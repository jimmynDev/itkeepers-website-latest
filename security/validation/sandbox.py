"""Reviewed validation control code. Project imports are forbidden until the gate."""
import errno
import glob
import json
import os
from pathlib import Path
import resource
import shutil
import socket
import subprocess
import time

SCRATCH = Path('/scratch')
RESULTS = SCRATCH / 'results'
ALLOWED_ENV = {
    'PATH': '/usr/local/bin:/usr/bin:/bin', 'HOME': '/scratch/home',
    'TMPDIR': '/scratch/tmp', 'TMP': '/scratch/tmp', 'TEMP': '/scratch/tmp',
    'XDG_CACHE_HOME': '/scratch/cache', 'LC_ALL': 'C.UTF-8', 'PYTHONUTF8': '1',
    'ASTRO_TELEMETRY_DISABLED': '1', 'WRANGLER_SEND_METRICS': 'false',
    'npm_config_cache': '/scratch/cache/npm', 'npm_config_offline': 'true',
    'npm_config_audit': 'false', 'npm_config_fund': 'false',
    'npm_config_update_notifier': 'false', 'GIT_CONFIG_NOSYSTEM': '1',
    'GIT_TERMINAL_PROMPT': '0', 'PUBLIC_CONTACT_FORM_ENABLED': 'false',
    'PUBLIC_CONTACT_FORM_ENDPOINT': '', 'PUBLIC_TURNSTILE_SITE_KEY': '',
}


def preflight():
    assert dict(os.environ) == ALLOWED_ENV, 'Unexpected environment variable/value'
    assert os.getuid() == os.geteuid() == 10001
    status = dict(line.split(':', 1) for line in Path('/proc/self/status').read_text().splitlines() if ':' in line)
    assert int(status['CapEff'].strip(), 16) == 0
    assert status['NoNewPrivs'].strip() == '1' and status['Seccomp'].strip() == '2'
    expected = {'memory.max': str(4 * 1024**3), 'memory.swap.max': '0',
                'pids.max': '96', 'cpu.max': '100000 100000'}
    actual = {key: (Path('/sys/fs/cgroup') / key).read_text().strip() for key in expected}
    assert actual == expected, ('Missing/wrong cgroup-v2 constraints', actual)
    for which, limit in [(resource.RLIMIT_FSIZE, 64 * 1024**2),
                         (resource.RLIMIT_NOFILE, 256), (resource.RLIMIT_NPROC, 96),
                         (resource.RLIMIT_CORE, 0), (resource.RLIMIT_CPU, 600)]:
        assert resource.getrlimit(which) == (limit, limit), 'Wrong hard/soft rlimit'
    disk = os.statvfs(SCRATCH)
    assert disk.f_blocks * disk.f_frsize <= 2 * 1024**3 and disk.f_files <= 65536
    assert set(os.listdir('/sys/class/net')) == {'lo'}, 'Unexpected network interface'
    for family, address in [(socket.AF_INET, ('198.51.100.1', 443)),
                            (socket.AF_INET6, ('2001:db8::1', 443, 0, 0))]:
        with socket.socket(family, socket.SOCK_STREAM) as probe:
            probe.settimeout(1)
            try:
                probe.connect(address)
            except OSError as error:
                assert error.errno in (errno.ENETUNREACH, errno.EHOSTUNREACH, errno.EAFNOSUPPORT), repr(error)
            else:
                raise AssertionError('External connection unexpectedly succeeded')
    # Positive local-fixture check in the container's isolated network namespace.
    with socket.socket() as listener:
        listener.bind(('127.0.0.1', 0)); listener.listen(1)
        with socket.create_connection(listener.getsockname(), timeout=1) as client:
            connection, _ = listener.accept(); connection.close()
    for directory in ('/source', '/opt/deps', '/opt/harness', '/control', '/tmp', '/dev/shm', '/dev/mqueue', '/etc'):
        probe = Path(directory) / '.v2-write-denial-probe'
        try:
            with probe.open('xb'):
                pass
        except OSError as error:
            assert error.errno in (errno.EROFS, errno.EACCES), repr(error)
        else:
            probe.unlink()
            raise AssertionError('Writable path outside scratch: ' + directory)
    assert not Path('/var/run/docker.sock').exists()
    RESULTS.mkdir()
    for directory in ('home', 'tmp', 'cache'):
        (SCRATCH / directory).mkdir()
    evidence = {'phase': 'before-project-code', 'uid': os.getuid(), 'environment': ALLOWED_ENV,
                'cgroups': actual, 'network_denied': True, 'loopback': True,
                'outside_writes_denied': True, 'scratch_bytes_limit': 2 * 1024**3,
                'scratch_inode_limit': 65536, 'capabilities': 0, 'no_new_privileges': True}
    (RESULTS / 'preflight.json').write_text(json.dumps(evidence, indent=2))
    print('SANDBOX_PREFLIGHT_OK', flush=True)


def validate():
    project = SCRATCH / 'project'
    shutil.copytree('/source', project, symlinks=False)
    (project / 'node_modules').symlink_to('/opt/deps/node_modules', target_is_directory=True)
    # Existing scanner requires git ls-files. Disposable metadata only, no history/remotes.
    subprocess.run(['git', 'init', '-q', str(project)], check=True, capture_output=True)
    subprocess.run(['git', '-C', str(project), 'add', '--all'], check=True, capture_output=True)
    npm = ['node', '/usr/local/lib/node_modules/npm/bin/npm-cli.js', 'run']
    commands = [
        ('typecheck', [*npm, 'typecheck']),
        ('build-production', [*npm, 'build']),
        ('build-staging', [*npm, 'build:staging']),
        ('build-rc', [*npm, 'build:rc']),
        ('check-staging', [*npm, 'check:staging']),
        ('check-rc', [*npm, 'check:rc']),
        ('all-tests', ['node', '--test', '--test-concurrency=1', *sorted(glob.glob(str(project / 'tests/*.test.mjs')))]),
        ('contact-mocks', ['node', '--test', '/opt/harness/contact-controller.test.cjs']),
    ]
    commands += [('security-' + name, ['python3', 'scripts/audit-security.py', directory,
                  str(RESULTS / ('security-' + name + '.json'))])
                 for name, directory in [('production', 'dist'), ('staging', 'dist-staging'), ('rc', 'dist-rc')]]
    records = []
    for name, argv in commands:
        log = RESULTS / (name + '.log')
        start = time.monotonic()
        with log.open('xb') as stream:
            try:
                child = subprocess.run(argv, cwd=project, env=ALLOWED_ENV,
                                       stdout=stream, stderr=subprocess.STDOUT, timeout=180)
                code = child.returncode
            except subprocess.TimeoutExpired:
                code = 124
        # A timeout aborts the whole container; no orphan descendants can proceed.
        records.append({'name': name, 'argv': argv, 'exit': code,
                        'seconds': round(time.monotonic() - start, 3)})
        if name in ('all-tests', 'contact-mocks') and code == 0:
            text = log.read_text(errors='replace')
            for line in ('# fail 0', '# cancelled 0', '# skipped 0', '# todo 0'):
                if line not in text:
                    code = 1; records[-1]['exit'] = code
                    records[-1]['reason'] = 'Missing zero-failure/skip/cancel/TODO TAP summary'
        (RESULTS / 'results.json').write_text(json.dumps(records, indent=2))
        if code:
            raise SystemExit(code if 0 < code < 126 else 1)
    print('VALIDATION_COMPLETE', flush=True)


if __name__ == '__main__':
    preflight()
    deadline = time.monotonic() + 60
    while not Path('/control/approved').is_file():
        if time.monotonic() > deadline:
            raise SystemExit('Host approval gate not received')
        time.sleep(0.2)
    validate()
