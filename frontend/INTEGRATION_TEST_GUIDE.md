# Integration Test Guide - Complete User Flows

## Overview

This document describes the comprehensive integration tests created for Task 26.3 to verify all complete user flows in the WebVibes Technology website.

## Test File Location

`frontend/src/app/integration/user-flows.spec.ts`

## Test Coverage

### 1. Navigation Flow Tests
**Validates: Requirements 7.1, 7.3, 7.4**

- ✅ Navigate from home to all pages (About, Internship, Courses, Projects, Contact)
- ✅ Verify each route change updates the URL correctly
- ✅ Verify empty path redirects to home page
- ✅ Verify navigation component remains visible across all pages

### 2. Internship Application Flow Tests
**Validates: Requirements 3.1-3.4, 8.1-8.3, 16.1-16.5**

- ✅ Complete internship application submission successfully
  - Select an internship (Java or Web Development)
  - Fill out application form with valid data
  - Submit form and verify HTTP POST request
  - Verify success message display
  - Verify form reset after submission

- ✅ Handle validation errors in internship application
  - Test with invalid student name (too short)
  - Test with invalid email format
  - Test with invalid phone number
  - Verify form validation prevents submission

- ✅ Handle server errors during internship application
  - Simulate 500 Internal Server Error
  - Verify error message display
  - Verify form state preservation

### 3. Course Enrollment Flow Tests
**Validates: Requirements 4.1-4.6, 9.1-9.3, 16.1-16.5**

- ✅ Complete course enrollment submission successfully
  - Select a course (Java, Spring Boot, Angular, or Full Stack)
  - Fill out enrollment form with valid data
  - Submit form and verify HTTP POST request
  - Verify success message display
  - Verify form reset after submission

- ✅ Handle validation errors in course enrollment
  - Test with empty student name
  - Test with invalid email format
  - Test with non-numeric phone number
  - Verify form validation prevents submission

- ✅ Handle server errors during course enrollment
  - Simulate 400 Bad Request (validation error from backend)
  - Verify error message display
  - Verify form state preservation

### 4. Contact Form Flow Tests
**Validates: Requirements 6.1-6.6, 10.1-10.3, 16.1-16.5**

- ✅ Complete contact form submission successfully
  - Fill out contact form with valid data
  - Submit form and verify HTTP POST request
  - Verify success message display
  - Verify form reset after submission

- ✅ Handle validation errors in contact form
  - Test with name too short (< 2 characters)
  - Test with invalid email format
  - Test with message too short (< 10 characters)
  - Verify form validation prevents submission

- ✅ Handle server errors during contact form submission
  - Simulate 500 Internal Server Error
  - Verify error message display
  - Verify form state preservation

### 5. Project Display Flow Tests
**Validates: Requirements 5.1-5.4, 11.4-11.5**

- ✅ Load and display projects from database
  - Verify HTTP GET request to /api/projects
  - Verify all projects are displayed with complete information
  - Verify loading state management
  - Verify error state is cleared on success

- ✅ Display message when no projects are available
  - Simulate empty project list response
  - Verify component handles empty state correctly

- ✅ Handle errors when loading projects
  - Simulate 500 Internal Server Error
  - Verify error message display
  - Verify loading state is cleared

- ✅ Verify GitHub links open in new tab
  - Verify links have target="_blank" attribute
  - Ensures external links don't navigate away from application

### 6. Complete User Journey Test
**Validates: All requirements - simulates a complete user session**

- ✅ Full user journey from home to multiple submissions
  1. Start at home page
  2. Navigate to about page
  3. Navigate to courses page and enroll in a course
  4. Navigate to internship page and apply for internship
  5. Navigate to projects page and view student projects
  6. Navigate to contact page and submit contact form
  7. Verify all submissions succeed
  8. Verify all navigation works correctly

## Running the Tests

### Run All Tests
```bash
cd frontend
npm test
```

### Run Only Integration Tests
```bash
cd frontend
ng test --include='**/user-flows.spec.ts'
```

### Run Tests in Headless Mode (CI/CD)
```bash
cd frontend
ng test --watch=false --browsers=ChromeHeadless
```

## Test Results Expected

All tests should pass with the following outcomes:

1. **Navigation Tests**: All routes should be accessible and URL should update correctly
2. **Form Submission Tests**: Valid data should be sent to backend, success messages should display
3. **Validation Tests**: Invalid data should be caught by frontend validation
4. **Error Handling Tests**: Server errors should be caught and displayed to user
5. **Project Display Tests**: Projects should load from backend and display correctly
6. **Complete Journey Test**: User should be able to complete entire flow without errors

## Manual Testing Checklist

In addition to automated tests, perform these manual tests:

### Navigation Testing
- [ ] Click each navigation link and verify page loads
- [ ] Verify navigation bar is visible on all pages
- [ ] Test responsive navigation (hamburger menu on mobile)
- [ ] Verify active route is highlighted in navigation

### Internship Application Testing
- [ ] Click "Apply" button on each internship card
- [ ] Fill out form with valid data and submit
- [ ] Verify success message appears
- [ ] Try submitting with invalid data (empty fields, bad email, etc.)
- [ ] Verify validation error messages appear
- [ ] Test form cancel button

### Course Enrollment Testing
- [ ] Click "Enroll" button on each course card
- [ ] Fill out form with valid data and submit
- [ ] Verify success message appears
- [ ] Try submitting with invalid data
- [ ] Verify validation error messages appear
- [ ] Test form cancel button

### Contact Form Testing
- [ ] Fill out contact form with valid data and submit
- [ ] Verify success message appears
- [ ] Try submitting with invalid data
- [ ] Verify validation error messages appear
- [ ] Test WhatsApp and Email buttons

### Project Display Testing
- [ ] Verify projects load and display
- [ ] Click GitHub links and verify they open in new tab
- [ ] Verify project images display correctly
- [ ] Test with no projects in database

### Responsive Design Testing
- [ ] Test all pages on mobile viewport (< 768px)
- [ ] Test all pages on tablet viewport (768px - 991px)
- [ ] Test all pages on desktop viewport (> 992px)
- [ ] Verify forms are usable on mobile devices
- [ ] Verify buttons are touch-friendly (min 44px height)

### End-to-End Flow Testing
- [ ] Complete entire user journey: Home → About → Courses → Enroll → Internship → Apply → Projects → Contact
- [ ] Verify all forms submit successfully
- [ ] Verify all navigation works smoothly
- [ ] Verify no console errors appear

## Backend Integration Requirements

For these tests to pass with a real backend:

1. **Backend must be running** on `http://localhost:8080`
2. **Database must be accessible** with proper schema
3. **CORS must be configured** to allow requests from `http://localhost:4200`
4. **All API endpoints must be functional**:
   - POST /api/internships/apply
   - POST /api/courses/enroll
   - POST /api/contact
   - GET /api/projects

## Test Data

The tests use the following test data:

### Internship Application
```json
{
  "studentName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "internshipType": "Java Internship",
  "message": "I am very interested in this internship program."
}
```

### Course Enrollment
```json
{
  "studentName": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "phone": "5551234567",
  "courseName": "Spring Boot",
  "message": "Excited to learn Spring Boot framework."
}
```

### Contact Message
```json
{
  "name": "Charlie Brown",
  "email": "charlie.brown@example.com",
  "message": "I would like to know more about your courses and internship programs."
}
```

### Project Data
```json
[
  {
    "id": 1,
    "title": "E-Commerce Platform",
    "description": "A full-stack e-commerce application built with Angular and Spring Boot",
    "githubLink": "https://github.com/student1/ecommerce",
    "imageUrl": "https://example.com/images/ecommerce.jpg"
  }
]
```

## Troubleshooting

### Tests Fail with "Cannot connect to backend"
- Ensure backend is running on port 8080
- Check CORS configuration in backend
- Verify environment.ts has correct API URL

### Tests Fail with "Validation errors"
- Check that form validators match backend validation rules
- Verify DTO field names match between frontend and backend

### Tests Fail with "Component not found"
- Ensure all components are declared in test module
- Check import paths are correct

### Tests Timeout
- Increase Jasmine timeout in karma.conf.js
- Check for infinite loops or unresolved promises

## Success Criteria

Task 26.3 is complete when:

✅ All integration tests pass
✅ Navigation between all pages works correctly
✅ Internship application submission works end-to-end
✅ Course enrollment submission works end-to-end
✅ Contact form submission works end-to-end
✅ Project display from database works correctly
✅ Error handling works for all forms
✅ Validation works for all forms
✅ Complete user journey test passes

## Notes

- These tests use `HttpClientTestingModule` to mock HTTP requests
- Tests do not require a running backend server
- Tests verify both success and error scenarios
- Tests cover validation at the frontend level
- Tests verify proper error message display
- Tests ensure forms reset after successful submission
