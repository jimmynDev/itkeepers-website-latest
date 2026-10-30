"""Linux/GitHub-hosted control plane. Never run this before owner approval.

Only trusted control code runs on the runner. Project code runs behind the gate.
"""
import json
import os
from pathlib import Path
import shutil
import stat
import subprocess
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[2]
HARNESS = ROOT / 'security/validation'
ALLOWLIST = {
    'preflight.json', 'results.json', 'typecheck.log', 'build-production.log',
    'build-staging.log', 'build-rc.log', 'check-staging.log', 'check-rc.log',
    'all-tests.log', 'contact-mocks.log', 'security-production.log',
    'security-staging.log', 'security-rc.log', 'security-production.json',
    'security-staging.json', 'security-rc.json',
}


def command(argv, **kwargs):
    return subprocess.check_output(argv, text=True, timeout=15, **kwargs).strip()


def promote(scratch_fd, artifacts_fd):
    """No archive extraction/glob/target-selected destination; only declared leaves."""
    flags = os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK
    results_fd = os.open('results', flags | os.O_DIRECTORY, dir_fd=scratch_fd)
    total = 0
    try:
        for name in sorted(ALLOWLIST):
            try:
                source_fd = os.open(name, flags, dir_fd=results_fd)
            except FileNotFoundError:
                continue  # Failure paths retain only files actually produced.
            with os.fdopen(source_fd, 'rb') as source:
                first = os.fstat(source.fileno())
                assert stat.S_ISREG(first.st_mode) and first.st_nlink == 1
                assert 0 <= first.st_size <= 2 * 1024**2
                total += first.st_size
                assert total <= 32 * 1024**2
                destination = os.open(name, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW,
                                      0o600, dir_fd=artifacts_fd)
                try:
                    with os.fdopen(destination, 'wb') as target:
                        created = os.fstat(target.fileno())
                        assert stat.S_ISREG(created.st_mode) and created.st_nlink == 1
                        remaining = first.st_size
                        while remaining:
                            chunk = source.read(min(65536, remaining))
                            assert chunk, 'Truncated evidence'
                            target.write(chunk); remaining -= len(chunk)
                        assert source.read(1) == b'', 'Evidence grew beyond limit'
                        last = os.fstat(source.fileno())
                        assert (first.st_dev, first.st_ino, first.st_mode, first.st_nlink,
                                first.st_size, first.st_mtime_ns, first.st_ctime_ns) == (
                                last.st_dev, last.st_ino, last.st_mode, last.st_nlink,
                                last.st_size, last.st_mtime_ns, last.st_ctime_ns)
                except BaseException:
                    os.unlink(name, dir_fd=artifacts_fd)
                    raise
    finally:
        os.close(results_fd)


def check_container(description, mounts):
    host = description['HostConfig']
    assert host['NetworkMode'] == 'none' and host['ReadonlyRootfs']
    assert host['Privileged'] is False and host['CapDrop'] == ['ALL']
    assert not host.get('CapAdd')
    assert 'no-new-privileges' in host['SecurityOpt']
    assert host['Memory'] == host['MemorySwap'] == 4 * 1024**3
    assert host['NanoCpus'] == 1000000000 and host['PidsLimit'] == 96
    assert host['CgroupnsMode'] == 'private' and host['IpcMode'] == 'private'
    assert not host.get('PortBindings') and not host.get('Devices')
    assert not host.get('PidMode') and not host.get('VolumesFrom')
    assert description['Config']['User'] == '10001:10001'
    actual = {m['Destination']: (str(Path(m['Source']).resolve()), m['RW'])
              for m in description['Mounts']}
    assert actual == mounts, ('Unexpected host mount', actual)
    limits = {u['Name']: (u['Soft'], u['Hard']) for u in host['Ulimits']}
    assert limits == {'core': (0, 0), 'nofile': (256, 256), 'nproc': (96, 96),
                      'fsize': (67108864, 67108864), 'cpu': (600, 600)}


def main():
    assert sys.platform == 'linux', 'Requires the approved Linux runner'
    os.umask(0o022)  # Snapshot/control mounts must be readable by the isolated UID.
    assert os.environ.get('GITHUB_ACTIONS') == 'true'
    assert os.environ.get('GITHUB_REF') == 'refs/heads/codex/v2-parkland-mena-usa'
    expected = os.environ['VALIDATION_COMMIT']
    assert command(['git', '-C', str(ROOT), 'rev-parse', 'HEAD']) == expected
    assert not command(['git', '-C', str(ROOT), 'status', '--porcelain'])
    temp = Path(os.environ['RUNNER_TEMP']).resolve()
    # Exclusive task roots; never mount the runner home/workspace or artifact root.
    work = Path(tempfile.mkdtemp(prefix='v2-isolated-', dir=temp))
    source = work / 'source'; source.mkdir()
    context = work / 'image'; context.mkdir()
    control = work / 'control'; control.mkdir(mode=0o755)
    empty = work / 'empty'; empty.mkdir(mode=0o755)
    scratch = work / 'scratch'; scratch.mkdir()
    artifacts = temp / 'v2-validation-artifacts'; artifacts.mkdir(mode=0o700)
    names = subprocess.check_output(['git', '-C', str(ROOT), 'ls-files', '-z']).decode().split('\0')
    for name in filter(None, names):
        relative = Path(name)
        assert not relative.is_absolute() and '..' not in relative.parts
        assert not any(part == '.git' or part.startswith(('.env', '.dev.vars')) for part in relative.parts)
        origin = ROOT / relative
        assert stat.S_ISREG(origin.lstat().st_mode), 'Only regular tracked source inputs allowed'
        assert all(not (ROOT / Path(*relative.parts[:i])).is_symlink()
                   for i in range(1, len(relative.parts)))
        dest = source / relative; dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(origin, dest)
    (context / 'project').mkdir(); (context / 'harness').mkdir()
    for name in ('package.json', 'package-lock.json'):
        shutil.copyfile(source / name, context / 'project' / name)
        shutil.copyfile(HARNESS / name, context / 'harness' / name)
    for name in ('sandbox.py', 'contact-controller.test.cjs'):
        shutil.copyfile(HARNESS / name, context / 'harness' / name)
    shutil.copyfile(HARNESS / 'Dockerfile', context / 'Dockerfile')
    # Explicitly separate trusted dependency preparation from offline execution.
    tag = 'itkeepers-validation:' + expected
    subprocess.run(['docker', 'build', '--tag', tag, str(context)], check=True, timeout=900)
    image = command(['docker', 'image', 'inspect', tag, '--format', '{{.Id}}'])
    subprocess.run(['sudo', 'mount', '-t', 'tmpfs', '-o',
                    'size=2G,nr_inodes=65536,mode=1777,nosuid,nodev,noexec',
                    'tmpfs', str(scratch)], check=True)
    scratch_fd = os.open(scratch, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
    artifacts_fd = os.open(artifacts, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
    cid = None
    try:
        # Import only the reviewed control module to obtain the fixed safe env map.
        # No source module, package hook or test is imported on the host.
        import importlib.util
        spec = importlib.util.spec_from_file_location('sandbox_control', HARNESS / 'sandbox.py')
        module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
        env_args = [key + '=' + value for key, value in module.ALLOWED_ENV.items()]
        mount_spec = {'/source': (str(source), False), '/control': (str(control), False),
                      '/scratch': (str(scratch), True), '/dev/shm': (str(empty), False),
                      '/dev/mqueue': (str(empty), False)}
        argv = ['docker', 'create', '--network=none', '--read-only', '--user=10001:10001',
                '--cap-drop=ALL', '--security-opt=no-new-privileges', '--cgroupns=private',
                '--ipc=private', '--cpus=1', '--memory=4g', '--memory-swap=4g', '--pids-limit=96',
                '--ulimit=core=0:0', '--ulimit=nofile=256:256', '--ulimit=nproc=96:96',
                '--ulimit=fsize=67108864:67108864', '--ulimit=cpu=600:600',
                '--log-driver=local', '--log-opt=max-size=1m', '--log-opt=max-file=1',
                '--entrypoint=/usr/bin/env']
        for destination, (origin, writable) in mount_spec.items():
            argv += ['--mount', 'type=bind,src=' + origin + ',dst=' + destination
                     + ('' if writable else ',readonly')]
        argv += [image, '-i', *env_args, 'python3', '/opt/harness/sandbox.py']
        cid = command(argv)
        description = json.loads(command(['docker', 'inspect', cid]))[0]
        check_container(description, mount_spec)
        subprocess.run(['docker', 'start', cid], check=True, capture_output=True)
        deadline = time.monotonic() + 45
        while True:
            logs = command(['docker', 'logs', cid], stderr=subprocess.STDOUT)
            if 'SANDBOX_PREFLIGHT_OK' in logs.splitlines():
                break
            state = json.loads(command(['docker', 'inspect', cid]))[0]['State']
            assert state['Running'] and time.monotonic() < deadline, 'Preflight failed; project code not authorized'
            time.sleep(0.5)
        # Gate file is host-controlled and read-only to the sandbox.
        (control / 'approved').touch(exist_ok=False)
        deadline = time.monotonic() + 900
        while True:
            state = json.loads(command(['docker', 'inspect', cid]))[0]['State']
            if not state['Running']:
                break
            assert time.monotonic() < deadline, 'Container wall-clock deadline exceeded'
            time.sleep(1)
        assert state['Pid'] == 0
        promote(scratch_fd, artifacts_fd)
        host_record = {'commit': expected, 'image_id': image, 'network': 'none',
                       'exit': state['ExitCode'], 'oom_killed': state['OOMKilled'],
                       'host_inspection': 'passed', 'preflight_before_project': 'passed'}
        (artifacts / 'host-controls.json').write_text(json.dumps(host_record, indent=2))
        assert state['ExitCode'] == 0 and not state['OOMKilled'], 'Validation failed; inspect bounded reports'
        assert all((artifacts / name).is_file() for name in ALLOWLIST), 'Missing required evidence'
        records = json.loads((artifacts / 'results.json').read_text())
        assert [item['name'] for item in records] == [
            'typecheck', 'build-production', 'build-staging', 'build-rc',
            'check-staging', 'check-rc', 'all-tests', 'contact-mocks',
            'security-production', 'security-staging', 'security-rc']
        assert all(item['exit'] == 0 for item in records)
        print('V2 validation completed for ' + expected + '; bounded reports retained.')
    finally:
        if cid:
            subprocess.run(['docker', 'rm', '--force', cid], capture_output=True)
        os.close(scratch_fd); os.close(artifacts_fd)
        subprocess.run(['sudo', 'umount', str(scratch)], check=True)


if __name__ == '__main__':
    main()
