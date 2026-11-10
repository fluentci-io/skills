# Native plan structure

Prefer the selected SDK's typed host-plan builders for application code. JSON is
the readable interchange/debugging representation, not a reason to serialize
native typed plans repeatedly. The engine compiles and schedules the DAG.

A minimal illustrative plan has version `1`, tasks with stable IDs, and explicit
dependencies. Here `lint` and `test` wait for `install`; `build` waits for both:

```json
{
  "version": 1,
  "jobs": 2,
  "inherit_env": false,
  "tasks": [
    {"id": "install", "program": "/usr/bin/make", "args": ["install"], "cwd": ".", "env": {}, "needs": []},
    {"id": "lint", "program": "/usr/bin/make", "args": ["lint"], "cwd": ".", "env": {}, "needs": ["install"]},
    {"id": "test", "program": "/usr/bin/make", "args": ["test"], "cwd": ".", "env": {}, "needs": ["install"]},
    {"id": "build", "program": "/usr/bin/make", "args": ["build"], "cwd": ".", "env": {}, "needs": ["lint", "test"]}
  ]
}
```

Use this shape only with the project's real programs and targets. This example
assumes Make at `/usr/bin/make` and those targets in the Makefile. Task environments
are explicit; give commands the actual PATH and other variables they need rather
than assuming the interactive shell is inherited. Cached tasks require explicit
environment rather than inherited ambient values.

Each execution uses a fresh run directory for the journal and per-task logs.
Paths in a plan and its workspace source need the installed CLI's documented
resolution rules; inspect preview output before moving a plan to a different root.

## Scheduling and failure

Use dependency edges for data/readiness ordering and resource names for mutual
exclusion. A jobs limit bounds running work; shared/exclusive resources express
additional constraints. A matrix expands typed cases into ordinary tasks.

Choose retry policies for genuinely retryable failures. Success/failure/always
conditions, allowed failures, and finalizers change dependency semantics; preserve
them while fixing a command failure. Service tasks need readiness and bounded
startup/shutdown behavior rather than a daemon launched with `&` and a fixed sleep.

Outputs/artifacts should come from their actual producer; declare bindings instead
of reading an unrelated run's files. Filesystem, package, host facts, digest, and
transfer primitives can also compose as tasks. Use literal argv for ordinary
commands and opt into shell syntax only when shell evaluation is intended.

[Host/transfer primitives](https://docs.fluentci.io/guides/primitives/)
[Engine SDKs](https://github.com/fluentci-io/fluentci-engine/tree/main/sdk)
