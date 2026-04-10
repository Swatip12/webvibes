# Implementation Plan: Student Attendance Tracker

## Overview

Implement the full attendance tracking feature on top of the existing Spring Boot + Angular + PostgreSQL stack. Backend foundations (entities, repository, service, controllers) are built first, followed by frontend components, admin UI extensions, and property-based tests.

## Tasks

- [x] 1. Add backend enums and extend StudentInternship entity
  - Create `AttendancePhase` enum (`TRAINING`, `INTERNSHIP`) in `com.webvibes.entity`
  - Create `AttendanceStatus` enum (`PRESENT`, `LATE`, `ABSENT`) in `com.webvibes.entity`
  - Add four `LocalDate` fields to `StudentInternship`: `trainingStartDate`, `trainingEndDate`, `internshipStartDate`, `internshipEndDate` with `@Column` mappings
  - Add getters and setters for the four new fields
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [x] 2. Create Attendance JPA entity and DTOs
  - [x] 2.1 Create `Attendance` entity in `com.webvibes.entity` with all fields from the design (`id`, `student`, `phase`, `date`, `checkInTime`, `checkOutTime`, `status`, `hoursWorked`) and the unique constraint on `(student_id, date, phase)`
    - _Requirements: 3.1, 4.1, 4.2_
  - [x] 2.2 Create `AttendanceTodayDTO`, `CalendarDayDTO`, `AttendanceSummaryDTO`, and `PhaseDatesRequest` in `com.webvibes.dto`
    - _Requirements: 6.1, 7.2, 8.1, 1.1_

- [x] 3. Create AttendanceRepository
  - Create `AttendanceRepository` extending `JpaRepository<Attendance, Long>` in `com.webvibes.repository`
  - Add `findByStudentAndDateAndPhase(Student, LocalDate, AttendancePhase)` returning `Optional<Attendance>`
  - Add `findByStudentAndPhaseAndDateBetween(Student, AttendancePhase, LocalDate, LocalDate)` returning `List<Attendance>`
  - _Requirements: 3.1, 7.1, 8.1_

- [x] 4. Add late threshold config to application.properties
  - Add `attendance.late-threshold=10:00` to `backend/src/main/resources/application.properties`
  - _Requirements: 9.1, 9.2_

- [x] 5. Create new exception classes and register in GlobalExceptionHandler
  - [x] 5.1 Create `AttendanceAlreadyExistsException` (→ HTTP 409), `AttendanceNotFoundException` (→ HTTP 400), `NoActivePhaseException` (→ HTTP 400), and `PhaseNotConfiguredException` (→ HTTP 400) in `com.webvibes.exception`
    - _Requirements: 3.4, 3.5, 3.6, 4.3, 4.4, 7.8, 8.3_
  - [x] 5.2 Add `@ExceptionHandler` mappings for all four new exceptions in `GlobalExceptionHandler`, returning `{ "error": "<message>" }` with the correct HTTP status
    - _Requirements: 3.4, 3.5, 3.6, 4.3, 4.4, 7.8, 8.3_

- [x] 6. Implement AttendanceService
  - [x] 6.1 Create `AttendanceService` in `com.webvibes.service`; inject `AttendanceRepository`, `StudentInternshipRepository`, `StudentRepository`, and `@Value("${attendance.late-threshold:10:00}") String lateThreshold`
    - _Requirements: 9.1_
  - [x] 6.2 Implement `detectActivePhase(String studentEmail)` — returns `AttendancePhase` or `null` based on today vs phase date ranges on `StudentInternship`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 6.3 Implement `checkIn(String studentEmail)` — validates weekend/no-phase/duplicate, creates `Attendance` record with PRESENT or LATE status, returns `AttendanceTodayDTO`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  - [x] 6.4 Implement `checkOut(String studentEmail)` — validates no-checkin/duplicate/weekend/no-phase, updates `checkOutTime` and `hoursWorked` (rounded to 2 dp), returns `AttendanceTodayDTO`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [x] 6.5 Implement `getTodayStatus(String studentEmail)` — returns `AttendanceTodayDTO` with `canCheckIn`/`canCheckOut` flags
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - [x] 6.6 Implement `getMonthlyCalendar(String studentEmail, int year, int month, AttendancePhase phase)` — iterates every day in the month, classifies each as WEEKEND / FUTURE / OUT_OF_PHASE / PRESENT / LATE / ABSENT
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_
  - [x] 6.7 Implement `getSummary(String studentEmail, AttendancePhase phase)` — counts present/late/absent/total working days up to today, computes attendance percentage rounded to 1 dp
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 6.8 Implement `getMonthlyCalendarForAdmin(Long studentId, int year, int month, AttendancePhase phase)` — same logic as 6.6 but looks up student by ID
    - _Requirements: 10.1, 10.2_
  - [x] 6.9 Implement `updatePhaseDates(Long studentId, PhaseDatesRequest req)` — validates end ≥ start for both phases, applies partial update (null fields leave existing values unchanged), saves and returns updated `AdminStudentDTO`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 7. Checkpoint — ensure backend compiles and all existing tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Create AttendanceController
  - Create `AttendanceController` at `/api/student/attendance` with `@PreAuthorize("hasRole('STUDENT')")`
  - Implement `POST /checkin` → `attendanceService.checkIn(principal.getName())`
  - Implement `POST /checkout` → `attendanceService.checkOut(principal.getName())`
  - Implement `GET /today` → `attendanceService.getTodayStatus(principal.getName())`
  - Implement `GET /monthly?year=&month=&phase=` → `attendanceService.getMonthlyCalendar(...)`
  - Implement `GET /summary?phase=` → `attendanceService.getSummary(...)`
  - _Requirements: 3.1, 4.1, 6.1, 7.1, 8.1, 15.1, 15.3_

- [x] 9. Extend AdminStudentController
  - Add `PUT /{id}/phase-dates` → `attendanceService.updatePhaseDates(id, request)`, annotated `@PreAuthorize("hasRole('ADMIN')")`
  - Add `GET /{id}/attendance?phase=&year=&month=` → `attendanceService.getMonthlyCalendarForAdmin(id, year, month, phase)`, annotated `@PreAuthorize("hasRole('ADMIN')")`
  - Extend `toDTO` helper (or `AdminStudentDTO`) to include the four phase date fields so the PUT response returns them
  - _Requirements: 1.1, 10.1, 10.2, 10.3, 15.2_

- [x] 10. Update SecurityConfig for new endpoints
  - Confirm `/api/student/attendance/**` is covered by the existing `hasRole('STUDENT')` rule (no change needed if wildcard already matches)
  - Confirm `/api/admin/students/**` is covered by the existing `hasRole('ADMIN')` rule
  - Add explicit permit rules only if the wildcard patterns do not already cover the new paths
  - _Requirements: 15.1, 15.2, 15.4, 15.5_

- [x] 11. Checkpoint — run backend tests, verify new endpoints return correct HTTP status codes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Create TypeScript models and Angular AttendanceService
  - [x] 12.1 Create `src/app/models/attendance.models.ts` with interfaces `AttendanceTodayDTO`, `CalendarDayDTO`, `AttendanceSummaryDTO`, `PhaseDatesRequest`
    - _Requirements: 6.1, 7.2, 8.1, 1.1_
  - [x] 12.2 Create `src/app/services/attendance.service.ts` with methods: `checkIn()`, `checkOut()`, `getToday()`, `getMonthly(year, month, phase)`, `getSummary(phase)`, `updatePhaseDates(studentId, req)`, `getAdminMonthly(studentId, year, month, phase)` — all returning typed `Observable`s via `HttpClient`
    - _Requirements: 11.6, 11.7, 12.3, 13.1, 14.2_

- [x] 13. Create AttendanceTrackerComponent
  - [x] 13.1 Generate component files (`attendance-tracker.component.ts/html/css`) in `src/app/components/attendance-tracker/`
    - Declare it in `AppModule`
    - _Requirements: 11.1_
  - [x] 13.2 Implement live clock using `setInterval` (1 s), displayed in the template; clear interval on `ngOnDestroy`
    - _Requirements: 11.5_
  - [x] 13.3 Implement today's card: call `getToday()` on init, display checkInTime / checkOutTime / hoursWorked / status badge; show Check-In button when `canCheckIn`, Check-Out button when `canCheckOut`, completed state when both are false and checkOutTime is set; wire button clicks to `checkIn()` / `checkOut()` service calls and refresh on success; display server error messages on failure
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.6, 11.7, 11.8_
  - [x] 13.4 Implement phase tab switcher (TRAINING / INTERNSHIP) and summary stats row (present / late / absent / attendance %); call `getSummary(phase)` when tab changes; display phase start/end dates; show "not configured" message when phase has no dates
    - _Requirements: 12.5, 12.6, 13.1, 13.2, 13.3_
  - [x] 13.5 Implement monthly calendar grid: 7-column Mon–Sun layout, color-coded cells (green=PRESENT, yellow=LATE, red=ABSENT, grey=WEEKEND/FUTURE/OUT_OF_PHASE), show check-in time in PRESENT/LATE cells, prev/next month navigation; call `getMonthly(year, month, phase)` on load and on navigation
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  - [ ]* 13.6 Write fast-check property test for AttendanceTrackerComponent button state: for any `AttendanceTodayDTO`, the component must show exactly one of {Check-In button, Check-Out button, completed state} — never both buttons simultaneously
    - **Property: Button mutual exclusivity**
    - **Validates: Requirements 11.1, 11.2, 11.4**
  - [ ]* 13.7 Write fast-check property test for calendar grid completeness: for any year/month, the rendered grid must contain exactly the correct number of day cells with no duplicates
    - **Property 8: Calendar Completeness**
    - **Validates: Requirements 7.1, 12.1**

- [x] 14. Embed AttendanceTrackerComponent in StudentDashboardComponent
  - Add `<app-attendance-tracker>` inside the `paymentStatus === 'FULL'` block in `student-dashboard.component.html`, below the assessments card
  - _Requirements: 11.1_

- [x] 15. Extend AdminStudentsComponent with phase dates form
  - Add a collapsible "Phase Dates" section per student row in `admin-students.component.html` with four date inputs (`trainingStartDate`, `trainingEndDate`, `internshipStartDate`, `internshipEndDate`)
  - Pre-populate inputs from existing student data (extend `AdminStudentDTO` response mapping to include phase date fields)
  - Add client-side validation: end date must not be before start date; show inline error if violated
  - Wire Save button to `attendanceService.updatePhaseDates(student.id, req)` and display success/error message
  - Add `getAdminMonthly` call and a read-only calendar view per student for admin attendance inspection
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 10.1_

- [x] 16. Checkpoint — verify frontend compiles, attendance tracker renders in dashboard, admin phase form saves correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. Backend property-based tests (jqwik)
  - [x] 17.1 Write `PhaseDatesPropertyTest` — Property 1: for random valid date pairs (end ≥ start), PUT phase-dates and read back must return identical values
    - **Property 1: Phase Dates Round-Trip**
    - **Validates: Requirements 1.1, 1.2**
  - [ ]* 17.2 Write `PhaseDatesPropertyTest` — Property 2: for random date pairs where end < start, service must throw validation exception and not persist
    - **Property 2: Invalid Date Range Rejected**
    - **Validates: Requirements 1.3, 1.4**
  - [ ]* 17.3 Write `PhaseDetectionPropertyTest` — Property 3: for random phase date ranges and random query dates, `detectActivePhase` must return TRAINING / INTERNSHIP / null per the range rules
    - **Property 3: Phase Detection Correctness**
    - **Validates: Requirements 2.1, 2.2, 2.3**
  - [ ]* 17.4 Write `CheckInStatusPropertyTest` — Property 4: for random check-in times and random late thresholds, status must be PRESENT iff time ≤ threshold, LATE otherwise
    - **Property 4: Check-In Status Assignment**
    - **Validates: Requirements 3.2, 3.3, 9.1**
  - [ ]* 17.5 Write `CheckInPropertyTest` — Property 5: for any student already checked in today, a second checkIn call must throw `AttendanceAlreadyExistsException` and leave the original record unchanged
    - **Property 5: Duplicate Check-In Rejected**
    - **Validates: Requirements 3.4**
  - [ ]* 17.6 Write `HoursWorkedPropertyTest` — Property 6: for random (t_in, t_out) pairs where t_out > t_in, `hoursWorked` must equal `(t_out − t_in)` in decimal hours rounded to 2 dp
    - **Property 6: Hours Worked Calculation**
    - **Validates: Requirements 4.2**
  - [ ]* 17.7 Write `CheckOutPropertyTest` — Property 7: for any student already checked out today, a second checkOut call must throw `AttendanceAlreadyExistsException` and leave original checkOutTime and hoursWorked unchanged
    - **Property 7: Duplicate Check-Out Rejected**
    - **Validates: Requirements 4.4**
  - [ ]* 17.8 Write `CalendarPropertyTest` — Property 8: for random year/month, `getMonthlyCalendar` must return exactly N entries (N = days in month) with no duplicate dates
    - **Property 8: Calendar Completeness**
    - **Validates: Requirements 7.1**
  - [ ]* 17.9 Write `CalendarPropertyTest` — Property 9: for random phase ranges and attendance record sets, every day's `displayStatus` must satisfy all classification rules simultaneously (WEEKEND / FUTURE / OUT_OF_PHASE / PRESENT / LATE / ABSENT)
    - **Property 9: Calendar DisplayStatus Correctness**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7**
  - [ ]* 17.10 Write `SummaryPropertyTest` — Property 10: for random attendance record sets within random phase ranges, summary counts and percentage must satisfy the arithmetic identities in the design
    - **Property 10: Summary Statistics Correctness**
    - **Validates: Requirements 8.1, 8.2**
  - [ ]* 17.11 Write `SecurityPropertyTest` — Property 11: for any authenticated student, the student_id on the returned Attendance record must match the JWT-encoded email, regardless of other request parameters
    - **Property 11: JWT Identity Enforcement**
    - **Validates: Requirements 15.3**

- [ ] 18. Frontend property-based tests (fast-check)
  - [ ]* 18.1 Write fast-check test for `AttendanceService` HTTP mapping: for any `CalendarDayDTO[]` response, the Angular service must return an array of the same length with all `displayStatus` values preserved
    - **Validates: Requirements 7.2**
  - [ ]* 18.2 Write fast-check test for `AttendanceTrackerComponent` button state (see task 13.6)
    - **Validates: Requirements 11.1, 11.2, 11.4**
  - [ ]* 18.3 Write fast-check test for calendar grid completeness (see task 13.7)
    - **Validates: Requirements 7.1, 12.1**

- [ ] 19. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at each layer boundary
- Property tests (jqwik / fast-check) validate universal correctness; unit tests validate specific boundary examples
- The `SecurityConfig` wildcard rules already cover the new paths — task 10 is a verification step only
