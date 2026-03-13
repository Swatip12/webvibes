import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { AuthService } from '../services/auth.service';

describe('JwtInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header with token to requests', () => {
    const testToken = 'test-jwt-token';
    authService.getToken.and.returnValue(testToken);

    httpClient.get('/api/admin/courses').subscribe();

    const req = httpMock.expectOne('/api/admin/courses');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    req.flush({});
  });

  it('should not add Authorization header when token is null', () => {
    authService.getToken.and.returnValue(null);

    httpClient.get('/api/admin/courses').subscribe();

    const req = httpMock.expectOne('/api/admin/courses');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should skip adding Authorization header for login endpoint', () => {
    const testToken = 'test-jwt-token';
    authService.getToken.and.returnValue(testToken);

    httpClient.post('/api/auth/login', { username: 'admin', password: 'password' }).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should add Authorization header for non-login endpoints', () => {
    const testToken = 'test-jwt-token';
    authService.getToken.and.returnValue(testToken);

    httpClient.get('/api/admin/internships').subscribe();

    const req = httpMock.expectOne('/api/admin/internships');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    req.flush({});
  });
});
