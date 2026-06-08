# SKYLINX PeopleOS API Specification

Base path: `/api/v1`

## Authentication

- `POST /auth/login`
- `POST /auth/otp/request`
- `POST /auth/otp/verify`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/logout`
- `GET /auth/me`

## Users, Roles, and Permissions

- `GET /users`
- `POST /users`
- `PATCH /users/:id`
- `GET /roles`
- `POST /roles`
- `PATCH /roles/:id/permissions`
- `GET /permissions`

## Dashboard

- `GET /dashboard/admin`
- `GET /dashboard/manager`
- `GET /dashboard/employee`
- `GET /dashboard/super-admin`

## Employees

- `GET /employees`
- `POST /employees`
- `POST /employees/bulk-upload`
- `GET /employees/:id`
- `PATCH /employees/:id`
- `GET /employees/:id/profile`
- `PATCH /employees/:id/personal-details`
- `PATCH /employees/:id/contact-details`
- `PATCH /employees/:id/work-details`
- `POST /employees/:id/education`
- `POST /employees/:id/family`
- `POST /employees/:id/documents`
- `PATCH /employees/:id/documents/:documentId/verify`
- `PATCH /employees/:id/bank-details`

## Attendance

- `GET /attendance/logs`
- `POST /attendance/check-in`
- `POST /attendance/check-out`
- `GET /attendance/shifts`
- `POST /attendance/shifts`
- `PATCH /attendance/shifts/:id`
- `GET /attendance/rules`
- `PATCH /attendance/rules`
- `POST /attendance/regularizations`
- `PATCH /attendance/regularizations/:id/approve`
- `PATCH /attendance/regularizations/:id/reject`
- `POST /attendance/overtime`
- `PATCH /attendance/overtime/:id/approve`
- `POST /attendance/comp-off`
- `GET /attendance/reports`

## Leave

- `GET /leave/types`
- `POST /leave/types`
- `PATCH /leave/types/:id`
- `GET /leave/balances`
- `POST /leave/requests`
- `PATCH /leave/requests/:id/approve`
- `PATCH /leave/requests/:id/reject`
- `GET /leave/reports`

## Payroll

- `GET /payroll/salary-structures`
- `POST /payroll/salary-structures`
- `PATCH /payroll/salary-structures/:id`
- `GET /payroll/runs`
- `POST /payroll/runs`
- `POST /payroll/runs/:id/calculate`
- `POST /payroll/runs/:id/lock`
- `GET /payroll/runs/:id/payslips`
- `GET /payroll/payslips/:id/download`
- `POST /payroll/runs/:id/bank-export`
- `GET /payroll/reports`
- `GET /payroll/form-16`

## Reports

- `GET /reports/employees`
- `GET /reports/attendance`
- `GET /reports/leave`
- `GET /reports/payroll`
- `GET /reports/expenses`
- `GET /reports/compliance`
- `POST /reports/export`

## Holidays

- `GET /holidays`
- `POST /holidays`
- `PATCH /holidays/:id`
- `DELETE /holidays/:id`

## Organization Chart

- `GET /organization/chart`
- `GET /organization/departments/tree`
- `PATCH /organization/manager-mapping`

## Expenses

- `GET /expenses`
- `POST /expenses`
- `POST /expenses/:id/receipt`
- `PATCH /expenses/:id/manager-approve`
- `PATCH /expenses/:id/hr-approve`
- `PATCH /expenses/:id/reimburse`

## Insurance

- `GET /insurance/policies`
- `POST /insurance/policies`
- `GET /insurance/employees/:employeeId`
- `POST /insurance/employees/:employeeId/dependents`
- `POST /insurance/claims`

## ID and Visiting Cards

- `GET /cards/templates`
- `POST /cards/templates`
- `POST /cards/id-card/:employeeId/generate`
- `POST /cards/visiting-card/:employeeId/generate`

## Social Feed

- `GET /feed`
- `POST /feed/posts`
- `POST /feed/posts/:id/like`
- `POST /feed/posts/:id/comments`
- `GET /feed/birthdays`

## Rewards and Benefits

- `GET /rewards`
- `POST /rewards/recognition`
- `GET /benefits`
- `POST /benefits/claims`

## Recruitment ATS

- `GET /ats/jobs`
- `POST /ats/jobs`
- `PATCH /ats/jobs/:id`
- `GET /ats/candidates`
- `POST /ats/candidates`
- `POST /ats/candidates/:id/resume`
- `POST /ats/applications`
- `PATCH /ats/applications/:id/stage`
- `POST /ats/interviews`
- `PATCH /ats/interviews/:id/feedback`
- `POST /ats/offers`
- `POST /ats/offers/:id/generate-letter`
- `POST /ats/joining-workflow`

## Settings

- `GET /settings/company`
- `PATCH /settings/company`
- `GET /settings/modules`
- `PATCH /settings/modules/:module`
- `GET /settings/payroll`
- `PATCH /settings/payroll`
- `GET /settings/attendance`
- `PATCH /settings/attendance`
- `GET /settings/leave`
- `PATCH /settings/leave`
- `GET /settings/import-export`

## Notifications

- `GET /notifications`
- `POST /notifications/test`
- `PATCH /notifications/preferences`
- `POST /notifications/templates`

## Audit Logs

- `GET /audit-logs`
- `GET /audit-logs/:id`
