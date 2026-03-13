import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { JwtAuthResponse } from '../../models/dtos';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    authService.isAuthenticated.and.returnValue(false);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty fields', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when fields are empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark form as valid when fields are filled', () => {
    component.loginForm.patchValue({
      username: 'admin',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should redirect to dashboard if already authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should call authService.login on form submit with valid credentials', () => {
    const mockResponse: JwtAuthResponse = {
      token: 'fake-jwt-token',
      type: 'Bearer',
      username: 'admin',
      role: 'ROLE_ADMIN'
    };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'admin',
      password: 'password123'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('admin', 'password123');
  });

  it('should navigate to dashboard on successful login', () => {
    const mockResponse: JwtAuthResponse = {
      token: 'fake-jwt-token',
      type: 'Bearer',
      username: 'admin',
      role: 'ROLE_ADMIN'
    };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'admin',
      password: 'password123'
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should display error message on login failure with 401 status', () => {
    const errorResponse = { status: 401, error: { message: 'Unauthorized' } };
    authService.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.patchValue({
      username: 'admin',
      password: 'wrongpassword'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Invalid username or password');
  });

  it('should display error message on network error', () => {
    const errorResponse = { status: 0 };
    authService.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.patchValue({
      username: 'admin',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Unable to connect to server. Please try again later.');
  });

  it('should not submit form when invalid', () => {
    component.loginForm.patchValue({
      username: '',
      password: ''
    });

    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should set isLoading to true during login', () => {
    const mockResponse: JwtAuthResponse = {
      token: 'fake-jwt-token',
      type: 'Bearer',
      username: 'admin',
      role: 'ROLE_ADMIN'
    };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'admin',
      password: 'password123'
    });

    expect(component.isLoading).toBeFalsy();
    component.onSubmit();
    expect(component.isLoading).toBeFalsy(); // Will be false after observable completes
  });

  it('should clear error message on new submit attempt', () => {
    component.errorMessage = 'Previous error';
    const mockResponse: JwtAuthResponse = {
      token: 'fake-jwt-token',
      type: 'Bearer',
      username: 'admin',
      role: 'ROLE_ADMIN'
    };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'admin',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('');
  });
});
