# Content caches and Git-aware affected selection

Cache contracts name inputs, outputs, and the relevant toolchain. Include source,
lockfiles, build configuration, and toolchain files that actually affect the
result. Use the SDK's supported file/directory semantics; do not invent glob
support or assume a matrix label fingerprints an installed compiler.

Cache keys incorporate declared content, arguments, environment, toolchain, and
execution policy. Outputs/logs are content-addressed separately. Environment
values and secrets should not be exposed in diagnostics or committed configuration.

A task that changes a declared input while running cannot safely publish a cache
entry. Generated outputs should not overlap declared inputs. Parallel writers
must not race on the same path; declare dependencies or use disjoint outputs.
Cache, journal, and log directories must not overlap source/output declarations.

When investigating a miss, compare the actual declared inputs, executable,
arguments, environment, modes, outputs, and toolchain. Preserve verification on
corrupted entries. Do not delete all cache state before capturing the reason or
promise remote/shared cache support that the installed engine does not expose.

## Affected plans

```sh
fluentci execute plan.json --affected --base origin/main --dry-run
fluentci execute plan.json --affected --base origin/main --head HEAD --committed-only --dry-run
```

The base uses the Git merge base. By default, staged, unstaged, and untracked
changes can affect selection; `--committed-only` excludes them. `--global-input`
is repeatable for repository-relative files/directories whose changes affect all
tasks. Selection includes affected tasks and required prerequisites; inspect the
returned reasons rather than treating it as a textual list of changed files.

`origin/main` is an example, not a universal base. Ensure the requested revision
exists in the checkout. Shallow CI clones may need the relevant history; do not
silently compare against an unrelated branch or discard local changes.

Affected detection is conservative where input contracts are incomplete. It is
not proof that undeclared dependencies are safe to ignore. Re-run the preview
after changing the plan or the comparison range.

[Native execution reference](https://docs.fluentci.io/reference/cli/)
