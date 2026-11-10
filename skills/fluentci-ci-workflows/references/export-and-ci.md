# CI exports and setup modules

`fluentci project export` operates on a saved project. Use `project list` and
`project show <name-or-id>` to establish the target; create/import the intended
project through its normal workflow rather than assuming any TOML file is already
registered. By default, exports use the current directory's project.

```sh
fluentci project export --workflow ci --github
fluentci project export --workflow ci --gitlab
fluentci project export --workflow ci --semaphore
```

Provider flags are mutually exclusive: `--github`, `--gitlab`, `--azure`,
`--circleci`, `--semaphore`, and `--aws`. Inspect output before writing it to a
tracked provider file. Preserve the project's existing runner, permission, and
secret conventions.

Important differences:

- GitHub supports push, pull request, manual dispatch, and schedules in its workflow.
- GitLab schedules also need configuration in GitLab CI/CD settings.
- Azure Repos PR validation uses branch policies in addition to exported YAML.
- CircleCI rejects static path filters it cannot represent; schedules need project triggers.
- CodeBuild buildspec exports include webhook/EventBridge setup notes; a buildspec
  alone does not create those cloud triggers.

Read the generated provider notes. Validate YAML and the platform's interpretation
of `on`, branch/tag/path filters, cron, matrix values, and shell quoting.

## Registry setup functions

Discover published setup modules and inspect their selected version's `setup`
function. For example, `fluentci run setup-rust setup --help` resolves the official
module, but may download it. Do not treat `--version`, `--toolchain`, `--components`,
or `--cache` as a universal shared setup contract.

Typed environment results need to be applied to subsequent CI steps. When the
project provides an environment-export bridge, preserve it and its typed-result
validation. Shell pipelines should preserve the failing command's exit status
(e.g. Bash `set -o pipefail`). Do not write raw log lines or unchecked JSON into
`GITHUB_ENV` or `GITHUB_PATH`. Stream logs separately from the final typed result.

Pass required secret names through the provider's environment mechanism, never
hardcoded values. `GH_TOKEN` does not automatically authenticate Nix's GitHub
fetches: Nix uses its own `access-tokens` configuration. If configuring Nix/Cachix,
retain the requested trusted users and avoid replacing system trust settings or
restarting daemons unrelated to the task.

Provisioning a tool and using its cache are different operations. A successful
Cachix setup does not prove that store paths were uploaded; inspect the build's
actual watch/push step and failure propagation when upload is requested.

[CI providers](https://docs.fluentci.io/guides/ci/)
