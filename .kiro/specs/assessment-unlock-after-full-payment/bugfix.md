# Bugfix Requirements Document

## Introduction

Students who have completed full payment (paymentStatus = FULL) incorrectly see the "Complete your payment to unlock assessments" lock message in the My Assessments section of their dashboard. This happens because `assessment-list.component.ts` sets `paymentGated = true` whenever the API returns an empty array, conflating "no assessments assigned yet" with "payment not complete". The fix ensures the payment gate is only triggered by a 403 HTTP error from the backend, not by an empty successful response.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a student with FULL payment status has no assessments assigned AND the API returns an empty array (HTTP 200) THEN the system sets `paymentGated = true` and displays "Complete your payment to unlock assessments"

1.2 WHEN a student with FULL payment status has no assessments assigned THEN the system incorrectly treats an empty successful response as a payment gate condition

### Expected Behavior (Correct)

2.1 WHEN the API returns an empty array (HTTP 200) for a student with FULL payment status THEN the system SHALL set `paymentGated = false` and display no lock message

2.2 WHEN the API returns a 403 HTTP error THEN the system SHALL set `paymentGated = true` and display the payment lock message

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a student with FULL payment status has assessments assigned THEN the system SHALL CONTINUE TO display the assessment cards correctly

3.2 WHEN a student without FULL payment status attempts to load assessments and receives a 403 THEN the system SHALL CONTINUE TO display the payment lock message

3.3 WHEN the API returns a non-403 error THEN the system SHALL CONTINUE TO display the generic error message "Failed to load assessments. Please try again."
