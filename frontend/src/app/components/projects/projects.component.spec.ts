import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: ProjectService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
  });

  it('should create', () => {
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
    expect(component.projects).toEqual(mockProjects);
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should handle error when fetching projects fails', () => {
    const errorResponse = new Error('Network error');
    projectService.getAllProjects.and.returnValue(throwError(() => errorResponse));

    component.ngOnInit();

    expect(component.error).toBe('Failed to load projects');
    expect(component.loading).toBe(false);
    expect(component.projects).toEqual([]);
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
    const projectCards = compiled.querySelectorAll('.project-card');
    
    expect(projectCards.length).toBe(2);
  });

  it('should display "No projects available" when projects array is empty', () => {
    projectService.getAllProjects.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const noProjectsMessage = compiled.querySelector('.text-muted');
    
    expect(noProjectsMessage?.textContent).toContain('No projects available');
  });

  it('should display error message when error occurs', () => {
    projectService.getAllProjects.and.returnValue(throwError(() => new Error('Network error')));
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const errorAlert = compiled.querySelector('.alert-danger');
    
    expect(errorAlert?.textContent).toContain('Failed to load projects');
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
