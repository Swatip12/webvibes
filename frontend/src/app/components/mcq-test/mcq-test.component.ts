import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AssessmentService } from '../../services/assessment.service';
import { CameraService } from '../../services/camera.service';
import {
  AssessmentDetailDTO,
  QuestionStudentDTO,
  AnswerDTO,
  McqSubmitRequest,
  SubmitResponse
} from '../../models/dtos';

@Component({
  selector: 'app-mcq-test',
  templateUrl: './mcq-test.component.html',
  styleUrls: ['./mcq-test.component.css']
})
export class McqTestComponent implements OnInit, OnDestroy {
  saId: number = 0;
  detail: AssessmentDetailDTO | null = null;
  questions: QuestionStudentDTO[] = [];
  answers: Map<number, number> = new Map();

  cameraGranted = false;

  isLoading = true;
  errorMessage = '';
  isSubmitting = false;
  submitted = false;
  alreadySubmitted = false;
  result: SubmitResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assessmentService: AssessmentService,
    private cameraService: CameraService
  ) {}

  ngOnInit(): void {
    this.saId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  ngOnDestroy(): void {
    this.cameraService.stopCamera();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    forkJoin({
      detail: this.assessmentService.getAssessmentDetail(this.saId),
      questions: this.assessmentService.getQuestions(this.saId)
    }).subscribe({
      next: ({ detail, questions }) => {
        this.detail = detail;
        this.questions = questions;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 409) {
          this.isLoading = false;
          this.alreadySubmitted = true;
        } else if (err.status === 403 || err.status === 404) {
          // saId might actually be an assessmentId — try auto-enroll
          this.assessmentService.enrollInAssessment(this.saId).subscribe({
            next: ({ studentAssessmentId }) => {
              this.saId = studentAssessmentId;
              // Reload with the correct studentAssessmentId
              forkJoin({
                detail: this.assessmentService.getAssessmentDetail(this.saId),
                questions: this.assessmentService.getQuestions(this.saId)
              }).subscribe({
                next: ({ detail, questions }) => {
                  this.detail = detail;
                  this.questions = questions;
                  this.isLoading = false;
                },
                error: () => {
                  this.isLoading = false;
                  this.errorMessage = 'Failed to load assessment. Please try again.';
                }
              });
            },
            error: () => {
              this.isLoading = false;
              this.errorMessage = 'Failed to load assessment. Please try again.';
            }
          });
        } else {
          this.isLoading = false;
          this.errorMessage = 'Failed to load assessment. Please try again.';
        }
      }
    });
  }

  get timeLimitMinutes(): number {
    return this.detail?.timeLimitMinutes ?? 0;
  }

  selectAnswer(questionId: number, selectedIndex: number): void {
    this.answers.set(questionId, selectedIndex);
  }

  getSelectedAnswer(questionId: number): number | undefined {
    return this.answers.get(questionId);
  }

  get canSubmit(): boolean {
    return this.answers.size > 0 && !this.isSubmitting;
  }

  onTimerExpired(): void {
    this.submitAnswers();
  }

  onSubmit(): void {
    if (!this.canSubmit) return;
    this.submitAnswers();
  }

  private submitAnswers(): void {
    if (this.isSubmitting || this.submitted) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    const answersArray: AnswerDTO[] = [];
    this.answers.forEach((selectedIndex, questionId) => {
      answersArray.push({ questionId, selectedIndex });
    });

    const request: McqSubmitRequest = { answers: answersArray };

    this.assessmentService.submitTest(this.saId, request).subscribe({
      next: (res) => {
        this.result = res;
        this.submitted = true;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 409) {
          this.alreadySubmitted = true;
          this.submitted = true;
        } else {
          this.errorMessage = err?.error?.message || err?.error?.error || 'Failed to submit. Please try again.';
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/student/dashboard']);
  }
}
