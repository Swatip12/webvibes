# Assessment Unlock After Full Payment Bugfix Design

## Overview

A fully-paid student with no assessments yet assigned sees a "Complete your payment to unlock assessments" lock message instead of an empty state. The root cause is a single line in `loadAssessments()` that conflates an empty HTTP 200 response with a payment-gated 403 response. The fix is a one-line change: unconditionally set `paymentGated = false` on success, leaving the error handler as the sole place that sets it to `true`.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug — `loadAssessments()` receives an HTTP 200 with an empty array while the student has FULL payment status
- **Property (P)**: The desired behavior — `paymentGated` remains `false` and no lock message is shown when the API succeeds
- **Preservation**: The existing 403-triggered gate and generic error message behavior that must remain unchanged
- **loadAssessments**: The method in `frontend/src/app/components/assessment-list/assessment-list.component.ts` that fetches the student's assigned assessments and sets component state
- **paymentGated**: The boolean flag that controls whether the payment lock UI is displayed

## Bug Details

### Bug Condition

The bug manifests when `loadAssessments()` receives a successful HTTP 200 response containing an empty array. The success handler incorrectly infers payment status from array length rather than from the HTTP status code.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type HttpResponse<StudentAssessmentDTO[]>
  OUTPUT: boolean

  RETURN input.status === 200
         AND input.body.length === 0
         AND student.paymentStatus === 'FULL'
END FUNCTION
```

### Examples

- Student has FULL payment, no assessments assigned yet → API returns `[]` (HTTP 200) → bug sets `paymentGated = true` → lock message shown (wrong)
- Student has FULL payment, 1 assessment assigned → API returns `[{...}]` (HTTP 200) → `data.length === 0` is false → no lock message (accidentally correct)
- Student has PARTIAL/no payment → API returns HTTP 403 → error handler sets `paymentGated = true` → lock message shown (correct, must be preserved)
- API returns HTTP 500 → error handler sets `errorMessage` → generic error shown (correct, must be preserved)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- A 403 response from the API MUST continue to set `paymentGated = true` and show the lock message
- A non-403 error response MUST continue to set `errorMessage` and show the generic error
- Assessment cards MUST continue to render correctly when the API returns a non-empty array

**Scope:**
All code paths that do NOT involve a successful HTTP 200 with an empty array are completely unaffected by this fix. This includes:
- The error handler (403 and non-403 paths)
- The success handler when `data.length > 0`
- All other component methods (`startTest`, `viewProblem`, `joinInterview`, etc.)

## Hypothesized Root Cause

The success handler uses array length as a proxy for payment status:

```typescript
// BUGGY
next: (data) => {
  this.assessments = data;
  this.paymentGated = data.length === 0;  // ← wrong signal
  this.isLoading = false;
}
```

An empty array is a valid business state (paid student, no assessments assigned yet). Payment status is already correctly communicated by the backend via HTTP 403 — the frontend should rely solely on that signal.

## Correctness Properties

Property 1: Bug Condition - Empty Success Response Does Not Gate Payment

_For any_ HTTP 200 response from `getMyAssessments()`, the fixed `loadAssessments()` SHALL set `paymentGated = false` regardless of whether the returned array is empty or non-empty.

**Validates: Requirements 2.1**

Property 2: Preservation - 403 Still Triggers Payment Gate

_For any_ HTTP 403 error response from `getMyAssessments()`, the fixed `loadAssessments()` SHALL set `paymentGated = true`, preserving the existing payment gate behavior for unpaid students.

**Validates: Requirements 2.2, 3.2**

Property 3: Preservation - Non-403 Errors Still Show Generic Message

_For any_ non-403 error response from `getMyAssessments()`, the fixed `loadAssessments()` SHALL set `errorMessage` to the generic error string and leave `paymentGated = false`, preserving existing error handling.

**Validates: Requirements 3.3**

## Fix Implementation

### Changes Required

**File**: `frontend/src/app/components/assessment-list/assessment-list.component.ts`

**Function**: `loadAssessments()`

**Specific Changes**:

1. **Success handler — remove length check**: Replace `this.paymentGated = data.length === 0` with `this.paymentGated = false`

That is the complete change. The error handler already correctly sets `paymentGated = true` only on 403 and requires no modification.

**Before:**
```typescript
next: (data) => {
  this.assessments = data;
  this.paymentGated = data.length === 0;
  this.isLoading = false;
}
```

**After:**
```typescript
next: (data) => {
  this.assessments = data;
  this.paymentGated = false;
  this.isLoading = false;
}
```

## Testing Strategy

### Validation Approach

Two-phase approach: first run exploratory tests against the unfixed code to confirm the bug and root cause, then verify the fix satisfies all correctness properties and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface a counterexample demonstrating the bug on unfixed code. Confirm that `paymentGated` is incorrectly set to `true` when the API returns an empty HTTP 200.

**Test Plan**: Mock `getMyAssessments()` to return an empty observable (`of([])`), call `loadAssessments()`, and assert `paymentGated === false`. This test WILL FAIL on unfixed code, confirming the root cause.

**Test Cases**:
1. **Empty 200 response test**: Mock returns `[]` → assert `paymentGated === false` (fails on unfixed code)
2. **Non-empty 200 response test**: Mock returns `[assessment]` → assert `paymentGated === false` (passes on both, sanity check)

**Expected Counterexamples**:
- `paymentGated` is `true` after a successful empty response — confirms the `data.length === 0` line is the root cause

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL response WHERE isBugCondition(response) DO
  result := loadAssessments_fixed(response)
  ASSERT result.paymentGated === false
  ASSERT result.assessments.length === 0
  ASSERT result.errorMessage === ''
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL response WHERE NOT isBugCondition(response) DO
  ASSERT loadAssessments_original(response) = loadAssessments_fixed(response)
END FOR
```

**Testing Approach**: The non-buggy paths (403 error, non-403 error, non-empty success) are simple enough for direct unit tests. Property-based testing can generate random non-empty arrays to confirm preservation across varied data.

**Test Cases**:
1. **403 preservation**: Mock returns HTTP 403 → assert `paymentGated === true`, `errorMessage === ''`
2. **Non-403 error preservation**: Mock returns HTTP 500 → assert `paymentGated === false`, `errorMessage` is set
3. **Non-empty success preservation**: Mock returns `[assessment1, assessment2]` → assert `assessments.length === 2`, `paymentGated === false`

### Unit Tests

- Empty HTTP 200 → `paymentGated === false`, `assessments === []`, `errorMessage === ''`
- Non-empty HTTP 200 → `paymentGated === false`, `assessments` populated
- HTTP 403 → `paymentGated === true`, `errorMessage === ''`
- HTTP 500 → `paymentGated === false`, `errorMessage` set to generic string
- `isLoading` is `false` after both success and error paths

### Property-Based Tests

- For any array of `StudentAssessmentDTO` returned with HTTP 200, `paymentGated` is always `false`
- For any HTTP 403 error, `paymentGated` is always `true` regardless of prior state
- For any non-403 HTTP error, `errorMessage` is always the generic string and `paymentGated` is always `false`

### Integration Tests

- Full student dashboard flow: FULL-payment student with no assessments sees empty state (no lock icon)
- Full student dashboard flow: FULL-payment student with assessments sees assessment cards
- Full student dashboard flow: unpaid student receives 403 and sees lock message
