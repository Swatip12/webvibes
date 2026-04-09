# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Empty Success Response Sets paymentGated True
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface a counterexample demonstrating that `paymentGated` is incorrectly set to `true` when `getMyAssessments()` returns an empty HTTP 200
  - **Scoped PBT Approach**: Scope the property to the concrete failing case — mock `getMyAssessments()` returning `of([])` (empty array, HTTP 200 success)
  - Create `frontend/src/app/components/assessment-list/assessment-list.component.spec.ts`
  - Set up `AssessmentListComponent` test bed with a mock `AssessmentService` and `Router`
  - Write property-based test: for all empty-array HTTP 200 responses, `paymentGated` MUST be `false` after `loadAssessments()` completes
  - Concrete case: mock `getMyAssessments()` returns `of([])`, call `loadAssessments()`, assert `component.paymentGated === false`
  - Run test on UNFIXED code (`this.paymentGated = data.length === 0`)
  - **EXPECTED OUTCOME**: Test FAILS with `paymentGated` being `true` instead of `false` — this proves the bug exists
  - Document counterexample: `getMyAssessments()` returns `[]` → `paymentGated` is `true` (wrong)
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Bug-Condition Paths Behave Correctly
  - **IMPORTANT**: Follow observation-first methodology — observe actual behavior on UNFIXED code for non-buggy inputs
  - Observe: mock returns HTTP 403 → `paymentGated === true`, `errorMessage === ''` on unfixed code
  - Observe: mock returns HTTP 500 → `paymentGated === false`, `errorMessage === 'Failed to load assessments. Please try again.'` on unfixed code
  - Observe: mock returns `[assessment]` (non-empty) → `paymentGated === false`, `assessments.length === 1` on unfixed code
  - Write property-based test: for any non-empty array returned with HTTP 200, `paymentGated` is always `false` (isBugCondition is false when `data.length > 0`)
  - Write unit test: HTTP 403 → `paymentGated === true`, `errorMessage === ''`
  - Write unit test: HTTP 500 → `paymentGated === false`, `errorMessage` set to generic string
  - Write unit test: `isLoading` is `false` after both success and error paths complete
  - Run all preservation tests on UNFIXED code
  - **EXPECTED OUTCOME**: All preservation tests PASS (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 3. Fix: empty HTTP 200 response no longer sets paymentGated to true

  - [x] 3.1 Implement the fix in assessment-list.component.ts
    - In `loadAssessments()` success handler, replace `this.paymentGated = data.length === 0` with `this.paymentGated = false`
    - This is the complete change — the error handler already correctly sets `paymentGated = true` only on 403
    - _Bug_Condition: isBugCondition(input) where input.status === 200 AND input.body.length === 0 AND student.paymentStatus === 'FULL'_
    - _Expected_Behavior: paymentGated === false, assessments === [], errorMessage === '' for any HTTP 200 response_
    - _Preservation: 403 still sets paymentGated = true; non-403 errors still set errorMessage; non-empty success still populates assessments_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Empty Success Response Does Not Gate Payment
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - The test from task 1 encodes the expected behavior: `paymentGated === false` after empty HTTP 200
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed — `paymentGated` is now `false`)
    - _Requirements: 2.1_

  - [x] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Bug-Condition Paths Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run all preservation property tests from step 2
    - **EXPECTED OUTCOME**: All tests PASS (confirms no regressions in 403 gate, error handling, and non-empty success paths)
    - Confirm `paymentGated` is still `true` on 403, `errorMessage` is still set on non-403 errors, assessments still populate on non-empty success

- [x] 4. Checkpoint - Ensure all tests pass
  - Run the full `assessment-list.component.spec.ts` suite
  - Ensure all tests pass; ask the user if any questions arise
