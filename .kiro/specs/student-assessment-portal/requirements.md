# Requirements Document

## Introduction

The Student Assessment Portal extends the existing WebVibes internship platform with a test and assessment management system. Admins can create four types of assessments — Mock Interview, Aptitude Test, Machine Test, and Technical MCQ Test — and assign them to individual students or entire batches. Students with a `FULL` payment status can view their assigned tests on the dashboard, take timed MCQ/aptitude tests, submit machine test solutions, and join scheduled mock interview sessions. Admins can review all student submissions and results.

The system integrates with the existing `Student`, `StudentInternship`, and `PaymentStatus` entities and reuses the existing JWT authentication infrastructure with `ROLE_STUDENT` and `ROLE_ADMIN` separation.

---

## Glossary

- **Assessment_Service**: The Spring Boot service responsible for creating, assigning, and retrieving assessments and their results.
- **Assessment**: A test entity with a type (`MOCK_INTERVIEW`, `APTITUDE_TEST`, `MACHINE_TEST`, `TECHNICAL_MCQ`) and associated content or schedule details.
- **Assessment_Type**: An enum with values `MOCK_INTERVIEW`, `APTITUDE_TEST`, `MACHINE_TEST`, `TECHNICAL_MCQ`.
- **Student_Assessment**: A join entity linking a specific Assessment to a specific Student, tracking assignment and submission status.
- **Assessment_Status**: An enum with values `PENDING`, `UPCOMING`, `COMPLETED` representing the student's progress on an assigned assessment.
- **Question**: A multiple-choice question entity with a prompt, four options, and a correct answer index, associated with an Assessment of type `APTITUDE_TEST` or `TECHNICAL_MCQ`.
- **Submission**: A record of a student's response to an assessment — selected answers for MCQ/aptitude, a solution text/link for machine test, or attendance confirmation for mock interview.
- **Batch**: A logical grouping of students sharing the same internship plan name, used for bulk assessment assignment.
- **Mock_Interview**: An assessment type where the admin schedules a date, time, and video call link for a live online interview requiring camera access.
- **Machine_Test**: An assessment type where the admin provides a problem statement and the student submits a solution (code, link, or text).
- **MCQ_Test**: An assessment type (either `TECHNICAL_MCQ` or `APTITUDE_TEST`) consisting of multiple-choice questions with a configurable time limit.
- **Timer**: A countdown mechanism on the frontend that enforces the time limit for MCQ_Test assessments.
- **Admin_Panel**: The existing Angular admin interface at `/admin/students`, extended with assessment management pages.
- **Student_Dashboard**: The existing Angular student page at `/student/dashboard`, extended to show assigned assessments.
- **Payment_Status**: The existing enum (`NOT_PAID`, `PARTIAL`, `FULL`) on `StudentInternship`; assessments are only visible to students with `FULL` status.

---

## Requirements

### Requirement 1: Assessment Creation by Admin

**User Story:** As an admin, I want to create assessments of different types with relevant content, so that I can prepare tests for students.

#### Acceptance Criteria

1. THE Assessment_Service SHALL expose a `POST /api/admin/assessments` endpoint that accepts assessment type, title, description, and type-specific fields.
2. WHEN the assessment type is `MOCK_INTERVIEW`, THE Assessment_Service SHALL require and persist a scheduled date-time and a video call link.
3. WHEN the assessment type is `MACHINE_TEST`, THE Assessment_Service SHALL require and persist a problem statement of at least 20 characters.
4. WHEN the assessment type is `TECHNICAL_MCQ` or `APTITUDE_TEST`, THE Assessment_Service SHALL require and persist a time limit in minutes (minimum 1, maximum 180) and at least one Question.
5. IF a required field is missing or invalid for the given assessment type, THEN THE Assessment_Service SHALL return HTTP 400 with field-level validation errors.
6. THE Assessment_Service SHALL expose a `GET /api/admin/assessments` endpoint that returns a paginated list of all assessments with their type, title, and creation date.
7. THE Assessment_Service SHALL expose a `GET /api/admin/assessments/{assessmentId}` endpoint that returns the full assessment details including all Questions.
8. THE Assessment_Service SHALL expose a `DELETE /api/admin/assessments/{assessmentId}` endpoint that removes the assessment and all associated Student_Assessments.
9. IF an assessment ID does not exist, THEN THE Assessment_Service SHALL return HTTP 404 with a descriptive error message.

---

### Requirement 2: Question Management for MCQ Assessments

**User Story:** As an admin, I want to add multiple-choice questions to MCQ and aptitude tests, so that students can be evaluated automatically.

#### Acceptance Criteria

1. THE Assessment_Service SHALL expose a `POST /api/admin/assessments/{assessmentId}/questions` endpoint that accepts a question prompt, four option strings, and a correct answer index (0–3).
2. WHEN a question is added to an assessment of type `TECHNICAL_MCQ` or `APTITUDE_TEST`, THE Assessment_Service SHALL persist the question linked to that assessment.
3. IF a question is added to an assessment of type `MOCK_INTERVIEW` or `MACHINE_TEST`, THEN THE Assessment_Service SHALL return HTTP 400 with the message "Questions are not applicable for this assessment type".
4. IF the correct answer index is not in the range 0–3, THEN THE Assessment_Service SHALL return HTTP 400 with a descriptive validation error.
5. THE Assessment_Service SHALL expose a `DELETE /api/admin/assessments/{assessmentId}/questions/{questionId}` endpoint that removes a single question.
6. WHEN a question is deleted and the assessment has no remaining questions, THE Assessment_Service SHALL still allow the assessment to exist but mark it as incomplete.

---

### Requirement 3: Assessment Assignment to Students

**User Story:** As an admin, I want to assign assessments to individual students or entire batches, so that the right students receive the right tests.

#### Acceptance Criteria

1. THE Assessment_Service SHALL expose a `POST /api/admin/assessments/{assessmentId}/assign` endpoint that accepts either a list of student IDs or a batch name (plan name).
2. WHEN a batch name is provided, THE Assessment_Service SHALL assign the assessment to all students whose `StudentInternship.planName` matches the provided batch name.
3. WHEN a list of student IDs is provided, THE Assessment_Service SHALL create a Student_Assessment record for each valid student ID.
4. IF a student ID in the list does not exist, THEN THE Assessment_Service SHALL skip that ID and include it in a `skippedIds` list in the response.
5. IF a Student_Assessment record already exists for a given student and assessment, THEN THE Assessment_Service SHALL not create a duplicate and SHALL include the student ID in a `alreadyAssigned` list in the response.
6. WHEN a Student_Assessment is created, THE Assessment_Service SHALL set the initial Assessment_Status to `PENDING`.
7. WHEN a `MOCK_INTERVIEW` assessment is assigned, THE Assessment_Service SHALL set the initial Assessment_Status to `UPCOMING`.
8. THE Assessment_Service SHALL expose a `GET /api/admin/assessments/{assessmentId}/students` endpoint that returns all students assigned to that assessment with their current Assessment_Status.

---

### Requirement 4: Student Assessment Visibility (Payment Gate)

**User Story:** As a student who has completed payment, I want to see my assigned assessments on the dashboard, so that I know what tests I need to take.

#### Acceptance Criteria

1. THE Assessment_Service SHALL expose a `GET /api/student/assessments` endpoint that returns all Student_Assessment records for the authenticated student.
2. WHILE the authenticated student's `StudentInternship.paymentStatus` is not `FULL`, THE Assessment_Service SHALL return an empty list with HTTP 200.
3. WHEN the authenticated student's `StudentInternship.paymentStatus` is `FULL`, THE Assessment_Service SHALL return all assigned assessments with their type, title, Assessment_Status, and scheduled date-time (for `MOCK_INTERVIEW`).
4. THE Student_Dashboard SHALL display an "Assessments" section only when the student's Payment_Status is `FULL`.
5. WHILE the student's Payment_Status is not `FULL`, THE Student_Dashboard SHALL display the message "Complete your payment to unlock assessments".
6. THE Student_Dashboard SHALL display each assigned assessment with its title, type, and Assessment_Status badge (`PENDING`, `UPCOMING`, or `COMPLETED`).

---

### Requirement 5: Taking MCQ and Aptitude Tests

**User Story:** As a student, I want to take timed multiple-choice tests, so that I can demonstrate my technical and aptitude skills.

#### Acceptance Criteria

1. THE Assessment_Service SHALL expose a `GET /api/student/assessments/{studentAssessmentId}/questions` endpoint that returns all questions for the assessment without revealing the correct answer index.
2. WHEN a student accesses an MCQ or aptitude test, THE Student_Dashboard SHALL display a countdown Timer initialized to the assessment's configured time limit.
3. WHILE the Timer is running, THE Student_Dashboard SHALL allow the student to select one answer per question.
4. WHEN the student clicks "Submit Test", THE Assessment_Service SHALL accept a `POST /api/student/assessments/{studentAssessmentId}/submit` request containing the student's selected answer index for each question.
5. WHEN the Timer reaches zero, THE Student_Dashboard SHALL automatically submit the test with the answers selected up to that point.
6. WHEN a submission is received, THE Assessment_Service SHALL calculate the score as the count of correct answers, persist the Submission, and set Assessment_Status to `COMPLETED`.
7. IF a submission is received for an assessment already in `COMPLETED` status, THEN THE Assessment_Service SHALL return HTTP 409 with the message "Assessment already submitted".
8. WHEN the submission is processed, THE Assessment_Service SHALL return the student's score and total question count in the response.
9. IF a student accesses an MCQ test questions endpoint for an assessment not assigned to them, THEN THE Assessment_Service SHALL return HTTP 403.

---

### Requirement 6: Machine Test Submission

**User Story:** As a student, I want to read a problem statement and submit my solution, so that I can complete the machine test assessment.

#### Acceptance Criteria

1. THE Assessment_Service SHALL expose a `GET /api/student/assessments/{studentAssessmentId}` endpoint that returns the full assessment details including the problem statement for `MACHINE_TEST` type.
2. WHEN a student views a `MACHINE_TEST` assessment, THE Student_Dashboard SHALL display the problem statement and a text area for solution submission.
3. WHEN the student clicks "Submit Solution", THE Assessment_Service SHALL accept a `POST /api/student/assessments/{studentAssessmentId}/submit` request containing the solution text (minimum 10 characters).
4. IF the solution text is fewer than 10 characters, THEN THE Assessment_Service SHALL return HTTP 400 with the message "Solution must be at least 10 characters".
5. WHEN a machine test submission is received, THE Assessment_Service SHALL persist the Submission and set Assessment_Status to `COMPLETED`.
6. IF a submission is received for a machine test already in `COMPLETED` status, THEN THE Assessment_Service SHALL return HTTP 409 with the message "Assessment already submitted".

---

### Requirement 7: Mock Interview Access

**User Story:** As a student, I want to see my scheduled mock interview details and join the video call, so that I can participate in the online interview.

#### Acceptance Criteria

1. WHEN a student views a `MOCK_INTERVIEW` assessment, THE Student_Dashboard SHALL display the scheduled date-time and a "Join Interview" button containing the video call link.
2. WHEN the student clicks "Join Interview", THE Student_Dashboard SHALL open the video call link in a new browser tab.
3. THE Student_Dashboard SHALL display a notice that camera and microphone access are required for the mock interview.
4. WHEN the scheduled date-time is in the future, THE Student_Dashboard SHALL display the Assessment_Status as `UPCOMING` and show a countdown to the interview time.
5. WHEN the admin marks a mock interview as completed for a student, THE Assessment_Service SHALL set the Assessment_Status to `COMPLETED` for that Student_Assessment.
6. THE Assessment_Service SHALL expose a `PUT /api/admin/student-assessments/{studentAssessmentId}/status` endpoint that allows the admin to update the Assessment_Status of any Student_Assessment.

---

### Requirement 8: Admin Results and Submission Review

**User Story:** As an admin, I want to view student submissions and scores for all assessment types, so that I can evaluate student performance.

#### Acceptance Criteria

1. THE Assessment_Service SHALL expose a `GET /api/admin/assessments/{assessmentId}/results` endpoint that returns all Student_Assessment records with student name, email, Assessment_Status, score (for MCQ types), and submission content (for machine test).
2. WHEN the assessment type is `TECHNICAL_MCQ` or `APTITUDE_TEST`, THE Assessment_Service SHALL include the student's score and total question count in the results response.
3. WHEN the assessment type is `MACHINE_TEST`, THE Assessment_Service SHALL include the submitted solution text in the results response.
4. WHEN the assessment type is `MOCK_INTERVIEW`, THE Assessment_Service SHALL include the Assessment_Status and the scheduled date-time in the results response.
5. THE Admin_Panel SHALL display an "Assessments" section in the admin navigation with a list of all assessments.
6. THE Admin_Panel SHALL display a results table for each assessment showing student name, status, and type-specific result data.
7. THE Assessment_Service SHALL expose a `GET /api/admin/student-assessments` endpoint that returns all Student_Assessment records across all assessments, filterable by `assessmentType` and `assessmentStatus` query parameters.

---

### Requirement 9: Assessment Status Display

**User Story:** As a student, I want to see the status of each of my assessments clearly, so that I know which tests are pending, upcoming, or completed.

#### Acceptance Criteria

1. THE Student_Dashboard SHALL display each Student_Assessment with a color-coded status badge: `PENDING` in yellow, `UPCOMING` in blue, `COMPLETED` in green.
2. WHEN Assessment_Status is `COMPLETED` for an MCQ or aptitude test, THE Student_Dashboard SHALL display the student's score alongside the status badge.
3. WHEN Assessment_Status is `UPCOMING` for a mock interview, THE Student_Dashboard SHALL display the scheduled date-time alongside the status badge.
4. WHEN Assessment_Status is `PENDING`, THE Student_Dashboard SHALL display a "Start Test" button for MCQ/aptitude types and a "View Problem" button for machine test type.
5. WHEN Assessment_Status is `COMPLETED`, THE Student_Dashboard SHALL not display any action buttons for that assessment.

---

### Requirement 10: Data Integrity and Security

**User Story:** As a system operator, I want assessment data to be consistent and access-controlled, so that students cannot access other students' tests or tamper with results.

#### Acceptance Criteria

1. THE Assessment_Service SHALL verify that the authenticated student is the owner of the Student_Assessment before returning questions or accepting submissions.
2. THE Assessment_Service SHALL verify that the authenticated student's `StudentInternship.paymentStatus` is `FULL` before returning any assessment content.
3. IF a student attempts to access an assessment not assigned to them, THEN THE Assessment_Service SHALL return HTTP 403.
4. THE Assessment_Service SHALL not include the correct answer index in any response to student-facing endpoints.
5. THE Assessment_Service SHALL ensure that a Student_Assessment record can only transition to `COMPLETED` status once, preventing re-submission.
6. THE Assessment_Service SHALL expose all admin assessment endpoints exclusively to requests authenticated with `ROLE_ADMIN`.
7. THE Assessment_Service SHALL expose all student assessment endpoints exclusively to requests authenticated with `ROLE_STUDENT`.
