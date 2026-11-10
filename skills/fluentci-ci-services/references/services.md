# Service definitions and lifecycle

Services can be declared in root `fluentci.toml`, Procfiles, or code supplied to
`fluentci services apply --file definitions.json`. Inspect `services apply --help`
for the accepted file/stdin and JSON mechanisms before constructing programmatic
requests.

A host Redis example assumes `redis-server` and `redis-cli` are installed:

```toml
[[services]]
name = "redis"
backend = "host"
command = ["redis-server", "--save", "", "--appendonly", "no", "--port", "6379"]
readiness = { type = "tcp", address = "127.0.0.1:6379" }
health = { type = "exec", command = ["redis-cli", "ping"] }
restart = "on_failure"
max_restarts = 3
startup_timeout_ms = 30000
stop_timeout_ms = 5000
```

Use the project's existing port or an available one; this literal host definition
does not allocate a random port automatically. Keep required credentials in the
project's secret/environment mechanism, not in checked-in TOML.

`depends_on` starts dependencies first and waits for their readiness. Probes can
use exec, TCP, or HTTP. Health checks continue after startup. Bounded restart
policies and backoff handle failures; a fixed sleep cannot establish readiness.

## Backends

- `host`: installed foreground program.
- `nix`: package-backed `nix shell`, or a selected flake through `nix develop`.
- `devbox` / `devenv`: command and optional setup in the project's environment.
- `pkgx`: declared package environment.
- `docker`: owned foreground container, explicit image, ports, and optional volumes.

For environment-provided databases, configure packages and idempotent setup in that
project first. FluentCI owns supervision rather than delegating it to another
service manager. Docker on BSD requires a suitable reachable daemon; a backend
name alone does not provision it.

A Docker port entry `"6379"` allocates a loopback host port; `"16379:6379"` requests
an explicit binding. Use returned JSON status or `${services.redis.ports.6379}`
in dependent service environment values instead of assuming the host port equals
the container port. Own readiness probes can refer to `${port:6379}`.

Scoped commands receive `FLUENTCI_SERVICES` JSON and allocated-port environment
values such as `FLUENTCI_SERVICE_REDIS_PORT_6379`. These names describe actual
service bindings; validate presence before building connection URLs.

## Manual lifecycle

```sh
fluentci up
fluentci ps
fluentci start redis
fluentci restart redis
fluentci stop redis
fluentci down
```

`start` is idempotent; `restart` replaces the process. Stopping a service also
stops dependents. `down` tears down the workspace services in reverse dependency
order. Scoped runs release leases, so services shared with other work or started
manually can remain running after a test.

Inspect logs and current state before recovery. Do not remove live manager/socket
state, delete another process's guard, or clear database data to bypass a startup
error. Diagnose the owned process and address the underlying cause.
