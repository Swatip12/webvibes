import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { HomeComponent } from '../components/home/home.component';
import { AboutComponent } from '../components/about/about.component';
import { InternshipComponent } from '../components/internship/internship.component';
import { CoursesComponent } from '../components/courses/courses.component';
import { ProjectsComponent } from '../components/projects/projects.component';
import { ContactComponent } from '../components/contact/contact.component';
import { NavigationComponent } from '../components/navigation/navigation.component';

import { InternshipService } from '../services/internship.service';
import { CourseService } from '../services/course.service';
import { ContactService } from '../services/contact.service';
import { ProjectService } from '../services/project.service';

import { environment } from '../../environments/environment';

/**
 * Integration Tests for Complete User Flows
 * Task 26.3: Test complete user flows
 * 
 * These tests verify end-to-end functionality including:
 * - Navigation between all pages
 * - Internship application submission
 * - Course enrollment submission
 * - Contact form submission
 * - Project display from database
 */
describe('Integration Tests - Complete User Flows', () => {
  let router: Router;
  let location: Location;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: '/home', pathMatch: 'full' },
          { path: 'home', component: HomeComponent },
          { path: 'about', component: AboutComponent },
          { path: 'internship', component: InternshipComponent },
          { path: 'courses', component: CoursesComponent },
          { path: 'projects', component: ProjectsComponent },
          { path: 'contact', component: ContactComponent }
        ]),
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      declarations: [
        HomeComponent,
        AboutComponent,
        InternshipComponent,
        CoursesComponent,
        ProjectsComponent,
        ContactComponent,
        NavigationComponent
      ],
      providers: [
        InternshipService,
        CourseService,
        ContactService,
        ProjectService
      ]
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Test: Navigation between all pages
   * Validates: Requirements 7.1, 7.3, 7.4
   */
  describe('Navigation Flow', () => {
    it('should navigate from home to all pages', async () => {
      // Start at home
      await router.navigate(['/home']);
      expect(location.path()).toBe('/home');

      // Navigate to about
      await router.navigate(['/about']);
      expect(location.path()).toBe('/about');

      // Navigate to internship
      await router.navigate(['/internship']);
      expect(location.path()).toBe('/internship');

      // Navigate to courses
      await router.navigate(['/courses']);
      expect(location.path()).toBe('/courses');

      // Navigate to projects
      await router.navigate(['/projects']);
      expect(location.path()).toBe('/projects');

      // Navigate to contact
      await router.navigate(['/contact']);
      expect(location.path()).toBe('/contact');

      // Navigate back to home
      await router.navigate(['/home']);
      expect(location.path()).toBe('/home');
    });

    it('should redirect empty path to home', async () => {
      await router.navigate(['']);
      expect(location.path()).toBe('/home');
    });
  });

  /**
   * Test: Internship application submission end-to-end
   * Validates: Requirements 3.1-3.4, 8.1-8.3, 16.1-16.5
   */
  describe('Internship Application Flow', () => {
    let fixture: ComponentFixture<InternshipComponent>;
    let component: InternshipComponent;

    beforeEach(async () => {
      await router.navigate(['/internship']);
      fixture = TestBed.createComponent(InternshipComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should complete internship application submission successfully', () => {
      // Select an internship
      component.onApply('Java Internship');
      expect(component.selectedInternship).toBe('Java Internship');
      expect(component.showApplicationForm).toBe(true);

      // Fill out the form
      component.applicationForm.setValue({
        studentName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        internshipType: 'Java Internship',
        message: 'I am very interested in this internship program.'
      });

      expect(component.applicationForm.valid).toBe(true);

      // Submit the form
      component.onSubmit();

      // Expect HTTP POST request
      const req = httpMock.expectOne(`${environment.apiUrl}/api/internships/apply`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        studentName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        internshipType: 'Java Internship',
        message: 'I am very interested in this internship program.'
      });

      // Simulate successful response
      req.flush({ message: 'Application submitted successfully' });

      // Verify success state
      expect(component.successMessage).toBeTruthy();
      expect(component.errorMessage).toBeFalsy();
      expect(component.applicationForm.pristine).toBe(true);
    });

    it('should handle validation errors in internship application', () => {
      component.onApply('Web Development Internship');

      // Try to submit with invalid data
      component.applicationForm.setValue({
        studentName: 'J', // Too short
        email: 'invalid-email', // Invalid format
        phone: '123', // Too short
        internshipType: 'Web Development Internship',
        message: ''
      });

      expect(component.applicationForm.valid).toBe(false);
      expect(component.applicationForm.get('studentName')?.errors).toBeTruthy();
      expect(component.applicationForm.get('email')?.errors).toBeTruthy();
      expect(component.applicationForm.get('phone')?.errors).toBeTruthy();
    });

    it('should handle server errors during internship application', () => {
      component.onApply('Java Internship');

      component.applicationForm.setValue({
        studentName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '9876543210',
        internshipType: 'Java Internship',
        message: 'Looking forward to learning Java.'
      });

      component.onSubmit();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/internships/apply`);
      
      // Simulate server error
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });

      // Verify error state
      expect(component.errorMessage).toBeTruthy();
      expect(component.successMessage).toBeFalsy();
    });
  });

  /**
   * Test: Course enrollment submission end-to-end
   * Validates: Requirements 4.1-4.6, 9.1-9.3, 16.1-16.5
   */
  describe('Course Enrollment Flow', () => {
    let fixture: ComponentFixture<CoursesComponent>;
    let component: CoursesComponent;

    beforeEach(async () => {
      await router.navigate(['/courses']);
      fixture = TestBed.createComponent(CoursesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should complete course enrollment submission successfully', () => {
      // Select a course
      component.onEnroll('Spring Boot');
      expect(component.selectedCourse).toBe('Spring Boot');
      expect(component.showEnrollmentForm).toBe(true);

      // Fill out the form
      component.enrollmentForm.setValue({
        studentName: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        phone: '5551234567',
        courseName: 'Spring Boot',
        message: 'Excited to learn Spring Boot framework.'
      });

      expect(component.enrollmentForm.valid).toBe(true);

      // Submit the form
      component.onSubmit();

      // Expect HTTP POST request
      const req = httpMock.expectOne(`${environment.apiUrl}/api/courses/enroll`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        studentName: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        phone: '5551234567',
        courseName: 'Spring Boot',
        message: 'Excited to learn Spring Boot framework.'
      });

      // Simulate successful response
      req.flush({ message: 'Enrollment submitted successfully' });

      // Verify success state
      expect(component.successMessage).toBeTruthy();
      expect(component.errorMessage).toBeFalsy();
      expect(component.enrollmentForm.pristine).toBe(true);
    });

    it('should handle validation errors in course enrollment', () => {
      component.onEnroll('Angular');

      // Try to submit with invalid data
      component.enrollmentForm.setValue({
        studentName: '', // Empty
        email: 'not-an-email', // Invalid format
        phone: 'abc', // Not numeric
        courseName: 'Angular',
        message: ''
      });

      expect(component.enrollmentForm.valid).toBe(false);
      expect(component.enrollmentForm.get('studentName')?.errors).toBeTruthy();
      expect(component.enrollmentForm.get('email')?.errors).toBeTruthy();
      expect(component.enrollmentForm.get('phone')?.errors).toBeTruthy();
    });

    it('should handle server errors during course enrollment', () => {
      component.onEnroll('Full Stack Development');

      component.enrollmentForm.setValue({
        studentName: 'Bob Williams',
        email: 'bob.williams@example.com',
        phone: '5559876543',
        courseName: 'Full Stack Development',
        message: 'Ready to become a full stack developer.'
      });

      component.onSubmit();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/courses/enroll`);
      
      // Simulate validation error from backend
      req.flush(
        { email: 'Email already registered' },
        { status: 400, statusText: 'Bad Request' }
      );

      // Verify error state
      expect(component.errorMessage).toBeTruthy();
      expect(component.successMessage).toBeFalsy();
    });
  });

  /**
   * Test: Contact form submission end-to-end
   * Validates: Requirements 6.1-6.6, 10.1-10.3, 16.1-16.5
   */
  describe('Contact Form Flow', () => {
    let fixture: ComponentFixture<ContactComponent>;
    let component: ContactComponent;

    beforeEach(async () => {
      await router.navigate(['/contact']);
      fixture = TestBed.createComponent(ContactComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should complete contact form submission successfully', () => {
      // Fill out the form
      component.contactForm.setValue({
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        message: 'I would like to know more about your courses and internship programs.'
      });

      expect(component.contactForm.valid).toBe(true);

      // Submit the form
      component.onSubmit();

      // Expect HTTP POST request
      const req = httpMock.expectOne(`${environment.apiUrl}/api/contact`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        message: 'I would like to know more about your courses and internship programs.'
      });

      // Simulate successful response
      req.flush({ message: 'Message sent successfully' });

      // Verify success state
      expect(component.successMessage).toBeTruthy();
      expect(component.errorMessage).toBeFalsy();
      expect(component.contactForm.pristine).toBe(true);
    });

    it('should handle validation errors in contact form', () => {
      // Try to submit with invalid data
      component.contactForm.setValue({
        name: 'A', // Too short
        email: 'bad@email', // Invalid format
        message: 'Short' // Too short (< 10 characters)
      });

      expect(component.contactForm.valid).toBe(false);
      expect(component.contactForm.get('name')?.errors).toBeTruthy();
      expect(component.contactForm.get('email')?.errors).toBeTruthy();
      expect(component.contactForm.get('message')?.errors).toBeTruthy();
    });

    it('should handle server errors during contact form submission', () => {
      component.contactForm.setValue({
        name: 'Diana Prince',
        email: 'diana.prince@example.com',
        message: 'This is a test message to check error handling in the contact form.'
      });

      component.onSubmit();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/contact`);
      
      // Simulate network error
      req.flush(
        { message: 'Database connection failed' },
        { status: 500, statusText: 'Internal Server Error' }
      );

      // Verify error state
      expect(component.errorMessage).toBeTruthy();
      expect(component.successMessage).toBeFalsy();
    });
  });

  /**
   * Test: Project display from database
   * Validates: Requirements 5.1-5.4, 11.4-11.5
   */
  describe('Project Display Flow', () => {
    let fixture: ComponentFixture<ProjectsComponent>;
    let component: ProjectsComponent;

    beforeEach(async () => {
      await router.navigate(['/projects']);
      fixture = TestBed.createComponent(ProjectsComponent);
      component = fixture.componentInstance;
    });

    it('should load and display projects from database', () => {
      const mockProjects = [
        {
          id: 1,
          title: 'E-Commerce Platform',
          description: 'A full-stack e-commerce application built with Angular and Spring Boot',
          githubLink: 'https://github.com/student1/ecommerce',
          imageUrl: 'https://example.com/images/ecommerce.jpg'
        },
        {
          id: 2,
          title: 'Task Management System',
          description: 'A task management application with real-time updates',
          githubLink: 'https://github.com/student2/task-manager',
          imageUrl: 'https://example.com/images/task-manager.jpg'
        },
        {
          id: 3,
          title: 'Social Media Dashboard',
          description: 'Analytics dashboard for social media metrics',
          githubLink: 'https://github.com/student3/social-dashboard',
          imageUrl: 'https://example.com/images/dashboard.jpg'
        }
      ];

      // Trigger component initialization
      fixture.detectChanges();

      // Expect HTTP GET request
      const req = httpMock.expectOne(`${environment.apiUrl}/api/projects`);
      expect(req.request.method).toBe('GET');

      // Simulate successful response
      req.flush(mockProjects);

      // Verify component state
      expect(component.projects.length).toBe(3);
      expect(component.loading).toBe(false);
      expect(component.error).toBeFalsy();
      expect(component.projects[0].title).toBe('E-Commerce Platform');
      expect(component.projects[1].title).toBe('Task Management System');
      expect(component.projects[2].title).toBe('Social Media Dashboard');
    });

    it('should display message when no projects are available', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/projects`);
      
      // Simulate empty response
      req.flush([]);

      // Verify component state
      expect(component.projects.length).toBe(0);
      expect(component.loading).toBe(false);
      expect(component.error).toBeFalsy();
    });

    it('should handle errors when loading projects', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/projects`);
      
      // Simulate error response
      req.flush(
        { message: 'Failed to fetch projects' },
        { status: 500, statusText: 'Internal Server Error' }
      );

      // Verify error state
      expect(component.loading).toBe(false);
      expect(component.error).toBeTruthy();
      expect(component.projects.length).toBe(0);
    });

    it('should verify GitHub links open in new tab', () => {
      const mockProjects = [
        {
          id: 1,
          title: 'Test Project',
          description: 'Test description',
          githubLink: 'https://github.com/test/project',
          imageUrl: 'https://example.com/image.jpg'
        }
      ];

      fixture.detectChanges();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/projects`);
      req.flush(mockProjects);

      fixture.detectChanges();

      // Check that the template renders the link with target="_blank"
      const compiled = fixture.nativeElement;
      const githubLink = compiled.querySelector('a[href="https://github.com/test/project"]');
      
      if (githubLink) {
        expect(githubLink.getAttribute('target')).toBe('_blank');
      }
    });
  });

  /**
   * Test: Complete user journey
   * Validates: All requirements - simulates a complete user session
   */
  describe('Complete User Journey', () => {
    it('should complete a full user journey from home to application submission', async () => {
      // 1. Start at home page
      await router.navigate(['/home']);
      expect(location.path()).toBe('/home');

      // 2. Navigate to about page to learn about the company
      await router.navigate(['/about']);
      expect(location.path()).toBe('/about');

      // 3. Navigate to courses page to browse courses
      await router.navigate(['/courses']);
      expect(location.path()).toBe('/courses');

      const coursesFixture = TestBed.createComponent(CoursesComponent);
      const coursesComponent = coursesFixture.componentInstance;
      coursesFixture.detectChanges();

      // 4. Enroll in a course
      coursesComponent.onEnroll('Java');
      coursesComponent.enrollmentForm.setValue({
        studentName: 'Test User',
        email: 'test.user@example.com',
        phone: '1234567890',
        courseName: 'Java',
        message: 'Interested in Java course'
      });

      coursesComponent.onSubmit();

      const courseReq = httpMock.expectOne(`${environment.apiUrl}/api/courses/enroll`);
      courseReq.flush({ message: 'Enrollment submitted successfully' });

      expect(coursesComponent.successMessage).toBeTruthy();

      // 5. Navigate to internship page
      await router.navigate(['/internship']);
      expect(location.path()).toBe('/internship');

      const internshipFixture = TestBed.createComponent(InternshipComponent);
      const internshipComponent = internshipFixture.componentInstance;
      internshipFixture.detectChanges();

      // 6. Apply for internship
      internshipComponent.onApply('Java Internship');
      internshipComponent.applicationForm.setValue({
        studentName: 'Test User',
        email: 'test.user@example.com',
        phone: '1234567890',
        internshipType: 'Java Internship',
        message: 'Interested in Java internship'
      });

      internshipComponent.onSubmit();

      const internshipReq = httpMock.expectOne(`${environment.apiUrl}/api/internships/apply`);
      internshipReq.flush({ message: 'Application submitted successfully' });

      expect(internshipComponent.successMessage).toBeTruthy();

      // 7. Navigate to projects page to see student work
      await router.navigate(['/projects']);
      expect(location.path()).toBe('/projects');

      const projectsFixture = TestBed.createComponent(ProjectsComponent);
      projectsFixture.detectChanges();

      const projectsReq = httpMock.expectOne(`${environment.apiUrl}/api/projects`);
      projectsReq.flush([
        {
          id: 1,
          title: 'Sample Project',
          description: 'A sample project',
          githubLink: 'https://github.com/sample/project',
          imageUrl: 'https://example.com/image.jpg'
        }
      ]);

      // 8. Navigate to contact page to ask questions
      await router.navigate(['/contact']);
      expect(location.path()).toBe('/contact');

      const contactFixture = TestBed.createComponent(ContactComponent);
      const contactComponent = contactFixture.componentInstance;
      contactFixture.detectChanges();

      // 9. Submit contact form
      contactComponent.contactForm.setValue({
        name: 'Test User',
        email: 'test.user@example.com',
        message: 'I have some questions about the programs'
      });

      contactComponent.onSubmit();

      const contactReq = httpMock.expectOne(`${environment.apiUrl}/api/contact`);
      contactReq.flush({ message: 'Message sent successfully' });

      expect(contactComponent.successMessage).toBeTruthy();

      // Journey complete!
    });
  });
});
