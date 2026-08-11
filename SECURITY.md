# Security policy

Echo Vendor Manager is a Cloudflare Worker (D1 + KV + service bindings) holding vendor tax
IDs, contract terms, purchase-order/spend history, and budget data.

## Fixed in this consolidation pass

1. **Timing side-channel in the credential check.** `authOk()` compared the submitted key
   with a raw `===`. Replaced with a constant-time `timingSafeEqual`.
2. **`.wrangler/cache/wrangler-account.json` was committed to git** despite `.gitignore`
   listing `.wrangler/` -- it referenced the doctrine-banned legacy Cloudflare account
   (`bmcii1976@gmail.com`). Not a credential leak (an account ID isn't a secret), but wrong to
   ship. Untracked.
3. **`@cloudflare/workers-types` was pinned to a version incompatible with the current
   `wrangler@^4.0.0` range** (`4.120.1` now peer-requires `workers-types@^5.x`) -- the repo
   could not `npm install` at all as it stood. Bumped to `^5.0.0`; typecheck passes clean.

## Known design choice, not changed in this pass -- read your way through this before relying on it

**Every GET route is intentionally unauthenticated.** The code's own comment says `// Auth
for write operations` -- this is the stated design, not a bug this pass silently introduced or
found accidentally broadened. Unlike other repos consolidated earlier in this campaign
(`echo-lms`, `echo-document-manager`), there is no competing narrower `/public/*` mechanism
here that contradicts the open-read design -- every GET has always been open, consistently,
with no internal signal that anything else was intended.

That said, this is real, worth-your-attention exposure, not merely theoretical: with only an
`org_id`/vendor `id` (sequential D1 autoincrement integers, not UUIDs -- trivially enumerable),
an unauthenticated caller can read `GET /vendors/:id` (including `tax_id`, `legal_name`, bank
payment method, full address), `GET /spend/analytics` (per-vendor and per-category spend
totals), `GET /budgets/utilization` (budget amounts and remaining balances), `GET /contracts`
(contract value and terms), and `GET /export?format=csv` (a full CSV dump of vendors, POs, or
spend for a given `org_id`). None of this requires a credential.

Whether that is acceptable depends on this Worker's actual deployment context (e.g. sitting
behind Cloudflare Access, or on a network no untrusted caller can reach) -- information not
available from the repo alone. Flagged, not silently redesigned: changing every read to
require auth is a real product decision (it would break any legitimate open-catalog use case
this API might currently support) that deserves an explicit call, not a unilateral change
buried in a consolidation pass. See the tracked follow-up.

## Supported version

Security fixes target the current `main` branch. Historical commits are retained for evidence
and are not patched in place.

## Report a vulnerability

Do not open a public issue for a suspected vulnerability. Send a private report to
`security@echo-op.com` with:

- affected endpoint and exact revision;
- reproduction steps and expected impact (this service holds vendor tax IDs and financial
  data -- treat any auth-boundary issue as high severity);
- safe contact details for follow-up.

Never include a live `ECHO_API_KEY` in a report.
