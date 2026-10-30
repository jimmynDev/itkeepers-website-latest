# V2 isolated validation — prepared, not executed

30 October 2026. Scope: close the remaining execution gap without repeating secret/history/dependency audits. Prepared only on `codex/v2-parkland-mena-usa`, base `b35279b5ba4ee0baa20c8004d0260489b956b6b3` plus current local edits. No commit, push, workflow dispatch, image build, project test/build, deployment or cloud change was performed. Backup and main refs are untouched.

## Authority and exact requirements

The requested path omitted a separator; the existing skill read is `C:/Users/Jim/.agents/skills/security-audit/SKILL.md`. Its universal execution requirements are OS-enforced no external networking (isolated loopback only when needed); an empty allowlisted environment with scratch-local home/temp/caches; read-only target/toolchain with scratch-only writes; explicit low CPU, memory, process, file-size, disk and wall limits. It permits a trusted parent to place a source copy in scratch when builds must write beside source. Retained evidence must be promoted only after all sandbox processes stop, through bounded no-follow descriptor operations that reject links and nonregular files.

This is guidance/implementation preparation, not another full audit. The skill influenced the container controls, pre-execution gate and evidence promotion. Hosted-runner status alone is not treated as compliance.

## Files and execution phases

- `.github/workflows/v2-isolated-validation.yml`: validation-only, exact branch guard, read-only repository permission, pinned actions, no deployment or cloud secrets. One Ubuntu24.04 hosted job,35minute job deadline, no concurrent validation run.
- `security/validation/Dockerfile`: digest-pinned official Node22 Debian image; trusted Python/Git tools; website dependency preparation with `npm ci --ignore-scripts`; separate locked jsdom26.1.0 test tooling. Only manifests and reviewed harness enter image build context. No website source, local credentials, original Git directory, `.npmrc`, environment file or host directory is available in that phase.
- `security/validation/package.json` / `package-lock.json`: harness-only jsdom tooling. Root website manifest/lockfile are unchanged. Preparing this lockfile fetched registry metadata only; no package installed or lifecycle/test script executed locally.
- `security/validation/runner.py`: trusted host controller creates a regular-file-only snapshot of the approved committed checkout, prepares image/dependencies, creates isolated scratch, inspects actual Docker configuration, gates execution, enforces deadlines and promotes a fixed report allowlist.
- `security/validation/sandbox.py`: trusted preflight; waits for host-controlled gate; copies source into scratch, links read-only installed dependencies, creates disposable local Git metadata for the existing scanner, and runs the fixed validation commands.
- `security/validation/contact-controller.test.cjs`: eight mock-only active-controller tests using inert built Contact markup and a DOM implementation; no browser resources, navigation or real provider transport. Exact timeout is driven through a fake15second deadline. No website code changed.

The image is built in a separate network-enabled dependency-preparation phase with lifecycle scripts disabled. It pins the base image and npm lock integrity; Debian package repositories still vary over time, so the resulting local image ID and validated commit are recorded. Optional native packages must work from their package archives without install hooks. If that assumption fails on Linux, validation fails; enabling hooks or network during tests is not an automatic fallback.

## Control matrix and fail-closed gate

| Requirement | Enforcement | Check before project imports/builds/tests |
|---|---|---|
| External network denied | `--network=none`; private network namespace; no published ports, host networking or service/socket mount | Host checks actual NetworkMode/port bindings; preflight requires only loopback interface and rejects successful IPv4/IPv6 external connections. An isolated-loopback connection must work. No DNS/provider/registry call is needed during execution. |
| Empty environment / no credentials | `/usr/bin/env -i` with a fixed safe map; no host home, checkout token, GitHub env/output files, Docker socket, `.git`, `.env`, cloud config or account state mounted | Preflight compares the entire environment to the allowlist. HOME/temp/caches all lie under `/scratch`. Checkout's automatic read-only GitHub token is confined to checkout/control plane, not persisted or passed into Docker build/test. |
| Read-only inputs / toolchain | Read-only container root filesystem; `/source` and `/control` bind mounts read-only; dependencies/harness in image; UID10001; all capabilities dropped; no-new-privileges; default seccomp | Host checks mounts, image user, dropped caps and security options. Preflight checks actual UID, effective capabilities0, seccomp2, NoNewPrivs1 and denied writes to source/tools/control/root temp/config paths. |
| Scratch-only ordinary-file writes | Only writable bind is assigned scratch: host-created tmpfs,2GiB/65536inodes, nosuid/nodev/noexec. `/dev/shm` and `/dev/mqueue` replaced by read-only empty mounts. No runner workspace/home/evidence directory exposed | Host permits only the exact mount set. Preflight verifies scratch byte/inode bounds and denied writes outside scratch, including both device auxiliary mounts. Standard isolated kernel pseudo-files/devices remain available as required by processes; no persistent writable host location is exposed. |
| CPU/memory/process limits | One CPU,4GiB RAM,4GiB memory+swap total (thus zero swap),96PIDs; private cgroup namespace; hard nproc96 | Host inspects Docker values. Preflight requires cgroup-v2 `cpu.max=100000 100000`, `memory.max=4294967296`, `memory.swap.max=0`, `pids.max=96` and exact hard/soft rlimits. No saturation/fork-bomb test. |
| File/core/open-file limits | Hard64MiB single-file limit,256file descriptors, zero core dumps; hard600CPU seconds per process | Exact Docker Ulimit inspection plus `getrlimit` check. Scratch bounds cap aggregate disk/inodes. |
| Wall-clock/process cleanup |180seconds per command;900seconds validation-container supervision;45second host preflight gate deadline; bounded Docker control calls;35minute outer job | Timeout or failed command aborts validation; PID1 exits and Docker removes remaining descendants. Host finally removes container and unmounts task tmpfs. Any failed probe/timeout/OOM fails the job, never becomes a skip/pass. |
| Safe evidence retention | Parent opens non-inheritable scratch/artifact directory descriptors before container execution. Artifact root never mounted; fixed16-file allowlist,2MiB/file,32MiB total | After container stopped/PID0, open results and leaves using directory-relative O_NOFOLLOW/O_NONBLOCK; require regular file/nlink1/bounded size; exclusive no-follow destination; bound reads and re-stat identity/size/type/timestamps. Reject any mismatch; no docker-cp/archive extraction/glob promotion. |

Only trusted preflight code runs before the marker. The host first verifies the created container configuration, starts it, waits for the trusted `SANDBOX_PREFLIGHT_OK` marker, then creates `/control/approved` on the host. The container sees that directory read-only. Only then may it copy/import/execute project code. The preflight evidence records the safe environment and actual controls; host evidence records commit, image ID and container exit/OOM state. Any unsupported cgroup layout, writable path, unexpected mount/environment or missing kernel control fails before the gate. The controls are a prepared design and runtime assertions, not an already observed isolation PASS.

This is an OS-enforced container boundary on an ephemeral VM, not a claim of immunity to kernel/container-runtime vulnerabilities. It assumes the reviewed workflow/controller/image definition and GitHub-hosted runner control plane are trusted. Approval must cover their exact future commit. The branch/commit-message opt-in is an operational execution gate, not a substitute for repository write-access controls or human approval.

## Exact validation commands inside isolated scratch

Working directory `/scratch/project`; `node_modules` points to read-only `/opt/deps/node_modules`. Existing commands use Node22.19+ within22, npm, Python3 and Git already prepared in the image. No installation or remote audit is part of these commands.

```text
npm run typecheck
npm run build
npm run build:staging
npm run build:rc
npm run check:staging
npm run check:rc
node --test --test-concurrency=1 tests/*.test.mjs
node --test /opt/harness/contact-controller.test.cjs
python3 scripts/audit-security.py dist /scratch/results/security-production.json
python3 scripts/audit-security.py dist-staging /scratch/results/security-staging.json
python3 scripts/audit-security.py dist-rc /scratch/results/security-rc.json
```

The controller expands the test glob deterministically, runs test files serially to respect the PID/memory budget, and invokes npm by its absolute prepared CLI path, avoiding npx/downloads/PATH ambiguity. All existing top-level test files run. Both TAP summaries must show zero failures/cancellations/skips/TODOs; otherwise the job fails. No guessed test-count assertion or skipped-test pass. All declared evidence files and11successful command records must exist for success. Logs, public-file hash reports and exits are bounded/promoted; built exports/source/dependency trees are not uploaded.

New active-controller mocks cover invalid/oversized/honeypot rejection; pending duplicate clicks, immutable payload and locked intent; accepted edit/resubmit;15second abort/uncertainty; verification native snapshot/duplicate guard/pageshow return; hostile provider error as bounded literal text; page-swap abort; network/non-JSON fallback;429retry behavior. Mock fetch checks fixed URL/method/omitted credentials/no redirects. No provider-side behavior/inbox delivery, visual layout, real browser BFCache or actual navigation is certified by DOM mocks. Those remain separate from the targeted async lifecycle checks.

## Trigger and approval procedure

The workflow is uncommitted and unexecuted. It cannot validate uncommitted local edits on GitHub: an approved future commit must include the intended current source/CSS plus these harness files. The host checks checkout HEAD equals the workflow's event SHA and checkout is clean.

`workflow_dispatch` normally requires workflow registration from the default branch; this repository has no default-branch workflow registration. No main change is proposed. To bootstrap solely on the authorized development branch, the file also listens to pushes on that exact branch, but the job runs only when the pushed commit message explicitly contains `[security-validation-approved]`. A future owner approval must include commit, push **and execution** before using that marker. Without the marker the job is skipped and no compliance pass exists. Later manual dispatch is available only where GitHub has registered it; this draft does not assume it is already available. No approval, commit, push, Actions run or default-branch change is performed by preparing the draft.

Actions pins verified from their official GitHub tag refs on30October2026: checkout v4.2.2 `11bd71901bbe5b1630ceea73d27597364c9af683`; upload-artifact v4.6.2 `ea165f8d65b6e75b540449e92b4886f43607fa02`. Official Node22 bookworm-slim registry index digest `sha256:4b150b48b4116e2a22f2c39cc27025fbf4f153e2078fd3b14d159fdb5c7279da`. Harness jsdom26.1.0 and transitive integrity values are locked separately. Existing website dependencies/configurations remain unchanged. These are exact preparation pins, not a fresh advisory audit or a promise that future updates are unnecessary.

## Verification performed now and remaining limits

Preparation-only checks: Python AST parses, Node `--check` on mock suite, existing js-yaml workflow parsing with branch/permission assertions, harness manifest/lockfile consistency, and static review of the control/gate/command paths. No controller, test, image, container or workflow executed. Python's default environment lacked PyYAML; existing js-yaml was used without adding a parser dependency. The first metadata-lock invocation ran from the wrong directory and failed before project execution; the harness-directory lock-only invocation passed. Neither attempt installed packages or ran lifecycle scripts.

The environment here still cannot run the required Docker/Hyper-V isolation. Consequently actual Docker inspect/cgroup checks, denial probes, Linux native dependency compatibility, all tests/builds and safe artifact promotion remain **pending the approved GitHub run**. A runtime failure must be fixed/reviewed and retried under the same controls; no disabling sandbox, fetching packages mid-test or silently skipping checks. Report closure remains HOLD until actual preflight plus command evidence passes. This design does not resolve Formspree account settings/inbox evidence, previous reporting-validator platform gaps or full audit coverage by itself.

Current local website edits, including the navigation CSS change, are preserved. A separate concurrent Services-refinement status append observed during preparation is preserved. Only this task's new workflow/harness/design files and an append-only status entry belong to this change. No backup/main/Cloudflare/deployment operation.

References: [Docker run constraints](https://docs.docker.com/engine/containers/run/), [GitHub secure workflow use](https://docs.github.com/en/actions/reference/security/secure-use). The local skill's requirements control the fail-closed gate; hosted-runner/container defaults alone are insufficient.
