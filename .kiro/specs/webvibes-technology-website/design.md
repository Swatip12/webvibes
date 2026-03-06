# Technical Design Document

## Overview

The WebVibes Technology website is a full-stack web application built with Angular (frontend), Spring Boot (backend), and MySQL (database). The system provides information about IT training courses and internship programs, showcases student projects, and enables prospective students to apply for programs and contact the company.

### System Goals

- Provide an engaging, responsive user interface for browsing courses and internships
- Enable students to submit applications and contact messages
- Showcase student projects with GitHub integration
- Maintain a clean separation between presentation, business logic, and data layers
- Ensure data validation at both frontend and backend layers
- Support responsive design for mobile, tablet, and desktop devices

### Technology Stack

**Frontend:**
- Angular 15+ (TypeScript-based SPA framework)
- Angular Router (client-side routing)
- Angular HttpClient (HTTP communication)
- Bootstrap 5 (responsive CSS framework)
- RxJS (reactive programming)

**Backend:**
- Spring Boot 3.x (Java application framework)
- Spring Web (REST API)
- Spring Data JPA (data access layer)
- Hibernate (JPA implementation)
- Bean Validation (input validation)
- MySQL Connector/J (database driver)

**Database:**
- MySQL 8.0+ (relational database)

**Build Tools:**
- Maven (backend dependency management)
- npm/Angular CLI (frontend build and development)

## Architecture

### High-Level Architecture

The system follows a three-tier architecture pattern:

```
┌─────────────────────────────────────────┐
│         Angular Frontend                │
│  (Presentation Layer)                   │
│  - Components (UI)                      │
│  - Services (HTTP clients)              │
│  - Routing                              │
└──────────────┬──────────────────────────┘
               │ HTTP/REST
               │ (JSON)
┌──────────────▼──────────────────────────┐
│      Spring Boot Backend                │
│  (Business Logic Layer)                 │
│  - Controllers (REST endpoints)         │
│  - Services (business logic)            │
│  - Repositories (data access)           │
│  - DTOs (data transfer)                 │
└──────────────┬──────────────────────────┘
               │ JDBC
               │ (SQL)
┌──────────────▼──────────────────────────┐
│         MySQL Database                  │
│  (Data Persistence Layer)               │
│  - Tables                               │
│  - Constraints                          │
│  - Indexes                              │
└─────────────────────────────────────────┘
```

### Communication Flow

1. **User Interaction**: User interacts with Angular components
2. **Service Call**: Component calls Angular service method
3. **HTTP Request**: Service sends HTTP request to Spring Boot REST endpoint
4. **Controller Processing**: Spring Boot controller receives request, validates input
5. **Service Layer**: Controller delegates to service layer for business logic
6. **Data Access**: Service calls repository to interact with database
7. **Response**: Data flows back through layers to frontend
8. **UI Update**: Angular component updates view with response data

### Architectural Principles

- **Separation of Concerns**: Clear boundaries between presentation, business logic, and data layers
- **RESTful Design**: Backend exposes resource-oriented REST APIs
- **Stateless Backend**: No session state maintained on server
- **Reactive Frontend**: RxJS observables for asynchronous operations
- **Validation at Boundaries**: Input validation at both frontend and backend
- **DTO Pattern**: Separate DTOs from entity models to decouple API contracts from database schema

## Components and Interfaces

### Frontend Components

#### 1. Navigation Component

**Purpose**: Provides consistent navigation across all pages

**Template Structure**:
```html
<nav class="navbar">
  <a routerLink="/home">Home</a>
  <a routerLink="/about">About</a>
  <a routerLink="/internship">Internship</a>
  <a routerLink="/courses">Courses</a>
  <a routerLink="/projects">Projects</a>
  <a routerLink="/contact">Contact</a>
</nav>
```

**Responsibilities**:
- Display navigation links
- Highlight active route
- Collapse to hamburger menu on mobile viewports
- Remain visible across all pages

**Styling Considerations**:
- Fixed or sticky positioning
- Responsive breakpoints at 768px
- Smooth transitions for mobile menu

#### 2. Home Component

**Purpose**: Landing page with hero section and call-to-action buttons

**Key Elements**:
- Hero section with title "Welcome to WebVibes Technology"
- Company introduction text
- "View Courses" button (routes to /courses)
- "Apply for Internship" button (routes to /internship)
- Animated elements for visual engagement

**Responsibilities**:
- Display static content
- Navigate to courses and internship pages
- Apply animations on page load

#### 3. About Component

**Purpose**: Display company information and mission

**Key Elements**:
- Company description section
- Mission and vision statements
- "What You'll Learn" section
- Technologies list (Java, Spring Boot, Angular, MySQL, etc.)

**Responsibilities**:
- Display static informational content
- Organize content in readable sections

#### 4. Internship Component

**Purpose**: Display available internships and handle applications

**Key Elements**:
- Internship cards (Java, Web Development)
- Each card shows: description, duration, skills
- "Apply" button on each card
- Application modal/form

**State Management**:
```typescript
selectedInternship: string | null = null;
showApplicationForm: boolean = false;
```

**Responsibilities**:
- Display internship cards
- Show/hide application form
- Pass selected internship to form
- Handle form submission via InternshipService

**Application Form Fields**:
- Student Name (required, text)
- Email (required, email format)
- Phone (required, numeric)
- Internship Type (pre-filled from selection)
- Message/Cover Letter (optional, textarea)

#### 5. Courses Component

**Purpose**: Display course catalog and handle enrollments

**Key Elements**:
- Course cards (Java, Spring Boot, Angular, Full Stack)
- Each card shows: description, duration, technologies
- "Enroll" button on each card
- Enrollment modal/form

**State Management**:
```typescript
selectedCourse: string | null = null;
showEnrollmentForm: boolean = false;
```

**Responsibilities**:
- Display course cards
- Show/hide enrollment form
- Pass selected course to form
- Handle form submission via CourseService

**Enrollment Form Fields**:
- Student Name (required, text)
- Email (required, email format)
- Phone (required, numeric)
- Course Name (pre-filled from selection)
- Message (optional, textarea)

#### 6. Projects Component

**Purpose**: Showcase student projects

**State Management**:
```typescript
projects: Project[] = [];
loading: boolean = true;
error: string | null = null;
```

**Lifecycle**:
```typescript
ngOnInit() {
  this.projectService.getAllProjects().subscribe({
    next: (data) => {
      this.projects = data;
      this.loading = false;
    },
    error: (err) => {
      this.error = 'Failed to load projects';
      this.loading = false;
    }
  });
}
```

**Responsibilities**:
- Fetch projects from backend on initialization
- Display project cards with title, description, image, GitHub link
- Handle loading and error states
- Open GitHub links in new tab (target="_blank")

**Project Card Structure**:
- Project image (responsive)
- Project title
- Project description
- GitHub link button

#### 7. Contact Component

**Purpose**: Enable students to contact the company

**Key Elements**:
- Contact form (Name, Email, Message)
- WhatsApp button (external link)
- Email button (mailto link)
- Success/error message display

**Form Fields**:
- Name (required, text, min 2 characters)
- Email (required, email format)
- Message (required, textarea, min 10 characters)

**Responsibilities**:
- Validate form inputs in real-time
- Submit form data via ContactService
- Display success/error messages
- Reset form after successful submission
- Provide alternative contact methods (WhatsApp, Email)

### Frontend Services

#### 1. InternshipService

**Purpose**: Handle internship application API calls

**Methods**:
```typescript
submitApplication(application: InternshipApplicationDTO): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/internships/apply`, application);
}
```

**API Endpoint**: `POST /api/internships/apply`

**Request DTO**:
```typescript
interface InternshipApplicationDTO {
  studentName: string;
  email: string;
  phone: string;
  internshipType: string;
  message?: string;
}
```

#### 2. CourseService

**Purpose**: Handle course enrollment API calls

**Methods**:
```typescript
submitEnrollment(enrollment: CourseEnrollmentDTO): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/courses/enroll`, enrollment);
}
```

**API Endpoint**: `POST /api/courses/enroll`

**Request DTO**:
```typescript
interface CourseEnrollmentDTO {
  studentName: string;
  email: string;
  phone: string;
  courseName: string;
  message?: string;
}
```

#### 3. ContactService

**Purpose**: Handle contact form submissions

**Methods**:
```typescript
submitContactForm(contact: ContactMessageDTO): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/contact`, contact);
}
```

**API Endpoint**: `POST /api/contact`

**Request DTO**:
```typescript
interface ContactMessageDTO {
  name: string;
  email: string;
  message: string;
}
```

#### 4. ProjectService

**Purpose**: Fetch and manage project data

**Methods**:
```typescript
getAllProjects(): Observable<Project[]> {
  return this.http.get<Project[]>(`${this.apiUrl}/api/projects`);
}

// Admin functionality (future)
addProject(project: ProjectDTO): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/projects`, project);
}
```

**API Endpoints**: 
- `GET /api/projects`
- `POST /api/projects`

**Response DTO**:
```typescript
interface Project {
  id: number;
  title: string;
  description: string;
  githubLink: string;
  imageUrl: string;
}
```

### Backend Controllers

#### 1. InternshipController

**Purpose**: Handle internship application requests

**Endpoint**: `POST /api/internships/apply`

**Request Body**: InternshipApplicationDTO

**Response**:
- Success: HTTP 201 with success message
- Validation Error: HTTP 400 with error details
- Server Error: HTTP 500 with error message

**Controller Method**:
```java
@PostMapping("/apply")
public ResponseEntity<?> applyForInternship(
    @Valid @RequestBody InternshipApplicationDTO dto) {
    
    InternshipApplication application = internshipService.saveApplication(dto);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(new MessageResponse("Application submitted successfully"));
}
```

**Validation Rules**:
- studentName: not blank, 2-100 characters
- email: not blank, valid email format
- phone: not blank, 10-15 digits
- internshipType: not blank
- message: optional, max 500 characters

#### 2. CourseController

**Purpose**: Handle course enrollment requests

**Endpoint**: `POST /api/courses/enroll`

**Request Body**: CourseEnrollmentDTO

**Response**:
- Success: HTTP 201 with success message
- Validation Error: HTTP 400 with error details
- Server Error: HTTP 500 with error message

**Controller Method**:
```java
@PostMapping("/enroll")
public ResponseEntity<?> enrollInCourse(
    @Valid @RequestBody CourseEnrollmentDTO dto) {
    
    CourseEnrollment enrollment = courseService.saveEnrollment(dto);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(new MessageResponse("Enrollment submitted successfully"));
}
```

**Validation Rules**:
- studentName: not blank, 2-100 characters
- email: not blank, valid email format
- phone: not blank, 10-15 digits
- courseName: not blank
- message: optional, max 500 characters

#### 3. ContactController

**Purpose**: Handle contact form submissions

**Endpoint**: `POST /api/contact`

**Request Body**: ContactMessageDTO

**Response**:
- Success: HTTP 201 with success message
- Validation Error: HTTP 400 with error details
- Server Error: HTTP 500 with error message

**Controller Method**:
```java
@PostMapping
public ResponseEntity<?> submitContactForm(
    @Valid @RequestBody ContactMessageDTO dto) {
    
    ContactMessage message = contactService.saveMessage(dto);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(new MessageResponse("Message sent successfully"));
}
```

**Validation Rules**:
- name: not blank, 2-100 characters
- email: not blank, valid email format
- message: not blank, 10-1000 characters

#### 4. ProjectController

**Purpose**: Manage project showcase data

**Endpoints**:
- `GET /api/projects` - Retrieve all projects
- `POST /api/projects` - Add new project (admin)

**GET Response**:
- Success: HTTP 200 with list of ProjectDTO
- Server Error: HTTP 500 with error message

**POST Request Body**: ProjectDTO

**POST Response**:
- Success: HTTP 201 with created project
- Validation Error: HTTP 400 with error details
- Server Error: HTTP 500 with error message

**Controller Methods**:
```java
@GetMapping
public ResponseEntity<List<ProjectDTO>> getAllProjects() {
    List<ProjectDTO> projects = projectService.getAllProjects();
    return ResponseEntity.ok(projects);
}

@PostMapping
public ResponseEntity<?> addProject(
    @Valid @RequestBody ProjectDTO dto) {
    
    Project project = projectService.saveProject(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(project);
}
```

**Validation Rules** (POST):
- title: not blank, 3-200 characters
- description: not blank, 10-1000 characters
- githubLink: not blank, valid URL format
- imageUrl: not blank, valid URL format

### Backend Services

#### 1. InternshipService

**Purpose**: Business logic for internship applications

**Methods**:
```java
public InternshipApplication saveApplication(InternshipApplicationDTO dto) {
    InternshipApplication application = new InternshipApplication();
    application.setStudentName(dto.getStudentName());
    application.setEmail(dto.getEmail());
    application.setPhone(dto.getPhone());
    application.setInternshipType(dto.getInternshipType());
    application.setMessage(dto.getMessage());
    application.setSubmittedAt(LocalDateTime.now());
    
    return internshipRepository.save(application);
}
```

**Responsibilities**:
- Convert DTO to entity
- Set timestamps
- Delegate persistence to repository
- Handle business logic (if any)

#### 2. CourseService

**Purpose**: Business logic for course enrollments

**Methods**:
```java
public CourseEnrollment saveEnrollment(CourseEnrollmentDTO dto) {
    CourseEnrollment enrollment = new CourseEnrollment();
    enrollment.setStudentName(dto.getStudentName());
    enrollment.setEmail(dto.getEmail());
    enrollment.setPhone(dto.getPhone());
    enrollment.setCourseName(dto.getCourseName());
    enrollment.setMessage(dto.getMessage());
    enrollment.setSubmittedAt(LocalDateTime.now());
    
    return courseRepository.save(enrollment);
}
```

**Responsibilities**:
- Convert DTO to entity
- Set timestamps
- Delegate persistence to repository
- Handle business logic (if any)

#### 3. ContactService

**Purpose**: Business logic for contact messages

**Methods**:
```java
public ContactMessage saveMessage(ContactMessageDTO dto) {
    ContactMessage message = new ContactMessage();
    message.setName(dto.getName());
    message.setEmail(dto.getEmail());
    message.setMessage(dto.getMessage());
    message.setSubmittedAt(LocalDateTime.now());
    
    return contactRepository.save(message);
}
```

**Responsibilities**:
- Convert DTO to entity
- Set timestamps
- Delegate persistence to repository

#### 4. ProjectService

**Purpose**: Business logic for project management

**Methods**:
```java
public List<ProjectDTO> getAllProjects() {
    List<Project> projects = projectRepository.findAll();
    return projects.stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
}

public Project saveProject(ProjectDTO dto) {
    Project project = new Project();
    project.setTitle(dto.getTitle());
    project.setDescription(dto.getDescription());
    project.setGithubLink(dto.getGithubLink());
    project.setImageUrl(dto.getImageUrl());
    project.setCreatedAt(LocalDateTime.now());
    
    return projectRepository.save(project);
}

private ProjectDTO convertToDTO(Project project) {
    ProjectDTO dto = new ProjectDTO();
    dto.setId(project.getId());
    dto.setTitle(project.getTitle());
    dto.setDescription(project.getDescription());
    dto.setGithubLink(project.getGithubLink());
    dto.setImageUrl(project.getImageUrl());
    return dto;
}
```

**Responsibilities**:
- Retrieve all projects
- Convert entities to DTOs
- Save new projects
- Handle business logic

### Backend Repositories

All repositories extend Spring Data JPA's `JpaRepository` interface:

```java
public interface InternshipRepository extends JpaRepository<InternshipApplication, Long> {
    // Custom queries can be added here if needed
}

public interface CourseRepository extends JpaRepository<CourseEnrollment, Long> {
    // Custom queries can be added here if needed
}

public interface ContactRepository extends JpaRepository<ContactMessage, Long> {
    // Custom queries can be added here if needed
}

public interface ProjectRepository extends JpaRepository<Project, Long> {
    // Custom queries can be added here if needed
}
```

**Provided Methods** (from JpaRepository):
- `save(entity)` - Insert or update
- `findById(id)` - Find by primary key
- `findAll()` - Retrieve all records
- `deleteById(id)` - Delete by primary key
- `count()` - Count records

## Data Models

### Database Schema

#### 1. internship_applications Table

```sql
CREATE TABLE internship_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    internship_type VARCHAR(50) NOT NULL,
    message TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_submitted_at (submitted_at)
);
```

**Columns**:
- `id`: Primary key, auto-increment
- `student_name`: Applicant's full name
- `email`: Applicant's email address
- `phone`: Applicant's phone number
- `internship_type`: Type of internship (e.g., "Java", "Web Development")
- `message`: Optional cover letter or message
- `submitted_at`: Timestamp of submission

**Indexes**:
- Email for lookup/duplicate checking
- Submitted date for sorting/filtering

#### 2. course_enrollments Table

```sql
CREATE TABLE course_enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    message TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_course_name (course_name),
    INDEX idx_submitted_at (submitted_at)
);
```

**Columns**:
- `id`: Primary key, auto-increment
- `student_name`: Student's full name
- `email`: Student's email address
- `phone`: Student's phone number
- `course_name`: Name of course (e.g., "Java", "Spring Boot", "Angular", "Full Stack")
- `message`: Optional message from student
- `submitted_at`: Timestamp of enrollment

**Indexes**:
- Email for lookup
- Course name for filtering by course
- Submitted date for sorting

#### 3. contact_messages Table

```sql
CREATE TABLE contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    INDEX idx_email (email),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_is_read (is_read)
);
```

**Columns**:
- `id`: Primary key, auto-increment
- `name`: Sender's name
- `email`: Sender's email address
- `message`: Message content
- `submitted_at`: Timestamp of submission
- `is_read`: Flag for admin tracking (future feature)

**Indexes**:
- Email for lookup
- Submitted date for sorting
- Read status for filtering

#### 4. projects Table

```sql
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    github_link VARCHAR(500) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
);
```

**Columns**:
- `id`: Primary key, auto-increment
- `title`: Project title
- `description`: Project description
- `github_link`: URL to GitHub repository
- `image_url`: URL to project screenshot/image
- `created_at`: Timestamp of project creation

**Indexes**:
- Created date for sorting (newest first)

### JPA Entity Models

#### 1. InternshipApplication Entity

```java
@Entity
@Table(name = "internship_applications")
public class InternshipApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "student_name", nullable = false, length = 100)
    private String studentName;
    
    @Column(nullable = false, length = 100)
    private String email;
    
    @Column(nullable = false, length = 15)
    private String phone;
    
    @Column(name = "internship_type", nullable = false, length = 50)
    private String internshipType;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
    
    // Getters and setters
}
```

#### 2. CourseEnrollment Entity

```java
@Entity
@Table(name = "course_enrollments")
public class CourseEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "student_name", nullable = false, length = 100)
    private String studentName;
    
    @Column(nullable = false, length = 100)
    private String email;
    
    @Column(nullable = false, length = 15)
    private String phone;
    
    @Column(name = "course_name", nullable = false, length = 100)
    private String courseName;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
    
    // Getters and setters
}
```

#### 3. ContactMessage Entity

```java
@Entity
@Table(name = "contact_messages")
public class ContactMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, length = 100)
    private String email;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
    
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;
    
    // Getters and setters
}
```

#### 4. Project Entity

```java
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "github_link", nullable = false, length = 500)
    private String githubLink;
    
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Getters and setters
}
```

### Data Transfer Objects (DTOs)

DTOs decouple the API contract from the database schema and provide validation.

#### Backend DTOs (Java)

```java
public class InternshipApplicationDTO {
    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 100)
    private String studentName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Invalid phone number")
    private String phone;
    
    @NotBlank(message = "Internship type is required")
    private String internshipType;
    
    @Size(max = 500)
    private String message;
    
    // Getters and setters
}

public class CourseEnrollmentDTO {
    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 100)
    private String studentName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Invalid phone number")
    private String phone;
    
    @NotBlank(message = "Course name is required")
    private String courseName;
    
    @Size(max = 500)
    private String message;
    
    // Getters and setters
}

public class ContactMessageDTO {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 1000)
    private String message;
    
    // Getters and setters
}

public class ProjectDTO {
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200)
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000)
    private String description;
    
    @NotBlank(message = "GitHub link is required")
    @Pattern(regexp = "^https://github\\.com/.*", message = "Must be a valid GitHub URL")
    private String githubLink;
    
    @NotBlank(message = "Image URL is required")
    private String imageUrl;
    
    // Getters and setters
}

public class MessageResponse {
    private String message;
    
    public MessageResponse(String message) {
        this.message = message;
    }
    
    // Getter and setter
}
```

#### Frontend DTOs (TypeScript)

```typescript
export interface InternshipApplicationDTO {
  studentName: string;
  email: string;
  phone: string;
  internshipType: string;
  message?: string;
}

export interface CourseEnrollmentDTO {
  studentName: string;
  email: string;
  phone: string;
  courseName: string;
  message?: string;
}

export interface ContactMessageDTO {
  name: string;
  email: string;
  message: string;
}

export interface ProjectDTO {
  id?: number;
  title: string;
  description: string;
  githubLink: string;
  imageUrl: string;
}

export interface MessageResponse {
  message: string;
}
```


## API Endpoints Summary

### Internship Endpoints

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| POST | `/api/internships/apply` | InternshipApplicationDTO | 201: MessageResponse<br>400: Error details | Submit internship application |

### Course Endpoints

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| POST | `/api/courses/enroll` | CourseEnrollmentDTO | 201: MessageResponse<br>400: Error details | Submit course enrollment |

### Contact Endpoints

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| POST | `/api/contact` | ContactMessageDTO | 201: MessageResponse<br>400: Error details | Submit contact message |

### Project Endpoints

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| GET | `/api/projects` | None | 200: ProjectDTO[]<br>500: Error | Retrieve all projects |
| POST | `/api/projects` | ProjectDTO | 201: ProjectDTO<br>400: Error details | Add new project |

## Responsive Design Strategy

### Breakpoint Strategy

The application uses Bootstrap 5's responsive breakpoint system:

- **Mobile**: < 576px (xs)
- **Tablet**: 576px - 767px (sm)
- **Tablet Landscape**: 768px - 991px (md)
- **Desktop**: 992px - 1199px (lg)
- **Large Desktop**: ≥ 1200px (xl)

### Component Responsive Behavior

#### Navigation Component
- **Desktop** (≥ 992px): Horizontal navigation bar with all links visible
- **Tablet** (768px - 991px): Horizontal navigation with slightly reduced spacing
- **Mobile** (< 768px): Hamburger menu icon, collapsible navigation drawer

#### Home Page
- **Desktop**: Hero section with large text, buttons side-by-side
- **Tablet**: Hero section with medium text, buttons side-by-side
- **Mobile**: Hero section with smaller text, buttons stacked vertically

#### Internship/Course Cards
- **Desktop**: 2 cards per row with equal width
- **Tablet**: 2 cards per row with adjusted spacing
- **Mobile**: 1 card per row, full width

#### Project Cards
- **Desktop**: 3 cards per row
- **Tablet**: 2 cards per row
- **Mobile**: 1 card per row

#### Forms
- **All Viewports**: Single column layout, full width inputs
- **Mobile**: Larger touch targets (min 44px height for buttons)

### CSS Framework Usage

**Bootstrap 5 Classes**:
- Container: `.container` or `.container-fluid`
- Grid: `.row`, `.col-*`, `.col-sm-*`, `.col-md-*`, `.col-lg-*`
- Spacing: `.p-*`, `.m-*`, `.px-*`, `.py-*`
- Display: `.d-none`, `.d-sm-block`, `.d-md-flex`
- Flexbox: `.d-flex`, `.justify-content-*`, `.align-items-*`
- Typography: `.h1`, `.h2`, `.text-center`, `.text-muted`

**Custom Media Queries** (when needed):
```css
/* Mobile */
@media (max-width: 767px) {
  .hero-title { font-size: 2rem; }
  .cta-buttons { flex-direction: column; }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 991px) {
  .hero-title { font-size: 2.5rem; }
}

/* Desktop */
@media (min-width: 992px) {
  .hero-title { font-size: 3.5rem; }
}
```

### Touch-Friendly Design

- Minimum button height: 44px
- Minimum tap target size: 44x44px
- Adequate spacing between interactive elements (min 8px)
- No hover-dependent functionality
- Swipe gestures for mobile navigation (optional enhancement)

## Form Validation Strategy

### Frontend Validation (Angular)

#### Validation Approach

Angular Reactive Forms with built-in validators and custom validators.

#### Implementation Pattern

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class ContactComponent {
  contactForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }
  
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }
  
  onSubmit() {
    if (this.contactForm.valid) {
      // Submit form
    }
  }
}
```

#### Template Validation Display

```html
<form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
  <div class="form-group">
    <label>Name</label>
    <input type="text" formControlName="name" class="form-control"
           [class.is-invalid]="name?.invalid && name?.touched">
    <div class="invalid-feedback" *ngIf="name?.invalid && name?.touched">
      <div *ngIf="name?.errors?.['required']">Name is required</div>
      <div *ngIf="name?.errors?.['minlength']">Name must be at least 2 characters</div>
    </div>
  </div>
  
  <button type="submit" [disabled]="contactForm.invalid">Submit</button>
</form>
```

#### Validation Rules by Form

**Internship Application Form**:
- studentName: required, 2-100 characters
- email: required, valid email format
- phone: required, 10-15 digits, numeric only
- internshipType: required (pre-filled)
- message: optional, max 500 characters

**Course Enrollment Form**:
- studentName: required, 2-100 characters
- email: required, valid email format
- phone: required, 10-15 digits, numeric only
- courseName: required (pre-filled)
- message: optional, max 500 characters

**Contact Form**:
- name: required, 2-100 characters
- email: required, valid email format
- message: required, 10-1000 characters

**Project Form** (Admin):
- title: required, 3-200 characters
- description: required, 10-1000 characters
- githubLink: required, valid GitHub URL format
- imageUrl: required, valid URL format

#### Real-Time Validation

- Validation triggers on `blur` and `input` events
- Error messages display immediately after field is touched
- Submit button disabled when form is invalid
- Visual feedback: red border for invalid fields, green for valid

#### Custom Validators

```typescript
// Phone number validator
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(value) ? null : { invalidPhone: true };
  };
}

// GitHub URL validator
export function githubUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    const githubRegex = /^https:\/\/github\.com\/.+/;
    return githubRegex.test(value) ? null : { invalidGithubUrl: true };
  };
}
```

### Backend Validation (Spring Boot)

#### Validation Approach

Bean Validation (JSR-380) with Hibernate Validator implementation.

#### Validation Annotations

Applied to DTO fields:
- `@NotBlank`: Field cannot be null or empty
- `@Email`: Must be valid email format
- `@Size(min, max)`: String length constraints
- `@Pattern(regexp)`: Custom regex validation
- `@NotNull`: Field cannot be null

#### Controller Validation

```java
@PostMapping("/contact")
public ResponseEntity<?> submitContactForm(
    @Valid @RequestBody ContactMessageDTO dto,
    BindingResult result) {
    
    if (result.hasErrors()) {
        Map<String, String> errors = new HashMap<>();
        result.getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(errors);
    }
    
    // Process valid data
}
```

#### Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(
        MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new MessageResponse("An error occurred: " + ex.getMessage()));
    }
}
```

### Validation Flow

1. **User Input**: User enters data in form field
2. **Frontend Validation**: Angular validates on blur/input
3. **Visual Feedback**: Error messages display if invalid
4. **Submit Attempt**: User clicks submit button
5. **Frontend Check**: Form submission blocked if invalid
6. **HTTP Request**: Valid form data sent to backend
7. **Backend Validation**: Spring Boot validates DTO
8. **Validation Failure**: Returns 400 with error details
9. **Frontend Error Display**: Shows backend validation errors
10. **Validation Success**: Processes request and returns 201

## Security Considerations

### CORS Configuration

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:4200") // Angular dev server
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Input Sanitization

- Backend validates all inputs using Bean Validation
- SQL injection prevented by JPA/Hibernate parameterized queries
- XSS prevention: Angular automatically sanitizes HTML content
- No user-generated HTML content rendered without sanitization

### Data Protection

- Email addresses stored in database (consider encryption for production)
- No sensitive data (passwords, payment info) collected
- HTTPS recommended for production deployment
- Database credentials stored in environment variables

### Future Security Enhancements

- Add authentication for admin endpoints (Spring Security)
- Implement rate limiting for form submissions
- Add CAPTCHA to prevent spam submissions
- Implement CSRF protection for state-changing operations
- Add input sanitization library for additional XSS protection


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Project Display Completeness

*For any* list of projects returned by the Backend_API, the Frontend_Application should display all projects with their complete information (title, description, GitHub link, and image).

**Validates: Requirements 5.1, 5.2**

### Property 2: GitHub Links Open in New Tab

*For any* project displayed on the projects page, clicking the GitHub link should open the link in a new browser tab (target="_blank").

**Validates: Requirements 5.3**

### Property 3: Contact Form Submission

*For any* valid contact form data (name, email, message meeting validation rules), the Frontend_Application should send the data to the Backend_API.

**Validates: Requirements 6.4**

### Property 4: Success Confirmation Display

*For any* successful API response (HTTP 2xx), the Frontend_Application should display a success confirmation message to the user.

**Validates: Requirements 6.5**

### Property 5: Error Message Display

*For any* error response from the Backend_API (HTTP 4xx or 5xx), the Frontend_Application should display an error message to the user.

**Validates: Requirements 6.6, 17.3**

### Property 6: Navigation Component Visibility

*For any* page route in the application, the Navigation_Component should be visible and contain links to all main pages (Home, About, Internship, Courses, Projects, Contact).

**Validates: Requirements 7.4**

### Property 7: Backend Input Validation

*For any* API endpoint that accepts user input (internship applications, course enrollments, contact messages, project submissions), the Backend_API should validate the request data before processing.

**Validates: Requirements 8.1, 9.1, 10.1, 11.1**

### Property 8: Data Persistence Round-Trip

*For any* valid entity (InternshipApplication, CourseEnrollment, ContactMessage, or Project), saving it to the database and then retrieving it should return an equivalent entity with all fields preserved.

**Validates: Requirements 8.2, 9.2, 10.2, 11.2**

### Property 9: Successful Creation Response

*For any* successful entity creation (internship application, course enrollment, contact message, or project), the Backend_API should return HTTP status 201 with a success message.

**Validates: Requirements 8.3, 9.3, 10.3, 11.3**

### Property 10: Invalid Data Rejection

*For any* invalid request data that fails validation, the Backend_API should return HTTP status 400 with validation error details.

**Validates: Requirements 8.4, 9.4, 10.4**

### Property 11: Project Retrieval Completeness

*For any* set of projects stored in the database, the GET /api/projects endpoint should return all projects with HTTP status 200.

**Validates: Requirements 11.5**

### Property 12: Real-Time Form Validation

*For any* form field input, the Frontend_Application should validate the input and display validation feedback (error messages for invalid data, no errors for valid data) in real-time.

**Validates: Requirements 16.1, 16.2**

### Property 13: Form Submit Button State

*For any* form state, the submit button should be enabled if and only if all form fields contain valid data.

**Validates: Requirements 16.3, 16.4**

### Property 14: Email Format Validation

*For any* email field input, the Frontend_Application should validate it against a standard email format pattern and reject invalid email formats.

**Validates: Requirements 16.5**

### Property 15: Error Response Format

*For any* error encountered by the Backend_API, the response should include an appropriate HTTP status code and a JSON body containing an error message.

**Validates: Requirements 17.1, 17.2**

## Error Handling

### Frontend Error Handling

#### HTTP Error Interceptor

Implement an Angular HTTP interceptor to handle errors globally:

```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 0) {
            errorMessage = 'Unable to connect to server. Please check your connection.';
          } else if (error.status === 400) {
            errorMessage = this.formatValidationErrors(error.error);
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = error.error?.message || `Error: ${error.status}`;
          }
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  
  private formatValidationErrors(errors: any): string {
    if (typeof errors === 'object') {
      return Object.values(errors).join(', ');
    }
    return errors.message || 'Validation failed';
  }
}
```

#### Component-Level Error Handling

```typescript
export class ContactComponent {
  errorMessage: string = '';
  successMessage: string = '';
  
  onSubmit() {
    if (this.contactForm.valid) {
      this.contactService.submitContactForm(this.contactForm.value).subscribe({
        next: (response) => {
          this.successMessage = 'Message sent successfully!';
          this.errorMessage = '';
          this.contactForm.reset();
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.successMessage = '';
        }
      });
    }
  }
}
```

#### Error Display Template

```html
<div class="alert alert-success" *ngIf="successMessage">
  {{ successMessage }}
</div>

<div class="alert alert-danger" *ngIf="errorMessage">
  {{ errorMessage }}
</div>
```

### Backend Error Handling

#### Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidationExceptions(
        MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        logger.warn("Validation failed: {}", errors);
        return errors;
    }
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public MessageResponse handleDataIntegrityViolation(
        DataIntegrityViolationException ex) {
        
        logger.error("Data integrity violation", ex);
        return new MessageResponse("Data integrity error. Please check your input.");
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public MessageResponse handleEntityNotFound(EntityNotFoundException ex) {
        logger.warn("Entity not found: {}", ex.getMessage());
        return new MessageResponse("Resource not found");
    }
    
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public MessageResponse handleGenericException(Exception ex) {
        logger.error("Unexpected error occurred", ex);
        return new MessageResponse("An unexpected error occurred. Please try again later.");
    }
}
```

#### Service-Level Error Handling

```java
@Service
public class InternshipService {
    
    private static final Logger logger = LoggerFactory.getLogger(InternshipService.class);
    
    public InternshipApplication saveApplication(InternshipApplicationDTO dto) {
        try {
            InternshipApplication application = new InternshipApplication();
            // Map DTO to entity
            application.setStudentName(dto.getStudentName());
            application.setEmail(dto.getEmail());
            application.setPhone(dto.getPhone());
            application.setInternshipType(dto.getInternshipType());
            application.setMessage(dto.getMessage());
            application.setSubmittedAt(LocalDateTime.now());
            
            InternshipApplication saved = internshipRepository.save(application);
            logger.info("Internship application saved: {}", saved.getId());
            return saved;
            
        } catch (DataAccessException ex) {
            logger.error("Database error while saving internship application", ex);
            throw new RuntimeException("Failed to save application", ex);
        }
    }
}
```

### Error Scenarios and Responses

| Scenario | HTTP Status | Response Body | Frontend Action |
|----------|-------------|---------------|-----------------|
| Validation failure | 400 | `{ "field": "error message" }` | Display field-specific errors |
| Missing required field | 400 | `{ "field": "Field is required" }` | Highlight field with error |
| Invalid email format | 400 | `{ "email": "Invalid email format" }` | Show email format error |
| Database error | 500 | `{ "message": "Server error" }` | Show generic error message |
| Network failure | 0 | N/A | Show connection error |
| Resource not found | 404 | `{ "message": "Resource not found" }` | Show not found message |
| Duplicate entry | 409 | `{ "message": "Data integrity error" }` | Show conflict message |

### Logging Strategy

**Frontend Logging**:
- Console errors for development
- Error tracking service (e.g., Sentry) for production
- Log user actions leading to errors

**Backend Logging**:
- SLF4J with Logback
- Log levels: ERROR for exceptions, WARN for validation failures, INFO for successful operations
- Include request IDs for tracing
- Log to file and console
- Structured logging for production monitoring

## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific examples and edge cases with property-based tests for universal properties across all inputs.

### Unit Testing

#### Frontend Unit Tests (Jasmine/Karma)

**Component Tests**:
- Test component initialization
- Test user interactions (button clicks, form submissions)
- Test conditional rendering (loading states, error messages)
- Test navigation behavior
- Mock service dependencies

**Example Test**:
```typescript
describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let contactService: jasmine.SpyObj<ContactService>;
  
  beforeEach(() => {
    const spy = jasmine.createSpyObj('ContactService', ['submitContactForm']);
    
    TestBed.configureTestingModule({
      declarations: [ContactComponent],
      providers: [
        { provide: ContactService, useValue: spy }
      ]
    });
    
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
  });
  
  it('should display success message on successful submission', () => {
    contactService.submitContactForm.and.returnValue(of({ message: 'Success' }));
    
    component.contactForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message'
    });
    
    component.onSubmit();
    
    expect(component.successMessage).toBe('Message sent successfully!');
    expect(component.errorMessage).toBe('');
  });
  
  it('should display error message on submission failure', () => {
    contactService.submitContactForm.and.returnValue(
      throwError(() => new Error('Network error'))
    );
    
    component.contactForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message'
    });
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Network error');
    expect(component.successMessage).toBe('');
  });
});
```

**Service Tests**:
- Test HTTP requests with HttpClientTestingModule
- Verify correct endpoints are called
- Verify request payloads
- Test error handling

**Example Test**:
```typescript
describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService]
    });
    
    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should send POST request to /api/contact', () => {
    const mockData: ContactMessageDTO = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message'
    };
    
    service.submitContactForm(mockData).subscribe();
    
    const req = httpMock.expectOne('http://localhost:8080/api/contact');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    
    req.flush({ message: 'Success' });
  });
});
```

#### Backend Unit Tests (JUnit 5 + Mockito)

**Controller Tests**:
- Test request mapping
- Test validation
- Test response status codes
- Mock service layer

**Example Test**:
```java
@WebMvcTest(ContactController.class)
class ContactControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private ContactService contactService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void shouldReturnCreatedWhenValidContactMessage() throws Exception {
        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setName("John Doe");
        dto.setEmail("john@example.com");
        dto.setMessage("Test message");
        
        ContactMessage savedMessage = new ContactMessage();
        savedMessage.setId(1L);
        
        when(contactService.saveMessage(any())).thenReturn(savedMessage);
        
        mockMvc.perform(post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Message sent successfully"));
    }
    
    @Test
    void shouldReturnBadRequestWhenInvalidEmail() throws Exception {
        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setName("John Doe");
        dto.setEmail("invalid-email");
        dto.setMessage("Test message");
        
        mockMvc.perform(post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }
}
```

**Service Tests**:
- Test business logic
- Test entity mapping
- Mock repository layer

**Example Test**:
```java
@ExtendWith(MockitoExtension.class)
class ContactServiceTest {
    
    @Mock
    private ContactRepository contactRepository;
    
    @InjectMocks
    private ContactService contactService;
    
    @Test
    void shouldSaveContactMessage() {
        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setName("John Doe");
        dto.setEmail("john@example.com");
        dto.setMessage("Test message");
        
        ContactMessage savedMessage = new ContactMessage();
        savedMessage.setId(1L);
        savedMessage.setName(dto.getName());
        savedMessage.setEmail(dto.getEmail());
        savedMessage.setMessage(dto.getMessage());
        
        when(contactRepository.save(any())).thenReturn(savedMessage);
        
        ContactMessage result = contactService.saveMessage(dto);
        
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("John Doe", result.getName());
        verify(contactRepository, times(1)).save(any());
    }
}
```

**Repository Tests**:
- Test custom queries
- Use @DataJpaTest for in-memory database testing

**Example Test**:
```java
@DataJpaTest
class ContactRepositoryTest {
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Test
    void shouldSaveAndRetrieveContactMessage() {
        ContactMessage message = new ContactMessage();
        message.setName("John Doe");
        message.setEmail("john@example.com");
        message.setMessage("Test message");
        message.setSubmittedAt(LocalDateTime.now());
        message.setIsRead(false);
        
        ContactMessage saved = contactRepository.save(message);
        
        assertNotNull(saved.getId());
        
        Optional<ContactMessage> retrieved = contactRepository.findById(saved.getId());
        
        assertTrue(retrieved.isPresent());
        assertEquals("John Doe", retrieved.get().getName());
    }
}
```

### Property-Based Testing

Property-based tests verify that universal properties hold across many randomly generated inputs. Each test should run a minimum of 100 iterations.

#### Frontend Property Tests (fast-check)

**Installation**:
```bash
npm install --save-dev fast-check
```

**Property Test Examples**:

```typescript
import * as fc from 'fast-check';

describe('Property Tests - Contact Form', () => {
  
  // Property 3: Contact Form Submission
  it('Feature: webvibes-technology-website, Property 3: For any valid contact form data, it should be sent to the API', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 2, maxLength: 100 }),
          email: fc.emailAddress(),
          message: fc.string({ minLength: 10, maxLength: 1000 })
        }),
        (contactData) => {
          const service = TestBed.inject(ContactService);
          const httpMock = TestBed.inject(HttpTestingController);
          
          service.submitContactForm(contactData).subscribe();
          
          const req = httpMock.expectOne('http://localhost:8080/api/contact');
          expect(req.request.method).toBe('POST');
          expect(req.request.body).toEqual(contactData);
          
          req.flush({ message: 'Success' });
          httpMock.verify();
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Property 13: Form Submit Button State
  it('Feature: webvibes-technology-website, Property 13: Submit button enabled iff all fields valid', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string(),
          email: fc.string(),
          message: fc.string()
        }),
        (formData) => {
          const component = fixture.componentInstance;
          component.contactForm.setValue(formData);
          
          const isValid = component.contactForm.valid;
          const buttonEnabled = !component.contactForm.invalid;
          
          expect(buttonEnabled).toBe(isValid);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Property 14: Email Format Validation
  it('Feature: webvibes-technology-website, Property 14: Invalid emails should be rejected', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !s.includes('@') || !s.includes('.')),
        (invalidEmail) => {
          const component = fixture.componentInstance;
          component.contactForm.get('email')?.setValue(invalidEmail);
          
          expect(component.contactForm.get('email')?.invalid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Backend Property Tests (jqwik)

**Maven Dependency**:
```xml
<dependency>
    <groupId>net.jqwik</groupId>
    <artifactId>jqwik</artifactId>
    <version>1.7.4</version>
    <scope>test</scope>
</dependency>
```

**Property Test Examples**:

```java
import net.jqwik.api.*;

class ContactServicePropertyTest {
    
    private ContactRepository contactRepository;
    private ContactService contactService;
    
    @BeforeEach
    void setUp() {
        contactRepository = mock(ContactRepository.class);
        contactService = new ContactService(contactRepository);
    }
    
    // Property 8: Data Persistence Round-Trip
    @Property(tries = 100)
    @Label("Feature: webvibes-technology-website, Property 8: Saving and retrieving should preserve all fields")
    void dataPersistenceRoundTrip(
        @ForAll @StringLength(min = 2, max = 100) String name,
        @ForAll @Email String email,
        @ForAll @StringLength(min = 10, max = 1000) String message) {
        
        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setName(name);
        dto.setEmail(email);
        dto.setMessage(message);
        
        ContactMessage savedMessage = new ContactMessage();
        savedMessage.setId(1L);
        savedMessage.setName(name);
        savedMessage.setEmail(email);
        savedMessage.setMessage(message);
        savedMessage.setSubmittedAt(LocalDateTime.now());
        
        when(contactRepository.save(any())).thenReturn(savedMessage);
        when(contactRepository.findById(1L)).thenReturn(Optional.of(savedMessage));
        
        ContactMessage result = contactService.saveMessage(dto);
        Optional<ContactMessage> retrieved = contactRepository.findById(result.getId());
        
        assertTrue(retrieved.isPresent());
        assertEquals(name, retrieved.get().getName());
        assertEquals(email, retrieved.get().getEmail());
        assertEquals(message, retrieved.get().getMessage());
    }
    
    // Property 9: Successful Creation Response
    @Property(tries = 100)
    @Label("Feature: webvibes-technology-website, Property 9: Successful saves should return 201")
    void successfulCreationReturns201(
        @ForAll @StringLength(min = 2, max = 100) String name,
        @ForAll @Email String email,
        @ForAll @StringLength(min = 10, max = 1000) String message) throws Exception {
        
        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setName(name);
        dto.setEmail(email);
        dto.setMessage(message);
        
        ContactMessage savedMessage = new ContactMessage();
        savedMessage.setId(1L);
        
        when(contactService.saveMessage(any())).thenReturn(savedMessage);
        
        mockMvc.perform(post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());
    }
    
    // Property 10: Invalid Data Rejection
    @Property(tries = 100)
    @Label("Feature: webvibes-technology-website, Property 10: Invalid data should return 400")
    void invalidDataReturns400(
        @ForAll @StringLength(max = 1) String shortName) throws Exception {
        
        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setName(shortName); // Too short
        dto.setEmail("valid@example.com");
        dto.setMessage("Valid message here");
        
        mockMvc.perform(post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }
}
```

### Integration Testing

**Frontend E2E Tests** (Cypress or Playwright):
- Test complete user flows
- Test navigation between pages
- Test form submissions with real API calls
- Test responsive behavior

**Backend Integration Tests**:
- Test with real database (TestContainers)
- Test complete request/response cycles
- Test transaction management
- Test data integrity

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 80% code coverage
- **Property Test Coverage**: All correctness properties implemented
- **Integration Test Coverage**: All critical user flows
- **E2E Test Coverage**: Happy path for each feature

### Continuous Integration

- Run all tests on every commit
- Fail build if tests fail
- Generate coverage reports
- Run property tests with high iteration counts in CI

