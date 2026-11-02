# Validation

Working branch: `feature/fictional-benefits-demo`. No merge or environment publication was performed.

Verified in the cloud with Node 24.19.0:

- TypeScript: `npm run typecheck`.
- Local simulation tests: 8 tests passed, covering all three programs and approval/decline/cancellation, input validation, immutable cash/item debits, no changes after declines, and SmartSpend calculations.
- Web production export succeeded.
- Android JavaScript/Hermes export succeeded. This is not an APK build or physical-device test.
- Chromium at a 412×915 viewport: all 15 original screens and 5 added screens, back/home/tabs, linking outcomes, unlinking, scan/reset, household task completion and persistence across navigation, Guardian source notices, budget choices, cash and WIC purchases, processor declines, unlinked-card declines and receipts. No browser runtime exceptions.
- Original extracted mock issuer backend: 5 tests passed (health, personal-data rejection, authorization/session requirements, link/read/revoke/isolation/audit, Medicaid non-cash coverage). The backend is not connected to the working app.
- Every extracted file was compared byte-for-byte with its original archive entry; originals were not changed.

## Re-run browser checks

Start Expo web in one terminal:

```sh
CI=1 EXPO_OFFLINE=1 npx expo start --web --localhost --port 8081 --max-workers 2
```

With Playwright available, run `node tests/navigation.cjs`. The cloud image already supplies Playwright and `/usr/bin/chromium`. Elsewhere, optional local tooling can be installed without saving dependencies:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node tests/navigation.cjs
```

Use `CHROMIUM_PATH` if a system Chromium path differs. These optional test tools are not mobile app dependencies.

The archived backend tests can be rerun with:

```sh
node --test reference-prototypes/BronzeMannaWallet_Backend_Issuer_Framework_Demo/BronzeMannaWallet_Secure_Backend_Issuer_Framework/backend/tests/api.test.js
```

Not verified: physical Android Expo Go launch, Android hardware Back button on a device, native accessibility, iOS execution, APK/AAB packaging, LAN/tunnel access from a phone, or optional archived apps/agency portal interfaces. The six MHTML pages are reference documents, not test suites. No real benefit linking or payment can be tested because none is implemented.
