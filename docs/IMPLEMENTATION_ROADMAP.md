# SKYLINX PeopleOS Implementation Roadmap

## Phase 0: Product Setup

- Finalize branding: SKYLINX HRMS or SKYLINX PeopleOS.
- Finalize user roles: Super Admin, HR/Admin, Manager, Employee.
- Finalize first company setup and data import templates.
- Create UI design system and module navigation.
- Create database migrations.

## Phase 1: MVP

Timeline target: 6 to 10 weeks for a small team.

### Scope

- Login
- Forgot password
- Role-based access
- Dashboard
- Employee directory
- Employee profile
- Documents
- Attendance logs
- Check-in and check-out
- Leave apply and approval
- Leave balance
- Basic payroll run
- Payslip records
- Reports
- Audit logs

### Deliverables

- Web app for HR/Admin, Manager, and Employee panels.
- PostgreSQL database.
- Backend APIs.
- Seed data and import templates.
- Basic reports in CSV/Excel.
- Internal deployment.

## Phase 2: Operational HRMS

Timeline target: 8 to 12 additional weeks.

### Scope

- OTP login
- Shift management
- Late mark rules
- Attendance regularization
- Overtime
- Comp-off
- Advanced leave rules
- Holiday calendar
- Organization chart
- Document verification
- Compliance filings
- Email notifications
- WhatsApp notifications
- Expense management
- ID card generator
- Bank export
- PF, ESI, PT, and TDS settings

### Deliverables

- Production-ready HRMS.
- Compliance report exports.
- Payroll approval workflow.
- Notification engine.
- Security audit console and notification controls.

## Phase 3: SKYLINX Recruitment and Integrations

Timeline target: 8 to 14 additional weeks.

### Scope

- Recruitment ATS
- Job posting
- Candidate database
- Resume upload
- Interview scheduling
- Walk-in management
- Campus drive management
- Offer letters
- Joining workflow
- Notification channel integrations
- Browser geo-attendance checks

### Deliverables

- Recruiter workflow.
- Candidate-to-employee conversion.
- Integrated attendance and leave workflows.

## Phase 4: Advanced Platform

Timeline target: 12+ additional weeks.

### Scope

- AI resume parser
- AI attendance alerts
- Advanced analytics
- SaaS multi-company system
- Billing system
- Subscription plans
- Benefits marketplace
- Advanced data retention and archival

## Suggested Team

- 1 Product owner
- 1 UI/UX designer
- 1 Next.js frontend developer
- 1 NestJS backend developer
- 1 QA engineer
- 1 DevOps engineer part-time
- 1 Flutter developer from Phase 3

## Immediate Next Sprint

1. Create Next.js frontend shell.
2. Create NestJS backend shell.
3. Create PostgreSQL schema migrations.
4. Implement login and RBAC.
5. Implement employee directory CRUD.
6. Implement dashboard metrics.
7. Implement attendance and leave MVP.
