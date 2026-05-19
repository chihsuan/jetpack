---
description: Merge latest origin/trunk into the current branch and resolve Jetpack's recurring conflicts (pnpm-lock.yaml, composer.lock, CHANGELOG.md)
---

Sync the current feature branch with `origin/trunk` via a merge (not rebase) and resolve conflicts safely.

## Preconditions

- Working tree is clean (commit or stash first).
- Current branch is the feature branch — not `trunk`.
- One-time setup (idempotent):
  ```bash
  git config rerere.enabled true
  git config rerere.autoupdate true
  ```

## Workflow

1. Fetch and sync the remote feature branch first (in case CI auto-committed):
   ```bash
   git fetch origin
   git pull --ff-only origin "$(git branch --show-current)"
   ```
2. Merge `origin/trunk` with clearer conflict context:
   ```bash
   git -c merge.conflictstyle=zdiff3 merge origin/trunk
   ```
3. Resolve conflicts (see file-class guidance below).
4. Stage and finish the merge. **Use `--no-verify`** — Jetpack's pre-commit hooks can rewrite merge commit files in unintended ways (see AGENTS.md "Common Pitfalls"):
   ```bash
   git add <files>
   git commit --no-edit --no-verify
   ```
5. Run relevant project tests/lint before pushing (`jp test ...`, `jp lint ...`).

## File-Class Conflict Guidance

These three patterns cover the vast majority of Jetpack merge conflicts. Handle them in this order.

### 1. `pnpm-lock.yaml` (regenerated, not hand-merged)

Almost never resolve by hand. Take `trunk`'s lockfile, then regenerate:

```bash
git checkout --theirs pnpm-lock.yaml
pnpm install --no-frozen-lockfile
git add pnpm-lock.yaml
```

If monorepo package versions changed on your branch, run `tools/fixup-project-versions.sh` first, then `pnpm install`.

### 2. `composer.lock` / `projects/*/composer.lock`

Same pattern — take `trunk`'s, regenerate:

```bash
git checkout --theirs <path>/composer.lock
# In the project directory:
( cd <path> && composer update --lock )
git add <path>/composer.lock
```

### 3. `changelog/` entries and `CHANGELOG.md`

- Files under `projects/*/changelog/` are per-PR fragments — conflicts here are rare (different filenames). If your changelog file was renamed or removed on `trunk` (because a release shipped), re-add it with `jp changelog add` to get a fresh filename.
- `projects/*/CHANGELOG.md` (the rolled-up file) only changes at release time. If it conflicts, take `trunk`'s version (`git checkout --theirs ...`) — your fragment in `changelog/` will be re-rolled into the next release.

### 4. Everything else (source code)

- Inspect with `git status` and `git diff --merge`.
- With zdiff3 markers, `<<<<<<<` is ours, `|||||||` is the base, `=======` separates, `>>>>>>>` is theirs.
- Read both intents (bug fix vs refactor vs rename) before choosing the resolution. Prefer minimal, intention-preserving edits — don't silently drop one side's behavior.
- For ambiguous import conflicts, accept both and let lint/types drop the dead ones.
- After resolving, run `git diff --check` to confirm no markers remain.

## Verification

Before pushing, sanity-check relevant projects:

```bash
jp test php <project>
jp test js <project>
```

## When to Ask the User

Resolve conflicts autonomously unless:

- The resolution depends on product intent not inferable from code, tests, or docs.
- The conflict crosses a user-visible API/contract where guessing could break consumers.
- Two designs with equivalent merit need a tiebreaker.
- The merge introduces irreversible side effects (schema/data changes).

Otherwise proceed; document non-obvious decisions in the merge commit summary if helpful.
