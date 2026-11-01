# BronzeManna: secure card linking and payments roadmap

## Delivered now (demo)
- My Digital Cards: fictional SNAP/WIC/TANF cards with masked demo numbers.
- Link a Card: simulated issuer-authorization journey. No card/PIN/ID entry.
- Payment Options: separate BronzeManna NFC, Apple Wallet, and Google Wallet future routes; all disabled.
- Security Center: simulated card freeze, safety guidance.
- Local mock server: `node server/mock-server.js` on loopback, returns demo session only. It is **not** used by the app and must not be deployed as a real issuer API.

## Real integration architecture (requires contracts)
1. Agency/issuer/processor contract and regulatory approval for each program and jurisdiction.
2. Approved issuer-hosted authentication and account authorization; use OAuth/OIDC or equivalent issuer-defined flows with PKCE, strict redirect allowlist, short-lived credentials and device-bound sessions when supported.
3. Backend exchanges authorization grant directly with issuer. Mobile app never sees card PAN or PIN. Store only issuer-scoped opaque account references and permitted masked metadata. Verify account ownership and permissions on every request.
4. Backend obtains authorized balances/transactions from issuer/processor APIs; never scrape consumer websites or infer WIC eligibility from unrelated data.
5. Payment provisioning requires an authorized token service provider, certified payment processing, device tokenization and NFC/payment network compatibility; separate Apple/Google issuer provisioning approval where supported.
6. Implement state-by-state feature flags, fraud monitoring, revocation, audit trails, key management, security reviews, accessibility and incident response before launch.

## Security controls required before production
- Independent legal/compliance assessment (including applicable EBT, privacy, consumer protection and security rules).
- Threat modeling, mobile security testing, backend penetration testing, data retention and deletion policy, encryption in transit and at rest, MFA, least privilege, logging with sensitive-data redaction, and vendor security reviews.
- Never collect EBT PINs, full card numbers, SSNs or ID images inside this demo.
- Do not claim that phone NFC emulation or a wallet logo makes an EBT card usable at checkout.

## USDA policy status
The Oct. 23, 2026 SNAP proposed rule says the mobile purchasing pilot is ongoing and does not propose nationwide virtual EBT provisioning changes at this time. See https://www.govinfo.gov/content/pkg/FR-2026-10-23/pdf/2026-21658.pdf .
