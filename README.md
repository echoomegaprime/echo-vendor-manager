# Echo Vendor Manager

AI-powered vendor and procurement management on Cloudflare Workers (D1 + KV + service
bindings). Vendor CRUD, purchase-order lifecycle with receiving/approval/budget deduction,
contracts with renewal, compliance-document expiry tracking, risk assessment, performance
reviews, spend analytics, AI-assisted vendor analysis and spend optimization, and CSV/JSON
export.

## Endpoints

Root (`/`) and `/health` need no auth. Every write (POST/PUT/PATCH/DELETE) requires
`X-Echo-API-Key`. **Every GET is intentionally unauthenticated by design** -- see
[SECURITY.md](SECURITY.md) for what that means in practice and why it's worth your attention
before deploying this to a real tenant.

Route groups: `/orgs`, `/users`, `/vendors` (+ onboarding actions), `/contacts`, `/contracts`
(+ renew), `/purchase-orders` (+ approve/reject/receive/close/cancel), `/budgets` (+
utilization), `/reviews`, `/compliance`, `/spend` (+ analytics, compare), `/risk-assessment`
(+ matrix), `/dashboard`, `/ai/vendor-analysis`, `/ai/spend-optimization`, `/export`.

## Verify

```powershell
npm install
npm test
```

## Security

This service stores vendor tax IDs, contract terms, and spend/budget data. See
[SECURITY.md](SECURITY.md) to report a vulnerability -- never as a public issue.

## License

See [LICENSE](LICENSE). Contributions: see [CONTRIBUTING.md](CONTRIBUTING.md).
