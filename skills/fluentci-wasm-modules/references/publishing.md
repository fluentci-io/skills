# Publishing and immutable versions

Authenticate with environment-provided `FLUENTCI_ACCOUNT` (handle or DID) and
`FLUENTCI_APP_PASSWORD` (an app password). `fluentci whoami` checks the current
account and remembers identity in `~/.fluentci/account.json`; it can also start
background Tangled indexing. Do not put the password in a command argument,
manifest, log, or chat message. An identity file alone is not a credential store.

Only name, version, and license are required metadata. At a module root, the
manifest supplies them and this builds/publishes that module:

```sh
fluentci publish
```

A workspace can select a module with `fluentci publish --module ci`. Explicit
artifact publishing uses `--file` or `--url` and a package name:

```sh
fluentci publish --file ./dist/plugin.wasm   --name project-checks --version 0.1.0 --license MIT
```

Configured values and explicit flags take precedence over reused metadata.
The CLI can fetch previous metadata for the same author's module and prompt only
for missing fields. In noninteractive jobs, provide all required fields; do not
wait for prompts. Inspect `publish --help` for current optional flags.

Descriptions, Git repository URLs/subdirectories, topics, supported OS/CPU
architectures, explicit README URLs, and logo URLs can be published. Optional
fields can be skipped. A logo must be a public picture URL returning HTTP 200
with an image MIME type. Compatibility labels are publisher-declared metadata,
not automatic proof that a module works on that platform.

Build through the SDK before publishing so exposed functions, named arguments,
descriptions, and return types reflect the real artifact. Do not attach fabricated
metadata to hide missing inspection or a failed compiler build.

The authenticated account owns the handle; do not treat a requested package scope
as proof of identity. Uploaded URLs and SHA-256 values are checked before the PDS
record is created. The publisher/name/version release identity is immutable;
existing release creation is not a silent overwrite. Use a new version for changed
bytes. Indexed metadata can change, but artifact URL, checksum, and version are
retained and delete events do not remove indexed release history.

If a publish times out, first check whether the version record and immutable object
already exist. Separate failed upload from failed PDS creation. Do not bump the
version or loop on publishing just because the final response was lost. Retry the
same intended artifact only when recovery evidence and the user's authorization
support it; stop and report conflicts rather than bypassing immutability.

[Publishing guide](https://docs.fluentci.io/registry/publishing/)
[Authentication](https://docs.fluentci.io/registry/authentication/)
