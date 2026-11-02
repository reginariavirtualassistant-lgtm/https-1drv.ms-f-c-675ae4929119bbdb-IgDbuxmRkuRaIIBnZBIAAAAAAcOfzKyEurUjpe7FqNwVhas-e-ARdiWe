# BronzeManna Wallet: independent app, existing issuer cards

## Demonstrated in this build
- BronzeManna-branded card wallet holding *fictional representations* of SNAP/EBT, WIC, TANF and Medicaid.
- Mock issuer-link approval without asking for actual card numbers, PINs, SSNs or identification.
- In-app simulated checkout with SNAP food-only restriction, WIC item-only restriction, TANF demo balance, and a local-only transaction ledger.
- Wallet freeze control, demo balance reset, family benefit hub, rule-based Guardian, messages, and separate agency-portal HTML demonstration.
- Medicaid member card is a **coverage ID**. Medicaid coverage is not a cash balance or general-purpose payment card.

## Not implemented
- Real issuer authentication or card provisioning; live benefit balances or transaction sync.
- NFC, POS, QR payment credentials, tokenization, Apple Pay/Google Wallet integration, EBT payment authorization or retailer acceptance.
- Actual recipient identity verification, secure cloud account, durable persistence, security certification or real agency messaging.

## Production design
1. Each issuer or authorized EBT processor supplies approved linking and scoped account access. Do not scrape credentials or request EBT PINs.
2. The wallet backend stores opaque issuer tokens, card metadata and minimal benefit data, never raw EBT PINs. Separate token vault and audit trail.
3. Payment initiation must route through the specific issuer/processor-approved EBT/WIC/TANF rails, with eligibility and merchant acceptance checks, POS certification and explicit error handling.
4. A Medicaid member card can be displayed as coverage identification with payer authorization. Any separate plan allowance card is modeled independently and only spendable if its issuer approves wallet payments.
5. Protect with real authentication, least-privilege access, encryption, consent, anti-fraud, accessibility, privacy assessment and independent security testing.
6. Obtain agency/vendor authorization and procurement approvals before pilot with real data.

## Test the simulation
- Link a fictional existing benefit card.
- Select SNAP and eligible groceries for $12.50: mock balance decreases.
- Select SNAP and non-food supplies: blocked.
- Select WIC and sample food item: mock food-item count decreases.
- Select WIC and other product: blocked.
- Select TANF and supplies: mock TANF balance decreases.
- Attempt amount above balance: blocked.
- Freeze wallet in Security Center and attempt checkout: blocked.
- View Wallet Activity and reset fictional balances.

All rules are illustrative and not a complete or authoritative description of actual state-specific eligibility, WIC UPC/APL rules, merchant restrictions, or payment authorization.
