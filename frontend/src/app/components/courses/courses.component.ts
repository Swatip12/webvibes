import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';

interface Course {
  id?: number;
  name: string;
  description: string;
  duration: string;
  studentsCount: number;
  badge?: string;
  badgeType?: 'bestseller' | 'trending' | 'new';
  category: string;
  level: string;
  logoUrl: string;
  logoBg: string;
  durationMonths: number;
  syllabusUrl?: string;
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  selectedCourse: string | null = null;
  showEnrollmentForm: boolean = false;
  enrollmentForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  // Filter and search properties
  searchQuery: string = '';
  selectedCategory: string = 'All';
  selectedDuration: string = 'All';
  selectedLevel: string = 'All';
  sortBy: string = 'popular';

  courses: Course[] = [
    {
      name: 'Java Programming',
      description: 'Master Java programming from basics to advanced concepts. Learn object-oriented programming, data structures, and build robust applications with industry best practices.',
      duration: '2 months',
      durationMonths: 2,
      studentsCount: 1250,
      badge: 'Bestseller',
      badgeType: 'bestseller',
      category: 'Web Development',
      level: 'Beginner',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      logoBg: '#f89820'
    },
    {
      name: 'Spring Boot',
      description: 'Build enterprise-grade applications with Spring Boot. Learn REST APIs, dependency injection, microservices architecture, and deploy scalable backend systems.',
      duration: '2 months',
      durationMonths: 2,
      studentsCount: 980,
      badge: 'Trending',
      badgeType: 'trending',
      category: 'Web Development',
      level: 'Intermediate',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
      logoBg: '#6db33f'
    },
    {
      name: 'Angular Development',
      description: 'Create dynamic single-page applications with Angular. Master TypeScript, components, services, reactive programming with RxJS, and modern frontend architecture.',
      duration: '2 months',
      durationMonths: 2,
      studentsCount: 1100,
      badge: 'Bestseller',
      badgeType: 'bestseller',
      category: 'Web Development',
      level: 'Intermediate',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      logoBg: '#dd0031'
    },
    {
      name: 'Full Stack Development',
      description: 'Become a full-stack developer by mastering both frontend and backend technologies. Build complete web applications from scratch with modern tools and frameworks.',
      duration: '4 months',
      durationMonths: 4,
      studentsCount: 2100,
      badge: 'Bestseller',
      badgeType: 'bestseller',
      category: 'Web Development',
      level: 'Advanced',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      logoBg: '#20232a'
    },
    {
      name: 'Python for Data Science',
      description: 'Learn Python programming for data analysis and machine learning. Master pandas, NumPy, scikit-learn, and build predictive models with real-world datasets.',
      duration: '3 months',
      durationMonths: 3,
      studentsCount: 850,
      badge: 'New',
      badgeType: 'new',
      category: 'Data Science',
      level: 'Beginner',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      logoBg: '#3776ab'
    },
    {
      name: 'React Native',
      description: 'Build cross-platform mobile applications with React Native. Learn to create iOS and Android apps with a single codebase using modern JavaScript and React.',
      duration: '2 months',
      durationMonths: 2,
      studentsCount: 720,
      badge: 'Trending',
      badgeType: 'trending',
      category: 'Mobile',
      level: 'Intermediate',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      logoBg: '#61dafb'
    }
  ];

  filteredCourses: Course[] = [];

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

  ngOnInit(): void {
    this.applyFilters();
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

  applyFilters(): void {
    let filtered = [...this.courses];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(course => course.category === this.selectedCategory);
    }

    // Apply duration filter
    if (this.selectedDuration !== 'All') {
      filtered = filtered.filter(course => {
        const months = course.durationMonths;
        switch (this.selectedDuration) {
          case '< 2 months':
            return months < 2;
          case '2-4 months':
            return months >= 2 && months <= 4;
          case '4+ months':
            return months > 4;
          default:
            return true;
        }
      });
    }

    // Apply level filter
    if (this.selectedLevel !== 'All') {
      filtered = filtered.filter(course => course.level === this.selectedLevel);
    }

    // Apply sorting
    switch (this.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.studentsCount - a.studentsCount);
        break;
      case 'newest':
        // Assuming courses with 'New' badge are newest
        filtered.sort((a, b) => {
          if (a.badge === 'New' && b.badge !== 'New') return -1;
          if (a.badge !== 'New' && b.badge === 'New') return 1;
          return 0;
        });
        break;
      case 'duration':
        filtered.sort((a, b) => a.durationMonths - b.durationMonths);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    this.filteredCourses = filtered;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.selectedDuration = 'All';
    this.selectedLevel = 'All';
    this.sortBy = 'popular';
    this.applyFilters();
  }

  downloadSyllabus(course: Course): void {
    if (!course.syllabusUrl) return;
    if (course.id) {
      this.courseService.downloadSyllabus(course.id);
    } else {
      window.open(course.syllabusUrl, '_blank');
    }
  }

}
