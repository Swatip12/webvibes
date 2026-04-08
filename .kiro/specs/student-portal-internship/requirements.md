# Requirements Document

## Introduction

The Student Portal for Internship Management is a self-service system that allows students to register, log in, view their assigned internship plan, track payment status, make payments via Razorpay, download payment receipts, and agree to an internship agreement. Admins can view and manage all student records and payment statuses. The system extends the existing Spring Boot + Angular platform, reusing the existing JWT infrastructure with a separate student identity context.

---

## Glossary

- **Student_Portal**: The Angular frontend module dedicated to student-facing pages (register, login, dashboard).
- **Auth_Service**: The Spring Boot service responsible for student registration and JWT token issuance for students.
- **Student**: A registered user with role `ROLE_STUDENT` who accesses the portal to manage their internship and payments.
- **Admin**: A user with role `ROLE_ADMIN` who manages student records and payment statuses via the admin panel.
- **Dashboard**: The post-login page showing the student's name, internship plan, and payment status.
- **Payment_Service**: The Spring Boot service that handles Razorpay payment initiation, callback processing, and DB updates.
- **Receipt_Service**: The Spring Boot service that generates PDF receipts and stores their file paths.
- **Razorpay**: The third-party payment gateway used for processing registration and remaining fee payments.
- **Payment_Status**: An enum with values `NOT_PAID`, `PARTIAL`, or `FULL` representing the student's payment state.
- **Agreement**: A legal text block displayed on the dashboard that the student must accept before making any payment.
- **JWT**: JSON Web Token used for stateless authentication between the Angular frontend and Spring Boot backend.
- **StudentInternship**: The database record linking a student to their internship plan, fees, and payment status.
- **Receipt**: A PDF document generated after each successful payment, stored on the server and downloadable by the student.

---

## Requirements

### Requirement 1: Student Registration

**User Story:** As a prospective intern, I want to register with my name, email, password, and mobile number, so that I can access the student portal.

#### Acceptance Criteria

1. THE Auth_Service SHALL expose a `POST /api/student/auth/register` endpoint that accepts name, email, password, and mobile number.
2. WHEN a registration request is received with a valid and unique email, THE Auth_Service SHALL create a Student record with a BCrypt-hashed password and role `ROLE_STUDENT`.
3. IF a registration request is received with an email that already exists, THEN THE Auth_Service SHALL return HTTP 409 with a descriptive error message.
4. IF a registration request is missing required fields (name, email, password, or mobile), THEN THE Auth_Service SHALL return HTTP 400 with field-level validation errors.
5. THE Auth_Service SHALL validate that the email field conforms to standard email format before persisting the record.
6. THE Auth_Service SHALL validate that the mobile field contains exactly 10 digits before persisting the record.
7. THE Auth_Service SHALL validate that the password field is at least 8 characters before persisting the record.

---

### Requirement 2: Student Login and JWT Authentication

**User Story:** As a registered student, I want to log in with my email and password, so that I receive a JWT token to access protected portal features.

#### Acceptance Criteria

1. THE Auth_Service SHALL expose a `POST /api/student/auth/login` endpoint that accepts email and password.
2. WHEN valid credentials are provided, THE Auth_Service SHALL return a JWT token, the student's name, and role `ROLE_STUDENT`.
3. IF invalid credentials are provided, THEN THE Auth_Service SHALL return HTTP 401 with a descriptive error message.
4. THE Student_Portal SHALL store the JWT token in localStorage upon successful login.
5. THE Student_Portal SHALL attach the JWT token as a Bearer token in the `Authorization` header for all subsequent authenticated API requests.
6. WHEN the JWT token is expired or absent, THE Student_Portal SHALL redirect the student to the login page.

---

### Requirement 3: Student Dashboard

**User Story:** As a logged-in student, I want to see my name, internship plan, and payment status on a dashboard, so that I have a clear overview of my enrollment.

#### Acceptance Criteria

1. THE Dashboard SHALL be accessible only to authenticated students with role `ROLE_STUDENT`.
2. WHEN a student accesses the dashboard, THE Dashboard SHALL display the student's full name.
3. WHEN a student accesses the dashboard, THE Dashboard SHALL display the assigned internship plan name.
4. WHEN a student accesses the dashboard, THE Dashboard SHALL display the current Payment_Status (`NOT_PAID`, `PARTIAL`, or `FULL`).
5. THE Auth_Service SHALL expose a `GET /api/student/dashboard` endpoint that returns the student's name, plan, total fee, paid amount, remaining amount, and Payment_Status.
6. IF no StudentInternship record exists for the logged-in student, THEN THE Auth_Service SHALL return HTTP 404 with a descriptive message.

---

### Requirement 4: Agreement Section

**User Story:** As a student, I want to read and accept an internship agreement before making any payment, so that I acknowledge the terms.

#### Acceptance Criteria

1. THE Dashboard SHALL display the full internship agreement text before any payment button.
2. THE Dashboard SHALL display a checkbox labelled "I agree to the internship terms and conditions".
3. WHILE the agreement checkbox is unchecked, THE Dashboard SHALL keep all payment action buttons disabled.
4. WHEN the student checks the agreement checkbox, THE Dashboard SHALL enable the applicable payment button.
5. WHEN the student unchecks the agreement checkbox, THE Dashboard SHALL disable the applicable payment button again.

---

### Requirement 5: Payment Flow — NOT PAID State

**User Story:** As a student with no payments made, I want to pay the ₹1000 registration fee, so that I can begin my internship enrollment.

#### Acceptance Criteria

1. WHILE Payment_Status is `NOT_PAID`, THE Dashboard SHALL display a button labelled "Pay ₹1000 Registration Fee".
2. WHEN the student clicks "Pay ₹1000 Registration Fee" and the agreement is accepted, THE Payment_Service SHALL initiate a Razorpay order for ₹1000.
3. WHEN Razorpay confirms payment success, THE Payment_Service SHALL update paid_amount to ₹1000, recalculate remaining_amount, and set Payment_Status to `PARTIAL`.
4. THE Payment_Service SHALL expose a `POST /api/payment/register` endpoint to create the Razorpay order and return the order details to the frontend.

---

### Requirement 6: Payment Flow — PARTIAL State

**User Story:** As a student who has paid the registration fee, I want to see my paid and remaining amounts and pay the balance, so that I can complete my enrollment.

#### Acceptance Criteria

1. WHILE Payment_Status is `PARTIAL`, THE Dashboard SHALL display the paid amount as "Paid: ₹1000".
2. WHILE Payment_Status is `PARTIAL`, THE Dashboard SHALL display the remaining amount dynamically as "Remaining: ₹[remaining_amount]".
3. WHILE Payment_Status is `PARTIAL`, THE Dashboard SHALL display a button labelled "Pay Remaining Fees".
4. WHEN the student clicks "Pay Remaining Fees" and the agreement is accepted, THE Payment_Service SHALL initiate a Razorpay order for the exact remaining_amount.
5. WHEN Razorpay confirms payment success for the remaining amount, THE Payment_Service SHALL update paid_amount to total_fee, set remaining_amount to 0, and set Payment_Status to `FULL`.
6. THE Payment_Service SHALL expose a `POST /api/payment/remaining` endpoint to create the Razorpay order for the remaining balance.

---

### Requirement 7: Payment Flow — FULL State

**User Story:** As a student who has completed all payments, I want to see a confirmation on my dashboard, so that I know my enrollment is financially complete.

#### Acceptance Criteria

1. WHILE Payment_Status is `FULL`, THE Dashboard SHALL display the text "Payment Completed" in place of any payment button.
2. WHILE Payment_Status is `FULL`, THE Dashboard SHALL not display any payment action buttons.

---

### Requirement 8: Razorpay Integration

**User Story:** As a student, I want payments to be processed securely through Razorpay, so that my financial transactions are safe and verifiable.

#### Acceptance Criteria

1. THE Payment_Service SHALL create Razorpay orders using the Razorpay Java SDK with the configured API key and secret.
2. WHEN a Razorpay payment success callback is received, THE Payment_Service SHALL verify the Razorpay signature before updating the database.
3. IF the Razorpay signature verification fails, THEN THE Payment_Service SHALL return HTTP 400 and not update the database.
4. THE Payment_Service SHALL expose a `POST /api/payment/verify` endpoint that accepts Razorpay payment ID, order ID, and signature for verification.
5. THE Student_Portal SHALL open the Razorpay checkout modal using the order details returned by the backend.
6. WHEN the Razorpay checkout modal is dismissed without payment, THE Student_Portal SHALL display an appropriate cancellation message without updating payment state.

---

### Requirement 9: Receipt Generation and Download

**User Story:** As a student, I want a PDF receipt generated after each successful payment, so that I have a record of my transaction.

#### Acceptance Criteria

1. WHEN a payment is successfully verified, THE Receipt_Service SHALL generate a PDF receipt containing the student name, payment amount, date, and transaction ID.
2. THE Receipt_Service SHALL store the generated PDF at a server-accessible path and persist the file path in the StudentInternship record.
3. THE Auth_Service SHALL expose a `GET /api/student/receipt/{paymentType}` endpoint that returns the stored PDF file for download.
4. WHILE Payment_Status is `PARTIAL` or `FULL`, THE Dashboard SHALL display a "Download Receipt" link for the registration payment.
5. WHILE Payment_Status is `FULL`, THE Dashboard SHALL display a "Download Receipt" link for the remaining payment.
6. IF a receipt file is not found at the stored path, THEN THE Auth_Service SHALL return HTTP 404 with a descriptive error message.

---

### Requirement 10: Admin Panel — Student Management

**User Story:** As an admin, I want to view all registered students, filter by payment status, and manually update payment records, so that I can manage internship enrollments effectively.

#### Acceptance Criteria

1. THE Admin SHALL expose a `GET /api/admin/students` endpoint that returns a paginated list of all students with their internship plan and Payment_Status.
2. WHEN a filter parameter `paymentStatus` is provided, THE Admin SHALL return only students matching the specified Payment_Status.
3. THE Admin SHALL expose a `PUT /api/admin/students/{studentId}/payment` endpoint that allows manual update of paid_amount, remaining_amount, and Payment_Status.
4. WHEN an admin manually updates a payment record, THE Admin SHALL recalculate remaining_amount as total_fee minus paid_amount before persisting.
5. IF a student ID does not exist, THEN THE Admin SHALL return HTTP 404 with a descriptive error message.
6. THE Admin panel Angular page SHALL display a table of all students with columns: name, email, mobile, plan, total fee, paid amount, remaining amount, and Payment_Status.
7. THE Admin panel Angular page SHALL provide a dropdown filter for Payment_Status (`ALL`, `NOT_PAID`, `PARTIAL`, `FULL`).
8. THE Admin panel Angular page SHALL provide an inline edit form to manually update a student's payment record.

---

### Requirement 11: Data Integrity

**User Story:** As a system operator, I want the database to enforce referential integrity and consistent payment calculations, so that financial data remains accurate.

#### Acceptance Criteria

1. THE Auth_Service SHALL ensure that remaining_amount is always equal to total_fee minus paid_amount after any payment operation.
2. THE Auth_Service SHALL ensure that Payment_Status transitions follow the sequence: `NOT_PAID` → `PARTIAL` → `FULL` and never regress automatically.
3. IF paid_amount exceeds total_fee, THEN THE Payment_Service SHALL return HTTP 400 and reject the payment.
4. THE StudentInternship record SHALL have a foreign key constraint referencing the Student record, enforced at the database level.
