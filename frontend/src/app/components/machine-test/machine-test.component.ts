import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentDetailDTO, MachineSubmitRequest, SubmitResponse } from '../../models/dtos';

@Component({
  selector: 'app-machine-test',
  templateUrl: './machine-test.component.html',
  styleUrls: ['./machine-test.component.css']
})
export class MachineTestComponent implements OnInit {
  saId: number = 0;
  detail: AssessmentDetailDTO | null = null;
  solution: string = '';

  isLoading = true;
  errorMessage = '';
  isSubmitting = false;
  submitted = false;
  alreadySubmitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assessmentService: AssessmentService
  ) {}

  ngOnInit(): void {
    this.saId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDetail();
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
        this.isLoading = false;
        if (err.status === 409) {
          this.alreadySubmitted = true;
        } else {
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
          this.errorMessage = 'Failed to submit. Please try again.';
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/student/dashboard']);
  }
}
