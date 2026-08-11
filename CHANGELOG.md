# Changelog

## Unreleased -- consolidation pass (2026-08-11)

### Fixed
- Constant-time `timingSafeEqual` for the `X-Echo-API-Key` comparison in `authOk()` (was raw
  `===`).
- Untracked `.wrangler/cache/wrangler-account.json` (committed despite `.gitignore`;
  referenced the doctrine-banned legacy Cloudflare account).
- Bumped `@cloudflare/workers-types` `^4.20241205.0` -> `^5.0.0` -- the pinned version
  conflicted with the current `wrangler@^4.0.0` range (resolves to 4.120.1, which
  peer-requires `workers-types@^5.x`); the repo could not `npm install` at all as it stood.

### Added
- `tests/auth.test.mjs` -- 6 tests covering the write-auth gate (POST/PUT/DELETE, positive
  and negative), the public `/` and `/health` routes, and a same-length-vs-different-length
  wrong-key timing-shape check.
- Full governance set (README, SECURITY, CONTRIBUTING, CODE_OF_CONDUCT, LICENSE, CI).

### Documented, not changed
- Every GET route is intentionally unauthenticated (writes gated) -- a real design decision
  stated in the code's own comments, not a bug this pass silently broadened or narrowed.
  Flagged in SECURITY.md as real, worth-your-attention exposure (vendor tax IDs, spend/budget
  data, CSV export) given sequential integer IDs are trivially enumerable, without unilaterally
  changing the auth model.

## 2.0.0 -- original release

Vendor CRUD, PO lifecycle with receiving/approval/budget deduction, contracts with renewal,
compliance-document expiry tracking, risk assessment, performance reviews, spend analytics,
AI-assisted vendor analysis and spend optimization, CSV/JSON export.
