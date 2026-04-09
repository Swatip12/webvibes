import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentService } from '../../services/assessment.service';
import { StudentAssessmentDTO, AssessmentType, AssessmentStatus } from '../../models/dtos';

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.css']
})
export class AssessmentListComponent implements OnInit {
  assessments: StudentAssessmentDTO[] = [];
  isLoading = false;
  errorMessage = '';
  paymentGated = false;

  constructor(
    private assessmentService: AssessmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAssessments();
  }

  loadAssessments(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.assessmentService.getMyAssessments().subscribe({
      next: (data) => {
        this.assessments = data;
        this.paymentGated = data.length === 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 403) {
          this.paymentGated = true;
        } else {
          this.errorMessage = 'Failed to load assessments. Please try again.';
        }
      }
    });
  }

  getStatusClass(status: AssessmentStatus): string {
    switch (status) {
      case 'PENDING': return 'badge-pending';
      case 'UPCOMING': return 'badge-upcoming';
      case 'COMPLETED': return 'badge-completed';
      default: return '';
    }
  }

  isMcqOrAptitude(type: AssessmentType): boolean {
    return type === 'TECHNICAL_MCQ' || type === 'APTITUDE_TEST';
  }

  isMachineTest(type: AssessmentType): boolean {
    return type === 'MACHINE_TEST';
  }

  isMockInterview(type: AssessmentType): boolean {
    return type === 'MOCK_INTERVIEW';
  }

  startTest(assessment: StudentAssessmentDTO): void {
    this.router.navigate(['/student/assessments', assessment.studentAssessmentId, 'take']);
  }

  viewProblem(assessment: StudentAssessmentDTO): void {
    this.router.navigate(['/student/assessments', assessment.studentAssessmentId, 'machine']);
  }

  joinInterview(assessment: StudentAssessmentDTO): void {
    this.router.navigate(['/student/assessments', assessment.studentAssessmentId, 'interview']);
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getTypeLabel(type: AssessmentType): string {
    switch (type) {
      case 'MOCK_INTERVIEW': return 'Mock Interview';
      case 'APTITUDE_TEST': return 'Aptitude Test';
      case 'MACHINE_TEST': return 'Machine Test';
      case 'TECHNICAL_MCQ': return 'Technical MCQ';
      default: return type;
    }
  }
}
