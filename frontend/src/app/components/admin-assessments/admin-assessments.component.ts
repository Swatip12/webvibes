import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAssessmentService } from '../../services/admin-assessment.service';
import { AssessmentDTO, CreateAssessmentRequest, AssessmentType } from '../../models/dtos';

@Component({
  selector: 'app-admin-assessments',
  templateUrl: './admin-assessments.component.html',
  styleUrls: ['./admin-assessments.component.css']
})
export class AdminAssessmentsComponent implements OnInit {
  assessments: AssessmentDTO[] = [];
  loading = false;
  error = '';
  successMsg = '';

  showForm = false;
  submitting = false;

  assessmentTypes: AssessmentType[] = ['MOCK_INTERVIEW', 'APTITUDE_TEST', 'MACHINE_TEST', 'TECHNICAL_MCQ'];

  form: CreateAssessmentRequest = {
    title: '',
    description: '',
    type: 'APTITUDE_TEST',
    scheduledAt: '',
    videoLink: '',
    problemStatement: '',
    timeLimitMinutes: undefined
  };

  constructor(
    private adminAssessmentService: AdminAssessmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAssessments();
  }

  loadAssessments(): void {
    this.loading = true;
    this.error = '';
    this.adminAssessmentService.listAssessments().subscribe({
      next: (data) => {
        this.assessments = data.content || data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load assessments.';
        this.loading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
    this.error = '';
    this.successMsg = '';
  }

  resetForm(): void {
    this.form = {
      title: '',
      description: '',
      type: 'APTITUDE_TEST',
      scheduledAt: '',
      videoLink: '',
      problemStatement: '',
      timeLimitMinutes: undefined
    };
  }

  onTypeChange(): void {
    // Clear type-specific fields when type changes
    this.form.scheduledAt = '';
    this.form.videoLink = '';
    this.form.problemStatement = '';
    this.form.timeLimitMinutes = undefined;
  }

  isMockInterview(): boolean {
    return this.form.type === 'MOCK_INTERVIEW';
  }

  isMachineTest(): boolean {
    return this.form.type === 'MACHINE_TEST';
  }

  isMcqOrAptitude(): boolean {
    return this.form.type === 'TECHNICAL_MCQ' || this.form.type === 'APTITUDE_TEST';
  }

  createAssessment(): void {
    this.submitting = true;
    this.error = '';
    this.successMsg = '';

    const req: CreateAssessmentRequest = {
      title: this.form.title,
      description: this.form.description,
      type: this.form.type
    };

    if (this.isMockInterview()) {
      req.scheduledAt = this.form.scheduledAt;
      req.videoLink = this.form.videoLink;
    } else if (this.isMachineTest()) {
      req.problemStatement = this.form.problemStatement;
    } else if (this.isMcqOrAptitude()) {
      req.timeLimitMinutes = this.form.timeLimitMinutes;
    }

    this.adminAssessmentService.createAssessment(req).subscribe({
      next: (created) => {
        this.assessments.unshift(created);
        this.successMsg = `Assessment "${created.title}" created successfully.`;
        this.showForm = false;
        this.resetForm();
        this.submitting = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to create assessment.';
        this.submitting = false;
      }
    });
  }

  deleteAssessment(assessment: AssessmentDTO, event: Event): void {
    event.stopPropagation();
    if (!confirm(`Delete assessment "${assessment.title}"? This will also remove all student assignments.`)) {
      return;
    }
    this.adminAssessmentService.deleteAssessment(assessment.id).subscribe({
      next: () => {
        this.assessments = this.assessments.filter(a => a.id !== assessment.id);
        this.successMsg = `Assessment "${assessment.title}" deleted.`;
      },
      error: () => {
        this.error = 'Failed to delete assessment.';
      }
    });
  }

  viewDetail(id: number): void {
    this.router.navigate(['/admin/assessments', id]);
  }

  getTypeBadgeClass(type: AssessmentType): string {
    switch (type) {
      case 'MOCK_INTERVIEW': return 'badge-interview';
      case 'MACHINE_TEST': return 'badge-machine';
      case 'TECHNICAL_MCQ': return 'badge-mcq';
      case 'APTITUDE_TEST': return 'badge-aptitude';
      default: return '';
    }
  }

  copiedId: number | null = null;

  getAssessmentLink(a: AssessmentDTO): string {
    const base = window.location.origin;
    const path = a.type === 'MOCK_INTERVIEW' ? 'interview'
               : a.type === 'MACHINE_TEST'   ? 'machine'
               : 'take'; // TECHNICAL_MCQ + APTITUDE_TEST
    return `${base}/student/assessments/${a.id}/${path}`;
  }

  copyLink(a: AssessmentDTO): void {
    const link = this.getAssessmentLink(a);
    navigator.clipboard.writeText(link).then(() => {
      this.copiedId = a.id;
      setTimeout(() => this.copiedId = null, 2000);
    });
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}
