# BronzeManna Tap-to-Pay: demo and real-world implementation roadmap

## What this build demonstrates
The React Native app has a **Tap to Pay Demo** screen with fictional card selection, illustrative SNAP/WIC/TANF item rules, mock authentication confirmation, ready-to-tap state, a local-only processor adapter, simulated approval/decline, fictional balance update, and a session-only receipt. It does not use NFC, biometrics, real money, card numbers, PINs or government accounts.

## Production integration gates
1. **Issuer / state agency authorization**: obtain written agreements, issuer-approved tokenization and account-linking methods for each benefit program and state. EBT/WIC support differs by issuer, processor and retailer. No scraping, PIN capture or copying raw card credentials.
2. **Card and token lifecycle**: issuer-approved wallet token or cryptogram provisioning, device binding, suspension, revocation, replacement, reconciliation and audit. An issuer-backed payment credential is required; a visual digital card is not enough.
3. **Contactless implementation**: on Android, determine whether approved HCE, secure element or platform wallet APIs can support the actual EBT payment protocol and terminal network. iOS third-party NFC requires Apple entitlements and commercial eligibility. Neither OS API grants payment-network access by itself.
4. **Processor and merchant certification**: authorize purchases through approved EBT rails, verify retailer POS acceptance, state/program restrictions, WIC approved product lists, split-tender handling, reversal/refund, offline rules, settlement and error states.
5. **Security and privacy**: threat model, secure key management, authentication, anti-replay, transaction integrity, least-privilege access, consent, encryption, audits, accessibility and independent penetration testing. Determine HIPAA applicability separately for Medicaid data.
6. **Pilot**: start with an agency/issuer and one certified retailer environment using approved test credentials and documented acceptance criteria. Do not enable real checkout before approval.

**Medicaid member ID** is for coverage identification, not a general-purpose payment credential. Some health plans issue distinct allowance cards, which would require separate issuer support.

## Developer notes
- `payments/paymentAdapter.ts`: `PaymentAdapter` interface, pure demo purchase validation and a fake authorization adapter. No networking.
- `App.tsx`: simulated state transitions and local balance updates only after demo authorization.
- `agency-portal/index.html`: separate, unconnected fictional agency view.
- No Expo NFC plugin or native contactless entitlement is included, intentionally.

## Manual test scenarios
- SNAP + eligible groceries + $12.50 -> simulated approval, balance decreases.
- SNAP + non-food supplies -> simulated decline, balance unchanged.
- WIC + sample WIC item -> simulated approval, one sample item removed.
- WIC + other product -> simulated decline.
- TANF + amount exceeding demo balance -> simulated decline.
- Frozen wallet or unlinked benefit card -> simulated decline.
- Repeated tap on same completed state -> not charged twice.
- Change item or amount -> demo confirmation must restart.
