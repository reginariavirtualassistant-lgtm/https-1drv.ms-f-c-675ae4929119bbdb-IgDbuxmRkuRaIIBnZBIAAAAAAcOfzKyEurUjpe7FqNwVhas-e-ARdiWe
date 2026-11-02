# BronzeManna Wallet — 15-screen demo

An Expo + React Native + TypeScript prototype for Android, iOS and web. Bronze/champagne/plum visual design. Includes all 15 screens from the reference image with sample interactions and fictional data.

## Run locally / Android preview

Use Node.js 24 LTS. From this repository folder:

```sh
npm ci
npx expo start --lan
```

Put the computer and Android phone on the same Wi-Fi. Open **Expo Go → Scan QR code** and scan the terminal QR code. This app uses **Expo SDK 54**; if the current Play Store Expo Go reports an SDK mismatch, obtain the SDK 54 Android Expo Go version from https://expo.dev/go. Do not upgrade the app's Expo SDK just to bypass that message.

If LAN access fails, allow Node through the computer's firewall, avoid guest Wi-Fi/client isolation, and retry. As an alternative on your own computer, run `npx expo start --tunnel` (requires Internet and Expo's tunnel helper). A cloud localhost URL or cloud LAN QR is not reachable from your phone. Cloud-to-phone tunnels have not been configured or tested here.

For a browser on the same computer, run `npm run web` and open the address printed by Expo. The cloud onboarding UI does not expose a web preview link. The local cloud server was used only for automated verification.

Open **Explore Demo → Cards** to link fictional SNAP/WIC/TANF cards. Try approved, declined and cancelled responses. Then open **Home → Tap-to-Pay Demo** to simulate authorization, a terminal tap, and a receipt. SmartSpend, Family Benefits Hub, Benefits Guardian and Wallet Activity are also in Home. Everything stays in memory and resets on reload. No real authorization, NFC or payment integration exists.

```sh
npm run typecheck
npm test
npm run build:web
npx expo export --platform android --max-workers 2
```

See [repository inventory and screen coverage](docs/REPOSITORY_AUDIT.md) and [validation details](docs/VALIDATION.md). Original archives and saved reference pages are preserved; extracted alternate apps live in `reference-prototypes/` and are not part of the working app build.

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
