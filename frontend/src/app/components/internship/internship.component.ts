import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InternshipService } from '../../services/internship.service';
import { SeoService } from '../../services/seo.service';

interface InternshipCard {
  id: string;
  title: string;
  duration: string;
  location: string;
  level: string;
  description: string;
  icon: string;
  requirements: string[];
  skills: string[];
  perks: string[];
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

  searchQuery: string = '';
  selectedLocation: string = '';
  selectedDuration: string = '';

  internships: InternshipCard[] = [
    {
      id: '1',
      title: 'Full Stack Java Developer',
      duration: '6 months',
      location: 'Remote',
      level: 'Intermediate',
      description: 'Build end-to-end web applications using Java, Spring Boot, and Angular. Work on real client projects with mentorship from senior developers.',
      icon: 'fab fa-java',
      requirements: ['Java', 'Spring Boot', 'REST APIs', 'MySQL'],
      skills: ['Core Java', 'Spring Framework', 'Microservices', 'Git', 'Agile'],
      perks: ['Certificate', 'Letter of Recommendation', 'Job Referral']
    },
    {
      id: '2',
      title: 'Frontend Developer',
      duration: '3-6 months',
      location: 'Hybrid',
      level: 'Beginner',
      description: 'Create stunning, responsive UIs with Angular and TypeScript. Learn component architecture, state management, and modern CSS techniques.',
      icon: 'fas fa-laptop-code',
      requirements: ['Angular', 'TypeScript', 'HTML/CSS', 'JavaScript'],
      skills: ['Angular', 'TypeScript', 'RxJS', 'Material Design', 'Git'],
      perks: ['Certificate', 'Portfolio Projects', 'Mentorship']
    },
    {
      id: '3',
      title: 'Backend Developer',
      duration: '6+ months',
      location: 'On-site',
      level: 'Advanced',
      description: 'Design and build scalable backend systems using Java, Spring Boot, and cloud services. Work with Docker, Kubernetes, and CI/CD pipelines.',
      icon: 'fas fa-server',
      requirements: ['Java', 'AWS', 'Docker', 'Kubernetes'],
      skills: ['Java', 'Spring Boot', 'AWS Services', 'Docker', 'CI/CD'],
      perks: ['Certificate', 'Cloud Exposure', 'Job Referral']
    },
    {
      id: '4',
      title: 'Mobile App Developer',
      duration: '3-6 months',
      location: 'Hybrid',
      level: 'Intermediate',
      description: 'Develop Android applications using Kotlin and Java. Build real apps from scratch with MVVM architecture and Firebase integration.',
      icon: 'fas fa-mobile-alt',
      requirements: ['Android', 'Kotlin', 'Java', 'REST APIs'],
      skills: ['Android SDK', 'Kotlin', 'MVVM', 'Retrofit', 'Firebase'],
      perks: ['Certificate', 'Play Store Deployment', 'Mentorship']
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      duration: '6+ months',
      location: 'Remote',
      level: 'Advanced',
      description: 'Automate deployments, manage cloud infrastructure, and build CI/CD pipelines. Hands-on with Docker, Kubernetes, Jenkins, and AWS.',
      icon: 'fas fa-cogs',
      requirements: ['Linux', 'Docker', 'Jenkins', 'AWS'],
      skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform'],
      perks: ['Certificate', 'AWS Exposure', 'Letter of Recommendation']
    },
    {
      id: '6',
      title: 'Data Science Intern',
      duration: '3-6 months',
      location: 'On-site',
      level: 'Beginner',
      description: 'Explore data analysis, machine learning, and visualization using Python. Work on real datasets and build predictive models.',
      icon: 'fas fa-chart-bar',
      requirements: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
      skills: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'SQL'],
      perks: ['Certificate', 'Research Projects', 'Mentorship']
    }
  ];

  filteredInternships: InternshipCard[] = [...this.internships];

  constructor(private fb: FormBuilder, private internshipService: InternshipService, private seo: SeoService) {
    this.applicationForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      internshipType: ['', Validators.required],
      message: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.seo.setPage({
      title: 'IT Internship Programs — Java, Angular, Android, DevOps, Data Science',
      description: 'Apply for IT internships at WebVibes Technology. Hands-on programs in Full Stack Java, Frontend Angular, Backend, Mobile App, DevOps, and Data Science. Get certificate, LOR, and job referral.',
      keywords: 'IT internship India, Java internship, Angular internship, software developer internship, industrial training program, internship with certificate, paid internship India, web development internship',
      canonical: 'https://webvibestechnology.vercel.app/internship'
    });
    this.internshipService.getInternships().subscribe({
      next: (apiInternships) => {
        if (apiInternships && apiInternships.length > 0) {
          const dbInternships: InternshipCard[] = apiInternships.map((i: any) => {
            const months = i.duration || 3;
            const skillList = i.skills ? i.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [];
            return {
              id: String(i.id),
              title: i.type,
              duration: `${months} month${months !== 1 ? 's' : ''}`,
              location: 'Remote',
              level: 'Beginner',
              description: i.description,
              icon: 'fas fa-laptop-code',
              requirements: skillList.slice(0, 4),
              skills: skillList,
              perks: ['Certificate', 'Letter of Recommendation']
            };
          });
          // Merge: DB internships first, then hardcoded ones not already in DB
          const dbTitles = new Set(dbInternships.map(i => i.title.toLowerCase()));
          const uniqueHardcoded = this.internships.filter(i => !dbTitles.has(i.title.toLowerCase()));
          this.internships = [...dbInternships, ...uniqueHardcoded];
        }
        this.filteredInternships = [...this.internships];
      },
      error: () => {
        this.filteredInternships = [...this.internships];
      }
    });
  }

  get studentName() { return this.applicationForm.get('studentName'); }
  get email()       { return this.applicationForm.get('email'); }
  get phone()       { return this.applicationForm.get('phone'); }
  get internshipType() { return this.applicationForm.get('internshipType'); }
  get message()     { return this.applicationForm.get('message'); }

  onSearchChange(): void   { this.applyFilters(); }
  onLocationChange(): void { this.applyFilters(); }
  onDurationChange(): void { this.applyFilters(); }

  applyFilters(): void {
    this.filteredInternships = this.internships.filter(i => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || i.title.toLowerCase().includes(q) || i.skills.some(s => s.toLowerCase().includes(q));
      const matchLoc    = !this.selectedLocation || i.location === this.selectedLocation;
      const matchDur    = !this.selectedDuration  || this.matchesDuration(i.duration, this.selectedDuration);
      return matchSearch && matchLoc && matchDur;
    });
  }

  private matchesDuration(dur: string, filter: string): boolean {
    if (filter === '1-3 months') return dur.includes('3 months') && !dur.includes('3-6');
    if (filter === '3-6 months') return dur.includes('3-6 months');
    if (filter === '6+ months')  return dur.includes('6+ months') || dur === '6 months';
    return false;
  }

  clearFilters(): void {
    this.searchQuery = ''; this.selectedLocation = ''; this.selectedDuration = '';
    this.filteredInternships = [...this.internships];
  }

  onApply(internship: InternshipCard): void {
    this.selectedInternship = internship.title;
    this.showApplicationForm = true;
    this.successMessage = ''; this.errorMessage = '';
    this.applicationForm.patchValue({ internshipType: internship.title });
  }

  onSubmit(): void {
    if (this.applicationForm.valid) {
      this.internshipService.submitApplication(this.applicationForm.value).subscribe({
        next: () => {
          this.successMessage = 'Application submitted successfully! We will contact you soon.';
          this.applicationForm.reset();
          setTimeout(() => { this.showApplicationForm = false; this.successMessage = ''; }, 3000);
        },
        error: (err) => { this.errorMessage = err.message || 'Failed to submit. Please try again.'; }
      });
    }
  }

  onCancel(): void { this.showApplicationForm = false; this.applicationForm.reset(); }
}
