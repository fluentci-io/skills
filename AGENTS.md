# Maintaining this repository

This repository contains agent instructions, not a FluentCI application.

- Keep skills in `skills/<name>/SKILL.md` with portable, self-contained references.
- Verify CLI commands against upstream source/help and current official docs.
- Keep SDK/compiler/runtime distinctions explicit; do not silently migrate Extism projects.
- Update the README catalog when adding or renaming a skill.
- Validate with `node scripts/validate.mjs`; this check never needs FluentCI installed.
- Do not execute example pipelines or publish registry modules just to validate documentation.
- Preserve user-specific execution and publishing restrictions when doing behavioral checks.
