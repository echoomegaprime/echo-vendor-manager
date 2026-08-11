# Contributing

Thank you for improving Echo Vendor Manager. This is a public, proprietary infrastructure
project: contributions are welcome for review, but repository visibility does not grant a
general use or redistribution license.

## Development path

1. Open an issue describing the behavior being changed.
2. Create a focused branch from current `main`.
3. Add a failing test before changing `authOk`/`timingSafeEqual` or which methods require
   auth -- see SECURITY.md for the current model (writes gated, reads intentionally open) and
   why that's flagged, not silently changed.
4. Validate before opening a pull request:

   ```powershell
   npm install
   npm test
   ```

5. Open a pull request using the repository template and include exact test output.

## Pull-request requirements

- No secrets (`ECHO_API_KEY`) are included.
- No stubs, placeholders, or self-asserted readiness -- this service holds vendor tax IDs and
  spend/budget data.
- **Changing any GET route from open to authenticated (or vice versa) must be called out
  explicitly in the pull request description**, since the current open-read design is a real
  product decision documented in SECURITY.md, not an oversight to quietly patch.
