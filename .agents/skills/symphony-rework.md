---
description: >
  Symphony Rework flow — full approach reset when a Linear issue moves to
  `Rework` state. Closes the existing PR, removes the workpad, and
  restarts from kickoff on a fresh worktree.
---

# Symphony Rework flow

`Rework` is a full approach reset, not incremental patching.

1. Re-read the issue body and all human/reviewer comments end to end.
   Explicitly note in the new workpad what will be done differently this
   attempt.
2. Post a short pointer on the existing PR via `github_add_pr_comment`
   (e.g. "Closing in favor of fresh approach — see new PR linked from the
   Linear issue."), then close it with
   `gh pr close <pr> --repo chihsuan/jetpack` (no scoped equivalent for
   close).
3. Remove the existing workpad comment (`{{ agent.workpad_heading }}`,
   `## Codex Workpad`, or `## Claude Workpad`).
4. The Symphony workspace already gives you a fresh worktree on
   `change/<slug>` off `origin/trunk` — verify with `git status` and
   `git log origin/trunk..HEAD`. If it isn't clean, stop and follow the
   blocked-access escape hatch (do not try to manually rebase).
5. Restart from the normal kickoff flow:
   - Move issue from `Rework` to `In Progress`.
   - Create a new `{{ agent.workpad_heading }}` workpad.
   - Run Phase 0 → Step 1 → Step 2 → /work-on → ... → completion bar.
