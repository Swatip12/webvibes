# Implementation Plan: Admin Panel

## Overview

This implementation plan breaks down the Admin Panel feature into discrete coding tasks. The system adds JWT-based authentication, role-based authorization, and admin management interfaces to the existing WebVibes Technology website. Tasks are organized to build incrementally, starting with backend security infrastructure, then database entities, admin APIs, frontend authentication, and finally admin UI components.

## Tasks

- [-] 1. Backend Spring Security setup
  - [ ] 1.1 Add Spring Security dependencies to pom.xml
    - Add spring-boot-starter-security dependency
    - Add jjwt-api, jjwt-impl, jjwt-jackson dependencies for JWT
    - _Requirements: 1.1, 2.1_
  
  - [ ] 1.2 Create JWT utility classes
    - Create JwtTokenProvider class with generateToken, validateToken, getUsernameFromToken methods
    - Configure JWT secret key and expiration time in application.properties
    - Add methods to extract claims from JWT tokens
    - _Requirements: 1.1, 1.3_
  
  - [ ] 1.3 Create JwtAuthenticationFilter
    - Extend OncePerRequestFilter to intercept all requests
    - Extract JWT token from Authorization header
    - Validate token and set authentication in SecurityContext
    - Handle token validation errors
    - _Requirements: 2.4, 2.5_
  
  - [ ] 1.4 Create SecurityConfig class
    - Configure HttpSecurity with JWT filter
    - Define public endpoints (/api/auth/**, /api/courses, /api/internships, /api/projects, /api/contact, /api/internships/apply, /api/courses/enroll)
    - Protect /api/admin/** endpoints with ADMIN role
    - Disable CSRF for stateless API
    - Configure BCrypt password encoder
    - _Requirements: 2.1, 2.2, 2.3_

- [ ] 2. Admin user entity and repository
  - [ ] 2.1 Create AdminUser entity
    - Define entity with id, username, password, role, createdAt, lastLogin fields
    - Add JPA annotations (@Entity, @Table, @Id, @GeneratedValue, @Column)
    - Create unique index on username
    - _Requirements: 1.4_
  
  - [ ] 2.2 Create AdminUserRepository
    - Extend JpaRepository<AdminUser, Long>
    - Add findByUsername method
    - Add existsByUsername method
    - _Requirements: 1.1_
  
  - [ ] 2.3 Create CustomUserDetailsService
    - Implement UserDetailsService interface
    - Load user from AdminUserRepository
    - Convert AdminUser to Spring Security UserDetails
    - _Requirements: 1.1, 2.1_
  
  - [ ] 2.4 Create database initialization script
    - Create SQL script to insert default admin user
    - Hash password using BCrypt (use online tool or Java code)
    - Username: admin, Password: admin123 (for development)
    - _Requirements: 1.4_

- [ ] 3. Authentication DTOs and controller
  - [ ] 3.1 Create authentication DTOs
    - Create LoginRequest DTO with username and password fields
    - Create JwtAuthResponse DTO with token, type, username, role fields
    - Add validation annotations (@NotBlank)
    - _Requirements: 1.1, 1.2_
  
  - [ ] 3.2 Create AuthController
    - Implement POST /api/auth/login endpoint
    - Authenticate user with AuthenticationManager
    - Generate JWT token on successful authentication
    - Return JwtAuthResponse with token and user info
    - Handle authentication failures with appropriate error messages
    - _Requirements: 1.1, 1.2_
  
  - [ ] 3.3 Add logout endpoint (optional)
    - Implement POST /api/auth/logout endpoint
    - Return success message (token invalidation handled client-side)
    - _Requirements: 1.5_

- [ ] 4. Course and Internship entities
  - [ ] 4.1 Create Course entity
    - Define entity with id, name, description, duration, technologies, createdAt, updatedAt fields
    - Add JPA annotations and column constraints
    - Create index on createdAt field
    - Add @PrePersist and @PreUpdate lifecycle callbacks for timestamps
    - _Requirements: 3.1, 8.1_
  
  - [ ] 4.2 Create Internship entity
    - Define entity with id, type, description, duration, skills, createdAt, updatedAt fields
    - Add JPA annotations and column constraints
    - Create index on createdAt field
    - Add @PrePersist and @PreUpdate lifecycle callbacks for timestamps
    - _Requirements: 4.1, 8.2_
  
  - [ ] 4.3 Create CourseRepository
    - Extend JpaRepository<Course, Long>
    - Add findAllByOrderByCreatedAtDesc method
    - _Requirements: 3.4_
  
  - [ ] 4.4 Create InternshipRepository
    - Extend JpaRepository<Internship, Long>
    - Add findAllByOrderByCreatedAtDesc method
    - _Requirements: 4.4_

- [ ] 5. Course and Internship DTOs
  - [ ] 5.1 Create CourseDTO
    - Define DTO with id, name, description, duration, technologies, createdAt, updatedAt fields
    - Add validation annotations (@NotBlank, @NotNull, @Min, @Size)
    - _Requirements: 3.5, 3.6_
  
  - [ ] 5.2 Create InternshipDTO
    - Define DTO with id, type, description, duration, skills, createdAt, updatedAt fields
    - Add validation annotations (@NotBlank, @NotNull, @Min, @Size)
    - _Requirements: 4.5, 4.6_

- [ ] 6. Admin Course service and controller
  - [ ] 6.1 Enhance CourseService with admin operations
    - Add createCourse method (convert DTO to entity, set timestamps, save)
    - Add updateCourse method (find by ID, update fields, save)
    - Add deleteCourse method (delete by ID)
    - Add getCourseById method
    - Keep existing getAllCourses method for public access
    - Add entity-to-DTO and DTO-to-entity conversion methods
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ] 6.2 Create AdminCourseController
    - Implement POST /api/admin/courses endpoint (create course)
    - Implement PUT /api/admin/courses/{id} endpoint (update course)
    - Implement DELETE /api/admin/courses/{id} endpoint (delete course)
    - Implement GET /api/admin/courses endpoint (get all courses)
    - Implement GET /api/admin/courses/{id} endpoint (get course by ID)
    - Add @PreAuthorize("hasRole('ADMIN')") annotation
    - Add @Valid annotation for request body validation
    - Return appropriate HTTP status codes (200, 201, 404)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 7. Admin Internship service and controller
  - [ ] 7.1 Enhance InternshipService with admin operations
    - Add createInternship method (convert DTO to entity, set timestamps, save)
    - Add updateInternship method (find by ID, update fields, save)
    - Add deleteInternship method (delete by ID)
    - Add getInternshipById method
    - Keep existing getAllInternships method for public access
    - Add entity-to-DTO and DTO-to-entity conversion methods
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 7.2 Create AdminInternshipController
    - Implement POST /api/admin/internships endpoint (create internship)
    - Implement PUT /api/admin/internships/{id} endpoint (update internship)
    - Implement DELETE /api/admin/internships/{id} endpoint (delete internship)
    - Implement GET /api/admin/internships endpoint (get all internships)
    - Implement GET /api/admin/internships/{id} endpoint (get internship by ID)
    - Add @PreAuthorize("hasRole('ADMIN')") annotation
    - Add @Valid annotation for request body validation
    - Return appropriate HTTP status codes (200, 201, 404)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 8. Admin view controller
  - [ ] 8.1 Create AdminViewController
    - Implement GET /api/admin/applications endpoint
    - Implement GET /api/admin/enrollments endpoint
    - Implement GET /api/admin/messages endpoint
    - Add @PreAuthorize("hasRole('ADMIN')") annotation
    - Return data sorted by submission date descending
    - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3_

- [ ] 9. Update public endpoints for courses and internships
  - [ ] 9.1 Create public CourseController
    - Implement GET /api/courses endpoint (fetch from database)
    - Return all courses sorted by createdAt descending
    - No authentication required
    - _Requirements: 8.1, 8.3, 8.4_
  
  - [ ] 9.2 Create public InternshipController  
    - Implement GET /api/internships endpoint (fetch from database)
    - Return all internships sorted by createdAt descending
    - No authentication required
    - _Requirements: 8.2, 8.5, 8.6_

- [ ] 10. Backend error handling enhancements
  - [ ] 10.1 Enhance GlobalExceptionHandler
    - Add handler for AuthenticationException (return 401)
    - Add handler for AccessDeniedException (return 403)
    - Add handler for JwtException (return 401)
    - Ensure existing validation error handling works with new DTOs
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 11. Backend checkpoint - Test authentication and admin APIs
  - Manually test login endpoint with valid and invalid credentials
  - Test admin endpoints with and without JWT token
  - Test course and internship CRUD operations
  - Verify public endpoints return database data

- [ ] 12. Frontend authentication models and service
  - [ ] 12.1 Create authentication TypeScript interfaces
    - Create AdminUser interface (username, role)
    - Create JwtAuthResponse interface (token, type, username, role)
    - Create LoginRequest interface (username, password)
    - _Requirements: 1.1_
  
  - [ ] 12.2 Create AuthService
    - Implement login method (POST to /api/auth/login)
    - Implement logout method (clear localStorage)
    - Implement getToken method (retrieve from localStorage)
    - Implement isAuthenticated method (check token existence and validity)
    - Implement getCurrentUser method (retrieve from localStorage)
    - Store token and user info in localStorage on successful login
    - Use BehaviorSubject for current user state
    - _Requirements: 1.1, 1.5_

- [ ] 13. Frontend authentication guards and interceptors
  - [ ] 13.1 Create AuthGuard
    - Implement CanActivate interface
    - Check if user is authenticated using AuthService
    - Redirect to /login if not authenticated
    - Allow navigation if authenticated
    - _Requirements: 2.3_
  
  - [ ] 13.2 Create JwtInterceptor
    - Implement HttpInterceptor interface
    - Add Authorization header with JWT token to all requests
    - Skip adding header for login endpoint
    - _Requirements: 2.4, 2.5_
  
  - [ ] 13.3 Enhance ErrorInterceptor
    - Handle 401 responses by redirecting to login page
    - Handle 403 responses with appropriate error message
    - Clear authentication state on 401
    - _Requirements: 10.1, 10.6_

- [ ] 14. Login component
  - [ ] 14.1 Create LoginComponent
    - Generate component with Angular CLI
    - Create reactive form with username and password fields
    - Add form validators (required)
    - Implement onSubmit method to call AuthService.login
    - Display error message on login failure
    - Navigate to /admin/dashboard on successful login
    - _Requirements: 1.1, 1.2, 9.1_
  
  - [ ] 14.2 Style LoginComponent
    - Create centered login card with Bootstrap
    - Style form fields and submit button
    - Add WebVibes Technology branding
    - Ensure responsive design for mobile and desktop
    - _Requirements: 9.5_

- [ ] 15. Admin dashboard component
  - [ ] 15.1 Create AdminDashboardComponent
    - Generate component with Angular CLI
    - Display welcome message with admin username
    - Add navigation cards/buttons to management sections
    - Display summary statistics (total courses, internships, applications, enrollments, messages)
    - Add logout button
    - _Requirements: 9.1, 9.2_
  
  - [ ] 15.2 Style AdminDashboardComponent
    - Use Bootstrap grid for responsive layout
    - Create card-based navigation
    - Add icons for each management section
    - Ensure responsive design
    - _Requirements: 9.5_

- [ ] 16. Course management component
  - [ ] 16.1 Create CourseManagementComponent
    - Generate component with Angular CLI
    - Fetch all courses from AdminService on init
    - Display courses in a table with columns: Name, Description, Duration, Technologies, Actions
    - Add "Add Course" button to show create form
    - Add Edit and Delete buttons for each course row
    - Implement state management for courses array, selectedCourse, isEditMode
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 9.3_
  
  - [ ] 16.2 Create course form in CourseManagementComponent
    - Create reactive form with name, description, duration, technologies fields
    - Add form validators matching backend validation
    - Show form when creating or editing
    - Pre-fill form when editing
    - Implement onSaveCourse method (create or update based on mode)
    - Implement onDeleteCourse method with confirmation dialog
    - Display success/error messages
    - Reload courses list after successful operation
    - _Requirements: 3.1, 3.2, 3.3, 9.4, 9.6_
  
  - [ ] 16.3 Style CourseManagementComponent
    - Use Bootstrap table for courses list
    - Style form with Bootstrap form classes
    - Add responsive design for mobile and desktop
    - Use modals or inline forms for create/edit
    - _Requirements: 9.5_

- [ ] 17. Internship management component
  - [ ] 17.1 Create InternshipManagementComponent
    - Generate component with Angular CLI
    - Fetch all internships from AdminService on init
    - Display internships in a table with columns: Type, Description, Duration, Skills, Actions
    - Add "Add Internship" button to show create form
    - Add Edit and Delete buttons for each internship row
    - Implement state management for internships array, selectedInternship, isEditMode
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 9.3_
  
  - [ ] 17.2 Create internship form in InternshipManagementComponent
    - Create reactive form with type, description, duration, skills fields
    - Add form validators matching backend validation
    - Show form when creating or editing
    - Pre-fill form when editing
    - Implement onSaveInternship method (create or update based on mode)
    - Implement onDeleteInternship method with confirmation dialog
    - Display success/error messages
    - Reload internships list after successful operation
    - _Requirements: 4.1, 4.2, 4.3, 9.4, 9.6_
  
  - [ ] 17.3 Style InternshipManagementComponent
    - Use Bootstrap table for internships list
    - Style form with Bootstrap form classes
    - Add responsive design for mobile and desktop
    - Use modals or inline forms for create/edit
    - _Requirements: 9.5_

- [ ] 18. Applications view component
  - [ ] 18.1 Create ApplicationsViewComponent
    - Generate component with Angular CLI
    - Fetch all applications from AdminService on init
    - Display applications in a table with columns: Student Name, Email, Phone, Internship Type, Application Date
    - Sort by application date descending
    - Display "No applications available" message when empty
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 9.3_
  
  - [ ] 18.2 Style ApplicationsViewComponent
    - Use Bootstrap table with responsive design
    - Format dates for readability
    - Add search/filter functionality (optional)
    - _Requirements: 9.5_

- [ ] 19. Enrollments view component
  - [ ] 19.1 Create EnrollmentsViewComponent
    - Generate component with Angular CLI
    - Fetch all enrollments from AdminService on init
    - Display enrollments in a table with columns: Student Name, Email, Phone, Course Name, Enrollment Date
    - Sort by enrollment date descending
    - Display "No enrollments available" message when empty
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 9.3_
  
  - [ ] 19.2 Style EnrollmentsViewComponent
    - Use Bootstrap table with responsive design
    - Format dates for readability
    - Add search/filter functionality (optional)
    - _Requirements: 9.5_

- [ ] 20. Messages view component
  - [ ] 20.1 Create MessagesViewComponent
    - Generate component with Angular CLI
    - Fetch all messages from AdminService on init
    - Display messages in a table with columns: Name, Email, Message, Submission Date
    - Sort by submission date descending
    - Display "No messages available" message when empty
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 9.3_
  
  - [ ] 20.2 Style MessagesViewComponent
    - Use Bootstrap table with responsive design
    - Format dates for readability
    - Truncate long messages with "View More" option
    - Add search/filter functionality (optional)
    - _Requirements: 9.5_

- [ ] 21. Admin service
  - [ ] 21.1 Create AdminService
    - Implement createCourse method (POST /api/admin/courses)
    - Implement updateCourse method (PUT /api/admin/courses/{id})
    - Implement deleteCourse method (DELETE /api/admin/courses/{id})
    - Implement getCourses method (GET /api/admin/courses)
    - Implement createInternship method (POST /api/admin/internships)
    - Implement updateInternship method (PUT /api/admin/internships/{id})
    - Implement deleteInternship method (DELETE /api/admin/internships/{id})
    - Implement getInternships method (GET /api/admin/internships)
    - Implement getApplications method (GET /api/admin/applications)
    - Implement getEnrollments method (GET /api/admin/enrollments)
    - Implement getMessages method (GET /api/admin/messages)
    - All methods return Observables
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 5.1, 6.1, 7.1_

- [ ] 22. Update public courses and internships components
  - [ ] 22.1 Update CoursesComponent to fetch from backend
    - Remove hardcoded courses array
    - Fetch courses from CourseService.getAllCourses on init
    - Handle loading and error states
    - Display courses dynamically from API response
    - Parse technologies string (comma-separated) into array for display
    - _Requirements: 8.1, 8.3, 8.4_
  
  - [ ] 22.2 Update InternshipComponent to fetch from backend
    - Remove hardcoded internships array
    - Fetch internships from InternshipService.getAllInternships on init
    - Handle loading and error states
    - Display internships dynamically from API response
    - Parse skills string (comma-separated) into array for display
    - _Requirements: 8.2, 8.5, 8.6_
  
  - [ ] 22.3 Update CourseService with public endpoint
    - Add getAllCourses method (GET /api/courses)
    - Return Observable<CourseDTO[]>
    - _Requirements: 8.1_
  
  - [ ] 22.4 Update InternshipService with public endpoint
    - Add getAllInternships method (GET /api/internships)
    - Return Observable<InternshipDTO[]>
    - _Requirements: 8.2_

- [ ] 23. Admin routing configuration
  - [ ] 23.1 Configure admin routes
    - Add /login route for LoginComponent (no guard)
    - Add /admin route with AuthGuard protecting all child routes
    - Add /admin/dashboard route for AdminDashboardComponent
    - Add /admin/courses route for CourseManagementComponent
    - Add /admin/internships route for InternshipManagementComponent
    - Add /admin/applications route for ApplicationsViewComponent
    - Add /admin/enrollments route for EnrollmentsViewComponent
    - Add /admin/messages route for MessagesViewComponent
    - _Requirements: 2.3, 9.1, 9.2_
  
  - [ ] 23.2 Add admin navigation link to main navigation (optional)
    - Add "Admin" link in navigation component
    - Show only when user is authenticated
    - Link to /admin/dashboard
    - _Requirements: 9.2_

- [ ] 24. Register all components and services in app module
  - [ ] 24.1 Update app.module.ts
    - Import and declare all admin components
    - Register AuthGuard as provider
    - Register JwtInterceptor with HTTP_INTERCEPTORS token
    - Ensure ErrorInterceptor is registered
    - Import ReactiveFormsModule if not already imported
    - _Requirements: 2.3, 2.4, 2.5_

- [ ] 25. Frontend checkpoint - Test admin panel
  - Test login with valid and invalid credentials
  - Test navigation to admin routes with and without authentication
  - Test course CRUD operations through UI
  - Test internship CRUD operations through UI
  - Test viewing applications, enrollments, and messages
  - Verify public courses and internships pages fetch from backend

- [ ] 26. Integration testing
  - [ ] 26.1 Test complete authentication flow
    - Login with admin credentials
    - Verify JWT token is stored in localStorage
    - Verify token is sent with admin API requests
    - Verify logout clears token and redirects to login
    - _Requirements: 1.1, 1.5, 2.4_
  
  - [ ] 26.2 Test course management end-to-end
    - Create a new course through admin panel
    - Verify course appears in admin courses list
    - Verify course appears on public courses page
    - Update the course
    - Verify changes reflect on both admin and public pages
    - Delete the course
    - Verify course is removed from both admin and public pages
    - _Requirements: 3.1, 3.2, 3.3, 8.1, 8.3, 8.4_
  
  - [ ] 26.3 Test internship management end-to-end
    - Create a new internship through admin panel
    - Verify internship appears in admin internships list
    - Verify internship appears on public internships page
    - Update the internship
    - Verify changes reflect on both admin and public pages
    - Delete the internship
    - Verify internship is removed from both admin and public pages
    - _Requirements: 4.1, 4.2, 4.3, 8.2, 8.5, 8.6_
  
  - [ ] 26.4 Test authorization and error handling
    - Attempt to access admin endpoints without token (should return 401)
    - Attempt to access admin routes without authentication (should redirect to login)
    - Test with expired token (should redirect to login)
    - Test validation errors on course and internship forms
    - _Requirements: 2.1, 2.3, 10.1, 10.6_

- [ ] 27. Final checkpoint - Complete admin panel verification
  - Ensure all admin features work end-to-end
  - Verify responsive design on mobile, tablet, and desktop
  - Test all error scenarios and edge cases
  - Verify public website integration works correctly

## Notes

- All tasks are required for the admin panel feature to function
- Backend tasks (1-11) should be completed before frontend tasks (12-25)
- Each task references specific requirements for traceability
- JWT secret key should be configured in application.properties (use a strong random string for production)
- Default admin credentials should be changed in production
- Technologies field in Course and skills field in Internship can be stored as comma-separated strings or JSON
- Consider adding pagination for large datasets in view components (optional enhancement)
- Consider adding search/filter functionality in view components (optional enhancement)
- The admin panel is designed for desktop/tablet use; mobile support is basic
