# SKYLINX HRMS Reference Recording Map

Source video:
`C:\Users\SKYLINX HR\Desktop\screen recorder for pc - Google Search - Google Chrome 2026-06-01 15-42-21.mp4`

Reviewed on: 2026-06-01

## Observed Reference Flows

The recording shows a Kredily-style HRMS experience with these major flows:

1. Dashboard
   - Left module menu
   - Dark top bar with employee search, date, notification and profile avatar
   - Company card, task notifications, quick module tiles, announcements and upgrade/referral panels

2. Profile / Company Setup
   - Employee profile cards
   - Personal / contact / official information blocks
   - Setup and configuration forms

3. Attendance
   - Attendance dashboard
   - Attendance logs
   - Shift / rule controls
   - Regularization and exception views

4. Leave
   - Leave dashboard
   - Leave requests
   - Leave balance and leave rules
   - Approve / reject flow

5. Payroll
   - Payroll dashboard
   - Payroll run workflow
   - Salary / payslip logs
   - Statutory and bank export actions

6. Insurance
   - Insurance information page
   - Employee policy and claim management

7. Rewards
   - Voucher / marketplace style page
   - Recognition and benefits items

8. ID & Visiting Card
   - Stationery designer
   - ID card / visiting card modes
   - Template selector, brand color, employee preview and print validation

## Changes Started

- Global shell and dashboard redesigned to match the reference structure.
- ID & Visiting Card designer already implemented with template selector, brand color, employee preview, front/back view and print validation.
- Attendance, Leave, Payroll, Insurance, Rewards, Directory, Documents, Holidays, Organization Chart, Reports and Settings now use a reference-style module workspace header with:
  - Module tabs
  - Action buttons
  - Compact status/stat blocks
  - Live API wording to avoid demo-data confusion

## Function Parity Checklist

| Reference Area | SKYLINX Module | Current Status |
| --- | --- | --- |
| Left menu + dark top bar + search + notifications | App shell | Implemented first pass |
| Dashboard quick module grid + company cards + announcements | Dashboard | Implemented first pass |
| Employee directory + profile sections | Directory | Header implemented, detailed profile tabs pending |
| Company profile / setup configuration | Settings | Header implemented, detailed setup tabs pending |
| Attendance dashboard, logs, rules and regularization | Attendance | Header + live actions/tables implemented, detailed filters pending |
| Leave dashboard, balance, requests and rules | Leave | Header + live actions/tables implemented, detailed filters pending |
| Payroll run, payslips, statutory and bank export | Payroll | Header + live actions/tables implemented, detailed run wizard pending |
| Reports and export screens | Reports | Header + live report console implemented, export UX refinement pending |
| Holiday calendar | Holidays | Header + live table/action implemented, calendar grid pending |
| Organization chart and manager mapping | Organization Chart | Header + live mapping implemented, visual chart pending |
| Insurance management | Insurance Management | Header + live policies/claims implemented |
| Rewards marketplace | Rewards | Header + live rewards console implemented, marketplace visuals pending |
| ID and visiting card designer | ID & Visiting Card | Implemented first pass |

## Remaining Reference Parity Work

- Convert profile/company setup pages into the recorded multi-section card layout.
- Convert table-heavy modules into tabbed dashboard/log/rule views.
- Add module-specific filters matching the reference, such as month, employee, status and department.
- Add print/export flows where the reference shows PDF/Excel actions.
- Continue testing every module against the uploaded recordings.
