import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InternshipService } from '../../services/internship.service';

@Component({
  selector: 'app-internship',
  templateUrl: './internship.component.html',
  styleUrls: ['./internship.component.css']
})
export class InternshipComponent {
  selectedInternship: string | null = null;
  showApplicationForm: boolean = false;
  applicationForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  internships = [
    {
      type: 'Java Internship',
      description: 'Gain hands-on experience with Java programming, object-oriented design, and enterprise application development.',
      duration: '3 months',
      skills: ['Core Java', 'OOP Concepts', 'Collections Framework', 'Exception Handling', 'JDBC']
    },
    {
      type: 'Web Development Internship',
      description: 'Learn modern web development with HTML, CSS, JavaScript, and popular frameworks to build responsive web applications.',
      duration: '3 months',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'Angular', 'Responsive Design']
    }
  ];

  constructor(
    private fb: FormBuilder,
    private internshipService: InternshipService
  ) {
    this.applicationForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      internshipType: ['', Validators.required],
      message: ['', [Validators.maxLength(500)]]
    });
  }

  get studentName() { return this.applicationForm.get('studentName'); }
  get email() { return this.applicationForm.get('email'); }
  get phone() { return this.applicationForm.get('phone'); }
  get internshipType() { return this.applicationForm.get('internshipType'); }
  get message() { return this.applicationForm.get('message'); }

  onApply(internshipType: string): void {
    this.selectedInternship = internshipType;
    this.showApplicationForm = true;
    this.successMessage = '';
    this.errorMessage = '';
    // Pre-fill internshipType from selected internship
    this.applicationForm.patchValue({
      internshipType: internshipType
    });
  }

  onSubmit(): void {
    if (this.applicationForm.valid) {
      this.successMessage = '';
      this.errorMessage = '';
      
      this.internshipService.submitApplication(this.applicationForm.value).subscribe({
        next: (response) => {
          this.successMessage = 'Application submitted successfully! We will contact you soon.';
          this.applicationForm.reset();
          // Optionally hide the form after a delay
          setTimeout(() => {
            this.showApplicationForm = false;
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to submit application. Please try again.';
        }
      });
    }
  }

  onCancel(): void {
    this.showApplicationForm = false;
    this.applicationForm.reset();
  }
}
