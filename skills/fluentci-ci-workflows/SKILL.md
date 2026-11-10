---
name: fluentci-ci-workflows
description: "Configure CI/CD workflows and export GitHub Actions, GitLab CI, CircleCI, Azure Pipelines, Semaphore, or AWS CodeBuild using FluentCI. Use for workflow YAML migration, push and pull request triggers, setup modules, or .fluentci/workflows TOML."
license: MIT
---

# FluentCI workflows

## Preserve the project model

Inspect the root `fluentci.toml`, `.fluentci/workflows/*.toml`, lockfile, package
scripts, and current provider workflow before editing. When CLI execution is
allowed, discover with `fluentci workflows --steps --json`. Do not scaffold over
an existing workspace or replace the user's package manager/SDK incidentally.

Shared modules and services belong in the root configuration. Separate workflow
steps and events belong in `.fluentci/workflows/<id>.toml`. Preserve stable workflow
IDs and their history when renaming display names or moving files.

Read [workflow declarations](references/workflows.md) when adding steps, multiple
workflows, or event conditions. Workflow steps and command arrays execute in order;
use a native task plan inside a module when lint and tests should run in parallel.

## Inspect the actual module contracts

```sh
fluentci run ci --help
fluentci run ci check --help
```

These commands can build or download source/artifacts. Use source inspection when
execution is prohibited. Take named arguments from that module's help, including
the expected types; a setup module's arguments are not global CLI flags.

Preserve pinned registry versions and `fluentci.lock`. For new dependencies, select
a real published release and record it deliberately. A version prefix may be
normalized by the registry; it does not imply a tool's own release tag syntax.

## CI exports and setup modules

Read [exports and CI setup](references/export-and-ci.md) before generating a
provider manifest or replacing setup actions. `project export` exports a saved
project workflow; ensure that project and workflow are selected correctly.
Inspect generated YAML and its provider notes rather than assuming a successful
export proves all triggers or credentials are configured remotely.

Use registry setup modules when requested and their current contracts support
the needed runner. Check platform support and typed environment output before
removing an existing setup mechanism. Preserve artifacts, caches, matrix targets,
secrets, runner selection, and failure propagation during migrations.

Local runs ignore CI event filters. A push/PR filter does not prevent an agent from
manually running a deployment workflow. Inspect its effects and use the user's
actual authorization, not the trigger configuration, to decide whether to run it.

Validate TOML and exported YAML using the project tools. Run only authorized
workflows; a plan preview does not apply automatically to arbitrary modules or
workflow shell steps. Report the target workflow/provider and remaining external
setup, such as schedules or branch policies.
