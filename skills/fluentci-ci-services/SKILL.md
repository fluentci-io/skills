---
name: fluentci-ci-services
description: "Run Redis, PostgreSQL, databases, and background services for CI/CD tests with FluentCI. Use for readiness probes, Docker test dependencies, scoped service lifecycle, service logs, or cleanup in FluentCI projects."
license: MIT
---

# FluentCI services

Inspect existing `[[services]]`, Procfiles, working directories, ports, persistent
data, and any already-running workspace services. Use the installed CLI's service
help when execution is allowed; do not start a database just to inspect its config.

Read [service definitions and lifecycle](references/services.md) when adding a
service, selecting a backend, or diagnosing readiness and cleanup.

## Prefer scoped test dependencies

For an authorized test run, the built-in manager can wait for readiness and release
its leases afterward:

```sh
fluentci services run --service redis -- bun test
```

Use the project's real test command. The wrapped exit status is preserved; the
manager handles cleanup on failure and interruption. Existing manually started
services and other clients' leases must remain intact.

Use foreground service commands. FluentCI owns supervision; do not double-daemonize
or add a second process manager around the same process. Use readiness probes
instead of fixed sleeps, and bounded restart/backoff settings for recovery.

## Inspect state and logs

```sh
fluentci services status --json
fluentci logs redis --tail 100
fluentci status redis
```

`logs --follow` is a stream, not a completion check; bound diagnostic collection
when the task needs a snapshot. Read readiness/health failures before changing
ports, adding retries, or restarting dependencies.

Use `start`, `stop`, `restart`, `up`, and `down` only for the requested workspace
and intended services. `stop` also affects dependents; `down` stops the workspace's
services and manager, so prefer releasing a scoped command's lease for CI cleanup.
Do not kill unrelated processes to free a port. Inspect ownership or choose an
available port instead.

Host, Nix, devbox, devenv, pkgx, and Docker backends still need their external
tools and platform support. Persistent database initialization/data removal are
separate from process lifecycle; preserve data unless reset is explicitly requested.

[Services](https://docs.fluentci.io/guides/services/)
