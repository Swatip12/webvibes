import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StudentAuthService } from '../../services/student-auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.css']
})
export class StudentLoginComponent implements OnInit {

  // ── Login ──
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  showPw = false;
  private returnUrl = '/student/dashboard';

  // ── Forgot password steps: 'login' | 'forgot' | 'otp' ──
  step: 'login' | 'forgot' | 'otp' = 'login';

  // Step 2 — send OTP
  forgotEmail = '';
  forgotLoading = false;
  forgotMsg = '';
  forgotError = '';

  // Step 3 — verify OTP + new password
  otp = '';
  newPassword = '';
  confirmPassword = '';
  showNewPw = false;
  otpLoading = false;
  otpMsg = '';
  otpError = '';

  private readonly apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private studentAuthService: StudentAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/student/dashboard';
  }

  // ── Login ──────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.studentAuthService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.status === 401 ? 'Invalid email or password' : 'Login failed. Please try again.';
      }
    });
  }

  get f() { return this.loginForm.controls; }

  // ── Forgot Password ────────────────────────────────────────────────────────

  goToForgot(): void {
    const emailVal = this.loginForm.value.email || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.forgotEmail = emailRegex.test(emailVal) ? emailVal : '';
    this.forgotMsg = '';
    this.forgotError = '';
    this.step = 'forgot';
    this.errorMessage = '';
  }

  sendOtp(): void {
    if (!this.forgotEmail) return;
    this.forgotLoading = true;
    this.forgotMsg = '';
    this.forgotError = '';
    this.http.post<{ message: string }>(
      `${this.apiUrl}/api/student/auth/forgot-password`,
      { email: this.forgotEmail }
    ).subscribe({
      next: (res) => {
        this.forgotLoading = false;
        this.forgotMsg = res.message;
        // Move to OTP step after short delay
        setTimeout(() => {
          this.otp = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.otpMsg = '';
          this.otpError = '';
          this.step = 'otp';
        }, 800);
      },
      error: (err) => {
        this.forgotLoading = false;
        this.forgotError = err?.error?.message || 'Failed to send OTP. Please try again.';
      }
    });
  }

  verifyOtp(): void {
    if (!this.otp || !this.newPassword || this.newPassword !== this.confirmPassword) return;
    this.otpLoading = true;
    this.otpMsg = '';
    this.otpError = '';
    this.http.post<{ message: string }>(
      `${this.apiUrl}/api/student/auth/verify-otp`,
      { email: this.forgotEmail, otp: this.otp, newPassword: this.newPassword }
    ).subscribe({
      next: (res) => {
        this.otpLoading = false;
        this.otpMsg = res.message;
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.step = 'login';
          this.loginForm.reset();
        }, 2000);
      },
      error: (err) => {
        this.otpLoading = false;
        this.otpError = err?.error?.message || 'Invalid or expired OTP.';
      }
    });
  }
}
