import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InternshipService } from '../../services/internship.service';

interface InternshipCard {
  id: string;
  title: string;
  duration: string;
  location: string;
  requirements: string[];
  skills: string[];
}

@Component({
  selector: 'app-internship',
  templateUrl: './internship.component.html',
  styleUrls: ['./internship.component.css']
})
export class InternshipComponent implements OnInit {
  selectedInternship: string | null = null;
  showApplicationForm: boolean = false;
  applicationForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  // Search and filter properties
  searchQuery: string = '';
  selectedLocation: string = '';
  selectedDuration: string = '';

  internships: InternshipCard[] = [
    {
      id: '1',
      title: 'Full Stack Java Developer',
      duration: '6 months',
      location: 'Remote',
      requirements: ['Java', 'Spring Boot', 'REST APIs', 'MySQL'],
      skills: ['Core Java', 'Spring Framework', 'Microservices', 'Git', 'Agile']
    },
    {
      id: '2',
      title: 'Frontend Developer',
      duration: '3-6 months',
      location: 'Hybrid',
      requirements: ['Angular', 'TypeScript', 'HTML/CSS', 'JavaScript'],
      skills: ['Angular', 'TypeScript', 'RxJS', 'Material Design', 'Git']
    },
    {
      id: '3',
      title: 'Backend Developer',
      duration: '6+ months',
      location: 'On-site',
      requirements: ['Java', 'AWS', 'Docker', 'Kubernetes'],
      skills: ['Java', 'Spring Boot', 'AWS Services', 'Docker', 'CI/CD']
    },
    {
      id: '4',
      title: 'Mobile App Developer',
      duration: '3-6 months',
      location: 'Hybrid',
      requirements: ['Android', 'Kotlin', 'Java', 'REST APIs'],
      skills: ['Android SDK', 'Kotlin', 'MVVM', 'Retrofit', 'Firebase']
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      duration: '6+ months',
      location: 'Remote',
      requirements: ['Linux', 'Docker', 'Jenkins', 'AWS'],
      skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform']
    },
    {
      id: '6',
      title: 'Data Science Intern',
      duration: '3-6 months',
      location: 'On-site',
      requirements: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
      skills: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'SQL']
    }
  ];

  filteredInternships: InternshipCard[] = [];

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

  ngOnInit(): void {
    this.filteredInternships = [...this.internships];
  }

  get studentName() { return this.applicationForm.get('studentName'); }
  get email() { return this.applicationForm.get('email'); }
  get phone() { return this.applicationForm.get('phone'); }
  get internshipType() { return this.applicationForm.get('internshipType'); }
  get message() { return this.applicationForm.get('message'); }

  // Search and filter methods
  onSearchChange(): void {
    this.applyFilters();
  }

  onLocationChange(): void {
    this.applyFilters();
  }

  onDurationChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredInternships = this.internships.filter(internship => {
      // Search filter (title, skills)
      const searchLower = this.searchQuery.toLowerCase();
      const matchesSearch = !this.searchQuery || 
        internship.title.toLowerCase().includes(searchLower) ||
        internship.skills.some(skill => skill.toLowerCase().includes(searchLower));

      // Location filter
      const matchesLocation = !this.selectedLocation || 
        internship.location === this.selectedLocation;

      // Duration filter
      const matchesDuration = !this.selectedDuration || 
        this.matchesDurationFilter(internship.duration, this.selectedDuration);

      return matchesSearch && matchesLocation && matchesDuration;
    });
  }

  private matchesDurationFilter(duration: string, filter: string): boolean {
    if (filter === '1-3 months') {
      return duration.includes('3 months') && !duration.includes('3-6');
    } else if (filter === '3-6 months') {
      return duration.includes('3-6 months');
    } else if (filter === '6+ months') {
      return duration.includes('6+ months') || duration.includes('6 months');
    }
    return false;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedLocation = '';
    this.selectedDuration = '';
    this.filteredInternships = [...this.internships];
  }

  onApply(internship: InternshipCard): void {
    this.selectedInternship = internship.title;
    this.showApplicationForm = true;
    this.successMessage = '';
    this.errorMessage = '';
    // Pre-fill internshipType from selected internship
    this.applicationForm.patchValue({
      internshipType: internship.title
    });
  }

  onSubmit(): void {
    if (this.applicationForm.valid) {
      this.successMessage = '';
      this.errorMessage = '';
      
      this.internshipService.submitApplication(this.applicationForm.value).subscribe({
        next: () => {
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
