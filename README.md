# BronzeManna Wallet — 15-screen demo

An Expo + React Native + TypeScript prototype for Android, iOS and web. Bronze/champagne/plum visual design. Includes all 15 screens from the reference image with sample interactions and fictional data.

## Run locally
1. Install Node.js LTS.
2. In this folder, run `npm install`.
3. Run `npx expo start`.
4. Install Expo Go on your phone and scan the QR code (same Wi-Fi), or press `w` for a browser preview. If Expo Go cannot connect, try `npx expo start --tunnel`.

## Use with Codex
1. Create a private GitHub repository.
2. Upload these project files to the repository (not the ZIP itself).
3. Connect the repository to Codex and ask it to improve screens or add functionality.

## Safety and limitations
- Demo only: all account balances, deposits, stores, and transactions are fictional.
- No EBT card numbers, PINs, identity documents, real verification, or payment processing.
- No backend or production authentication. No live camera/barcode integration.
- Future SNAP/WIC mobile payment needs agency/processor authorization, technical integrations, security reviews, and applicable approvals.
- This is a first working UI prototype, not a production-ready government benefits system.
- Names, logos, trademarks, and rights must be checked separately before launch.

## Suggested next Codex tasks
- Refactor `App.tsx` into separate screens and reusable components.
- Add local-only demo persistence and automated tests.
- Improve fidelity against the supplied 15-screen reference image.
- Create a separate agency administration portal using synthetic data.
- Perform accessibility and mobile device testing.
