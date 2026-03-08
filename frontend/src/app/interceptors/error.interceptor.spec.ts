import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const interceptor = new ErrorInterceptor();
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
        expect(error.message).toBe('Error: 403');
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(null, { status: 403, statusText: 'Forbidden' });
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
