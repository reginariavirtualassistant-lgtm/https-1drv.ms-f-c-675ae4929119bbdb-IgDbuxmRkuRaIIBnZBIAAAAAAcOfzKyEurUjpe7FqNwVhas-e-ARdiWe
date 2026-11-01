# BronzeManna demonstration walkthrough

1. Open the Expo mobile app and choose **Explore Demo**. The bronze basket logo remains on the welcome screen; Diana Prince's fictional avatar is used only for the profile.
2. On Dashboard, open **Family Benefits Hub**. Show Diana and Avery with program summaries. All amounts are fictional.
3. Open **Action Planner**. Mark a sample task complete and reopen it to demonstrate the session-only workflow.
4. Open **Benefits Guardian AI**. Ask “When is my Medicaid renewal?” and “What is my WIC appointment?” Show the cited fictional notice identifiers. This is deterministic rule-based text, not an LLM connection.
5. Open **Medicaid Coverage**. Show that cash is “Not applicable” and any plan-specific allowance is “Not connected” until an authorized health plan provides it.
6. Open **Messages & Updates** for the existing local-only WIC and Medicaid messages.
7. Open `agency-portal/index.html` in a browser. Select the WIC or Medicaid workspace, review the fictional task queue, and simulate a notice. The mobile app and agency page are **not network connected**; do not claim the agency message appears in the phone.
8. Use `VALIDATION_PLAN.md` for interviews and scorecards.

No real recipient information, live agencies, payments, EBT PINs or Medicaid records should be entered.
