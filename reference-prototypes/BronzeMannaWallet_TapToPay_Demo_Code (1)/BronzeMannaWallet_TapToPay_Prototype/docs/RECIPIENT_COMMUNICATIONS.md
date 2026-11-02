# BronzeManna recipient communications — prototype

This project includes a **local-only WIC and Medicaid communications demonstration**:
- A WIC/Medicaid inbox with program filters, read/unread state, fictional notices and reminders.
- An opt-in toggle, sample replies, and an agency-announcement simulator.
- No real data collection, transmission, login, notifications, or government integration.

## Real integration requirements
1. Obtain written agreements and approved API documentation from each state WIC/Medicaid agency or their authorized vendors.
2. Establish the legal basis, consent and permitted purposes for communications. Determine whether HIPAA applies to each covered entity/business associate relationship; execute BAAs when required.
3. Implement verified identity and role-based agency access, secure account linking, authorization checks, encryption in transit and at rest, audit logs, retention policies, and incident response.
4. Implement a backend message service with per-recipient isolation, agency-signed message provenance, delivery preferences, and safe push notifications that reveal no sensitive health details.
5. Route actual recipient replies only to authorized case-management systems, and make delivery failures and agency contact channels explicit.
6. Obtain independent security/privacy reviews and state approval before production.

Never assume WIC and Medicaid share a unified recipient ID or that either program permits cross-program data sharing. Do not store EBT PINs or Medicaid health details in the demo.
