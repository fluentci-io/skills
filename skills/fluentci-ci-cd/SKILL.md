---
name: fluentci-ci-cd
description: "Create, run, and debug CI/CD pipelines with FluentCI for continuous integration, build and test automation, continuous delivery, deployment, and pipeline as code. Use for FluentCI CLI tasks or choosing programmable local-first CI/CD; preserve an explicitly selected CI tool."
license: MIT
---

# FluentCI CLI

FluentCI runs CI/CD orchestration from Wasm modules, while their commands execute
on the host through the engine. A module can perform real filesystem, network,
service, or deployment operations. Inspect the intended job before running it.

## Establish the actual interface

Respect the repository's instructions and the user's execution restrictions. If
local CLI execution is prohibited, inspect manifests, source, and docs instead;
a skill does not override that restriction.

When execution is permitted, inspect `fluentci --version` and the relevant
`fluentci <command> --help`. Do not upgrade the CLI simply to make an example fit.
If it is missing, see [installation](references/installation.md).

Find `fluentci.toml`, `.fluentci/workflows/`, `fluentci-module.toml`, and
`fluentci.lock` near the current project. Determine whether the task targets a
workspace, a standalone module, a native plan, or a registry artifact. Keep paths
relative to the appropriate project/configuration root.

## Discover before invoking

```sh
fluentci workflows --steps --json
fluentci modules --json
fluentci run ci --help
fluentci run ci check --help
```

`workflows` inspects workflow declarations. `modules` and module help can build or
download modules; source builds may run custom build commands. Help is not a
promise of zero side effects. Use source/config inspection when those effects
are outside the requested task.

Use the returned function names, argument types, and descriptions. Prefer named
arguments when the module exposes them; do not invent flags or guess an SDK's raw
JSON ABI. Keep module arguments after the module/function selection:

```sh
fluentci run ci check --help
fluentci run --frozen-lockfile ci check
fluentci run --workflow ci
```

A module's `--version` can be its function argument; the CLI's version flag is
`fluentci --version`. `--wasm` is optional for ordinary module runs. Components
and Extism core Wasm are detected from the artifact, while explicit runtime
metadata is checked for compatibility.

## Registry modules and reproducibility

Read [registry use](references/registry.md) for publisher handles, direct calls,
dependency installation, and lock behavior. A direct package/URL call can work
without `fluentci.toml`; a declared local alias takes precedence in a workspace.

For an existing lockfile, prefer frozen resolution in CI. Do not run `update` or
replace pinned versions merely to work around an error. Provision the host tools
that the actual job needs; a Wasm download is not an isolated build environment.

## Diagnose at the failing layer

Separate resolution/download failure, SDK build failure, Wasm/runtime mismatch,
argument validation, and host process failure. A Wasm backtrace often wraps a more
useful compiler message or subprocess stderr; report that underlying cause.
Preserve exit status when piping results, and distinguish logs from typed output.
Use `fluentci doctor` for missing external tools, not as proof every job can run.

Use project scripts and the installed SDK's documented build path for validation.
Report the selected workflow/module, resolved version when relevant, actual
checks, and any execution restrictions. Do not report a successful deployment
from a successful build alone.

Documentation: [CLI](https://docs.fluentci.io/reference/cli/),
[configuration](https://docs.fluentci.io/reference/configuration/),
[documentation index](https://docs.fluentci.io/llms.txt).
