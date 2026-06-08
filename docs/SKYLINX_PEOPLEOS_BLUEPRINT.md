# SKYLINX PeopleOS HRMS Blueprint

## Product Name

SKYLINX PeopleOS, also branded as SKYLINX HRMS.

## Product Goal

Build a complete HRMS for SKYLINX that covers employee lifecycle, attendance, leave, payroll, compliance, reports, recruitment, employee self-service, and admin control in one secure platform.

## User Panels

### Super Admin Panel

- Manage companies, subscriptions, licenses, system settings, backups, audit logs, and module access.
- Create and manage HR/Admin users.
- View cross-company analytics in future SaaS mode.

### HR/Admin Panel

- Manage employees, attendance, leaves, payroll, documents, compliance, settings, reports, and recruitment.
- Approve or reject HR workflows.
- Export HR, payroll, attendance, leave, expense, and compliance reports.

### Manager Panel

- View reporting team.
- Approve or reject leave, attendance regularization, overtime, comp-off, and expenses.
- View team attendance, leave balance, shift roster, and performance inputs.

### Employee Self-Service Panel

- View profile, attendance, leave balance, payslips, holidays, documents, announcements, insurance, rewards, and benefits.
- Apply leave, request attendance regularization, submit expenses, download payslips, and update personal details where allowed.

## Core Modules

### Authentication

- Email/password login
- OTP login by email or mobile
- Forgot password
- Role-based access control
- Fine-grained permissions
- Optional two-factor authentication
- Session management

### Dashboard

- Employee count
- Attendance summary
- Leave summary
- Payroll summary
- Pending approvals
- Compliance reminders
- Quick actions
- Birthday and work anniversary alerts

### Employee Directory

- Employee list
- Add employee
- Bulk upload
- Employee profile
- Personal details
- Contact details
- Work details
- Education
- Family details
- Documents
- Bank details
- Verification status
- Exit status in later phase

### Attendance Management

- Attendance logs
- Check-in and check-out
- Shift management
- Late mark rules
- Attendance approvals
- Regularization
- Overtime
- Comp-off
- Biometric integration
- Geo attendance
- Attendance reports

### Leave Management

- Apply leave
- Approve or reject leave
- Leave balance
- Leave types
- Leave rules
- Carry forward
- Sandwich leave
- Comp-off leave
- Leave reports

### Payroll Management

- Salary structure
- Payroll run
- Payslip generation
- Deductions
- Incentives
- PF, ESI, and Professional Tax
- TDS
- Form 16
- Bank export
- Payroll reports
- Payroll data encryption

### Reports

- Employee reports
- Attendance reports
- Leave reports
- Payroll reports
- Expense reports
- Compliance reports
- Excel export
- PDF export

### Holiday Calendar

- Mandatory holidays
- Optional holidays
- Regional holidays
- Calendar view
- Location-wise holiday assignment

### Organization Chart

- Reporting hierarchy
- Department tree
- Manager mapping

### Expense Management

- Expense claims
- Receipt upload
- Manager approval
- HR approval
- Reimbursement

### Insurance Management

- Employee insurance
- Dependents
- Policy details
- Claims

### ID and Visiting Card

- ID card template
- Visiting card template
- QR code
- PDF download

### Internal Social Feed

- Announcements
- Employee posts
- Likes
- Comments
- Birthday wishes

### Rewards and Benefits

- Vouchers
- Reward points
- Employee recognition
- Benefits marketplace

### Settings

- Company profile
- Branding
- Work week
- Departments
- Designations
- Grades
- Locations
- Roles and permissions
- Payroll settings
- Attendance settings
- Leave settings
- Module enable or disable
- Data import and export
- Subscription and license control

## SKYLINX Extra Module: Recruitment ATS

- Job posting
- Candidate database
- Resume upload
- Interview scheduling
- Walk-in management
- Campus drive management
- Offer letter
- Joining workflow
- Future AI resume parser

## Security Requirements

- 2FA and OTP support
- Audit logs for sensitive actions
- Daily database backup
- File backup
- Restore option
- Disaster recovery plan
- Role permissions
- Payroll data encryption
- Employee document security
- Signed file URLs for private documents
- Password hashing with bcrypt or Argon2
- Rate limiting for authentication APIs
- Session/token revocation

## Notification Requirements

- Email alerts
- WhatsApp alerts
- Leave approval alerts
- Attendance reminders
- Payroll and payslip alerts
- Birthday and work anniversary alerts
- Recruitment interview reminders
- Compliance due-date reminders

## Compliance Requirements

- PF
- ESI
- Professional Tax
- TDS
- Form 16
- Labour law reports
- Statutory report exports
- State-wise holiday and tax configuration

## MVP Phase

The MVP should include:

- Login
- Dashboard
- Employee directory
- Attendance
- Leave
- Basic payroll
- Reports
- Role-based access
- Audit logs
- Basic notification templates

## Version 2

- Mobile app
- WhatsApp integration
- Recruitment ATS
- Expense module
- ID card generator
- Organization chart
- Holiday calendar
- Document verification
- Advanced payroll rules

## Version 3

- AI resume parser
- AI attendance alerts
- SaaS multi-company system
- Billing system
- Subscription plans
- Advanced analytics
- Benefits marketplace

## Recommended Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Node.js with NestJS
- Database: PostgreSQL
- Cache and queue: Redis
- File storage: AWS S3 or DigitalOcean Spaces
- Hosting: AWS or DigitalOcean
- Mobile app: Flutter
- Notifications: Email, WhatsApp, and push notifications
- Background jobs: BullMQ
- PDF generation: Playwright or server-side PDF renderer
- Authentication: JWT access tokens with refresh tokens, optional OTP and 2FA

## Build Order

1. Database schema and role permissions
2. Authentication and user panels
3. Employee directory
4. Attendance and leave workflows
5. Payroll basic
6. Reports and exports
7. Notifications and audit logs
8. Compliance and backup automation
9. Mobile app and WhatsApp
10. ATS, advanced analytics, and SaaS features
