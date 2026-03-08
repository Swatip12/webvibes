import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InternshipService } from './internship.service';
import { InternshipApplicationDTO } from '../models/dtos';
import { environment } from '../../environments/environment';

describe('InternshipService', () => {
  let service: InternshipService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InternshipService]
    });

    service = TestBed.inject(InternshipService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request to /api/internships/apply', () => {
    const mockApplication: InternshipApplicationDTO = {
      studentName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      internshipType: 'Java',
      message: 'I am interested in the Java internship'
    };

    const mockResponse = { message: 'Application submitted successfully' };

    service.submitApplication(mockApplication).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/internships/apply`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockApplication);

    req.flush(mockResponse);
  });

  it('should handle error response', () => {
    const mockApplication: InternshipApplicationDTO = {
      studentName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      internshipType: 'Java'
    };

    const mockError = { message: 'Validation failed' };

    service.submitApplication(mockApplication).subscribe({
      next: () => fail('should have failed with 400 error'),
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/internships/apply`);
    req.flush(mockError, { status: 400, statusText: 'Bad Request' });
  });
});
