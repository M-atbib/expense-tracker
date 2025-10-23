# Manual Validation Log

Track walkthrough notes for each user story and viewport as required by the constitution.

## US1 – Capture New Transaction

- **Desktop (1440px)**:
  - [ ] Submit income + expense entries; confirm success banner appears and latest row pins to the top of the table.
  - [ ] Validate form resets (date defaults to today, subcategory realigns with category) without reloading.
  - Notes: Pending—run after wiring smoke data set for review.
- **Mobile (375px)**:
  - [ ] Ensure inputs remain full width, numeric keypad opens for Amount, and submit CTA stays in view.
  - [ ] Validate banner does not overflow viewport when keyboard is dismissed.
  - Notes: Pending manual check.

## US2 – Review and Filter Entries

- **Tablet (768px)**:
  - [ ] Cycle through presets; confirm table + KPI counts update instantly and feedback shows when future dates are clamped.
  - [ ] Test custom range swap (start > end) to ensure helper notice appears and range corrects automatically.
  - Notes: Pending—capture screenshots after smoke test.
- **Mobile (375px)**:
  - [ ] Verify table scrolls horizontally with sticky headers and Remove action remains tappable.
  - [ ] Confirm empty state renders when filter excludes all entries.
  - Notes: Pending manual check.

## US3 – Monitor Budget Insights

- **Desktop (1440px)**:
  - [ ] Confirm KPI cards reflect manual calculations for at least three test entries and savings rate message matches net balance sign.
  - [ ] Validate trend chart tooltips/rendered points align with weekly aggregates and donut legend totals equal expense sum.
  - Notes: Pending manual check.
- **Mobile (375px)**:
  - [ ] Ensure KPI cards stack cleanly, charts remain legible, and legend scrolls without breaking layout.
  - [ ] Verify aria-labels/descriptive copy announce chart purpose in screen readers (via VoiceOver/NVDA spot check).
  - Notes: Pending manual check.
