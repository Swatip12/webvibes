import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../services/assessment.service';
import { CameraService } from '../../services/camera.service';
import { AssessmentDetailDTO, MachineSubmitRequest, SubmitResponse } from '../../models/dtos';

@Component({
  selector: 'app-machine-test',
  templateUrl: './machine-test.component.html',
  styleUrls: ['./machine-test.component.css']
})
export class MachineTestComponent implements OnInit, OnDestroy {
  saId: number = 0;
  detail: AssessmentDetailDTO | null = null;
  solution: string = '';

  cameraGranted = false;

  isLoading = true;
  errorMessage = '';
  isSubmitting = false;
  submitted = false;
  alreadySubmitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assessmentService: AssessmentService,
    private cameraService: CameraService
  ) {}

  ngOnInit(): void {
    this.saId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDetail();
  }

  ngOnDestroy(): void {
    this.cameraService.stopCamera();
  }

  loadDetail(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.assessmentService.getAssessmentDetail(this.saId).subscribe({
      next: (detail) => {
        this.detail = detail;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 409) {
          this.isLoading = false;
          this.alreadySubmitted = true;
        } else if (err.status === 403 || err.status === 404) {
          this.assessmentService.enrollInAssessment(this.saId).subscribe({
            next: ({ studentAssessmentId }) => {
              this.saId = studentAssessmentId;
              this.assessmentService.getAssessmentDetail(this.saId).subscribe({
                next: (detail) => { this.detail = detail; this.isLoading = false; },
                error: () => { this.isLoading = false; this.errorMessage = 'Failed to load assessment. Please try again.'; }
              });
            },
            error: () => { this.isLoading = false; this.errorMessage = 'Failed to load assessment. Please try again.'; }
          });
        } else {
          this.isLoading = false;
          this.errorMessage = 'Failed to load assessment. Please try again.';
        }
      }
    });
  }

  get canSubmit(): boolean {
    return this.solution.trim().length > 0 && !this.isSubmitting;
  }

  onSubmit(): void {
    if (!this.canSubmit) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    const request: MachineSubmitRequest = { solutionText: this.solution.trim() };

    this.assessmentService.submitMachineTest(this.saId, request).subscribe({
      next: () => {
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
