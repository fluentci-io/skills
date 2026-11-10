# Registry calls and locked modules

Registry names are `@handle/name`, optionally followed by `@version` or `@latest`.
The `@` before the handle can be omitted. Use the publisher's actual AT Protocol
handle, including its domain; a GitHub organization name is not automatically a
registry identity. Official `@fluentci.io/name` modules can use just `name`.

Inspect a real package before calling it:

```sh
fluentci search setup-rust
fluentci run setup-rust --help
fluentci run setup-rust setup --help
```

Help can resolve/download an artifact. Use an exact published version for a
reproducible direct invocation; an omitted version is a latest-version request.
Use only flags the selected module actually exposes. For example, versions of
setup modules may accept strings where older releases used JSON arrays.

A module can run without a workspace configuration:

```sh
fluentci run fluentci.io/setup-rust --help
fluentci run --wasm ./dist/plugin.wasm --help
```

HTTP(S) Wasm URLs are also accepted. A public download URL may use
`https://modules.fluentci.io/handle/name/v1.2.3/name.wasm`; the leading `@` in the
handle path is accepted for compatibility. Prefer registry resolution when a
published package exists so the CLI can use its verified artifact metadata.

## Dependencies

At a module root containing `fluentci-module.toml`:

```sh
fluentci add math --path ../math
fluentci install
fluentci install --frozen-lockfile
```

`add` updates module `[dependencies]` and installs into `fluentci_modules/`.
`modules add` is a different command: it scaffolds/registers a workspace module.
A workspace can declare a registry source with `[[modules]]` and `package`.

Commit manifests and `fluentci.lock`. Ignore downloaded modules and generated
bindings. Latest resolutions stay pinned until `fluentci update` is explicitly
requested. Exact versions and latest are supported; do not invent SemVer ranges.

A checksum mismatch is a failed verification, not a reason to delete the lock or
skip verification. Identify the manifest entry, locked source, URL, and checksum
without printing credentials. `fluentci docs <module>` renders an available README.

[Registry usage](https://docs.fluentci.io/registry/using-plugins/)
[Lockfile](https://docs.fluentci.io/reference/lockfile/)
