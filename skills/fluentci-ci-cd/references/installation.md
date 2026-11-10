# Installation and capability checks

Use an existing project-approved CLI before installing another copy. Check the
installed version/help against the feature needed; do not pin a date-based or
obsolete bootstrap release from memory.

Supported installation paths include:

```sh
npm install -g @fluentci/cli
# Or a one-off invocation, which may download a binary:
npx @fluentci/cli --version
```

The shell installer uses the official release source:

```sh
curl -fsSL https://cli.fluentci.io | sh
export PATH="$HOME/.local/bin:$PATH"
```

`FLUENTCI_VERSION` and `FLUENTCI_INSTALL_DIR` belong on the receiving installer
process when overriding them. Follow the repository's tool installation policy;
do not execute an installer where execution or network changes are prohibited.

Homebrew uses `fluentci-io/tap/fluentci`; the Studio desktop cask is
`fluentci-io/tap/fluentci-studio`. Nix installation is documented as
`nix profile install github:fluentci-io/fluentci`. Read the official installation
guide for platform support, cache setup, trust configuration, and current package
repository instructions instead of changing system package managers speculatively.

Source modules also need their SDK compiler. Precompiled components need the host
programs used by their functions, but do not need the source SDK just to execute.
Local workflows and Studio do not need a publishing account.

[Official installation guide](https://docs.fluentci.io/getting-started/installation/)
