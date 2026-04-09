import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentDetailDTO } from '../../models/dtos';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-mock-interview',
  templateUrl: './mock-interview.component.html',
  styleUrls: ['./mock-interview.component.css']
})
export class MockInterviewComponent implements OnInit, OnDestroy {
  saId: number = 0;
  detail: AssessmentDetailDTO | null = null;

  isLoading = true;
  errorMessage = '';

  countdown: CountdownTime | null = null;
  isUpcoming = false;

  private countdownInterval: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assessmentService: AssessmentService
  ) {}

  ngOnInit(): void {
    this.saId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDetail();
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }

  loadDetail(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.assessmentService.getAssessmentDetail(this.saId).subscribe({
      next: (detail) => {
        this.detail = detail;
        this.isLoading = false;
        if (detail.scheduledAt) {
          this.initCountdown(detail.scheduledAt);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load interview details. Please try again.';
      }
    });
  }

  private initCountdown(scheduledAt: string): void {
    const target = new Date(scheduledAt).getTime();
    const update = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff > 0) {
        this.isUpcoming = true;
        this.countdown = {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        };
      } else {
        this.isUpcoming = false;
        this.countdown = null;
        this.clearCountdown();
      }
    };
    update();
    this.countdownInterval = setInterval(update, 1000);
  }

  private clearCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  joinInterview(): void {
    if (this.detail?.videoLink) {
      window.open(this.detail.videoLink, '_blank');
    }
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/student/dashboard']);
  }
}
