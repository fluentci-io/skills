# Contributing

Keep each skill independently useful and narrowly triggered. Put essential decisions
in `SKILL.md`; put longer examples in `references/` and link them from the entrypoint.
Do not link outside a skill directory for instructions required after installation.

Verify commands against the installed CLI help or the FluentCI source and official
documentation. Check module/function help before documenting named arguments:
registry module contracts can change independently from the CLI. Do not copy a
single incident, environment restriction, or preferred SDK into a universal rule.

Run `node scripts/validate.mjs`. Also review meaningful scenarios manually: an
existing Extism project, a fresh component module, a dependency pinned by a lock,
a CI export with provider-specific triggers, an affected-plan preview, and scoped
services that were already running. Check both the chosen actions and side effects;
structural validation alone does not prove the instructions are correct.

Testing must respect the environment's execution permissions. Use temporary
workspaces and disposable services; a skill does not authorize a registry publish,
production deployment, or execution that the user has prohibited.

Do not claim support for unreleased CLI flags, automatic source type inference
beyond the SDK compiler's actual contract, remote caches, or Protobuf transport.
