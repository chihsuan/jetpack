---
description: >
  Manually gather PR feedback from all channels (top-level comments, inline
  review comments, review summaries) and mirror it into the workpad. Use on
  `Rework` re-entry, on `Todo`-with-attached-PR kickoff, and as the final
  check before moving an issue to `In Review`. Normal `In Review` re-entries
  already have feedback pre-injected by Symphony's `pr_review_poller`, so
  the manual sweep is the fallback path.
---

# Symphony PR feedback sweep

1. Identify the PR number via `github_get_pull_request` (returns the PR
   currently attached to the branch).
2. Gather feedback from all channels — no scoped tool covers comment
   listing, so this is raw `gh`:
   - Top-level PR comments:
     `gh pr view <pr> --repo chihsuan/jetpack --comments`
   - Inline review comments:
     `gh api repos/chihsuan/jetpack/pulls/<pr>/comments`
   - Review summaries / states:
     `gh pr view <pr> --repo chihsuan/jetpack --json reviews`
3. Treat every actionable comment (human or bot, top-level or inline) as
   blocking until one of:
   - the code/test/docs change addresses it, or
   - an explicit, justified pushback reply is posted on the same thread via
     `github_add_pr_comment` (top-level) or, for inline-thread replies the
     scoped tool can't post,
     `gh api repos/chihsuan/jetpack/pulls/<pr>/comments/<id>/replies`.
4. Mirror each feedback item into the workpad checklist with resolution
   status.
5. Re-run validation after feedback-driven changes; re-run the sweep until
   no actionable comments remain.
