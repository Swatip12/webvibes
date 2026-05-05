import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentAuthService } from '../../services/student-auth.service';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.css']
})
export class StudentLoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  private returnUrl = '/student/dashboard';

  // Forgot password state
  showForgot = false;
  forgotEmail = '';
  forgotMsg = '';
  forgotError = '';

  constructor(
    private fb: FormBuilder,
    private studentAuthService: StudentAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/student/dashboard';
  }

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
        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }

  openForgot(): void {
    // Pre-fill email from login form if entered
    this.forgotEmail = this.loginForm.value.email || '';
    this.forgotMsg = '';
    this.forgotError = '';
    this.showForgot = true;
    this.errorMessage = '';
  }

  closeForgot(): void {
    this.showForgot = false;
    this.forgotMsg = '';
    this.forgotError = '';
  }

  get f() { return this.loginForm.controls; }
}
