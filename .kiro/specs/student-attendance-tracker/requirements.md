# Requirements Document

## Introduction

The Student Attendance Tracker adds a live, corporate-style attendance tracking system to the existing student dashboard. Students clock in and clock out each working day, and the system records actual working hours. Attendance is tracked independently for two phases — Training and Internship — each with its own date range configured per student by an admin. Students see a monthly calendar with color-coded day statuses and summary statistics. Admins can configure phase dates and view any student's attendance history.

---

## Glossary

- **Attendance_Tracker**: The backend service and frontend component responsible for recording and displaying attendance data.
- **Attendance_Record**: A single day's attendance entry containing check-in time, check-out time, status, and hours worked for one student in one phase.
- **Phase**: One of two distinct periods of a student's program — TRAINING or INTERNSHIP — each with its own start and end date.
- **Phase_Dates**: The four date fields on StudentInternship — trainingStartDate, trainingEndDate, internshipStartDate, internshipEndDate — set by an admin per student.
- **Active_Phase**: The phase whose date range includes today's date. A student may have at most one active phase at any given time.
- **Check_In**: The action of a student recording their arrival time for the current working day.
- **Check_Out**: The action of a student recording their departure time for the current working day, after having checked in.
- **Working_Day**: Any calendar day that is not a Saturday or Sunday.
- **Late_Threshold**: A configurable time-of-day value (default 10:00 AM) after which a check-in is classified as LATE.
- **Attendance_Status**: One of three values assigned to an Attendance_Record — PRESENT, LATE, or ABSENT.
- **Hours_Worked**: The duration in decimal hours between check-in time and check-out time for a given Attendance_Record.
- **Monthly_Calendar**: A calendar view showing one month of attendance days, each color-coded by status.
- **Attendance_Summary**: Aggregated statistics for a phase — total present days, absent days, late days, and attendance percentage.
- **Admin**: A user with administrative privileges who manages student data and phase configuration.
- **Student**: A registered user with ROLE_STUDENT who uses the attendance tracker via the student dashboard.
- **StudentInternship**: The existing JPA entity linking a Student to their internship plan, extended with Phase_Dates.

---

## Requirements

### Requirement 1: Phase Date Configuration by Admin

**User Story:** As an admin, I want to set training and internship phase dates per student, so that the system knows when each phase is active for that student.

#### Acceptance Criteria

1. THE Admin SHALL be able to set trainingStartDate, trainingEndDate, internshipStartDate, and internshipEndDate on a student's StudentInternship record via `PUT /api/admin/students/{id}/phase-dates`.
2. WHEN the admin submits a phase date update, THE Attendance_Tracker SHALL persist all four date fields to the StudentInternship record for the specified student.
3. IF the admin submits a trainingEndDate that is before trainingStartDate, THEN THE Attendance_Tracker SHALL return HTTP 400 with a descriptive validation error message.
4. IF the admin submits an internshipEndDate that is before internshipStartDate, THEN THE Attendance_Tracker SHALL return HTTP 400 with a descriptive validation error message.
5. IF the specified student does not exist, THEN THE Attendance_Tracker SHALL return HTTP 404.
6. WHEN phase dates are updated, THE Attendance_Tracker SHALL allow partial updates — any date field not provided in the request SHALL remain unchanged.

---

### Requirement 2: Active Phase Detection

**User Story:** As a student, I want the system to automatically detect which phase I am currently in, so that my attendance is recorded under the correct phase.

#### Acceptance Criteria

1. WHEN a student requests their current phase, THE Attendance_Tracker SHALL return TRAINING if today's date falls within trainingStartDate and trainingEndDate (inclusive).
2. WHEN a student requests their current phase, THE Attendance_Tracker SHALL return INTERNSHIP if today's date falls within internshipStartDate and internshipEndDate (inclusive) and today does not fall within the training phase range.
3. IF today's date does not fall within any configured phase date range for the student, THEN THE Attendance_Tracker SHALL return a status indicating no active phase.
4. THE Attendance_Tracker SHALL treat phase date comparisons using the server's configured timezone.

---

### Requirement 3: Daily Check-In

**User Story:** As a student, I want to check in once per working day during an active phase, so that my attendance is recorded for that day.

#### Acceptance Criteria

1. WHEN a student calls `POST /api/student/attendance/checkin`, THE Attendance_Tracker SHALL create an Attendance_Record for today's date with the current server time as checkInTime and the detected Active_Phase.
2. WHEN the check-in time is at or before the Late_Threshold, THE Attendance_Tracker SHALL set the Attendance_Status to PRESENT.
3. WHEN the check-in time is after the Late_Threshold, THE Attendance_Tracker SHALL set the Attendance_Status to LATE.
4. IF the student has already checked in today for the Active_Phase, THEN THE Attendance_Tracker SHALL return HTTP 409 and SHALL NOT create a duplicate Attendance_Record.
5. IF today is not a Working_Day, THEN THE Attendance_Tracker SHALL return HTTP 400 indicating check-in is not available on weekends.
6. IF the student has no Active_Phase today, THEN THE Attendance_Tracker SHALL return HTTP 400 indicating no active phase is configured.
7. THE Attendance_Tracker SHALL associate the Attendance_Record with the authenticated student derived from the JWT token.

---

### Requirement 4: Daily Check-Out

**User Story:** As a student, I want to check out at the end of my working day, so that my hours worked are recorded.

#### Acceptance Criteria

1. WHEN a student calls `POST /api/student/attendance/checkout`, THE Attendance_Tracker SHALL update today's Attendance_Record with the current server time as checkOutTime.
2. WHEN check-out is recorded, THE Attendance_Tracker SHALL calculate Hours_Worked as the decimal difference between checkOutTime and checkInTime, rounded to two decimal places.
3. IF the student has not checked in today, THEN THE Attendance_Tracker SHALL return HTTP 400 indicating check-out requires a prior check-in.
4. IF the student has already checked out today, THEN THE Attendance_Tracker SHALL return HTTP 409 and SHALL NOT overwrite the existing checkOutTime.
5. IF today is not a Working_Day, THEN THE Attendance_Tracker SHALL return HTTP 400 indicating check-out is not available on weekends.
6. IF the student has no Active_Phase today, THEN THE Attendance_Tracker SHALL return HTTP 400 indicating no active phase is configured.

---

### Requirement 5: Absent Day Marking

**User Story:** As a system operator, I want working days within a phase where a student did not check in to be automatically marked as ABSENT, so that attendance records are complete.

#### Acceptance Criteria

1. THE Attendance_Tracker SHALL mark a Working_Day within a phase date range as ABSENT when the student did not create an Attendance_Record for that day.
2. WHEN the monthly attendance is requested, THE Attendance_Tracker SHALL derive ABSENT status for any past Working_Day within the phase that has no Attendance_Record, without requiring a scheduled job to pre-create records.
3. THE Attendance_Tracker SHALL NOT mark future dates as ABSENT.
4. THE Attendance_Tracker SHALL NOT mark weekend dates as ABSENT.

---

### Requirement 6: Today's Attendance Status

**User Story:** As a student, I want to see my attendance record for today, so that I can confirm my check-in and check-out times.

#### Acceptance Criteria

1. WHEN a student calls `GET /api/student/attendance/today`, THE Attendance_Tracker SHALL return the Attendance_Record for today if one exists, including checkInTime, checkOutTime, status, and hoursWorked.
2. IF no Attendance_Record exists for today, THE Attendance_Tracker SHALL return a response indicating the student has not yet checked in today.
3. THE Attendance_Tracker SHALL include the Active_Phase in the today response.
4. THE Attendance_Tracker SHALL include whether check-in and check-out actions are currently available in the today response.

---

### Requirement 7: Monthly Calendar Data

**User Story:** As a student, I want to view a monthly calendar showing each day's attendance status, so that I can track my attendance history visually.

#### Acceptance Criteria

1. WHEN a student calls `GET /api/student/attendance/monthly?year=&month=&phase=`, THE Attendance_Tracker SHALL return a list of day entries for every calendar day in the specified month.
2. FOR each day in the month, THE Attendance_Tracker SHALL return the date, the Attendance_Status (PRESENT, LATE, ABSENT, WEEKEND, or FUTURE), and the checkInTime and checkOutTime if available.
3. WHEN a day is a Working_Day within the phase date range and has an Attendance_Record, THE Attendance_Tracker SHALL return the recorded status (PRESENT or LATE).
4. WHEN a day is a past Working_Day within the phase date range and has no Attendance_Record, THE Attendance_Tracker SHALL return ABSENT for that day.
5. WHEN a day is a Saturday or Sunday, THE Attendance_Tracker SHALL return WEEKEND for that day regardless of phase.
6. WHEN a day is in the future relative to today's date, THE Attendance_Tracker SHALL return FUTURE for that day.
7. WHEN a day falls outside the phase date range, THE Attendance_Tracker SHALL return a status of OUT_OF_PHASE for that day.
8. IF the requested phase has no configured dates for the student, THEN THE Attendance_Tracker SHALL return HTTP 400.

---

### Requirement 8: Attendance Summary Statistics

**User Story:** As a student, I want to see summary statistics for each phase, so that I know my overall attendance percentage and counts.

#### Acceptance Criteria

1. WHEN a student calls `GET /api/student/attendance/summary?phase=`, THE Attendance_Tracker SHALL return the total number of PRESENT days, LATE days, ABSENT days, and total Working_Days within the phase date range up to and including today.
2. THE Attendance_Tracker SHALL calculate attendance percentage as `(presentDays + lateDays) / totalWorkingDays * 100`, rounded to one decimal place.
3. IF the phase has no configured dates for the student, THEN THE Attendance_Tracker SHALL return HTTP 400.
4. IF the phase has not yet started (start date is in the future), THE Attendance_Tracker SHALL return zero for all counts and 0.0 for attendance percentage.

---

### Requirement 9: Late Threshold Configuration

**User Story:** As an admin, I want to configure the late check-in threshold time, so that the definition of "late" can be adjusted without code changes.

#### Acceptance Criteria

1. THE Attendance_Tracker SHALL read the Late_Threshold from application configuration with a default value of 10:00 AM server time.
2. WHEN the Late_Threshold is updated in configuration and the application is restarted, THE Attendance_Tracker SHALL apply the new threshold to all subsequent check-ins.
3. THE Attendance_Tracker SHALL NOT retroactively change the status of existing Attendance_Records when the Late_Threshold is changed.

---

### Requirement 10: Admin View of Student Attendance

**User Story:** As an admin, I want to view any student's attendance records, so that I can monitor attendance and resolve disputes.

#### Acceptance Criteria

1. WHEN an admin calls `GET /api/admin/students/{id}/attendance?phase=&year=&month=`, THE Attendance_Tracker SHALL return the same monthly calendar data structure as the student-facing endpoint for the specified student.
2. IF the specified student does not exist, THEN THE Attendance_Tracker SHALL return HTTP 404.
3. THE Attendance_Tracker SHALL restrict this endpoint to users with ROLE_ADMIN.

---

### Requirement 11: Check-In / Check-Out UI Controls

**User Story:** As a student, I want a check-in and check-out button on my dashboard that reflects my current state, so that I can clock in and out without confusion.

#### Acceptance Criteria

1. THE AttendanceTrackerComponent SHALL display a Check-In button when the student has not yet checked in today and an Active_Phase exists.
2. THE AttendanceTrackerComponent SHALL display a Check-Out button when the student has checked in but not yet checked out today.
3. WHILE no Active_Phase exists for today, THE AttendanceTrackerComponent SHALL display the check-in button in a disabled state with a message indicating no active phase.
4. WHEN the student has already checked out today, THE AttendanceTrackerComponent SHALL display both times and hours worked and SHALL NOT display an active check-in or check-out button.
5. THE AttendanceTrackerComponent SHALL display a live clock showing the current time, updated every second.
6. WHEN the student clicks Check-In, THE AttendanceTrackerComponent SHALL call `POST /api/student/attendance/checkin` and refresh the today status card on success.
7. WHEN the student clicks Check-Out, THE AttendanceTrackerComponent SHALL call `POST /api/student/attendance/checkout` and refresh the today status card on success.
8. IF the check-in or check-out API call returns an error, THE AttendanceTrackerComponent SHALL display the error message returned by the server.

---

### Requirement 12: Monthly Calendar UI

**User Story:** As a student, I want to see a color-coded monthly calendar on my dashboard, so that I can visually identify my attendance pattern.

#### Acceptance Criteria

1. THE AttendanceTrackerComponent SHALL render a monthly calendar grid showing all days of the selected month.
2. THE AttendanceTrackerComponent SHALL color-code each day: green for PRESENT, yellow for LATE, red for ABSENT, grey for WEEKEND or FUTURE or OUT_OF_PHASE.
3. THE AttendanceTrackerComponent SHALL allow the student to navigate to the previous and next month.
4. WHEN a day cell is PRESENT or LATE, THE AttendanceTrackerComponent SHALL display the check-in time within the cell.
5. THE AttendanceTrackerComponent SHALL allow the student to switch between TRAINING and INTERNSHIP phase views.
6. WHEN a phase has no configured dates, THE AttendanceTrackerComponent SHALL display a message indicating the phase has not been configured by the admin.

---

### Requirement 13: Attendance Summary UI

**User Story:** As a student, I want to see attendance summary statistics on my dashboard, so that I can quickly assess my attendance standing.

#### Acceptance Criteria

1. THE AttendanceTrackerComponent SHALL display the total present days, late days, absent days, and attendance percentage for the currently selected phase.
2. THE AttendanceTrackerComponent SHALL update the summary statistics when the student switches between TRAINING and INTERNSHIP phase views.
3. THE AttendanceTrackerComponent SHALL display the phase start and end dates alongside the summary statistics.

---

### Requirement 14: Admin Phase Date UI

**User Story:** As an admin, I want a form in the admin student management panel to set phase dates per student, so that I can configure attendance tracking without direct database access.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display input fields for trainingStartDate, trainingEndDate, internshipStartDate, and internshipEndDate on the student detail or edit page.
2. WHEN the admin submits the phase date form, THE Admin_Panel SHALL call `PUT /api/admin/students/{id}/phase-dates` and display a success or error message based on the response.
3. THE Admin_Panel SHALL pre-populate the phase date fields with the student's existing phase dates if already configured.
4. THE Admin_Panel SHALL validate that end dates are not before start dates before submitting the form, displaying an inline validation error if violated.

---

### Requirement 15: Security and Authorization

**User Story:** As a system operator, I want attendance endpoints to be properly secured, so that students can only access their own data and admins can access all data.

#### Acceptance Criteria

1. THE Attendance_Tracker SHALL restrict all `/api/student/attendance/**` endpoints to authenticated users with ROLE_STUDENT.
2. THE Attendance_Tracker SHALL restrict all `/api/admin/students/{id}/attendance` and `/api/admin/students/{id}/phase-dates` endpoints to authenticated users with ROLE_ADMIN.
3. WHEN a student calls any attendance endpoint, THE Attendance_Tracker SHALL derive the student identity exclusively from the JWT token and SHALL NOT accept a student ID as a request parameter for self-service endpoints.
4. IF an unauthenticated request is made to any attendance endpoint, THEN THE Attendance_Tracker SHALL return HTTP 401.
5. IF a ROLE_STUDENT user attempts to access an admin attendance endpoint, THEN THE Attendance_Tracker SHALL return HTTP 403.
