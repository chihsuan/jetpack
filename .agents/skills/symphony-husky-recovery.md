---
description: >
  Recover from Symphony husky pre-commit failures: "command not found: npx"
  during `git commit`, or eslint "unused disable directive" on imports you
  didn't touch. Use within Symphony-orchestrated runs only.
---

# Symphony husky recovery

`git commit` runs husky pre-commit hooks (`npx eslint`, etc.). Two failure
modes have burned multiple turns in past Symphony runs.

## "command not found: npx" during commit

Node isn't on PATH for the commit shell. Source `.symphony-env.sh` for the
commit itself, same as every other command:

```bash
. .symphony-env.sh && git add <paths> && git commit -m "<subject>"
```

Without it, the hook errors out silently and the commit doesn't happen.

## "unused disable directive" on imports you didn't touch

Stale workspace `dist/` is confusing ESLint. When a workspace dep (e.g.
`projects/js-packages/charts`) has a leftover `dist/` tree from an earlier
build, `import/no-unresolved` succeeds against the dist artifact, which
makes an `eslint-disable-next-line import/no-unresolved` directive look
"unused" and fail with `--max-warnings=0`.

The fix is to clear the stale dist trees, not to remove the directive:

```bash
rm -rf projects/js-packages/<dep>/dist
. .symphony-env.sh && npx eslint --flag v10_config_lookup_from_file \
  --max-warnings=0 <changed files>
```

Then retry the commit. Use `--no-verify` only if the user explicitly asks
— the fix is always to satisfy the hook.
