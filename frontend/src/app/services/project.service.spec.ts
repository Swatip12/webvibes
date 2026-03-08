import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectService } from './project.service';
import { ProjectDTO } from '../models/dtos';
import { environment } from '../../environments/environment';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService]
    });

    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send GET request to /api/projects', () => {
    const mockProjects: ProjectDTO[] = [
      {
        id: 1,
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce application',
        githubLink: 'https://github.com/student/ecommerce',
        imageUrl: 'https://example.com/image1.jpg'
      },
      {
        id: 2,
        title: 'Task Manager',
        description: 'A task management application',
        githubLink: 'https://github.com/student/taskmanager',
        imageUrl: 'https://example.com/image2.jpg'
      }
    ];

    service.getAllProjects().subscribe(projects => {
      expect(projects).toEqual(mockProjects);
      expect(projects.length).toBe(2);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/projects`);
    expect(req.request.method).toBe('GET');

    req.flush(mockProjects);
  });

  it('should handle empty projects array', () => {
    const mockProjects: ProjectDTO[] = [];

    service.getAllProjects().subscribe(projects => {
      expect(projects).toEqual([]);
      expect(projects.length).toBe(0);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/projects`);
    expect(req.request.method).toBe('GET');

    req.flush(mockProjects);
  });

  it('should handle error response', () => {
    const mockError = { message: 'Server error' };

    service.getAllProjects().subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/projects`);
    req.flush(mockError, { status: 500, statusText: 'Internal Server Error' });
  });
});
