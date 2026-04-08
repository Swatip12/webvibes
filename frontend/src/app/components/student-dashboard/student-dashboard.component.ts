import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StudentAuthService } from '../../services/student-auth.service';
import { DashboardResponse, RazorpayOrderResponse, PaymentVerifyRequest } from '../../models/dtos';
import { environment } from '../../../environments/environment';

declare var Razorpay: any;

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
  currentPaymentType = '';

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

  initiateRegistrationPayment(): void {
    this.cancellationMessage = '';
    this.currentPaymentType = 'REGISTRATION';
    this.http.post<RazorpayOrderResponse>(`${this.apiUrl}/api/payment/register`, {}).subscribe({
      next: (orderData) => this.openRazorpayModal(orderData),
      error: () => { this.errorMessage = 'Failed to initiate payment. Please try again.'; }
    });
  }

  initiateRemainingPayment(): void {
    this.cancellationMessage = '';
    this.currentPaymentType = 'REMAINING';
    this.http.post<RazorpayOrderResponse>(`${this.apiUrl}/api/payment/remaining`, {}).subscribe({
      next: (orderData) => this.openRazorpayModal(orderData),
      error: () => { this.errorMessage = 'Failed to initiate payment. Please try again.'; }
    });
  }

  openRazorpayModal(orderData: RazorpayOrderResponse): void {
    const student = this.studentAuthService.getCurrentStudent();
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: 'WebVibes Technology',
      description: this.currentPaymentType === 'REGISTRATION' ? 'Registration Fee' : 'Remaining Fee',
      prefill: {
        name: student?.name || ''
      },
      theme: { color: '#4f46e5' },
      handler: (response: any) => {
        const verifyReq: PaymentVerifyRequest = {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          paymentType: this.currentPaymentType
        };
        this.http.post(`${this.apiUrl}/api/payment/verify`, verifyReq).subscribe({
          next: () => {
            this.cancellationMessage = '';
            this.loadDashboard();
          },
          error: () => { this.errorMessage = 'Payment verification failed. Please contact support.'; }
        });
      },
      modal: {
        ondismiss: () => {
          this.cancellationMessage = 'Payment was cancelled. You can try again.';
        }
      }
    };
    const rzp = new Razorpay(options);
    rzp.open();
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
