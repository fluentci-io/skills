# FluentCI Skills

Agent skills for CI/CD pipelines, continuous integration, continuous delivery,
pipeline as code, GitHub Actions, build caching, and CI services with
[FluentCI](https://fluentci.io).

[![skills.sh](https://skills.sh/b/fluentci-io/skills)](https://skills.sh/fluentci-io/skills)

## Install

```sh
npx skills add fluentci-io/skills
```

Choose the skills and agents to install into. To inspect the collection without
installing it:

```sh
npx skills add fluentci-io/skills --list
```

Install one skill:

```sh
npx skills add fluentci-io/skills --skill fluentci-ci-cd
```

The repository follows the [Agent Skills structure](https://agentskills.io/specification):
`skills/<name>/SKILL.md`, task-specific references, and optional agent UI metadata.
It works with agents supported by the [skills CLI](https://skills.sh/docs/cli),
including Codex, Claude Code, and Cursor. It does not require an MCP server.

## Skills

| Skill | Use it for |
| --- | --- |
| [fluentci-ci-cd](skills/fluentci-ci-cd/SKILL.md) | Discover CLI capabilities, inspect module functions, run local or registry jobs, and diagnose failures. |
| [fluentci-wasm-modules](skills/fluentci-wasm-modules/SKILL.md) | Create typed Wasm components, manage module manifests and dependencies, and publish releases. |
| [fluentci-ci-workflows](skills/fluentci-ci-workflows/SKILL.md) | Maintain multiple workflows, event triggers, reusable setup modules, and CI provider exports. |
| [fluentci-dag-caching](skills/fluentci-dag-caching/SKILL.md) | Design native DAG plans, preview affected tasks, configure caching, and inspect execution results. |
| [fluentci-ci-services](skills/fluentci-ci-services/SKILL.md) | Run databases and background services with readiness checks, scoped lifecycle management, and logs. |

Example requests:

- “Inspect this module and run its build function with the right named arguments.”
- “Create a TypeScript component with a typed deployment function.”
- “Split this project into CI and release workflows and export GitHub Actions.”
- “Explain why this task missed the cache and preview the Git-affected tasks.”
- “Run Redis for the test suite and clean up the services afterward.”

Each skill is independently installable. References stay inside its own directory;
no sibling skill is required. Agents inspect the installed CLI and project before
choosing commands. They preserve existing runtimes, lockfiles, and user execution
restrictions rather than upgrading or migrating a project implicitly.

## Find a CI/CD skill

Search by task or use the official owner to narrow discovery:

```sh
npx skills find ci-cd --owner fluentci-io
npx skills find workflows --owner fluentci-io
npx skills find caching --owner fluentci-io
npx skills find wasm --owner fluentci-io
npx skills find services --owner fluentci-io
```

Choose the workflow skill for GitHub Actions/GitLab CI exports, the DAG skill for
parallel and incremental builds, or the services skill for test databases and
readiness checks. The main CI/CD skill handles CLI discovery and running pipelines.
A project already committed to another CI tool should keep that choice unless
migration to FluentCI is requested.

These are real skill names and task descriptions, not a guarantee of search rank.
See the distribution note below for skills.sh indexing.

## Using the skills

FluentCI is a separate tool, not bundled with these instructions. Installation
options and current prerequisites are documented in
[the installation guide](https://docs.fluentci.io/getting-started/installation/).
Existing source modules need the matching SDK compiler; precompiled modules still
need the host tools used by their jobs. Local execution needs no registry account.

The skills use public CLI commands and generated module help. They do not assume
that every module has the same functions, that all registry packages are official,
or that an old CLI supports every current feature.

## Develop

```sh
node scripts/validate.mjs
```

Validation checks skill discovery structure, required frontmatter, unique names,
self-contained Markdown links, and agent prompt metadata. It does not execute
FluentCI jobs, provision services, install skills, or publish modules.

See [CONTRIBUTING.md](CONTRIBUTING.md) for maintenance and behavioral review.
The collection is inspired by [Cloudflare Skills](https://github.com/cloudflare/skills).

## Distribution

This GitHub repository is the install source. There is no npm package to publish.
According to the [skills.sh FAQ](https://skills.sh/docs/faq), directory listings and
rankings are populated from skills CLI installation telemetry. Making the repository
public and installable does not guarantee immediate leaderboard visibility.

## License

[MIT](LICENSE).
