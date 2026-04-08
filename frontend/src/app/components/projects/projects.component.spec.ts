import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProjectsComponent } from './projects.component';
import { ProjectService } from '../../services/project.service';
import { of, throwError } from 'rxjs';
import { ProjectDTO } from '../../models/dtos';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProjectService', ['getAllProjects']);

    await TestBed.configureTestingModule({
      declarations: [ ProjectsComponent ],
      imports: [ HttpClientTestingModule, FormsModule ],
      providers: [
        { provide: ProjectService, useValue: spy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
  });

  it('should create', () => {
    projectService.getAllProjects.and.returnValue(of([]));
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.loading).toBe(true);
    expect(component.projects).toEqual([]);
    expect(component.error).toBeNull();
  });

  it('should fetch projects on initialization', () => {
    const mockProjects: ProjectDTO[] = [
      {
        id: 1,
        title: 'Test Project',
        description: 'Test Description',
        githubLink: 'https://github.com/test/project',
        imageUrl: 'https://example.com/image.jpg'
      }
    ];

    projectService.getAllProjects.and.returnValue(of(mockProjects));

    component.ngOnInit();

    expect(projectService.getAllProjects).toHaveBeenCalled();
    // Component merges API projects with hardcoded ones
    expect(component.projects.length).toBeGreaterThanOrEqual(1);
    expect(component.projects[0].title).toBe('Test Project');
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should show hardcoded projects when API fails', () => {
    const errorResponse = new Error('Network error');
    projectService.getAllProjects.and.returnValue(throwError(() => errorResponse));

    component.ngOnInit();

    // Component falls back to hardcoded projects on error
    expect(component.loading).toBe(false);
    expect(component.projects.length).toBeGreaterThan(0);
  });

  it('should display projects when data is loaded', () => {
    const mockProjects: ProjectDTO[] = [
      {
        id: 1,
        title: 'Project 1',
        description: 'Description 1',
        githubLink: 'https://github.com/test/project1',
        imageUrl: 'https://example.com/image1.jpg'
      },
      {
        id: 2,
        title: 'Project 2',
        description: 'Description 2',
        githubLink: 'https://github.com/test/project2',
        imageUrl: 'https://example.com/image2.jpg'
      }
    ];

    projectService.getAllProjects.and.returnValue(of(mockProjects));
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const projectCards = compiled.querySelectorAll('.pp-card');

    expect(projectCards.length).toBeGreaterThanOrEqual(2);
  });

  it('should show hardcoded projects when API returns empty array', () => {
    projectService.getAllProjects.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();

    // Component shows hardcoded projects when API returns empty
    expect(component.projects.length).toBeGreaterThan(0);
    expect(component.loading).toBe(false);
  });

  it('should open GitHub links in new tab', () => {
    const mockProjects: ProjectDTO[] = [
      {
        id: 1,
        title: 'Test Project',
        description: 'Test Description',
        githubLink: 'https://github.com/test/project',
        imageUrl: 'https://example.com/image.jpg'
      }
    ];

    projectService.getAllProjects.and.returnValue(of(mockProjects));
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const githubLink = compiled.querySelector('a[target="_blank"]');

    expect(githubLink).toBeTruthy();
    expect(githubLink?.getAttribute('target')).toBe('_blank');
    expect(githubLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
