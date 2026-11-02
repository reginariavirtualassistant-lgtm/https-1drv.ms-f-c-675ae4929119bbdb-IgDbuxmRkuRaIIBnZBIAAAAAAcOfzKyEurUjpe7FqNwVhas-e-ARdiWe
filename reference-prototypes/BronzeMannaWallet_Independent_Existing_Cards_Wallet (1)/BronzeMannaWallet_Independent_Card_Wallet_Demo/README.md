# BronzeManna Wallet — demo prototype

React Native / Expo TypeScript prototype for Android and iOS. Bronze/champagne/plum design. **All cards, balances, transactions, stores, verification, links and checkout flows are fictional.** No payment functionality or real EBT integration.

## Start
1. Install Node.js (LTS) and Expo Go on your phone.
2. In this folder run `npm install` then `npx expo start`.
3. Scan the Expo QR code with Expo Go (Android) or camera (iOS) on the same network. Expo development environment may require extra setup.
4. Optional mock backend: `node server/mock-server.js`; visit http://127.0.0.1:4100/health . The mock backend is separate from the mobile app and never calls an issuer.

## Features
Original 15 screens plus My Digital Cards, Link a Card, Payment Options and Security Center. Includes simulated card verification, fictional card linking, a demo freeze control, future NFC/Apple Wallet/Google Wallet pathways clearly disabled, WIC scanner simulation, calendars, alerts, and support.

## Codex workflow
Extract ZIP, push files to a private GitHub repository, open repository in Codex. Ask Codex to run `npm install`, `npx tsc --noEmit`, and help launch Expo. Then ask for improvements screen-by-screen.

## Production warning
Do not deploy as a live government benefits wallet. Real cards require issuer/processor contracts and secure integrations; real tap-to-pay requires additional approvals and certification. See `docs/LIVE_INTEGRATION_PLAN.md`.

## WIC Approved Foods (demo)
The WIC Approved Foods screen provides searchable example categories, filters, and educational descriptions. This is NOT a verified state Approved Product List (APL) and must not be used to determine checkout eligibility. A production integration requires official state WIC product data, appropriate update procedures, and household benefit authorization.

## Demo identity and avatar
The fictional sample user is **Diana Prince**. The user-provided illustration at `assets/diana-prince-demo-avatar.jpg` appears on the dashboard, profile and identity verification preview. This is an avatar, **not a government-issued ID**. Identity verification remains disabled. No personal user name or photo is bundled in this project. The Create Account screen lets testers change the displayed name during the demo session.

## Brand placement correction
The BronzeManna basket/phone brand logo is shown on the welcome screen. The user-provided fictional character appears **only** as the circular profile avatar on the dashboard and profile screen. The identity-verification screen has no character picture and does not collect ID data. All benefits, card links, and payments remain simulated.

## WIC and Medicaid recipient communications
Open **Messages & Updates** from the app menu or Profile. Filter by program, read notices, save demo replies, toggle demo message consent, and simulate an agency announcement. Everything is local and fictional. See `docs/RECIPIENT_COMMUNICATIONS.md` for production requirements.

## NEW: Family Benefits Hub, Guardian and Agency Portal
- **Family Benefits Hub**: Diana Prince and fictional child Avery, household program summary.
- **Cross-Program Action Planner**: four sample tasks with completion toggles.
- **Benefits Guardian AI demonstration**: deterministic, rule-based answers with fictional notice identifiers; NOT a real AI model.
- **Medicaid Coverage**: member card placeholder, coverage, renewal and explicit distinction between coverage and cash or plan allowances.
- **Agency Intelligence Portal**: `agency-portal/index.html`, a separate interactive browser-only simulation with agency filters and fictional notices. **It is not connected to the mobile app or a backend.**
- **Validation kit**: `docs/VALIDATION_PLAN.md` and `docs/DEMO_WALKTHROUGH.md`.

Run the mobile app with `npm install` and `npm start` (Expo). Open the agency portal HTML in a browser. Do not enter real personal information.

## Independent BronzeManna Wallet — existing cards, simulated checkout
**My Digital Cards** is now a BronzeManna-branded wallet for fictional representations of existing SNAP/EBT, WIC, TANF and Medicaid cards. **Link a Card** simulates issuer approval without credentials. **Future Checkout** now has a local-only purchase simulator with illustrative benefit restrictions and simulated balance changes. **Wallet Activity** shows session-only transactions and a reset option. Medicaid is a coverage ID, not a cash payment card.

No real NFC, payment network, issuer integration, money transfer, or government card linking is present. Read `docs/INDEPENDENT_WALLET_ARCHITECTURE.md`.
