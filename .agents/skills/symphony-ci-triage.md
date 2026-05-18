---
description: >
  Manually triage red GitHub Actions checks on a Symphony PR. Use before
  moving an issue to `In Review` and after any push you initiated locally.
  Normal `In Review` re-entries already have failure summaries pre-injected
  by Symphony's `ci_poller`, so the manual flow is the fallback path.
---

# Symphony CI triage

1. Read CI status with `github_get_pr_checks` (per-check status / conclusion
   / `details_url`). Prefer this over `gh pr checks`.
2. For each failing check, fetch the failed log content (no scoped
   equivalent):
   `gh run view <run-id> --repo chihsuan/jetpack --log-failed`
   (the run ID is in the `details_url` returned by `github_get_pr_checks`).
3. Categorize each failure: flaky infrastructure (retryable) vs real code
   defect.
4. For real failures: diagnose root cause, fix it, re-run validation
   locally, then loop back through validation → diff review → commit → push.
5. If the failure is in unrelated pre-existing code (rare, given the scope
   constraint): document in the workpad and note it explicitly in the PR
   body so the reviewer knows it's not yours.

Use `--no-verify`, `--force`, or skipped hooks only if the user explicitly
asks — the fix is always to satisfy the check.
