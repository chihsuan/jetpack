# Agent contract for `@automattic/jetpack-premium-analytics`

This file defines what AI agents may and may not change in this package.

## Allowed scope

- `src/**` (PHP and component code)
- `tests/**` (test code)
- `changelog/**` (new entries only)
- `composer.json`, `package.json` (only when adding/upgrading a dependency
  required by the current Linear ticket and justified in the workpad)

## Off-limits without explicit approval

- `shims/**` (boot chain and asset registration — owner-only)
- `routes/**` (route registration — owner-only)
- Build tooling under `tools/` (if present)

## Definition of Done

See `tools/symphony/WORKFLOW.md` "Definition of Done" section. This package adds:

- [ ] `composer phpunit` exits 0 (PHP tests pass)
- [ ] `pnpm run build` exits 0 (no build errors)
- [ ] No new `as any` type casts in TypeScript source
- [ ] Changelog entry uses `Significance` (major/minor/patch) and `Type` (added/fixed/changed) per
      existing entries in `changelog/`

## Verification

For UI changes, the orchestrator (Symphony) uses `/jetpack-test-jurassic-ninja`
to provision a JN site and verifies behavior via Playwright MCP against
`/wp-admin/admin.php?page=jetpack-premium-analytics`. The check
must pass before push.
