import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CourseService } from './course.service';
import { CourseEnrollmentDTO } from '../models/dtos';
import { environment } from '../../environments/environment';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourseService]
    });

    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request to /api/courses/enroll', () => {
    const mockEnrollment: CourseEnrollmentDTO = {
      studentName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '1234567890',
      courseName: 'Angular',
      message: 'I am interested in the Angular course'
    };

    const mockResponse = { message: 'Enrollment submitted successfully' };

    service.submitEnrollment(mockEnrollment).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/courses/enroll`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockEnrollment);

    req.flush(mockResponse);
  });

  it('should handle error response', () => {
    const mockEnrollment: CourseEnrollmentDTO = {
      studentName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '1234567890',
      courseName: 'Angular'
    };

    const mockError = { message: 'Validation failed' };

    service.submitEnrollment(mockEnrollment).subscribe({
      next: () => fail('should have failed with 400 error'),
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/courses/enroll`);
    req.flush(mockError, { status: 400, statusText: 'Bad Request' });
  });
});
