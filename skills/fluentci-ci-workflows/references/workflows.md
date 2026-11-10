# Workflow declarations

Keep shared modules at the root:

```toml
# fluentci.toml
[[modules]]
name = "ci"
path = ".fluentci/ci"
```

A workflow selects exported functions from that declared module:

```toml
# .fluentci/workflows/ci.toml
id = "ci"
name = "Continuous integration"
description = "Check the project before merging"
enabled = true
env = ["CI=true"]

[on]
manual = true

[on.push]
branches = ["main"]

[on.pull_request]
branches = ["main"]

[[steps]]
name = "Check"
module = "ci"
command = "check"
wasm = true
```

`check` is an example: select an actual export from the project's module. `command`
contains the function plus its arguments, not another redundant module selection.
For a shell step, set `module = "shell"` and use the actual shell command.
Step environment values override workflow values. Paths resolve against the
project root; SDK builds still use their selected module source directory.

Workflow IDs are stable lowercase identifiers, not display names. The reserved
`default` workflow preserves existing root steps/saved actions. Do not delete it
or rewrite existing IDs as part of a cosmetic rename.

```sh
fluentci workflows
fluentci workflows ci --steps
fluentci workflows --steps --json
fluentci run --workflow ci
```

## Events are export conditions

Without an `[on]` block, the default events are push to `main` and manual dispatch.
With an explicit block, omitted push/PR events are disabled; an empty event table
matches all refs/paths. Pull request branch filters refer to the target/base branch.

Optional push filters include branches, tags, and paths. Branch and path filters
both must match. Branch-only filters exclude tag pushes; tag-only filters exclude
branch pushes. A tag push ignores path filters. Supported inclusive globs use `*`,
`**`, and `?`. Do not assume a provider's additional glob syntax is supported.

Schedules are five-field numeric UTC cron expressions:

```toml
[on]
manual = true
schedule = ["0 6 * * 1-5"]
```

Local manual runs do not evaluate those events. An enabled workflow with all CI
events disabled can still be invoked locally. `enabled = false` is different from
disabling a trigger.

Commit TOML workflow files. `.fluentci/workflows/.lock` is a transient writer guard,
not the dependency lockfile; do not commit it or remove a guard owned by a live
writer to bypass a conflict.

[Configuration and event semantics](https://docs.fluentci.io/reference/configuration/)
