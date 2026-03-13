import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AdminService } from './admin.service';
import { CourseDTO, MessageResponse } from '../models/dtos';
import { environment } from '../../environments/environment';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + '/api/admin';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Course Operations', () => {
    it('should get all courses', () => {
      const mockCourses: CourseDTO[] = [
        {
          id: 1,
          name: 'Angular Fundamentals',
          description: 'Learn Angular',
          duration: 8,
          technologies: 'Angular, TypeScript'
        },
        {
          id: 2,
          name: 'Spring Boot',
          description: 'Learn Spring Boot',
          duration: 12,
          technologies: 'Spring Boot, Java'
        }
      ];

      service.getCourses().subscribe(courses => {
        expect(courses).toEqual(mockCourses);
        expect(courses.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/courses`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCourses);
    });

    it('should create a course', () => {
      const newCourse: CourseDTO = {
        name: 'New Course',
        description: 'New Description',
        duration: 10,
        technologies: 'Tech1, Tech2'
      };

      const createdCourse: CourseDTO = { ...newCourse, id: 1 };

      service.createCourse(newCourse).subscribe(course => {
        expect(course).toEqual(createdCourse);
        expect(course.id).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/courses`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newCourse);
      req.flush(createdCourse);
    });

    it('should update a course', () => {
      const courseId = 1;
      const updatedCourse: CourseDTO = {
        id: courseId,
        name: 'Updated Course',
        description: 'Updated Description',
        duration: 15,
        technologies: 'Updated Tech'
      };

      service.updateCourse(courseId, updatedCourse).subscribe(course => {
        expect(course).toEqual(updatedCourse);
      });

      const req = httpMock.expectOne(`${apiUrl}/courses/${courseId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedCourse);
      req.flush(updatedCourse);
    });

    it('should delete a course', () => {
      const courseId = 1;
      const mockResponse: MessageResponse = { message: 'Course deleted successfully' };

      service.deleteCourse(courseId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/courses/${courseId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should handle error when getting courses', () => {
      const errorMessage = 'Failed to load courses';

      service.getCourses().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/courses`);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });

    it('should handle error when creating course', () => {
      const newCourse: CourseDTO = {
        name: 'New Course',
        description: 'New Description',
        duration: 10
      };

      service.createCourse(newCourse).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/courses`);
      req.flush('Validation error', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle error when updating course', () => {
      const courseId = 1;
      const updatedCourse: CourseDTO = {
        id: courseId,
        name: 'Updated Course',
        description: 'Updated Description',
        duration: 15
      };

      service.updateCourse(courseId, updatedCourse).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/courses/${courseId}`);
      req.flush('Course not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle error when deleting course', () => {
      const courseId = 1;

      service.deleteCourse(courseId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/courses/${courseId}`);
      req.flush('Course not found', { status: 404, statusText: 'Not Found' });
    });
  });
});
