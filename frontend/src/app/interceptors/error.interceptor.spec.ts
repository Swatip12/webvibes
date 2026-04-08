import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorInterceptor } from './error.interceptor';
import { AuthService } from '../services/auth.service';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ErrorInterceptor,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const interceptor = TestBed.inject(ErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should handle client-side errors (ErrorEvent)', (done) => {
    const testUrl = '/api/test';
    const errorMessage = 'Network error occurred';

    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with error'),
      error: (error: Error) => {
        expect(error.message).toBe(`Error: ${errorMessage}`);
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.error(new ErrorEvent('Network error', {
      message: errorMessage
    }));
  });

  it('should handle HTTP status 0 (connection error)', (done) => {
    const testUrl = '/api/test';

    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with error'),
      error: (error: Error) => {
        expect(error.message).toBe('Unable to connect to server. Please check your connection.');
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
  });

  it('should handle HTTP status 400 with validation errors object', (done) => {
    const testUrl = '/api/test';
    const validationErrors = {
      name: 'Name is required',
      email: 'Invalid email format'
    };

    httpClient.post(testUrl, {}).subscribe({
      next: () => fail('should have failed with error'),
      error: (error: Error) => {
        expect(error.message).toContain('Name is required');
        expect(error.message).toContain('Invalid email format');
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(validationErrors, { status: 400, statusText: 'Bad Request' });
  });

  it('should handle HTTP status 401 (unauthorized) by clearing auth and redirecting to login', (done) => {
    const testUrl = '/api/admin/courses';

    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with error'),
      error: (error: Error) => {
        expect(error.message).toBe('Your session has expired. Please log in again.');
        expect(authService.logout).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle HTTP status 403 (forbidden) with appropriate message', (done) => {
    const testUrl = '/api/admin/courses';

    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with error'),
      error: (error: Error) => {
        expect(error.message).toBe('Access denied. You do not have permission to perform this action.');
        expect(authService.logout).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(null, { status: 403, statusText: 'Forbidden' });
  });

  it('should handle HTTP status 400 with message property', (done) => {
    const testUrl = '/api/test';
    const errorResponse = { message: 'Validation failed' };

    httpClient.post(testUrl, {}).subscribe({
      next: () => fail('should have failed with error'),
      error: (error: Error) => {
        expect(error.message).toBe('Validation failed');
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
  });

  it('should handle HTTP status 400 with empty object', (done) => {
    const testUrl = '/api/test';

    httpClient.post(testUrl, {}).subscribe({
      next: () => fail('should have failed with error'),
      error: (error: Error) => {
        expect(error.message).toBe('Validation failed');
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush({}, { status: 400, statusText: 'Bad Request' });
  });

  it('should handle HTTP status 500 (server error)', (done) => {
    const testUrl = '/api/test';

    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with error'),
      error: (error: Error) => {
        expect(error.message).toBe('Server error. Please try again later.');
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle other HTTP status codes with message', (done) => {
    const testUrl = '/api/test';
    const errorResponse = { message: 'Resource not found' };

    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with error'),
      error: (error: Error) => {
        expect(error.message).toBe('Resource not found');
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(errorResponse, { status: 404, statusText: 'Not Found' });
  });

  it('should handle other HTTP status codes without message', (done) => {
    const testUrl = '/api/test';

    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with error'),
      error: (error: Error) => {
        expect(error.message).toBe('Error: 404');
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('should format multiple validation errors correctly', (done) => {
    const testUrl = '/api/test';
    const validationErrors = {
      field1: 'Error 1',
      field2: 'Error 2',
      field3: 'Error 3'
    };

    httpClient.post(testUrl, {}).subscribe({
      next: () => fail('should have failed with error'),
      error: (error: Error) => {
        expect(error.message).toContain('Error 1');
        expect(error.message).toContain('Error 2');
        expect(error.message).toContain('Error 3');
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(validationErrors, { status: 400, statusText: 'Bad Request' });
  });
});
