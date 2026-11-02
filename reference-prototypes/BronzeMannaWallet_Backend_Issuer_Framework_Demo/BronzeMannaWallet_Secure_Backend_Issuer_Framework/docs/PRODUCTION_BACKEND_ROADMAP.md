# BronzeManna — production backend and authorized issuer integration roadmap

## Current status
- Functional **local-only, fictional-data API simulator**, **not production security**.
- No real identity verification, issuer partnership, real balances, EBT card linking, PIN entry, NFC, payment processing, health records or money movement.
- The original on-device simulated wallet and the separate local issuer API lab are **not synchronized**. This prevents the demonstration from being mistaken for real issuer-backed payments.

## Proposed production architecture
Mobile app → authenticated API gateway → account/consent service → wallet service → scoped issuer adapter → approved agency/processor endpoint. Independent audit and security monitoring. Payment initiation is a separate issuer-approved service; not implemented in the demo.

### Milestones
1. **Partnership discovery:** identify each program's authorized issuer, processor, available read-only APIs, issuer-hosted identity flow, wallet provisioning options, security obligations, and contract owner. No universal EBT API should be assumed.
2. **Legal and privacy:** data-flow mapping, minimum necessary collection, relevant state/federal SNAP/WIC/Medicaid rules, HIPAA applicability by role, agreements/BAAs where required, privacy notices, retention/deletion rules and accessibility requirements.
3. **Real account security:** identity proofing and passkeys/MFA, secure sessions and device binding, scoped authorization, refresh-token rotation, recovery and revocation, secure key management, rate limiting and fraud monitoring.
4. **Production infrastructure:** managed database with tenant/user isolation, encryption at rest and in transit, KMS/HSM-backed key storage, network segmentation, immutable audit storage, backup/restore, monitoring, incident response and disaster recovery.
5. **Issuer adapters:** signed contract per issuer, documented OAuth/OIDC or equivalent issuer-approved authorization, state/nonce/PKCE where supported, strict callback validation, token vault, permission scope and expiry handling, error isolation and safe reconciliation.
6. **Independent security review:** threat modeling, penetration testing, dependency scanning, privacy review, accessibility testing, incident drills and procurement security questionnaires.
7. **Authorized pilot:** start with read-only balances or notices, using agency-issued sandbox credentials and documented permissions. Only after approval consider payment credentials and POS/NFC certification.

### EBT PIN boundary
The wallet must never request or store EBT PINs for linking. A real transaction may still require an issuer/processor-approved PIN-entry mechanism. The app cannot assume all programs allow NFC or issuer tokenization.

### Medicaid boundary
Medicaid member IDs identify coverage, not general-purpose spendable cash. Plan-specific allowances may require separate approved card/payment integration.

## Questions for issuers
- Do you support third-party wallet account linking and issuer-hosted authentication?
- Is read-only balance or transaction data available under contract? Which programs and states?
- Is card tokenization, NFC provisioning, or mobile POS acceptance supported for SNAP/WIC/TANF?
- What PIN-entry, terminal certification, and merchant restrictions apply?
- Who authorizes access and what are the onboarding, audit, security, and liability requirements?
