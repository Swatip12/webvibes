import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  selectedCourse: string | null = null;
  showEnrollmentForm: boolean = false;
  enrollmentForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  courses = [
    {
      name: 'Java',
      description: 'Master Java programming from basics to advanced concepts. Learn object-oriented programming, data structures, and build robust applications.',
      duration: '2 months',
      technologies: ['Core Java', 'OOP', 'Collections', 'Exception Handling', 'Multithreading']
    },
    {
      name: 'Spring Boot',
      description: 'Build enterprise-grade applications with Spring Boot. Learn REST APIs, dependency injection, and microservices architecture.',
      duration: '2 months',
      technologies: ['Spring Framework', 'Spring Boot', 'REST API', 'Spring Data JPA', 'Microservices']
    },
    {
      name: 'Angular',
      description: 'Create dynamic single-page applications with Angular. Master TypeScript, components, services, and reactive programming.',
      duration: '2 months',
      technologies: ['TypeScript', 'Components', 'Services', 'RxJS', 'Angular Router']
    },
    {
      name: 'Full Stack Development',
      description: 'Become a full-stack developer by mastering both frontend and backend technologies. Build complete web applications from scratch.',
      duration: '4 months',
      technologies: ['Java', 'Spring Boot', 'Angular', 'MySQL', 'REST APIs']
    }
  ];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService
  ) {
    this.enrollmentForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      courseName: ['', Validators.required],
      message: ['', [Validators.maxLength(500)]]
    });
  }

  get studentName() { return this.enrollmentForm.get('studentName'); }
  get email() { return this.enrollmentForm.get('email'); }
  get phone() { return this.enrollmentForm.get('phone'); }
  get courseName() { return this.enrollmentForm.get('courseName'); }
  get message() { return this.enrollmentForm.get('message'); }

  onEnroll(courseName: string): void {
    this.selectedCourse = courseName;
    this.showEnrollmentForm = true;
    this.successMessage = '';
    this.errorMessage = '';
    // Pre-fill courseName from selected course
    this.enrollmentForm.patchValue({
      courseName: courseName
    });
  }

  onSubmit(): void {
    if (this.enrollmentForm.valid) {
      this.successMessage = '';
      this.errorMessage = '';
      
      this.courseService.submitEnrollment(this.enrollmentForm.value).subscribe({
        next: () => {
          this.successMessage = 'Enrollment submitted successfully! We will contact you soon.';
          this.enrollmentForm.reset();
          // Optionally hide the form after a delay
          setTimeout(() => {
            this.showEnrollmentForm = false;
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to submit enrollment. Please try again.';
        }
      });
    }
  }

  onCancel(): void {
    this.showEnrollmentForm = false;
    this.enrollmentForm.reset();
  }
}
