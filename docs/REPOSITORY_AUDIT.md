# Repository audit

The root App.tsx is the working Expo 54 app, with 15 original screens. No original screen is missing. ZIP apps are alternate snapshots, not active routes. All unique ZIPs are extracted unchanged under reference-prototypes; original archives are preserved. Reference projects are excluded from the working TypeScript project.

| Archive | Finding |
| --- | --- |
| BronzeMannaWallet_Backend_Issuer_Framework_Demo.zip | Extracted separately; 28 screens |
| BronzeMannaWallet_Brand_Corrected.zip | Extracted separately; 20 screens |
| BronzeMannaWallet_CardFeatures (1).zip | Extracted separately; 19 screens |
| BronzeMannaWallet_CardFeatures.zip | Exact duplicate of BronzeMannaWallet_CardFeatures (1).zip |
| BronzeMannaWallet_Diana_Prince_Update (1).zip | Extracted separately; 20 screens |
| BronzeMannaWallet_Diana_Prince_Update.zip | Exact duplicate of BronzeMannaWallet_Diana_Prince_Update (1).zip |
| BronzeMannaWallet_Family_Guardian_Agency_Prototype (1).zip | Extracted separately; 25 screens |
| BronzeMannaWallet_Independent_Existing_Cards_Wallet (1).zip | Extracted separately; 26 screens |
| BronzeMannaWallet_Source.zip | Extracted separately; 15 screens |
| BronzeMannaWallet_TapToPay_Demo_Code (1).zip | Extracted separately; 27 screens |
| BronzeMannaWallet_WIC_Foods_Update (1).zip | Extracted separately; 20 screens |
| BronzeMannaWallet_WIC_Medicaid_Messaging_Demo (1).zip | Extracted separately; 21 screens |

The six MHTML files are saved HTML/CSS/image reference pages, not runnable Expo source. They remain untouched.

Archived additions: digital cards, card linking, security/freeze, payment options, WIC approved-food lists, Diana demo profile and brand images, WIC/Medicaid messaging, family household hub, action planner, rule-based Benefits Guardian, Medicaid coverage, wallet checkout/activity, Tap-to-Pay, agency HTML portal, issuer client and mock backend with tests. No SmartSpend implementation was found; the working app adds a small fictional budget planner. No archived app replaces the root app.

The compatible family/Guardian and payment concepts are adapted into separate working components and local services. Archive-only features remain available in the reference snapshots and are not claimed as integrated. The issuer backend and agency portal are optional references and are not connected to the working phone app.

## Original screen coverage

All 15 are reachable and were exercised in Chromium, including returning through Back, Home and bottom tabs.

| Original screen | Working behavior and limits |
| --- | --- |
| Welcome | Get Started and Explore Demo |
| Create Account | Nickname and optional demo email; no real registration |
| Identity Verification | Disabled ID/selfie/phone placeholders; continue works |
| Add Benefits → Add Benefit Cards | SNAP/WIC/TANF simulated linking; Medicaid/Housing display toggles preserved |
| Dashboard | Demo balances, menus and newly added feature routes |
| SNAP / EBT | Session balance and illustrative historical transactions |
| WIC Benefits | Session item count and illustrative food package |
| Scan WIC Item | Simulate/reset; no camera or live product lookup |
| Store Finder | Fictional stores; search is still a placeholder |
| Future Checkout | Original concept preserved, with link to Tap-to-Pay Demo |
| Benefit Calendar | Static November 2026 sample dates |
| Notifications | Fictional alerts; no push delivery |
| Profile & Settings | Demo profile, card management and preferences |
| Help & Support | Demo FAQ |
| Accessibility & Language | Larger text; high contrast remains a preview; Spanish/French remain planned |

Added screens: Family Benefits Hub (household action planner), Benefits Guardian (predefined rule-based notice explanations), SmartSpend (fictional budget split), Tap-to-Pay Demo, Wallet Activity. Family task completion, linked cards and wallet changes survive navigation within a session; all reset on reload. These are adapted demonstrations, not a wholesale import of every archived feature.

## Organization and dependencies

- `App.tsx`: existing screen switch, back stack, dashboard and original screens. Android hardware Back is wired to the same history.
- `src/screens/BenefitCards.tsx`: fictional card-linking controls.
- `src/services/benefitLinking.ts`: program-only authorization responses, no network or sensitive-data inputs.
- `src/screens/FeatureDemos.tsx`: compatible added demonstrations using the existing plum/bronze/white palette plus purple selection states.
- `src/services/demoWallet.ts`: pure integer-cent payment and budget simulation; WIC deducts sample items only.
- `reference-prototypes/`: 10 unique historical archive snapshots; 12 original ZIPs retained, with two exact duplicate pairs (CardFeatures and Diana Prince).
- `tests/`: simulation and browser checks. The mock backend's original tests remain in its extracted reference directory.
- Expo 54, React 19.1, React Native 0.81.5 and TypeScript 5.9 retained. Missing Expo web dependencies are now declared. Added npm lockfile for repeatable installation.

The SNAP historical transaction list and WIC food-package examples remain illustrative static content, distinct from the new session purchase receipts. No real accounts, government data, live AI, NFC or payment network is connected.
