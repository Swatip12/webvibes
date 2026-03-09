# Manual Testing Checklist - Task 26.3

## Complete User Flows Testing

This checklist covers manual testing for all user flows in the WebVibes Technology website.

---

## Prerequisites

- [ ] Backend server is running on `http://localhost:8080`
- [ ] Frontend server is running on `http://localhost:4200`
- [ ] Database is accessible and contains sample project data
- [ ] Browser developer tools are open (F12) to monitor console and network

---

## 1. Navigation Flow Testing

### Test: Navigate between all pages

**Steps:**
1. [ ] Open browser and navigate to `http://localhost:4200`
2. [ ] Verify home page loads successfully
3. [ ] Click "About" in navigation menu
   - [ ] Verify URL changes to `/about`
   - [ ] Verify About page content displays
4. [ ] Click "Internship" in navigation menu
   - [ ] Verify URL changes to `/internship`
   - [ ] Verify Internship page content displays
5. [ ] Click "Courses" in navigation menu
   - [ ] Verify URL changes to `/courses`
   - [ ] Verify Courses page content displays
6. [ ] Click "Projects" in navigation menu
   - [ ] Verify URL changes to `/projects`
   - [ ] Verify Projects page content displays
7. [ ] Click "Contact" in navigation menu
   - [ ] Verify URL changes to `/contact`
   - [ ] Verify Contact page content displays
8. [ ] Click "Home" in navigation menu
   - [ ] Verify URL changes to `/home`
   - [ ] Verify Home page content displays

**Expected Results:**
- ✅ All pages load without errors
- ✅ Navigation bar remains visible on all pages
- ✅ Active route is highlighted in navigation
- ✅ No console errors appear

---

## 2. Internship Application Flow Testing

### Test: Submit internship application successfully

**Steps:**
1. [ ] Navigate to Internship page (`/internship`)
2. [ ] Verify two internship cards are displayed:
   - [ ] Java Internship
   - [ ] Web Development Internship
3. [ ] Click "Apply" button on Java Internship card
4. [ ] Verify application form appears
5. [ ] Fill out the form:
   - [ ] Student Name: `John Doe`
   - [ ] Email: `john.doe@example.com`
   - [ ] Phone: `1234567890`
   - [ ] Internship Type: `Java Internship` (pre-filled)
   - [ ] Message: `I am very interested in this internship program.`
6. [ ] Click "Submit" button
7. [ ] Monitor Network tab in developer tools
   - [ ] Verify POST request to `/api/internships/apply`
   - [ ] Verify request payload contains form data
   - [ ] Verify response status is 201 Created
8. [ ] Verify success message appears: "Application submitted successfully!"
9. [ ] Verify form is reset/hidden after 3 seconds

**Expected Results:**
- ✅ Form displays correctly
- ✅ All fields accept input
- ✅ Submit button is enabled when form is valid
- ✅ HTTP request is sent successfully
- ✅ Success message displays
- ✅ Form resets after submission

### Test: Validate internship application form

**Steps:**
1. [ ] Navigate to Internship page
2. [ ] Click "Apply" on Web Development Internship
3. [ ] Try to submit empty form
   - [ ] Verify submit button is disabled
4. [ ] Enter invalid data:
   - [ ] Student Name: `J` (too short)
   - [ ] Email: `invalid-email` (no @ or domain)
   - [ ] Phone: `123` (too short)
5. [ ] Verify validation error messages appear:
   - [ ] "Student name must be at least 2 characters"
   - [ ] "Invalid email format"
   - [ ] "Phone number must be 10-15 digits"
6. [ ] Correct the errors and verify messages disappear
7. [ ] Verify submit button becomes enabled

**Expected Results:**
- ✅ Empty form cannot be submitted
- ✅ Validation errors display for invalid data
- ✅ Validation errors clear when data is corrected
- ✅ Submit button state reflects form validity

### Test: Handle server errors

**Steps:**
1. [ ] Stop the backend server
2. [ ] Navigate to Internship page
3. [ ] Fill out and submit application form
4. [ ] Verify error message appears
5. [ ] Restart backend server
6. [ ] Submit form again
7. [ ] Verify success message appears

**Expected Results:**
- ✅ Error message displays when backend is unavailable
- ✅ Form data is preserved after error
- ✅ Submission succeeds when backend is available

---

## 3. Course Enrollment Flow Testing

### Test: Submit course enrollment successfully

**Steps:**
1. [ ] Navigate to Courses page (`/courses`)
2. [ ] Verify four course cards are displayed:
   - [ ] Java
   - [ ] Spring Boot
   - [ ] Angular
   - [ ] Full Stack Development
3. [ ] Click "Enroll" button on Spring Boot course card
4. [ ] Verify enrollment form appears
5. [ ] Fill out the form:
   - [ ] Student Name: `Alice Johnson`
   - [ ] Email: `alice.johnson@example.com`
   - [ ] Phone: `5551234567`
   - [ ] Course Name: `Spring Boot` (pre-filled)
   - [ ] Message: `Excited to learn Spring Boot framework.`
6. [ ] Click "Submit" button
7. [ ] Monitor Network tab in developer tools
   - [ ] Verify POST request to `/api/courses/enroll`
   - [ ] Verify request payload contains form data
   - [ ] Verify response status is 201 Created
8. [ ] Verify success message appears: "Enrollment submitted successfully!"
9. [ ] Verify form is reset/hidden after 3 seconds

**Expected Results:**
- ✅ Form displays correctly
- ✅ All fields accept input
- ✅ Submit button is enabled when form is valid
- ✅ HTTP request is sent successfully
- ✅ Success message displays
- ✅ Form resets after submission

### Test: Validate course enrollment form

**Steps:**
1. [ ] Navigate to Courses page
2. [ ] Click "Enroll" on Angular course
3. [ ] Try to submit empty form
   - [ ] Verify submit button is disabled
4. [ ] Enter invalid data:
   - [ ] Student Name: (empty)
   - [ ] Email: `not-an-email`
   - [ ] Phone: `abc` (non-numeric)
5. [ ] Verify validation error messages appear
6. [ ] Correct the errors and verify messages disappear
7. [ ] Verify submit button becomes enabled

**Expected Results:**
- ✅ Empty form cannot be submitted
- ✅ Validation errors display for invalid data
- ✅ Validation errors clear when data is corrected
- ✅ Submit button state reflects form validity

---

## 4. Contact Form Flow Testing

### Test: Submit contact form successfully

**Steps:**
1. [ ] Navigate to Contact page (`/contact`)
2. [ ] Verify contact form is displayed
3. [ ] Verify WhatsApp and Email buttons are displayed
4. [ ] Fill out the form:
   - [ ] Name: `Charlie Brown`
   - [ ] Email: `charlie.brown@example.com`
   - [ ] Message: `I would like to know more about your courses and internship programs.`
5. [ ] Click "Submit" button
6. [ ] Monitor Network tab in developer tools
   - [ ] Verify POST request to `/api/contact`
   - [ ] Verify request payload contains form data
   - [ ] Verify response status is 201 Created
7. [ ] Verify success message appears: "Message sent successfully!"
8. [ ] Verify form is reset

**Expected Results:**
- ✅ Form displays correctly
- ✅ All fields accept input
- ✅ Submit button is enabled when form is valid
- ✅ HTTP request is sent successfully
- ✅ Success message displays
- ✅ Form resets after submission

### Test: Validate contact form

**Steps:**
1. [ ] Navigate to Contact page
2. [ ] Try to submit empty form
   - [ ] Verify submit button is disabled
3. [ ] Enter invalid data:
   - [ ] Name: `A` (too short)
   - [ ] Email: `bad@email` (invalid format)
   - [ ] Message: `Short` (less than 10 characters)
4. [ ] Verify validation error messages appear:
   - [ ] "Name must be at least 2 characters"
   - [ ] "Invalid email format"
   - [ ] "Message must be at least 10 characters"
5. [ ] Correct the errors and verify messages disappear
6. [ ] Verify submit button becomes enabled

**Expected Results:**
- ✅ Empty form cannot be submitted
- ✅ Validation errors display for invalid data
- ✅ Validation errors clear when data is corrected
- ✅ Submit button state reflects form validity

### Test: Alternative contact methods

**Steps:**
1. [ ] Navigate to Contact page
2. [ ] Click WhatsApp button
   - [ ] Verify WhatsApp link opens (or shows "no WhatsApp installed" message)
3. [ ] Click Email button
   - [ ] Verify email client opens with pre-filled recipient

**Expected Results:**
- ✅ WhatsApp button works correctly
- ✅ Email button opens email client

---

## 5. Project Display Flow Testing

### Test: Display projects from database

**Steps:**
1. [ ] Ensure backend has sample projects in database
2. [ ] Navigate to Projects page (`/projects`)
3. [ ] Monitor Network tab in developer tools
   - [ ] Verify GET request to `/api/projects`
   - [ ] Verify response status is 200 OK
   - [ ] Verify response contains project data
4. [ ] Verify projects are displayed with:
   - [ ] Project title
   - [ ] Project description
   - [ ] Project image
   - [ ] GitHub link button
5. [ ] Click a GitHub link
   - [ ] Verify link opens in new tab
   - [ ] Verify GitHub repository page loads

**Expected Results:**
- ✅ Projects load from backend
- ✅ All project information displays correctly
- ✅ Images load correctly
- ✅ GitHub links open in new tab
- ✅ No console errors

### Test: Handle empty project list

**Steps:**
1. [ ] Clear all projects from database
2. [ ] Navigate to Projects page
3. [ ] Verify message displays: "No projects available"

**Expected Results:**
- ✅ Empty state message displays
- ✅ No errors occur

### Test: Handle project loading errors

**Steps:**
1. [ ] Stop backend server
2. [ ] Navigate to Projects page
3. [ ] Verify error message displays
4. [ ] Restart backend server
5. [ ] Refresh page
6. [ ] Verify projects load successfully

**Expected Results:**
- ✅ Error message displays when backend is unavailable
- ✅ Projects load when backend is available

---

## 6. Complete User Journey Testing

### Test: Full user flow from home to multiple submissions

**Steps:**
1. [ ] Start at Home page (`http://localhost:4200`)
2. [ ] Click "View Courses" button
   - [ ] Verify navigation to Courses page
3. [ ] Click "Enroll" on Java course
4. [ ] Fill out and submit enrollment form
   - [ ] Verify success message
5. [ ] Navigate to Internship page
6. [ ] Click "Apply" on Java Internship
7. [ ] Fill out and submit application form
   - [ ] Verify success message
8. [ ] Navigate to Projects page
   - [ ] Verify projects load and display
9. [ ] Navigate to Contact page
10. [ ] Fill out and submit contact form
    - [ ] Verify success message
11. [ ] Navigate to About page
    - [ ] Verify company information displays
12. [ ] Navigate back to Home page
    - [ ] Verify home page displays

**Expected Results:**
- ✅ All navigation works smoothly
- ✅ All forms submit successfully
- ✅ All success messages display
- ✅ No console errors throughout journey
- ✅ User can complete entire flow without issues

---

## 7. Responsive Design Testing

### Test: Mobile viewport (< 768px)

**Steps:**
1. [ ] Open browser developer tools (F12)
2. [ ] Enable device toolbar (Ctrl+Shift+M)
3. [ ] Select iPhone or similar mobile device
4. [ ] Navigate through all pages
5. [ ] Verify:
   - [ ] Navigation collapses to hamburger menu
   - [ ] All content is readable
   - [ ] Forms are usable
   - [ ] Buttons are touch-friendly (min 44px height)
   - [ ] Images scale appropriately
   - [ ] No horizontal scrolling

**Expected Results:**
- ✅ All pages are mobile-friendly
- ✅ Navigation works on mobile
- ✅ Forms are usable on mobile
- ✅ Content is readable

### Test: Tablet viewport (768px - 991px)

**Steps:**
1. [ ] Set viewport to iPad or similar tablet
2. [ ] Navigate through all pages
3. [ ] Verify layout adjusts appropriately
4. [ ] Test all forms and interactions

**Expected Results:**
- ✅ Layout adapts to tablet viewport
- ✅ All functionality works correctly

### Test: Desktop viewport (> 992px)

**Steps:**
1. [ ] Set viewport to desktop size (1920x1080)
2. [ ] Navigate through all pages
3. [ ] Verify full desktop layout displays
4. [ ] Test all forms and interactions

**Expected Results:**
- ✅ Full desktop layout displays
- ✅ All functionality works correctly

---

## 8. Error Handling Testing

### Test: Network errors

**Steps:**
1. [ ] Open browser developer tools
2. [ ] Go to Network tab
3. [ ] Enable "Offline" mode
4. [ ] Try to submit any form
5. [ ] Verify error message displays
6. [ ] Disable "Offline" mode
7. [ ] Submit form again
8. [ ] Verify success message displays

**Expected Results:**
- ✅ Offline errors are caught and displayed
- ✅ Forms work when connection is restored

### Test: Backend validation errors

**Steps:**
1. [ ] Modify backend to reject a specific email
2. [ ] Submit form with that email
3. [ ] Verify backend validation error displays
4. [ ] Correct the email
5. [ ] Submit again
6. [ ] Verify success message displays

**Expected Results:**
- ✅ Backend validation errors are displayed
- ✅ User can correct and resubmit

---

## Test Summary

### Total Tests: 8 categories

- [ ] Navigation Flow (1 test)
- [ ] Internship Application Flow (3 tests)
- [ ] Course Enrollment Flow (2 tests)
- [ ] Contact Form Flow (3 tests)
- [ ] Project Display Flow (3 tests)
- [ ] Complete User Journey (1 test)
- [ ] Responsive Design (3 tests)
- [ ] Error Handling (2 tests)

### Sign-off

**Tester Name:** ___________________________

**Date:** ___________________________

**All Tests Passed:** [ ] Yes [ ] No

**Notes/Issues:**
_______________________________________________
_______________________________________________
_______________________________________________

---

## Task 26.3 Completion Criteria

✅ All navigation tests pass
✅ All form submission tests pass
✅ All validation tests pass
✅ All error handling tests pass
✅ All responsive design tests pass
✅ Complete user journey test passes
✅ No console errors during testing
✅ All requirements validated

**Task Status:** [ ] Complete [ ] Incomplete

**Completed By:** ___________________________

**Date:** ___________________________
