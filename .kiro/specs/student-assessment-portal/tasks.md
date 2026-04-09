# Implementation Plan: Student Assessment Portal

## Overview

Implement the Student Assessment Portal on top of the existing Spring Boot 3.2 + Angular 15 platform. The backend is built incrementally — entities → repositories → exceptions → service → controllers — followed by frontend services and components. Each phase wires into the existing infrastructure without modifying SecurityConfig.

## Tasks

- [x] 1. Create backend entities and enums
  - [x] 1.1 Create `AssessmentType` and `AssessmentStatus` enums in `com.webvibes.entity`
    - `AssessmentType`: `MOCK_INTERVIEW`, `APTITUDE_TEST`, `MACHINE_TEST`, `TECHNICAL_MCQ`
    - `AssessmentStatus`: `PENDING`, `UPCOMING`, `COMPLETED`
    - _Requirements: 1.1, 3.5, 3.6, 3.7_

  - [x] 1.2 Create `Assessment` entity in `com.webvibes.entity`
    - Fields: `id`, `type` (AssessmentType), `title`, `description`, `scheduledAt`, `videoLink`, `problemStatement`, `timeLimitMinutes`, `createdAt`
    - `@OneToMany` to `Question` and `StudentAssessment` with `CascadeType.ALL, orphanRemoval = true`
    - `@PrePersist` sets `createdAt`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.3 Create `Question` entity in `com.webvibes.entity`
    - Fields: `id`, `assessment` (ManyToOne lazy), `prompt`, `optionA`, `optionB`, `optionC`, `optionD`, `correctAnswerIndex`
    - _Requirements: 2.1, 2.3, 2.4_

  - [x] 1.4 Create `StudentAssessment` entity in `com.webvibes.entity`
    - Fields: `id`, `student` (ManyToOne lazy), `assessment` (ManyToOne lazy), `status` (AssessmentStatus, default PENDING), `assignedAt`
    - Unique constraint on `(student_id, assessment_id)`
    - _Requirements: 3.1, 3.5, 3.6_

  - [x] 1.5 Create `Submission` entity in `com.webvibes.entity`
    - Fields: `id`, `studentAssessment` (OneToOne lazy, unique), `answersJson` (TEXT), `solutionText` (TEXT), `score`, `submittedAt`
    - _Requirements: 5.6, 6.5_

- [x] 2. Create backend repositories
  - Create `AssessmentRepository`, `QuestionRepository`, `StudentAssessmentRepository`, `SubmissionRepository` in `com.webvibes.repository`
  - `AssessmentRepository`: standard `JpaRepository<Assessment, Long>`
  - `QuestionRepository`: standard `JpaRepository<Question, Long>`
  - `StudentAssessmentRepository`: add `findByStudentId(Long)`, `findByStudentIdAndAssessmentId(Long, Long)`, `findByAssessmentId(Long)`, `existsByStudentIdAndAssessmentId(Long, Long)`
  - `SubmissionRepository`: add `findByStudentAssessmentId(Long)`, `existsByStudentAssessmentId(Long)`
  - _Requirements: 1.6, 3.1, 4.1, 5.6_

- [x] 3. Create backend exceptions and update GlobalExceptionHandler
  - [x] 3.1 Create `AssessmentNotFoundException`, `AssessmentAlreadySubmittedException`, `AssessmentAccessDeniedException`, `InvalidAssessmentTypeOperationException` in `com.webvibes.exception`
    - Each extends `RuntimeException` with a message constructor
    - _Requirements: 1.9, 5.7, 5.9, 2.3_

  - [x] 3.2 Add handlers to `GlobalExceptionHandler` for the four new exceptions
    - `AssessmentNotFoundException` → HTTP 404
    - `AssessmentAlreadySubmittedException` → HTTP 409
    - `AssessmentAccessDeniedException` → HTTP 403
    - `InvalidAssessmentTypeOperationException` → HTTP 400
    - _Requirements: 1.9, 2.3, 5.7, 5.9_

- [x] 4. Create backend DTOs
  - Create all request/response DTOs in `com.webvibes.dto`:
    - `CreateAssessmentRequest` (with Bean Validation annotations: `@NotBlank`, `@NotNull`, `@Size`, `@Min`, `@Max`)
    - `CreateQuestionRequest` (`@NotBlank` on all fields, `@Min(0) @Max(3)` on `correctAnswerIndex`)
    - `AssignRequest` (`studentIds`, `batchName`)
    - `AssignResponse` (`assigned`, `skippedIds`, `alreadyAssigned`)
    - `StudentAssessmentDTO` (`studentAssessmentId`, `assessmentId`, `title`, `type`, `status`, `scheduledAt`, `timeLimitMinutes`)
    - `AssessmentDetailDTO` (full details including `problemStatement`, `videoLink`, `scheduledAt`)
    - `QuestionStudentDTO` (`questionId`, `prompt`, `optionA`, `optionB`, `optionC`, `optionD` — NO `correctAnswerIndex`)
    - `QuestionDTO` (admin-facing, includes `correctAnswerIndex`)
    - `AssessmentDTO` (admin-facing summary)
    - `McqSubmitRequest` (list of `AnswerDTO` with `questionId`, `selectedIndex`)
    - `MachineSubmitRequest` (`@Size(min=10) String solutionText`)
    - `SubmitResponse` (`score`, `total`, `status`)
    - `ResultDTO` (`studentAssessmentId`, `studentName`, `studentEmail`, `status`, `score`, `total`, `solutionText`, `scheduledAt`, `submittedAt`)
    - `UpdateStatusRequest` (`AssessmentStatus status`)
  - _Requirements: 1.1, 2.1, 3.1, 4.3, 5.1, 5.4, 5.8, 6.3, 8.1_

- [x] 5. Implement `AssessmentService`
  - [x] 5.1 Implement assessment CRUD methods: `createAssessment`, `getAssessments`, `getAssessmentById`, `deleteAssessment`
    - `createAssessment`: validate type-specific required fields (scheduledAt+videoLink for MOCK_INTERVIEW, problemStatement≥20 for MACHINE_TEST, timeLimitMinutes in [1,180] for MCQ/APTITUDE), throw `InvalidAssessmentTypeOperationException` or return 400 on violation
    - `deleteAssessment`: throw `AssessmentNotFoundException` if not found
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

  - [ ]* 5.2 Write property test for MOCK_INTERVIEW creation validation (Property 1)
    - **Property 1: MOCK_INTERVIEW creation requires scheduledAt and videoLink**
    - **Validates: Requirements 1.2, 1.5**

  - [ ]* 5.3 Write property test for MACHINE_TEST problemStatement length (Property 2)
    - **Property 2: MACHINE_TEST creation requires problemStatement of at least 20 characters**
    - **Validates: Requirements 1.3, 1.5**

  - [ ]* 5.4 Write property test for MCQ/APTITUDE timeLimitMinutes range (Property 3)
    - **Property 3: MCQ/APTITUDE creation requires timeLimitMinutes in [1, 180]**
    - **Validates: Requirements 1.4, 1.5**

  - [x] 5.5 Implement question management methods: `addQuestion`, `deleteQuestion`
    - `addQuestion`: throw `InvalidAssessmentTypeOperationException` if assessment type is MOCK_INTERVIEW or MACHINE_TEST
    - Validate `correctAnswerIndex` in [0, 3]
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 5.6 Write property test for question-type restriction (Property 7)
    - **Property 7: Questions can only be added to MCQ/APTITUDE assessments**
    - **Validates: Requirements 2.2, 2.3**

  - [ ]* 5.7 Write property test for correctAnswerIndex range (Property 8)
    - **Property 8: correctAnswerIndex must be in range [0, 3]**
    - **Validates: Requirements 2.3, 2.4**

  - [x] 5.8 Implement assignment methods: `assignAssessment`, `getAssignedStudents`
    - Resolve by `studentIds` or `batchName` via `StudentInternshipRepository.findByPlanName`
    - Skip non-existent IDs into `skippedIds`; skip already-assigned into `alreadyAssigned`
    - Set initial status: `UPCOMING` for MOCK_INTERVIEW, `PENDING` for all others
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 5.9 Write property test for individual assignment count (Property 10)
    - **Property 10: Individual assignment creates exactly the right StudentAssessment records**
    - **Validates: Requirements 3.1, 3.3, 3.4**

  - [ ]* 5.10 Write property test for duplicate assignment idempotency (Property 12)
    - **Property 12: Duplicate assignment is idempotent**
    - **Validates: Requirements 3.4**

  - [ ]* 5.11 Write property test for initial status correctness (Property 13)
    - **Property 13: Initial StudentAssessment status is correct for each assessment type**
    - **Validates: Requirements 3.5, 3.6, 3.7**

  - [x] 5.12 Implement student-facing methods: `getStudentAssessments`, `getAssessmentForStudent`, `getQuestionsForStudent`
    - `getStudentAssessments`: return empty list if `paymentStatus != FULL`
    - `getAssessmentForStudent`: verify ownership, throw `AssessmentAccessDeniedException` if not owner
    - `getQuestionsForStudent`: map to `QuestionStudentDTO` (no `correctAnswerIndex`), verify ownership
    - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.9, 6.1, 10.1, 10.2, 10.3, 10.4_

  - [ ]* 5.13 Write property test for payment gate (Property 14)
    - **Property 14: Payment gate — non-FULL students receive empty assessment list**
    - **Validates: Requirements 4.1, 4.2, 10.2**

  - [ ]* 5.14 Write property test for correctAnswerIndex exclusion (Property 16)
    - **Property 16: correctAnswerIndex is never present in student-facing question responses**
    - **Validates: Requirements 5.1, 10.4**

  - [x] 5.15 Implement submission methods: `submitAssessment`, `updateStudentAssessmentStatus`
    - `submitAssessment`: check for existing `Submission` → throw `AssessmentAlreadySubmittedException` (HTTP 409) if found
    - For MCQ/APTITUDE: calculate score by comparing `selectedIndex` to `correctAnswerIndex`
    - For MACHINE_TEST: validate `solutionText.length() >= 10`
    - Set `StudentAssessment.status = COMPLETED` after successful submission
    - _Requirements: 5.4, 5.5, 5.6, 5.7, 5.8, 6.3, 6.4, 6.5, 6.6, 10.5_

  - [ ]* 5.16 Write property test for MCQ score calculation (Property 17)
    - **Property 17: MCQ score calculation is correct**
    - **Validates: Requirements 5.6, 5.8**

  - [ ]* 5.17 Write property test for re-submission rejection (Property 19)
    - **Property 19: Re-submission is rejected with HTTP 409**
    - **Validates: Requirements 5.7, 6.6, 10.5**

  - [ ]* 5.18 Write property test for cross-student access denial (Property 20)
    - **Property 20: Students cannot access assessments not assigned to them**
    - **Validates: Requirements 5.9, 10.1, 10.3**

  - [ ]* 5.19 Write property test for machine test solution minimum length (Property 21)
    - **Property 21: Machine test solution minimum length is enforced**
    - **Validates: Requirements 6.3, 6.4**

  - [x] 5.20 Implement admin results methods: `getResults`, `getAllStudentAssessments`
    - `getResults`: return `List<ResultDTO>` for all `StudentAssessment` records for an assessment
    - `getAllStudentAssessments`: filterable by `assessmentType` and `assessmentStatus` query params
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.7_

- [x] 6. Checkpoint — Ensure all backend service tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement backend controllers
  - [x] 7.1 Implement `AdminAssessmentController` at `/api/admin/assessments`
    - `POST /` → `createAssessment`
    - `GET /` → `getAssessments` (paginated, use `Pageable`)
    - `GET /{assessmentId}` → `getAssessmentById`
    - `DELETE /{assessmentId}` → `deleteAssessment`
    - `POST /{assessmentId}/questions` → `addQuestion`
    - `DELETE /{assessmentId}/questions/{questionId}` → `deleteQuestion`
    - `POST /{assessmentId}/assign` → `assignAssessment`
    - `GET /{assessmentId}/students` → `getAssignedStudents`
    - `GET /{assessmentId}/results` → `getResults`
    - Annotate with `@RestController`, `@RequestMapping`, `@PreAuthorize("hasRole('ADMIN')")` or rely on SecurityConfig
    - _Requirements: 1.1, 1.6, 1.7, 1.8, 2.1, 2.5, 3.1, 3.8, 8.1_

  - [x] 7.2 Implement `AdminStudentAssessmentController` at `/api/admin/student-assessments`
    - `GET /` → `getAllStudentAssessments` with optional `assessmentType` and `assessmentStatus` query params
    - `PUT /{studentAssessmentId}/status` → `updateStudentAssessmentStatus`
    - _Requirements: 7.5, 7.6, 8.7_

  - [x] 7.3 Implement `StudentAssessmentController` at `/api/student/assessments`
    - Extract student email from `Authentication` principal (same pattern as `StudentDashboardController`)
    - `GET /` → `getStudentAssessments`
    - `GET /{studentAssessmentId}` → `getAssessmentForStudent`
    - `GET /{studentAssessmentId}/questions` → `getQuestionsForStudent`
    - `POST /{studentAssessmentId}/submit` → `submitAssessment` (accepts `McqSubmitRequest` or `MachineSubmitRequest` based on type)
    - _Requirements: 4.1, 5.1, 5.4, 6.1, 6.3, 10.1, 10.2, 10.3_

- [x] 8. Checkpoint — Ensure all backend controller tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement Angular services
  - [x] 9.1 Create `AssessmentService` in `frontend/src/app/services/`
    - `getMyAssessments()` → `GET /api/student/assessments`
    - `getAssessmentDetail(saId)` → `GET /api/student/assessments/{saId}`
    - `getQuestions(saId)` → `GET /api/student/assessments/{saId}/questions`
    - `submitTest(saId, answers)` → `POST /api/student/assessments/{saId}/submit`
    - `submitMachineTest(saId, solution)` → `POST /api/student/assessments/{saId}/submit`
    - Use `environment.apiUrl` and inject `HttpClient`
    - _Requirements: 4.1, 5.1, 5.4, 6.1, 6.3_

  - [x] 9.2 Create `AdminAssessmentService` in `frontend/src/app/services/`
    - `createAssessment(req)`, `listAssessments()`, `getAssessment(id)`, `deleteAssessment(id)`
    - `addQuestion(assessmentId, req)`, `deleteQuestion(assessmentId, questionId)`
    - `assignAssessment(assessmentId, req)`, `getResults(assessmentId)`
    - `updateStudentAssessmentStatus(saId, status)`
    - _Requirements: 1.1, 2.1, 3.1, 7.6, 8.1_

- [x] 10. Create Angular DTO interfaces
  - Create `assessment.models.ts` (or extend existing `dtos.ts`) with TypeScript interfaces matching backend DTOs:
    - `StudentAssessmentDTO`, `AssessmentDetailDTO`, `QuestionStudentDTO`, `McqSubmitRequest`, `MachineSubmitRequest`, `SubmitResponse`, `ResultDTO`, `AssignRequest`, `AssignResponse`, `CreateAssessmentRequest`, `CreateQuestionRequest`
  - _Requirements: 4.3, 5.1, 5.8, 8.1_

- [x] 11. Implement `TimerComponent`
  - Create `TimerComponent` in `frontend/src/app/components/timer/`
  - Input: `@Input() totalMinutes: number`
  - Output: `@Output() timerExpired = new EventEmitter<void>()`
  - Displays countdown as `MM:SS`, uses `setInterval`, clears on `ngOnDestroy`
  - Emits `timerExpired` when countdown reaches zero
  - _Requirements: 5.2, 5.5_

- [x] 12. Implement `AssessmentListComponent`
  - Create `AssessmentListComponent` in `frontend/src/app/components/assessment-list/`
  - Embedded in `StudentDashboardComponent` (not a routed page)
  - Calls `AssessmentService.getMyAssessments()` on init
  - Shows "Complete your payment to unlock assessments" when list is empty due to payment gate
  - Renders assessment cards with title, type, color-coded status badge (PENDING=yellow, UPCOMING=blue, COMPLETED=green)
  - Shows score for COMPLETED MCQ/aptitude; shows scheduled date for UPCOMING mock interview
  - "Start Test" button for PENDING MCQ/aptitude → navigates to `/student/assessments/:id/take`
  - "View Problem" button for PENDING machine test → navigates to `/student/assessments/:id/machine`
  - "Join Interview" button for UPCOMING mock interview → navigates to `/student/assessments/:id/interview`
  - No action buttons for COMPLETED assessments
  - _Requirements: 4.4, 4.5, 4.6, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 13. Implement `McqTestComponent`
  - Create `McqTestComponent` in `frontend/src/app/components/mcq-test/`
  - Route: `/student/assessments/:id/take`
  - Loads questions via `AssessmentService.getQuestions(saId)` and assessment detail for `timeLimitMinutes`
  - Embeds `TimerComponent`; on `(timerExpired)` auto-submits with current answers
  - Renders each question with radio buttons for options A–D
  - Submit button disabled until at least one answer is selected
  - On submit: calls `AssessmentService.submitTest(saId, answers)`, shows score result
  - Handles HTTP 409 (already submitted) gracefully
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7, 5.8_

- [x] 14. Implement `MachineTestComponent`
  - Create `MachineTestComponent` in `frontend/src/app/components/machine-test/`
  - Route: `/student/assessments/:id/machine`
  - Loads assessment detail via `AssessmentService.getAssessmentDetail(saId)` to display `problemStatement`
  - Textarea for solution input; submit button disabled when textarea is empty
  - On submit: calls `AssessmentService.submitMachineTest(saId, solution)`, shows confirmation
  - Handles HTTP 409 (already submitted) gracefully
  - _Requirements: 6.1, 6.2, 6.3, 6.6_

- [x] 15. Implement `MockInterviewComponent`
  - Create `MockInterviewComponent` in `frontend/src/app/components/mock-interview/`
  - Route: `/student/assessments/:id/interview`
  - Loads assessment detail to display `scheduledAt` and `videoLink`
  - "Join Interview" button opens `videoLink` in a new tab (`window.open(url, '_blank')`)
  - Displays camera/microphone access notice
  - Shows countdown to interview time when `scheduledAt` is in the future
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 16. Implement `AdminAssessmentsComponent`
  - Create `AdminAssessmentsComponent` in `frontend/src/app/components/admin-assessments/`
  - Route: `/admin/assessments`
  - Lists all assessments via `AdminAssessmentService.listAssessments()`
  - Form to create a new assessment (type selector drives which additional fields appear)
  - Delete button per assessment row
  - Each row links to `/admin/assessments/:id`
  - _Requirements: 1.1, 1.6, 1.8, 8.5_

- [x] 17. Implement `AdminAssessmentDetailComponent`
  - Create `AdminAssessmentDetailComponent` in `frontend/src/app/components/admin-assessment-detail/`
  - Route: `/admin/assessments/:id`
  - Loads assessment detail including questions via `AdminAssessmentService.getAssessment(id)`
  - For MCQ/APTITUDE: form to add questions (prompt, 4 options, correct answer index); list existing questions with delete button
  - Assign section: input for batch name or comma-separated student IDs; shows `AssignResponse` feedback
  - Results table: student name, email, status, score/solution depending on type
  - Admin can update `StudentAssessment` status via `AdminAssessmentService.updateStudentAssessmentStatus`
  - _Requirements: 2.1, 2.5, 3.1, 3.2, 7.6, 8.1, 8.2, 8.3, 8.4, 8.6_

- [x] 18. Wire Angular components into AppModule and AppRoutingModule
  - Declare all new components in `AppModule.declarations`: `AssessmentListComponent`, `McqTestComponent`, `MachineTestComponent`, `MockInterviewComponent`, `TimerComponent`, `AdminAssessmentsComponent`, `AdminAssessmentDetailComponent`
  - Add routes to `AppRoutingModule`:
    - `{ path: 'student/assessments/:id/take', component: McqTestComponent, canActivate: [StudentAuthGuard] }`
    - `{ path: 'student/assessments/:id/machine', component: MachineTestComponent, canActivate: [StudentAuthGuard] }`
    - `{ path: 'student/assessments/:id/interview', component: MockInterviewComponent, canActivate: [StudentAuthGuard] }`
    - `{ path: 'admin/assessments', component: AdminAssessmentsComponent, canActivate: [AuthGuard] }`
    - `{ path: 'admin/assessments/:id', component: AdminAssessmentDetailComponent, canActivate: [AuthGuard] }`
  - Embed `<app-assessment-list>` in `student-dashboard.component.html`
  - _Requirements: 4.4, 5.2, 6.2, 7.1, 8.5_

- [x] 19. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use jqwik (`@Property(tries = 100)`) on the backend; Angular component tests use Jasmine/Karma
- `QuestionStudentDTO` intentionally omits `correctAnswerIndex` — never expose it to student endpoints
- The existing `SecurityConfig` already covers all new endpoints via `/api/admin/**` and `/api/student/**` rules — no changes needed
- MCQ timer enforcement is client-side (auto-submit on expiry); server-side idempotency guard prevents double-scoring
