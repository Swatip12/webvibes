import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AuthService } from '../../services/auth.service';
import { AdminUser } from '../../models/dtos';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    const mockUser: AdminUser = {
      username: 'admin',
      role: 'ROLE_ADMIN'
    };
    authService.getCurrentUser.and.returnValue(mockUser);
    
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load admin username on init', () => {
    expect(component.adminUsername).toBe('admin');
  });

  it('should initialize stats with zero values', () => {
    expect(component.stats.totalCourses).toBe(0);
    expect(component.stats.totalInternships).toBe(0);
    expect(component.stats.totalApplications).toBe(0);
    expect(component.stats.totalEnrollments).toBe(0);
    expect(component.stats.totalMessages).toBe(0);
  });

  it('should set loading to false after initialization', () => {
    expect(component.loading).toBe(false);
  });

  it('should call authService.logout and navigate to login on logout', () => {
    component.logout();
    
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to specified route', () => {
    component.navigateTo('/admin/courses');
    
    expect(router.navigate).toHaveBeenCalledWith(['/admin/courses']);
  });

  it('should handle null user gracefully', () => {
    authService.getCurrentUser.and.returnValue(null);
    
    component.ngOnInit();
    
    expect(component.adminUsername).toBe('');
  });
});
