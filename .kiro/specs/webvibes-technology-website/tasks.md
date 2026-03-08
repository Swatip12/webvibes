# Implementation Plan: WebVibes Technology Website

## Overview

This implementation plan breaks down the WebVibes Technology full-stack website into discrete coding tasks. The system uses Angular (TypeScript) for the frontend, Spring Boot (Java) for the backend, and MySQL for the database. Tasks are organized to build incrementally, starting with backend infrastructure, then frontend setup, followed by feature implementation, and finally integration and testing.

## Tasks

- [ ] 1. Backend project setup and configuration
  - [x] 1.1 Create Spring Boot project with Maven
    - Initialize Spring Boot 3.x project with dependencies: Spring Web, Spring Data JPA, MySQL Driver, Validation, Lombok
    - Configure project structure with packages: controller, service, repository, entity, dto, exception
    - _Requirements: 12.1, 12.2, 12.3_
  
  - [x] 1.2 Configure database connection and properties
    - Create application.properties with MySQL connection settings (URL, username, password)
    - Configure JPA/Hibernate properties (ddl-auto, dialect, show-sql)
    - Set up server port and context path
    - _Requirements: 12.2, 12.3, 13.1-13.6_
  
  - [x] 1.3 Configure CORS for Angular frontend
    - Create CorsConfig class to allow requests from Angular dev server (http://localhost:4200)
    - Configure allowed methods (GET, POST, PUT, DELETE) and headers
    - _Requirements: 12.5_

- [ ] 2. Database schema and JPA entities
  - [x] 2.1 Create InternshipApplication entity and table
    - Define InternshipApplication entity with fields: id, studentName, email, phone, internshipType, message, submittedAt
    - Add JPA annotations (@Entity, @Table, @Id, @GeneratedValue, @Column)
    - Create indexes on email and submittedAt fields
    - _Requirements: 13.2, 8.2_
  
  - [x] 2.2 Create CourseEnrollment entity and table
    - Define CourseEnrollment entity with fields: id, studentName, email, phone, courseName, message, submittedAt
    - Add JPA annotations and column constraints
    - Create indexes on email, courseName, and submittedAt fields
    - _Requirements: 13.3, 9.2_
  
  - [x] 2.3 Create ContactMessage entity and table
    - Define ContactMessage entity with fields: id, name, email, message, submittedAt, isRead
    - Add JPA annotations and column constraints
    - Create indexes on email, submittedAt, and isRead fields
    - _Requirements: 13.5, 10.2_
  
  - [x] 2.4 Create Project entity and table
    - Define Project entity with fields: id, title, description, githubLink, imageUrl, createdAt
    - Add JPA annotations and column constraints
    - Create index on createdAt field
    - _Requirements: 13.4, 11.2_

- [ ] 3. Backend DTOs and validation
  - [x] 3.1 Create InternshipApplicationDTO with validation
    - Define DTO with fields: studentName, email, phone, internshipType, message
    - Add Bean Validation annotations (@NotBlank, @Email, @Pattern, @Size)
    - _Requirements: 12.4, 8.1_
  
  - [x] 3.2 Create CourseEnrollmentDTO with validation
    - Define DTO with fields: studentName, email, phone, courseName, message
    - Add Bean Validation annotations
    - _Requirements: 12.4, 9.1_
  
  - [x] 3.3 Create ContactMessageDTO with validation
    - Define DTO with fields: name, email, message
    - Add Bean Validation annotations
    - _Requirements: 12.4, 10.1_
  
  - [x] 3.4 Create ProjectDTO with validation
    - Define DTO with fields: id, title, description, githubLink, imageUrl
    - Add Bean Validation annotations including GitHub URL pattern validation
    - _Requirements: 12.4, 11.1_
  
  - [x] 3.5 Create MessageResponse DTO
    - Define simple response DTO with message field for success responses
    - _Requirements: 12.4_

- [ ] 4. Backend repositories
  - [x] 4.1 Create Spring Data JPA repositories
    - Create InternshipRepository extending JpaRepository<InternshipApplication, Long>
    - Create CourseRepository extending JpaRepository<CourseEnrollment, Long>
    - Create ContactRepository extending JpaRepository<ContactMessage, Long>
    - Create ProjectRepository extending JpaRepository<Project, Long>
    - _Requirements: 12.1, 12.2_

- [ ] 5. Backend services
  - [x] 5.1 Implement InternshipService
    - Create saveApplication method to convert DTO to entity, set timestamp, and save to repository
    - Add error handling and logging
    - _Requirements: 12.1, 8.2_
  
  - [x] 5.2 Implement CourseService
    - Create saveEnrollment method to convert DTO to entity, set timestamp, and save to repository
    - Add error handling and logging
    - _Requirements: 12.1, 9.2_
  
  - [x] 5.3 Implement ContactService
    - Create saveMessage method to convert DTO to entity, set timestamp, and save to repository
    - Add error handling and logging
    - _Requirements: 12.1, 10.2_
  
  - [x] 5.4 Implement ProjectService
    - Create saveProject method to convert DTO to entity, set timestamp, and save to repository
    - Create getAllProjects method to retrieve all projects and convert to DTOs
    - Add error handling and logging
    - _Requirements: 12.1, 11.2, 11.5_

- [x] 6. Backend controllers and REST endpoints
  - [x] 6.1 Create InternshipController
    - Implement POST /api/internships/apply endpoint
    - Add @Valid annotation for DTO validation
    - Return HTTP 201 with MessageResponse on success
    - _Requirements: 12.5, 8.1, 8.3_
  
  - [x] 6.2 Create CourseController
    - Implement POST /api/courses/enroll endpoint
    - Add @Valid annotation for DTO validation
    - Return HTTP 201 with MessageResponse on success
    - _Requirements: 12.5, 9.1, 9.3_
  
  - [x] 6.3 Create ContactController
    - Implement POST /api/contact endpoint
    - Add @Valid annotation for DTO validation
    - Return HTTP 201 with MessageResponse on success
    - _Requirements: 12.5, 10.1, 10.3_
  
  - [x] 6.4 Create ProjectController
    - Implement GET /api/projects endpoint to retrieve all projects
    - Implement POST /api/projects endpoint to add new project
    - Add @Valid annotation for POST request validation
    - Return HTTP 200 for GET, HTTP 201 for POST
    - _Requirements: 12.5, 11.1, 11.3, 11.4, 11.5_

- [x] 7. Backend error handling
  - [x] 7.1 Create GlobalExceptionHandler
    - Implement @RestControllerAdvice class
    - Handle MethodArgumentNotValidException (return 400 with field errors)
    - Handle DataIntegrityViolationException (return 409)
    - Handle EntityNotFoundException (return 404)
    - Handle generic Exception (return 500 with error message)
    - Add logging for all exceptions
    - _Requirements: 17.1, 17.2, 8.4, 9.4, 10.4_

- [x] 8. Checkpoint - Backend verification
  - Ensure all backend tests pass, verify database schema creation, test API endpoints manually or with Postman

- [ ] 9. Frontend project setup
  - [x] 9.1 Create Angular project
    - Initialize Angular 15+ project using Angular CLI
    - Configure project structure with components and services folders
    - Install Bootstrap 5 for responsive styling
    - _Requirements: 15.4_
  
  - [x] 9.2 Configure Angular routing
    - Set up app-routing.module with routes for: home, about, internship, courses, projects, contact
    - Configure RouterModule with routes
    - _Requirements: 7.3_
  
  - [x] 9.3 Configure environment and API base URL
    - Create environment files with backend API base URL (http://localhost:8080)
    - _Requirements: 14.5_

- [ ] 10. Frontend DTOs and interfaces
  - [x] 10.1 Create TypeScript interfaces
    - Define InternshipApplicationDTO interface
    - Define CourseEnrollmentDTO interface
    - Define ContactMessageDTO interface
    - Define ProjectDTO interface
    - Define MessageResponse interface
    - _Requirements: 12.4_

- [ ] 11. Frontend services
  - [x] 11.1 Create InternshipService
    - Implement submitApplication method using HttpClient POST to /api/internships/apply
    - Return Observable<any>
    - _Requirements: 14.1, 14.5, 8.1_
  
  - [x] 11.2 Create CourseService
    - Implement submitEnrollment method using HttpClient POST to /api/courses/enroll
    - Return Observable<any>
    - _Requirements: 14.2, 14.5, 9.1_
  
  - [x] 11.3 Create ContactService
    - Implement submitContactForm method using HttpClient POST to /api/contact
    - Return Observable<any>
    - _Requirements: 14.3, 14.5, 10.1_
  
  - [x] 11.4 Create ProjectService
    - Implement getAllProjects method using HttpClient GET to /api/projects
    - Return Observable<Project[]>
    - _Requirements: 14.4, 14.5, 11.4_

- [ ] 12. Navigation component
  - [x] 12.1 Create Navigation component
    - Generate component with Angular CLI
    - Create template with navigation links (Home, About, Internship, Courses, Projects, Contact)
    - Use routerLink for navigation
    - Add routerLinkActive for highlighting active route
    - _Requirements: 7.1, 7.4_
  
  - [x] 12.2 Style Navigation component with responsive design
    - Apply Bootstrap navbar classes
    - Implement hamburger menu for mobile viewports (< 768px)
    - Add smooth transitions for menu toggle
    - _Requirements: 7.5, 15.1_

- [ ] 13. Home page component
  - [x] 13.1 Create Home component
    - Generate component with Angular CLI
    - Create hero section with title "Welcome to WebVibes Technology"
    - Add company introduction text
    - Add "View Courses" button with routerLink to /courses
    - Add "Apply for Internship" button with routerLink to /internship
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 13.2 Style Home component with responsive design and animations
    - Apply Bootstrap grid and spacing classes
    - Implement responsive layout for mobile, tablet, and desktop
    - Add CSS animations for hero section elements
    - _Requirements: 1.5, 1.6, 18.1-18.5_

- [ ] 14. About page component
  - [x] 14.1 Create About component
    - Generate component with Angular CLI
    - Add company description section
    - Add mission and vision statements section
    - Add "What You'll Learn" section
    - Add technologies list (Java, Spring Boot, Angular, MySQL, etc.)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 14.2 Style About component with responsive design
    - Apply Bootstrap grid and spacing classes
    - Implement responsive layout for all viewports
    - _Requirements: 15.1-15.3, 18.1-18.5_

- [ ] 15. Internship page component
  - [x] 15.1 Create Internship component
    - Generate component with Angular CLI
    - Create internship cards for Java and Web Development internships
    - Display description, duration, and skills for each internship
    - Add "Apply" button on each card
    - Implement state management for selectedInternship and showApplicationForm
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 15.2 Create internship application form
    - Add reactive form with fields: studentName, email, phone, internshipType, message
    - Add form validators (required, email, phone pattern, length constraints)
    - Pre-fill internshipType from selected internship
    - Show/hide form based on showApplicationForm state
    - _Requirements: 3.4, 16.1-16.5_
  
  - [ ] 15.3 Implement form submission and feedback
    - Call InternshipService.submitApplication on form submit
    - Display success message on successful submission
    - Display error message on failure
    - Reset form after successful submission
    - _Requirements: 8.1, 8.3, 17.3, 17.4_
  
  - [~] 15.4 Style Internship component with responsive design
    - Apply Bootstrap card and grid classes
    - Implement 2 cards per row on desktop/tablet, 1 card on mobile
    - Style form with Bootstrap form classes
    - _Requirements: 15.1-15.3, 18.1-18.5_

- [ ] 16. Courses page component
  - [~] 16.1 Create Courses component
    - Generate component with Angular CLI
    - Create course cards for Java, Spring Boot, Angular, and Full Stack courses
    - Display description, duration, and technologies for each course
    - Add "Enroll" button on each card
    - Implement state management for selectedCourse and showEnrollmentForm
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [~] 16.2 Create course enrollment form
    - Add reactive form with fields: studentName, email, phone, courseName, message
    - Add form validators (required, email, phone pattern, length constraints)
    - Pre-fill courseName from selected course
    - Show/hide form based on showEnrollmentForm state
    - _Requirements: 4.6, 16.1-16.5_
  
  - [~] 16.3 Implement form submission and feedback
    - Call CourseService.submitEnrollment on form submit
    - Display success message on successful submission
    - Display error message on failure
    - Reset form after successful submission
    - _Requirements: 9.1, 9.3, 17.3, 17.4_
  
  - [~] 16.4 Style Courses component with responsive design
    - Apply Bootstrap card and grid classes
    - Implement 2 cards per row on desktop/tablet, 1 card on mobile
    - Style form with Bootstrap form classes
    - _Requirements: 15.1-15.3, 18.1-18.5_

- [ ] 17. Projects page component
  - [~] 17.1 Create Projects component
    - Generate component with Angular CLI
    - Implement ngOnInit to fetch projects from ProjectService
    - Implement state management for projects array, loading, and error states
    - Display project cards with title, description, image, and GitHub link
    - Open GitHub links in new tab (target="_blank")
    - Display "No projects available" message when projects array is empty
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [~] 17.2 Implement error handling for project loading
    - Display error message if project fetch fails
    - Display loading indicator while fetching projects
    - _Requirements: 17.3, 17.4_
  
  - [~] 17.3 Style Projects component with responsive design
    - Apply Bootstrap card and grid classes
    - Implement 3 cards per row on desktop, 2 on tablet, 1 on mobile
    - Style project images to be responsive
    - _Requirements: 15.1-15.3, 18.1-18.5_

- [ ] 18. Contact page component
  - [~] 18.1 Create Contact component
    - Generate component with Angular CLI
    - Create reactive form with fields: name, email, message
    - Add form validators (required, email, minLength, maxLength)
    - Add WhatsApp button with external link
    - Add Email button with mailto link
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [~] 18.2 Implement form submission and feedback
    - Call ContactService.submitContactForm on form submit
    - Display success message on successful submission
    - Display error message on failure
    - Reset form after successful submission
    - _Requirements: 6.4, 6.5, 6.6, 10.1, 10.3_
  
  - [~] 18.3 Style Contact component with responsive design
    - Apply Bootstrap form and button classes
    - Implement single column layout for all viewports
    - Ensure touch-friendly button sizes (min 44px height)
    - _Requirements: 15.1-15.5, 18.1-18.5_

- [ ] 19. Footer component
  - [~] 19.1 Create Footer component
    - Generate component with Angular CLI
    - Add social media links
    - Style with Bootstrap classes
    - _Requirements: 7.2_

- [ ] 20. HTTP error interceptor
  - [~] 20.1 Create ErrorInterceptor
    - Implement HttpInterceptor interface
    - Handle client-side errors (ErrorEvent)
    - Handle server-side errors (HTTP status codes: 0, 400, 500)
    - Format validation errors from 400 responses
    - Return formatted error messages
    - _Requirements: 17.3, 17.4_
  
  - [~] 20.2 Register ErrorInterceptor in app module
    - Add interceptor to providers array with HTTP_INTERCEPTORS token
    - _Requirements: 17.3_

- [~] 21. Checkpoint - Frontend verification
  - Ensure all components render correctly, test navigation between pages, verify forms display validation errors

- [ ] 22. Backend unit tests
  - [ ]* 22.1 Write unit tests for InternshipService
    - Test saveApplication method with valid data
    - Test entity mapping from DTO
    - Mock repository layer
    - _Requirements: 8.2_
  
  - [ ]* 22.2 Write unit tests for CourseService
    - Test saveEnrollment method with valid data
    - Test entity mapping from DTO
    - Mock repository layer
    - _Requirements: 9.2_
  
  - [ ]* 22.3 Write unit tests for ContactService
    - Test saveMessage method with valid data
    - Test entity mapping from DTO
    - Mock repository layer
    - _Requirements: 10.2_
  
  - [ ]* 22.4 Write unit tests for ProjectService
    - Test saveProject and getAllProjects methods
    - Test DTO conversion
    - Mock repository layer
    - _Requirements: 11.2, 11.5_
  
  - [ ]* 22.5 Write unit tests for controllers
    - Test InternshipController POST endpoint with valid and invalid data
    - Test CourseController POST endpoint with valid and invalid data
    - Test ContactController POST endpoint with valid and invalid data
    - Test ProjectController GET and POST endpoints
    - Use @WebMvcTest and MockMvc
    - _Requirements: 8.1, 8.3, 8.4, 9.1, 9.3, 9.4, 10.1, 10.3, 10.4, 11.1, 11.3, 11.5_
  
  - [ ]* 22.6 Write repository tests
    - Test save and retrieve operations for all entities
    - Use @DataJpaTest with in-memory database
    - _Requirements: 8.2, 9.2, 10.2, 11.2_

- [ ]* 23. Backend property-based tests
  - [ ]* 23.1 Write property test for data persistence round-trip (Property 8)
    - **Property 8: Data Persistence Round-Trip**
    - **Validates: Requirements 8.2, 9.2, 10.2, 11.2**
    - Use jqwik to generate random valid data
    - Test that saving and retrieving preserves all fields
    - Run 100 iterations
  
  - [ ]* 23.2 Write property test for successful creation response (Property 9)
    - **Property 9: Successful Creation Response**
    - **Validates: Requirements 8.3, 9.3, 10.3, 11.3**
    - Use jqwik to generate random valid data
    - Test that successful saves return HTTP 201
    - Run 100 iterations
  
  - [ ]* 23.3 Write property test for invalid data rejection (Property 10)
    - **Property 10: Invalid Data Rejection**
    - **Validates: Requirements 8.4, 9.4, 10.4**
    - Use jqwik to generate random invalid data
    - Test that invalid data returns HTTP 400
    - Run 100 iterations

- [ ]* 24. Frontend unit tests
  - [ ]* 24.1 Write unit tests for InternshipService
    - Test submitApplication sends POST request to correct endpoint
    - Use HttpClientTestingModule
    - _Requirements: 8.1_
  
  - [ ]* 24.2 Write unit tests for CourseService
    - Test submitEnrollment sends POST request to correct endpoint
    - Use HttpClientTestingModule
    - _Requirements: 9.1_
  
  - [ ]* 24.3 Write unit tests for ContactService
    - Test submitContactForm sends POST request to correct endpoint
    - Use HttpClientTestingModule
    - _Requirements: 10.1_
  
  - [ ]* 24.4 Write unit tests for ProjectService
    - Test getAllProjects sends GET request to correct endpoint
    - Use HttpClientTestingModule
    - _Requirements: 11.4_
  
  - [ ]* 24.5 Write unit tests for Contact component
    - Test form initialization
    - Test success message display on successful submission
    - Test error message display on submission failure
    - Mock ContactService
    - _Requirements: 6.4, 6.5, 6.6_
  
  - [ ]* 24.6 Write unit tests for Projects component
    - Test project loading on ngOnInit
    - Test loading state display
    - Test error state display
    - Mock ProjectService
    - _Requirements: 5.1, 5.2_

- [ ]* 25. Frontend property-based tests
  - [ ]* 25.1 Write property test for contact form submission (Property 3)
    - **Property 3: Contact Form Submission**
    - **Validates: Requirements 6.4**
    - Use fast-check to generate random valid contact form data
    - Test that valid data is sent to API
    - Run 100 iterations
  
  - [ ]* 25.2 Write property test for form submit button state (Property 13)
    - **Property 13: Form Submit Button State**
    - **Validates: Requirements 16.3, 16.4**
    - Use fast-check to generate random form data
    - Test that button is enabled iff all fields are valid
    - Run 100 iterations
  
  - [ ]* 25.3 Write property test for email format validation (Property 14)
    - **Property 14: Email Format Validation**
    - **Validates: Requirements 16.5**
    - Use fast-check to generate random invalid emails
    - Test that invalid emails are rejected
    - Run 100 iterations
  
  - [ ]* 25.4 Write property test for project display completeness (Property 1)
    - **Property 1: Project Display Completeness**
    - **Validates: Requirements 5.1, 5.2**
    - Use fast-check to generate random project lists
    - Test that all projects are displayed with complete information
    - Run 100 iterations

- [ ] 26. Integration and final wiring
  - [~] 26.1 Wire all components into app module
    - Import all components in app.module.ts
    - Declare all components
    - Import HttpClientModule, ReactiveFormsModule, RouterModule
    - _Requirements: 7.3, 14.5_
  
  - [~] 26.2 Add Navigation and Footer to app component
    - Include Navigation component in app.component.html
    - Include router-outlet for page content
    - Include Footer component
    - _Requirements: 7.1, 7.2, 7.4_
  
  - [~] 26.3 Test complete user flows
    - Test navigation between all pages
    - Test internship application submission end-to-end
    - Test course enrollment submission end-to-end
    - Test contact form submission end-to-end
    - Test project display from database
    - _Requirements: All_

- [~] 27. Final checkpoint - Complete system verification
  - Ensure all tests pass, verify all features work end-to-end, test responsive design on multiple devices

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities to address issues
- Property tests validate universal correctness properties across many inputs
- Unit tests validate specific examples and edge cases
- Backend uses Java with Spring Boot, frontend uses TypeScript with Angular
- All forms include real-time validation with visual feedback
- Responsive design ensures mobile, tablet, and desktop compatibility
