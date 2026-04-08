import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { AdminUser } from '../../models/dtos';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let adminService: jasmine.SpyObj<AdminService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    const adminServiceSpy = jasmine.createSpyObj('AdminService', [
      'getCourses', 'getInternships', 'getApplications', 'getEnrollments', 'getMessages'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    adminServiceSpy.getCourses.and.returnValue(of([]));
    adminServiceSpy.getInternships.and.returnValue(of([]));
    adminServiceSpy.getApplications.and.returnValue(of([]));
    adminServiceSpy.getEnrollments.and.returnValue(of([]));
    adminServiceSpy.getMessages.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
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
    expect(component.stats.courses).toBe(0);
    expect(component.stats.internships).toBe(0);
    expect(component.stats.applications).toBe(0);
    expect(component.stats.enrollments).toBe(0);
    expect(component.stats.messages).toBe(0);
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
    component.adminUsername = '';
    
    component.ngOnInit();
    
    expect(component.adminUsername).toBe('');
  });
});
