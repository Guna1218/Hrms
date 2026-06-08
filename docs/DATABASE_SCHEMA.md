# SKYLINX PeopleOS Database Schema

This schema is designed for PostgreSQL and supports MVP through Version 3.

## Identity and Access

### users

- id
- employee_id
- email
- phone
- password_hash
- status
- last_login_at
- created_at
- updated_at

### roles

- id
- name
- description
- is_system_role
- created_at
- updated_at

### permissions

- id
- module
- action
- description

### role_permissions

- id
- role_id
- permission_id

### user_roles

- id
- user_id
- role_id

### otp_tokens

- id
- user_id
- channel
- otp_hash
- expires_at
- consumed_at
- created_at

## Organization

### companies

- id
- name
- legal_name
- logo_url
- address
- tax_id
- work_week
- timezone
- status
- created_at
- updated_at

### departments

- id
- company_id
- name
- code
- manager_employee_id
- status

### designations

- id
- company_id
- department_id
- title
- grade_id
- status

### grades

- id
- company_id
- name
- level

### locations

- id
- company_id
- name
- address
- city
- state
- country
- status

## Employee Directory

### employees

- id
- company_id
- employee_code
- first_name
- last_name
- email
- phone
- gender
- date_of_birth
- joining_date
- department_id
- designation_id
- location_id
- manager_id
- employment_type
- status
- created_at
- updated_at

### employee_personal_details

- id
- employee_id
- aadhaar_number_encrypted
- pan_number_encrypted
- marital_status
- blood_group
- emergency_contact_name
- emergency_contact_phone

### employee_addresses

- id
- employee_id
- type
- line1
- line2
- city
- state
- pincode
- country

### employee_education

- id
- employee_id
- qualification
- institute
- year_of_passing
- score

### employee_family_details

- id
- employee_id
- name
- relationship
- date_of_birth
- phone
- is_dependent

### employee_documents

- id
- employee_id
- document_type
- file_url
- verification_status
- verified_by
- verified_at
- expires_at
- created_at

### employee_bank_details

- id
- employee_id
- account_holder_name
- bank_name
- account_number_encrypted
- ifsc
- branch
- verification_status

## Attendance

### shifts

- id
- company_id
- name
- start_time
- end_time
- grace_minutes
- half_day_minutes
- status

### attendance_rules

- id
- company_id
- late_mark_after_minutes
- max_late_marks_per_month
- geo_required
- selfie_required
- biometric_required
- overtime_enabled

### attendance_logs

- id
- employee_id
- shift_id
- date
- check_in_at
- check_out_at
- check_in_latitude
- check_in_longitude
- check_out_latitude
- check_out_longitude
- source
- status
- approved_by
- created_at

### attendance_regularizations

- id
- employee_id
- attendance_log_id
- requested_check_in
- requested_check_out
- reason
- status
- manager_id
- decided_at

### overtime_requests

- id
- employee_id
- attendance_log_id
- hours
- reason
- status
- approved_by

### comp_off_requests

- id
- employee_id
- attendance_log_id
- earned_date
- expiry_date
- status

## Leave

### leave_types

- id
- company_id
- name
- code
- annual_quota
- carry_forward_allowed
- sandwich_rule_enabled
- comp_off_linked
- status

### leave_balances

- id
- employee_id
- leave_type_id
- year
- opening_balance
- accrued
- used
- carried_forward
- available

### leave_requests

- id
- employee_id
- leave_type_id
- from_date
- to_date
- days
- reason
- status
- manager_id
- decided_at
- created_at

## Payroll

### salary_structures

- id
- employee_id
- effective_from
- annual_ctc
- basic
- hra
- allowances
- employer_pf
- employee_pf
- esi
- professional_tax
- tds
- status

### payroll_runs

- id
- company_id
- month
- year
- status
- processed_by
- processed_at
- locked_at

### payslips

- id
- payroll_run_id
- employee_id
- gross_pay
- deductions
- net_pay
- file_url
- status

### payroll_components

- id
- payslip_id
- type
- name
- amount

### bank_exports

- id
- payroll_run_id
- bank_name
- file_url
- generated_by
- generated_at

## Reports and Compliance

### holidays

- id
- company_id
- location_id
- name
- date
- type
- status

### expenses

- id
- employee_id
- category
- amount
- receipt_url
- claim_date
- status
- manager_approved_by
- hr_approved_by
- reimbursed_at

### insurance_policies

- id
- company_id
- provider
- policy_number
- coverage_amount
- start_date
- end_date

### employee_insurance_members

- id
- employee_id
- policy_id
- member_name
- relationship
- status

### reports

- id
- company_id
- report_type
- filters_json
- file_url
- generated_by
- generated_at

### compliance_filings

- id
- company_id
- type
- period
- due_date
- filed_at
- status
- file_url

## Recruitment ATS

### job_postings

- id
- company_id
- title
- department_id
- location_id
- openings
- status
- created_by
- created_at

### candidates

- id
- full_name
- email
- phone
- resume_url
- source
- current_stage
- created_at

### job_applications

- id
- job_posting_id
- candidate_id
- stage
- status
- assigned_recruiter_id
- created_at

### interviews

- id
- application_id
- interviewer_employee_id
- scheduled_at
- mode
- status
- feedback

### offers

- id
- application_id
- offered_ctc
- joining_date
- offer_letter_url
- status

## Communication, Audit, and Admin

### notifications

- id
- user_id
- channel
- title
- body
- status
- sent_at
- created_at

### audit_logs

- id
- actor_user_id
- module
- action
- entity_type
- entity_id
- old_value_json
- new_value_json
- ip_address
- user_agent
- created_at

### backups

- id
- type
- storage_url
- status
- started_at
- completed_at

### module_settings

- id
- company_id
- module
- enabled
- settings_json

### subscriptions

- id
- company_id
- plan_name
- employee_limit
- starts_at
- ends_at
- status
