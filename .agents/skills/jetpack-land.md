---
description: Shepherd a Jetpack PR to merge — resolve trunk conflicts, watch CI, address review, then squash-merge
---

Land the PR for the current branch. Don't yield until it's merged or genuinely blocked.

## Preconditions

- `gh` CLI is authenticated for `github.com/Automattic/jetpack`.
- A PR exists for the current branch (use `.agents/skills/jetpack-pr.md` first if not).
- Working tree is clean.

## Workflow

1. Capture PR context:
   ```bash
   branch=$(git branch --show-current)
   pr_number=$(gh pr view --json number -q .number)
   pr_title=$(gh pr view --json title -q .title)
   pr_body=$(gh pr view --json body -q .body)
   ```
2. **Resolve conflicts with trunk** if any:
   ```bash
   mergeable=$(gh pr view --json mergeable -q .mergeable)
   ```
   - `CONFLICTING` → follow `.agents/skills/jetpack-pull.md`, then `git push`.
   - `UNKNOWN` → wait a few seconds and re-check.
   - `MERGEABLE` → proceed.
3. **Address review feedback** before merging:
   ```bash
   # Inline review comments
   gh api repos/Automattic/jetpack/pulls/"$pr_number"/comments
   # Top-level PR discussion
   gh api repos/Automattic/jetpack/issues/"$pr_number"/comments
   ```
   Reply to each unresolved comment with intent (accept / clarify / push back) before pushing fixes. For inline comments, reply on the review thread (not as a top-level comment) so the thread can be resolved:
   ```bash
   gh api -X POST /repos/Automattic/jetpack/pulls/"$pr_number"/comments \
     -f body='<reply>' -F in_reply_to=<numeric_review_comment_id>
   ```
   Then implement, commit, push, and reply again with the commit SHA.
4. **Watch CI**:
   ```bash
   gh pr checks "$pr_number" --watch
   ```
   - If a required check fails, pull logs (`gh run list --branch "$branch"`, `gh run view <run-id> --log-failed`), fix locally, commit, push, restart the watch.
   - Use judgment on flakes — a single-platform timeout on an unrelated job is usually safe to re-run via `gh run rerun <run-id>` rather than push a no-op commit.
   - Pre-commit hook stripped your merge commit? Re-stage and `git commit --no-edit --no-verify` (see AGENTS.md "Common Pitfalls").
5. **Flip the status label** when ready for human review:
   ```bash
   gh pr edit "$pr_number" --remove-label "[Status] In Progress" \
                           --add-label "[Status] Needs Review"
   ```
6. **Squash-merge** once checks are green and all review threads are resolved:
   ```bash
   gh pr merge "$pr_number" --squash \
     --subject "$pr_title" --body "$pr_body"
   ```
   The repo auto-deletes head branches; no manual cleanup needed.

## Failure Handling

- **Lockfile corruption errors across all jobs** on the merge commit: fetch `origin/trunk`, run `.agents/skills/jetpack-pull.md`, push, and rerun.
- **CI bot auto-commit doesn't retrigger CI**: pull the new HEAD locally, add a real commit (or amend trivially) and push to retrigger.
- **`mergeable: UNKNOWN` for a long time**: GitHub is recomputing — re-check rather than force anything.
- **Do not enable auto-merge.** Many Jetpack checks are not marked "required," so auto-merge can ship before CI signals real failures.
- **Do not `--force` push** unless history was deliberately rewritten — use `--force-with-lease` and only when you know why.

## Stop and Ask When

- Review feedback contradicts the user's stated intent for the PR.
- A reviewer requests changes that would expand scope significantly — confirm with the user before agreeing.
- CI fails in a way the diff doesn't plausibly explain after one investigation pass.
- A required check is failing on `trunk` itself (not your branch's fault).
