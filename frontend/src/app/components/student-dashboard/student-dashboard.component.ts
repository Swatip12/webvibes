import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StudentAuthService } from '../../services/student-auth.service';
import { DashboardResponse } from '../../models/dtos';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  dashboard: DashboardResponse | null = null;
  isLoading = false;
  errorMessage = '';
  agreementAccepted = false;
  cancellationMessage = '';
  showUpiForm = false;
  utrNumber = '';
  successMessage = '';

  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private studentAuthService: StudentAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.http.get<DashboardResponse>(`${this.apiUrl}/api/student/dashboard`).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load dashboard. Please try again.';
      }
    });
  }

  logout(): void {
    this.studentAuthService.logout();
    this.router.navigate(['/student/login']);
  }

  submitUpiPayment(paymentType: string): void {
    if (!this.utrNumber.trim()) return;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post<{message: string}>(`${this.apiUrl}/api/payment/upi-submit`, {
      paymentType,
      utrNumber: this.utrNumber.trim()
    }).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.showUpiForm = false;
        this.utrNumber = '';
      },
      error: () => {
        this.errorMessage = 'Failed to submit payment. Please try again.';
      }
    });
  }

  downloadReceipt(type: string): void {
    this.http.get(`${this.apiUrl}/api/student/receipt/${type}`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${type.toLowerCase()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => { this.errorMessage = 'Receipt not found. Please contact support.'; }
    });
  }
}
