# Module manifests and dependency imports

```toml
name = "project-checks"
version = "0.1.0"
license = "MIT"
description = "Reusable project checks"
sdk = "typescript"
runtime = "component"

[dependencies]
math = { path = "../math" }
```

This is `fluentci-module.toml` at the module root. Preserve the starter's build
settings and entry path. `version` belongs to the module, not `package.version`.
Optional fields include `repository`, `subdir`, `readme_url`, `logo`, `topics`,
`os`, and `arch`; source/build selection must remain consistent with the SDK.

The workspace uses its own alias/source declaration:

```toml
[[modules]]
name = "checks"
path = ".fluentci/checks"
```

From a module root:

```sh
fluentci add math --path ../math
fluentci add math --git https://github.com/example/modules --rev main --subdir math
fluentci install --frozen-lockfile
```

The Git URL is illustrative: use the real repository. A relative Git `subdir`
selects the module in a monorepo and must not escape the repository. Registry
sources use the author's full handle or an official short name. Install first,
then use an installed alias in `fluentci run math --help`.

Commit the manifest and `fluentci.lock`; ignore `fluentci_modules/` and generated
`.fluentci/dependencies/` bindings. `add` preserves comments and updates the lock;
`update` deliberately refreshes resolutions. Do not hand-edit artifact checksums.

For component dependencies, FluentCI extracts actual WIT and generates imports.
A TypeScript source can import an installed component alias with:

```typescript
import { add } from "fluentci:dependency/math";
```

Use the dependency's inspected function contract, not an assumed `add` signature.
The starter includes generated declarations for editor/typechecker support. Other
SDKs have their own generated binding syntax; read the corresponding example in
[the dependency guide](https://docs.fluentci.io/guides/module-dependencies/).
Do not substitute a generic JSON call for a native typed WIT import.
