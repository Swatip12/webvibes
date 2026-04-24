import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../services/assessment.service';

@Component({
  selector: 'app-assessment-redirect',
  template: `
    <div style="display:flex;align-items:center;justify-content:center;min-height:60vh;flex-direction:column;gap:16px;">
      <div *ngIf="!error" style="text-align:center;">
        <div style="width:48px;height:48px;border:4px solid #6366f1;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px;"></div>
        <p style="color:#475569;font-size:1rem;">Loading your assessment...</p>
      </div>
      <div *ngIf="error" style="text-align:center;color:#ef4444;">
        <p>{{ error }}</p>
        <a routerLink="/student/dashboard" style="color:#6366f1;text-decoration:underline;">Back to Dashboard</a>
      </div>
    </div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
  `
})
export class AssessmentRedirectComponent implements OnInit {
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assessmentService: AssessmentService
  ) {}

  ngOnInit(): void {
    const assessmentId = Number(this.route.snapshot.paramMap.get('assessmentId'));
    const type = this.route.snapshot.paramMap.get('type'); // take | machine | interview

    if (!assessmentId) {
      this.error = 'Invalid assessment link.';
      return;
    }

    this.assessmentService.enrollInAssessment(assessmentId).subscribe({
      next: ({ studentAssessmentId }) => {
        const path = type === 'machine' ? 'machine'
                   : type === 'interview' ? 'interview'
                   : 'take';
        this.router.navigate([`/student/assessments/${studentAssessmentId}/${path}`]);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load assessment. Please try again.';
      }
    });
  }
}
