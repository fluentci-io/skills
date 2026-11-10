# Typed component authoring

New modules use `runtime = "component"`; `--runtime extism` is an explicit legacy
alternative. Artifact encoding is detected on execution, and a declared runtime
must agree with the actual Wasm. Core Extism modules cannot satisfy native WIT
component imports.

Prefer generated starters. Their build commands include SDK inspection, binding
generation, and componentization; invoking only a language compiler may skip the
metadata or emit a core Wasm file rather than a component.

## Source contracts

- Rust: typed function signatures and argument structs, checked by compilation.
- TypeScript: compiler-inspected exported functions and typed argument records.
- PureScript: compiler docs/CoreFn and declared exported function types.
- ClojureScript: checked shared `.cljc` source with Typed Clojure annotations.
- Gleam: compiler package interfaces and native argument records.
- ReScript: compiler interfaces/docs and typed records.
- Python: annotations, dataclasses/TypedDicts, and supported aliases.
- Elixir: executable CI DSL declarations; not arbitrary BEAM reflection or execution.

Supported types and optional fields depend on each SDK's inspection backend. An
unsupported or ambiguous type should be made explicit or simplified rather than
replaced with a guessed string. Keep the source's real signature and generated
WIT synchronized by building through the SDK path.

For example, a TypeScript component entry point can expose:

```typescript
export interface CheckArgs {
  /** Project directory to check. */
  directory: string;
}

/** Return the selected project directory. */
export function check(args: CheckArgs): string {
  return args.directory;
}
```

After the starter build, inspect `fluentci run ci check --help` and invoke the
exposed named argument with `--directory .`. WIT and CLI argument names use
kebab-case. Return a typed value; do not add `Host.outputString` or an Extism
input/output decorator to a native component function.

The standard FluentCI host package is versioned as `fluentci:runtime@0.1.0`.
Use the starter's matching SDK and WIT rather than bumping that version to work
around a linker error. WASI and host imports are runtime capabilities; they do
not put the host build tools inside the Wasm binary.

For a legacy Extism module, preserve the raw-text/JSON ABI unless intentionally
migrating it. Embedded SDK-neutral metadata can describe functions, but an old
raw export does not acquire a typed ABI just by adding CLI flags.
