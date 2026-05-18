---
description: >
  Resolve Node + pnpm and write `.symphony-env.sh` when the Symphony
  `after_create` hook didn't (file missing, or `node --version` doesn't
  satisfy `.nvmrc`). Use within Symphony-orchestrated runs only.
---

# Symphony toolchain fallback

The `after_create` hook normally writes `.symphony-env.sh` with the resolved
Node bin directory on PATH. If the file is missing or the resolved Node
doesn't satisfy `.nvmrc`, the hook failed and you need to fall back.

Resolve Node without mutating the developer environment — no edits to
`~/.zshrc`, `~/.zshenv`, or any other dotfile; no `brew install` (Homebrew
writes outside the sandbox and will fail). The fix is per-run, not persistent.

Read the required Node version from `.nvmrc` first, then try in order and
record which method worked in the workpad `### Notes` as
`Toolchain: <method> → node v<version>`:

```bash
NODE_VERSION="$(cat .nvmrc)"
```

1. **nvm**: `\. "$NVM_DIR/nvm.sh" && nvm use` (reads `.nvmrc` itself).
2. **fnm**: `eval "$(fnm env --use-on-cd)" && fnm use`.
3. **mise**: `mise use -g node@"$NODE_VERSION" && eval "$(mise activate bash)"`.
4. **asdf**: `asdf install nodejs "$NODE_VERSION" && asdf shell nodejs "$NODE_VERSION"`.
5. **Tarball fallback** (sandbox blocks the version managers): download the
   matching Node tarball into a writable temp dir under `/private/tmp/`,
   extract, and prepend its `bin/` to `PATH` for the run.

After whichever method works, persist the resolved bin dir into
`.symphony-env.sh` so the rest of the run keeps using the
`. .symphony-env.sh && ...` shim:

```bash
printf 'export PATH=%q:"$PATH"\n' "$(dirname "$(command -v node)")" > .symphony-env.sh
```

Verify once before continuing:

```bash
. .symphony-env.sh && node --version   # must match .nvmrc
. .symphony-env.sh && pnpm --version   # must satisfy package.json#packageManager
```
