import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAssessmentService } from '../../services/admin-assessment.service';
import {
  AssessmentDTO,
  AssessmentType,
  AssessmentStatus,
  QuestionDTO,
  CreateQuestionRequest,
  AssignRequest,
  AssignResponse,
  ResultDTO,
  UpdateStatusRequest
} from '../../models/dtos';

@Component({
  selector: 'app-admin-assessment-detail',
  templateUrl: './admin-assessment-detail.component.html',
  styleUrls: ['./admin-assessment-detail.component.css']
})
export class AdminAssessmentDetailComponent implements OnInit {
  assessment: AssessmentDTO | null = null;
  results: ResultDTO[] = [];
  loading = false;
  resultsLoading = false;
  error = '';
  successMsg = '';

  // Question form
  questionForm: CreateQuestionRequest = {
    prompt: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswerIndex: 0
  };
  addingQuestion = false;
  questionError = '';
  questionSuccess = '';

  // Assign section
  assignMode: 'batch' | 'ids' = 'batch';
  batchName = '';
  studentIdsInput = '';
  assigning = false;
  assignResponse: AssignResponse | null = null;
  assignError = '';

  // Status update
  updatingStatusId: number | null = null;

  readonly statuses: AssessmentStatus[] = ['PENDING', 'UPCOMING', 'COMPLETED'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminAssessmentService: AdminAssessmentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadAssessment(id);
      this.loadResults(id);
    }
  }

  loadAssessment(id: number): void {
    this.loading = true;
    this.error = '';
    this.adminAssessmentService.getAssessment(id).subscribe({
      next: (data) => {
        this.assessment = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load assessment.';
        this.loading = false;
      }
    });
  }

  loadResults(id: number): void {
    this.resultsLoading = true;
    this.adminAssessmentService.getResults(id).subscribe({
      next: (data) => {
        this.results = data;
        this.resultsLoading = false;
      },
      error: () => {
        this.resultsLoading = false;
      }
    });
  }

  isMcqOrAptitude(): boolean {
    return this.assessment?.type === 'TECHNICAL_MCQ' || this.assessment?.type === 'APTITUDE_TEST';
  }

  isMachineTest(): boolean {
    return this.assessment?.type === 'MACHINE_TEST';
  }

  isMockInterview(): boolean {
    return this.assessment?.type === 'MOCK_INTERVIEW';
  }

  // Question management
  addQuestion(): void {
    if (!this.assessment) return;
    this.addingQuestion = true;
    this.questionError = '';
    this.questionSuccess = '';

    this.adminAssessmentService.addQuestion(this.assessment.id, this.questionForm).subscribe({
      next: (q) => {
        if (!this.assessment!.questions) {
          this.assessment!.questions = [];
        }
        this.assessment!.questions.push(q);
        this.questionSuccess = 'Question added successfully.';
        this.resetQuestionForm();
        this.addingQuestion = false;
      },
      error: (err) => {
        this.questionError = err?.error?.message || 'Failed to add question.';
        this.addingQuestion = false;
      }
    });
  }

  deleteQuestion(questionId: number): void {
    if (!this.assessment) return;
    if (!confirm('Delete this question?')) return;

    this.adminAssessmentService.deleteQuestion(this.assessment.id, questionId).subscribe({
      next: () => {
        this.assessment!.questions = this.assessment!.questions?.filter(q => q.id !== questionId) || [];
        this.questionSuccess = 'Question deleted.';
      },
      error: () => {
        this.questionError = 'Failed to delete question.';
      }
    });
  }

  resetQuestionForm(): void {
    this.questionForm = {
      prompt: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswerIndex: 0
    };
  }

  // Assign section
  assign(): void {
    if (!this.assessment) return;
    this.assigning = true;
    this.assignError = '';
    this.assignResponse = null;

    const req: AssignRequest = {};
    if (this.assignMode === 'batch') {
      req.batchName = this.batchName.trim();
    } else {
      req.studentIds = this.studentIdsInput
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n));
    }

    this.adminAssessmentService.assignAssessment(this.assessment.id, req).subscribe({
      next: (res) => {
        this.assignResponse = res;
        this.assigning = false;
        this.batchName = '';
        this.studentIdsInput = '';
        this.loadResults(this.assessment!.id);
      },
      error: (err) => {
        this.assignError = err?.error?.message || 'Failed to assign assessment.';
        this.assigning = false;
      }
    });
  }

  // Status update
  updateStatus(saId: number, status: AssessmentStatus): void {
    this.updatingStatusId = saId;
    const req: UpdateStatusRequest = { status };
    this.adminAssessmentService.updateStudentAssessmentStatus(saId, req).subscribe({
      next: () => {
        const result = this.results.find(r => r.studentAssessmentId === saId);
        if (result) result.status = status;
        this.updatingStatusId = null;
      },
      error: () => {
        this.updatingStatusId = null;
      }
    });
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

  getStatusBadgeClass(status: AssessmentStatus): string {
    switch (status) {
      case 'PENDING': return 'badge-pending';
      case 'UPCOMING': return 'badge-upcoming';
      case 'COMPLETED': return 'badge-completed';
      default: return '';
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/assessments']);
  }
}
