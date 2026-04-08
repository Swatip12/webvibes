# Implementation Plan: Student Portal — Internship Management

## Overview

Implement the student self-service internship portal on top of the existing Spring Boot + Angular platform. The work is split into: backend data layer, auth, payment, receipt, admin API, then Angular frontend components, wired together at the end.

## Tasks

- [x] 1. Add dependencies and configuration
  - Add Razorpay Java SDK (`razorpay-java:1.4.5`) and iText PDF (`itextpdf:5.5.13.3`) to `backend/pom.xml`
  - Add `razorpay.key.id`, `razorpay.key.secret`, and `app.receipt.dir` properties to `backend/src/main/resources/application.properties`
  - _Requirements: 8.1, 9.2_

- [x] 2. Create backend data layer
  - [x] 2.1 Create `PaymentStatus` enum in `com.webvibes.entity`
    - Values: `NOT_PAID`, `PARTIAL`, `FULL`
    - _Requirements: 3.4, 5.3, 6.5, 7.1_

  - [x] 2.2 Create `Student` entity in `com.webvibes.entity`
    - Fields: id, name, email (unique), password, mobile (10 digits), role (`ROLE_STUDENT`), createdAt, oneToOne StudentInternship
    - _Requirements: 1.2, 11.4_

  - [x] 2.3 Create `StudentInternship` entity in `com.webvibes.entity`
    - Fields: id, student (FK), planName, totalFee, paidAmount, remainingAmount, paymentStatus, registrationReceiptPath, remainingReceiptPath, razorpayRegistrationPaymentId, razorpayRemainingPaymentId, updatedAt
    - _Requirements: 3.3, 3.4, 11.1, 11.4_

  - [x] 2.4 Create `StudentRepository` and `StudentInternshipRepository` JPA interfaces in `com.webvibes.repository`
    - `StudentRepository`: `findByEmail(String email)`
    - `StudentInternshipRepository`: `findByStudentId(Long studentId)`, `findByStudentEmail(String email)`
    - _Requirements: 1.3, 2.1, 3.5_

- [x] 3. Implement student authentication backend
  - [x] 3.1 Create DTOs: `StudentRegisterRequest`, `StudentLoginRequest`, `StudentAuthResponse` in `com.webvibes.dto`
    - `StudentRegisterRequest`: `@NotBlank` name, `@Email` email, `@Size(min=8)` password, `@Pattern(regexp="\\d{10}")` mobile
    - `StudentAuthResponse`: token, name, role
    - _Requirements: 1.1, 1.4, 1.5, 1.6, 1.7, 2.2_

  - [x] 3.2 Create `StudentUserDetailsService` in `com.webvibes.security`
    - Implements `UserDetailsService`, loads student by email from `StudentRepository`
    - _Requirements: 2.1, 2.2_

  - [x] 3.3 Update `CustomUserDetailsService` to composite-delegate: try admin lookup first, then student lookup
    - Alternatively, register a second `DaoAuthenticationProvider` bean in `SecurityConfig` for student auth
    - _Requirements: 2.1, 2.2_

  - [x] 3.4 Create `StudentService` in `com.webvibes.service`
    - `register(StudentRegisterRequest)`: validate uniqueness, BCrypt hash password, persist Student
    - Throw `EmailAlreadyExistsException` on duplicate email
    - _Requirements: 1.2, 1.3_

  - [x] 3.5 Create `StudentAuthController` at `/api/student/auth` in `com.webvibes.controller`
    - `POST /register` — public, calls `StudentService.register`, returns 201
    - `POST /login` — public, authenticates via `AuthenticationManager`, returns JWT + name + role
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3_

  - [ ]* 3.6 Write unit tests for `StudentService` registration logic
    - Test: valid registration creates BCrypt-hashed record
    - Test: duplicate email throws `EmailAlreadyExistsException`
    - Test: missing/invalid fields fail `@Valid` constraints
    - _Requirements: 1.2, 1.3, 1.4_

  - [ ]* 3.7 Write property test for input validation (Property 2)
    - **Property 2: Input validation rejects invalid registrations**
    - **Validates: Requirements 1.4, 1.5, 1.6, 1.7**
    - Generate random `StudentRegisterRequest` with at least one invalid field; assert HTTP 400 and no DB record created

  - [ ]* 3.8 Write property test for BCrypt password storage (Property 3)
    - **Property 3: Successful registration stores BCrypt-hashed password**
    - **Validates: Requirements 1.2**
    - Generate random valid passwords; register; assert stored hash verifies with BCrypt and does not equal plaintext

  - [ ]* 3.9 Write property test for invalid credential rejection (Property 4)
    - **Property 4: Invalid credentials are rejected**
    - **Validates: Requirements 2.3**
    - Generate random email/password pairs not matching any student; assert HTTP 401

- [ ] 4. Update `SecurityConfig` for student routes
  - Permit `/api/student/auth/**` (public)
  - Restrict `/api/student/**` and `/api/payment/**` to `ROLE_STUDENT`
  - Register `DaoAuthenticationProvider` for `StudentUserDetailsService` if using separate provider approach
  - _Requirements: 2.1, 2.5, 3.1, 5.4, 6.6, 8.4_

- [ ] 5. Implement student dashboard backend
  - [ ] 5.1 Create `DashboardResponse` DTO in `com.webvibes.dto`
    - Fields: name, planName, totalFee, paidAmount, remainingAmount, paymentStatus
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

  - [ ] 5.2 Create `StudentInternshipService` in `com.webvibes.service`
    - `getDashboard(String email)`: fetch StudentInternship by student email, map to DashboardResponse
    - Throw `StudentInternshipNotFoundException` if no record found
    - `updatePayment(Long studentId, AdminPaymentUpdateRequest)`: recalculate remainingAmount, persist
    - _Requirements: 3.5, 3.6, 10.4, 11.1_

  - [ ] 5.3 Create `StudentDashboardController` at `/api/student` in `com.webvibes.controller`
    - `GET /dashboard` — requires `ROLE_STUDENT`, resolves email from JWT principal, returns `DashboardResponse`
    - `GET /receipt/{paymentType}` — requires `ROLE_STUDENT`, streams PDF file as `application/pdf`
    - _Requirements: 3.1, 3.5, 3.6, 9.3, 9.6_

  - [ ]* 5.4 Write unit tests for `StudentInternshipService`
    - Test: dashboard returns correct computed fields
    - Test: 404 when no plan assigned
    - _Requirements: 3.5, 3.6_

- [ ] 6. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement payment backend
  - [ ] 7.1 Create payment DTOs in `com.webvibes.dto`
    - `RazorpayOrderResponse`: orderId, amount (paise), currency, keyId
    - `PaymentVerifyRequest`: razorpayPaymentId, razorpayOrderId, razorpaySignature, paymentType
    - `PaymentVerifyResponse`: success, paymentStatus
    - _Requirements: 5.4, 6.6, 8.4, 8.5_

  - [ ] 7.2 Create `PaymentService` in `com.webvibes.service`
    - `createRegistrationOrder(String email)`: validate status is `NOT_PAID`, create Razorpay order for ₹1000 (100000 paise)
    - `createRemainingOrder(String email)`: validate status is `PARTIAL`, create Razorpay order for remainingAmount
    - `verifyAndRecord(PaymentVerifyRequest, String email)`: HMAC-SHA256 verify signature; on success update StudentInternship amounts and status; call ReceiptService; throw `PaymentVerificationException` on bad signature; throw `OverpaymentException` if amount exceeds totalFee
    - _Requirements: 5.2, 5.3, 6.4, 6.5, 8.1, 8.2, 8.3, 11.1, 11.2, 11.3_

  - [ ] 7.3 Create `PaymentController` at `/api/payment` in `com.webvibes.controller`
    - `POST /register` — requires `ROLE_STUDENT`
    - `POST /remaining` — requires `ROLE_STUDENT`
    - `POST /verify` — requires `ROLE_STUDENT`
    - _Requirements: 5.4, 6.6, 8.4_

  - [ ]* 7.4 Write unit tests for `PaymentService`
    - Test: valid signature updates DB and returns PARTIAL/FULL status
    - Test: invalid signature returns HTTP 400 and leaves DB unchanged
    - Test: overpayment returns HTTP 400
    - _Requirements: 8.2, 8.3, 11.3_

  - [ ]* 7.5 Write property test for payment amount invariant (Property 6)
    - **Property 6: Payment amount invariant**
    - **Validates: Requirements 11.1**
    - Generate random (totalFee, paidAmount) pairs where paidAmount ≤ totalFee; apply payment; assert remainingAmount == totalFee - paidAmount

  - [ ]* 7.6 Write property test for payment status monotonicity (Property 7)
    - **Property 7: Payment status monotonicity**
    - **Validates: Requirements 11.2**
    - Generate random payment sequences; assert status never regresses

  - [ ]* 7.7 Write property test for overpayment rejection (Property 8)
    - **Property 8: Overpayment is rejected**
    - **Validates: Requirements 11.3**
    - Generate paidAmount > totalFee; assert HTTP 400 and no DB change

  - [ ]* 7.8 Write property test for Razorpay signature verification (Property 9)
    - **Property 9: Razorpay signature verification gates DB updates**
    - **Validates: Requirements 8.2, 8.3**
    - Generate random tampered signatures; assert HTTP 400 and DB unchanged

- [ ] 8. Implement receipt service
  - [ ] 8.1 Create `ReceiptService` in `com.webvibes.service`
    - `generateReceipt(Student, StudentInternship, String paymentType, String transactionId)`: generate PDF with iText containing student name, amount, date, transaction ID; write to `app.receipt.dir`; return file path; persist path on StudentInternship
    - _Requirements: 9.1, 9.2_

  - [ ]* 8.2 Write unit tests for `ReceiptService`
    - Test: PDF generation produces non-empty bytes
    - Test: file is written to expected path
    - _Requirements: 9.1, 9.2_

  - [ ]* 8.3 Write property test for receipt round-trip (Property 10)
    - **Property 10: Receipt round-trip — generate then retrieve**
    - **Validates: Requirements 9.1, 9.2, 9.3**
    - For any successfully verified payment, assert receipt file exists at stored path and GET returns non-empty PDF bytes

- [ ] 9. Implement admin student management backend
  - [ ] 9.1 Create `AdminStudentDTO` and `AdminPaymentUpdateRequest` DTOs in `com.webvibes.dto`
    - `AdminStudentDTO`: id, name, email, mobile, planName, totalFee, paidAmount, remainingAmount, paymentStatus
    - `AdminPaymentUpdateRequest`: paidAmount, paymentStatus
    - _Requirements: 10.1, 10.3_

  - [ ] 9.2 Create `AdminStudentController` at `/api/admin/students` in `com.webvibes.controller`
    - `GET /` — requires `ROLE_ADMIN`, paginated, optional `paymentStatus` filter query param
    - `PUT /{studentId}/payment` — requires `ROLE_ADMIN`, calls `StudentInternshipService.updatePayment`, recalculates remainingAmount
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 9.3 Write unit tests for `AdminStudentController`
    - Test: filter by paymentStatus returns correct subset
    - Test: manual update recalculates remainingAmount
    - Test: unknown studentId returns 404
    - _Requirements: 10.2, 10.4, 10.5_

  - [ ]* 9.4 Write property test for admin recalculation invariant (Property 12)
    - **Property 12: Admin payment recalculation invariant**
    - **Validates: Requirements 10.4**
    - Generate random admin update requests; assert remainingAmount == totalFee - paidAmount after update

- [ ] 10. Add custom exception types and extend `GlobalExceptionHandler`
  - Create `EmailAlreadyExistsException` (409), `StudentInternshipNotFoundException` (404), `PaymentVerificationException` (400), `OverpaymentException` (400) in `com.webvibes.exception`
  - Add `@ExceptionHandler` methods in `GlobalExceptionHandler` for each new exception
  - _Requirements: 1.3, 3.6, 8.3, 11.3_

- [ ] 11. Checkpoint — Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Implement Angular student auth frontend
  - [ ] 12.1 Create `StudentAuthService` in `frontend/src/app/services/`
    - Separate from existing `AuthService`; uses `student_jwt_token` localStorage key
    - Methods: `register(req)`, `login(req)`, `logout()`, `getToken()`, `isStudentAuthenticated()`
    - _Requirements: 2.4, 2.5, 2.6_

  - [ ] 12.2 Create `StudentGuard` in `frontend/src/app/guards/`
    - Checks `StudentAuthService.isStudentAuthenticated()`; redirects to `/student/login` if not authenticated
    - _Requirements: 2.6, 3.1_

  - [ ] 12.3 Update `JwtInterceptor` to also attach `student_jwt_token` for `/api/student/**` and `/api/payment/**` routes
    - Keep existing admin token logic intact; add student token branch for student API paths
    - _Requirements: 2.5_

  - [ ] 12.4 Create `StudentRegisterComponent` at route `/student/register`
    - Reactive form: name, email, password, mobile
    - On success navigate to `/student/login`; on 409 show "Email already registered"
    - _Requirements: 1.1, 1.4, 1.5, 1.6, 1.7_

  - [ ] 12.5 Create `StudentLoginComponent` at route `/student/login`
    - Reactive form: email, password
    - On success store token via `StudentAuthService`, navigate to `/student/dashboard`
    - On 401 show "Invalid email or password"
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 12.6 Write Jasmine tests for `StudentAuthService`
    - Test: token stored under `student_jwt_token` key, not `jwt_token`
    - Test: `isStudentAuthenticated()` returns false when token absent or expired
    - _Requirements: 2.4, 2.6_

  - [ ]* 12.7 Write Jasmine tests for `StudentGuard`
    - Test: redirects to `/student/login` when not authenticated
    - _Requirements: 2.6, 3.1_

- [ ] 13. Implement Angular student dashboard frontend
  - [ ] 13.1 Create `StudentDashboardComponent` at route `/student/dashboard` (guarded by `StudentGuard`)
    - On init call `GET /api/student/dashboard`; display name, planName, totalFee, paidAmount, remainingAmount, paymentStatus
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 13.2 Add agreement section to `StudentDashboardComponent`
    - Display full agreement text block
    - Checkbox: "I agree to the internship terms and conditions"
    - Bind payment button `[disabled]` to `!agreementAccepted`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 13.3 Add payment state rendering to `StudentDashboardComponent`
    - `NOT_PAID`: show "Pay ₹1000 Registration Fee" button
    - `PARTIAL`: show paid/remaining amounts and "Pay Remaining Fees" button
    - `FULL`: show "Payment Completed" text, no payment buttons
    - _Requirements: 5.1, 6.1, 6.2, 6.3, 7.1, 7.2_

  - [ ] 13.4 Integrate Razorpay checkout into `StudentDashboardComponent`
    - On button click: call `/api/payment/register` or `/api/payment/remaining`; open Razorpay modal with returned order details
    - On payment success: call `POST /api/payment/verify`; refresh dashboard data
    - On modal dismiss without payment: show cancellation message, no state change
    - _Requirements: 8.5, 8.6, 5.2, 6.4_

  - [ ] 13.5 Add receipt download links to `StudentDashboardComponent`
    - Show "Download Receipt" link for registration when status is `PARTIAL` or `FULL`
    - Show "Download Receipt" link for remaining payment when status is `FULL`
    - Links call `GET /api/student/receipt/{paymentType}`
    - _Requirements: 9.4, 9.5_

  - [ ]* 13.6 Write Jasmine tests for `StudentDashboardComponent`
    - Test: agreement checkbox unchecked → payment buttons disabled (Property 11)
    - Test: agreement checkbox checked → applicable button enabled
    - Test: `FULL` status → no payment buttons rendered
    - **Property 11: Agreement checkbox gates payment buttons**
    - **Validates: Requirements 4.3, 4.4, 4.5**
    - _Requirements: 4.3, 4.4, 4.5, 7.1, 7.2_

- [ ] 14. Implement Angular admin students page
  - [ ] 14.1 Create `AdminStudentsComponent` at route `/admin/students` (guarded by existing `AuthGuard`)
    - Table columns: name, email, mobile, plan, total fee, paid amount, remaining amount, paymentStatus
    - Dropdown filter for paymentStatus (`ALL`, `NOT_PAID`, `PARTIAL`, `FULL`)
    - Inline edit form to update paidAmount and paymentStatus; calls `PUT /api/admin/students/{id}/payment`
    - _Requirements: 10.6, 10.7, 10.8_

  - [ ] 14.2 Register `AdminStudentsComponent` in `AppModule` and add route to `AppRoutingModule`
    - _Requirements: 10.6_

- [ ] 15. Wire everything together and register new routes
  - [ ] 15.1 Register `StudentRegisterComponent`, `StudentLoginComponent`, `StudentDashboardComponent` routes in `AppRoutingModule`
    - `/student/register`, `/student/login`, `/student/dashboard` (with `StudentGuard`)
    - _Requirements: 1.1, 2.1, 3.1_

  - [ ] 15.2 Register all new Angular components and services in `AppModule`
    - Declare new components; provide `StudentAuthService`, `StudentGuard`
    - _Requirements: 2.4, 2.5, 2.6_

  - [ ] 15.3 Add navigation links to student portal in `NavigationComponent` (register, login)
    - _Requirements: 1.1, 2.1_

- [ ] 16. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Backend uses Java (Spring Boot 3.2 / JUnit 5 + jqwik for property tests)
- Frontend uses TypeScript (Angular 15 / Jasmine + Karma)
- Property tests use jqwik `@Property(tries = 100)` annotations
- Each property test references its property number from the design document
- Student auth is fully isolated from admin auth — separate localStorage key, separate service, separate Spring Security provider
