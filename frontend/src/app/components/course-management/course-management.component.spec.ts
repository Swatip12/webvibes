import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CourseManagementComponent } from './course-management.component';
import { AdminService } from '../../services/admin.service';
import { CourseDTO } from '../../models/dtos';

describe('CourseManagementComponent', () => {
  let component: CourseManagementComponent;
  let fixture: ComponentFixture<CourseManagementComponent>;
  let adminService: jasmine.SpyObj<AdminService>;

  const mockCourses: CourseDTO[] = [
    {
      id: 1,
      name: 'Angular Fundamentals',
      description: 'Learn Angular basics',
      duration: 8,
      technologies: 'Angular, TypeScript'
    },
    {
      id: 2,
      name: 'Advanced Spring Boot',
      description: 'Master Spring Boot',
      duration: 12,
      technologies: 'Spring Boot, Java'
    }
  ];

  beforeEach(async () => {
    const adminServiceSpy = jasmine.createSpyObj('AdminService', [
      'getCourses',
      'createCourse',
      'updateCourse',
      'deleteCourse'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ CourseManagementComponent ],
      imports: [ ReactiveFormsModule, HttpClientTestingModule ],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy }
      ]
    })
    .compileComponents();

    adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
    fixture = TestBed.createComponent(CourseManagementComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load courses on init', () => {
    adminService.getCourses.and.returnValue(of(mockCourses));
    
    fixture.detectChanges(); // triggers ngOnInit
    
    expect(adminService.getCourses).toHaveBeenCalled();
    expect(component.courses).toEqual(mockCourses);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading courses', () => {
    adminService.getCourses.and.returnValue(throwError(() => new Error('Failed to load')));
    
    fixture.detectChanges();
    
    expect(component.errorMessage).toBe('Failed to load courses');
    expect(component.loading).toBeFalse();
  });

  it('should initialize form for creating new course', () => {
    component.onCreateCourse();
    
    expect(component.isEditMode).toBeFalse();
    expect(component.showForm).toBeTrue();
    expect(component.selectedCourse).toBeNull();
    expect(component.courseForm.value).toEqual({
      name: null,
      description: null,
      duration: null,
      technologies: null
    });
  });

  it('should initialize form for editing course', () => {
    const courseToEdit = mockCourses[0];
    
    component.onEditCourse(courseToEdit);
    
    expect(component.isEditMode).toBeTrue();
    expect(component.showForm).toBeTrue();
    expect(component.selectedCourse).toEqual(courseToEdit);
    expect(component.courseForm.value).toEqual({
      name: courseToEdit.name,
      description: courseToEdit.description,
      duration: courseToEdit.duration,
      technologies: courseToEdit.technologies
    });
  });

  it('should create new course successfully', () => {
    const newCourse: CourseDTO = {
      name: 'New Course',
      description: 'New Description',
      duration: 10,
      technologies: 'Tech1, Tech2'
    };
    
    adminService.createCourse.and.returnValue(of({ ...newCourse, id: 3 }));
    adminService.getCourses.and.returnValue(of([...mockCourses, { ...newCourse, id: 3 }]));
    
    component.courseForm.patchValue(newCourse);
    component.onSaveCourse();
    
    expect(adminService.createCourse).toHaveBeenCalledWith(newCourse);
    expect(component.successMessage).toBe('Course created successfully');
    expect(component.showForm).toBeFalse();
  });

  it('should update existing course successfully', () => {
    const updatedCourse: CourseDTO = {
      id: 1,
      name: 'Updated Course',
      description: 'Updated Description',
      duration: 15,
      technologies: 'Updated Tech'
    };
    
    component.isEditMode = true;
    component.selectedCourse = mockCourses[0];
    adminService.updateCourse.and.returnValue(of(updatedCourse));
    adminService.getCourses.and.returnValue(of(mockCourses));
    
    component.courseForm.patchValue({
      name: updatedCourse.name,
      description: updatedCourse.description,
      duration: updatedCourse.duration,
      technologies: updatedCourse.technologies
    });
    component.onSaveCourse();
    
    expect(adminService.updateCourse).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(component.successMessage).toBe('Course updated successfully');
    expect(component.showForm).toBeFalse();
  });

  it('should not save course with invalid form', () => {
    component.courseForm.patchValue({
      name: '',
      description: '',
      duration: null,
      technologies: ''
    });
    
    component.onSaveCourse();
    
    expect(component.errorMessage).toBe('Please fill in all required fields correctly');
    expect(adminService.createCourse).not.toHaveBeenCalled();
    expect(adminService.updateCourse).not.toHaveBeenCalled();
  });

  it('should delete course with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    adminService.deleteCourse.and.returnValue(of({ message: 'Deleted' }));
    adminService.getCourses.and.returnValue(of(mockCourses));
    
    component.onDeleteCourse(1);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(adminService.deleteCourse).toHaveBeenCalledWith(1);
    expect(component.successMessage).toBe('Course deleted successfully');
  });

  it('should not delete course without confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.onDeleteCourse(1);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(adminService.deleteCourse).not.toHaveBeenCalled();
  });

  it('should cancel edit and reset form', () => {
    component.showForm = true;
    component.selectedCourse = mockCourses[0];
    component.courseForm.patchValue(mockCourses[0]);
    
    component.onCancelEdit();
    
    expect(component.showForm).toBeFalse();
    expect(component.selectedCourse).toBeNull();
    expect(component.courseForm.value).toEqual({
      name: null,
      description: null,
      duration: null,
      technologies: null
    });
  });

  it('should validate required fields', () => {
    const nameControl = component.courseForm.get('name');
    const descriptionControl = component.courseForm.get('description');
    const durationControl = component.courseForm.get('duration');
    
    expect(nameControl?.hasError('required')).toBeTrue();
    expect(descriptionControl?.hasError('required')).toBeTrue();
    expect(durationControl?.hasError('required')).toBeTrue();
    
    nameControl?.setValue('Test Course');
    descriptionControl?.setValue('Test Description');
    durationControl?.setValue(10);
    
    expect(nameControl?.hasError('required')).toBeFalse();
    expect(descriptionControl?.hasError('required')).toBeFalse();
    expect(durationControl?.hasError('required')).toBeFalse();
  });

  it('should validate duration minimum value', () => {
    const durationControl = component.courseForm.get('duration');
    
    durationControl?.setValue(0);
    expect(durationControl?.hasError('min')).toBeTrue();
    
    durationControl?.setValue(-5);
    expect(durationControl?.hasError('min')).toBeTrue();
    
    durationControl?.setValue(1);
    expect(durationControl?.hasError('min')).toBeFalse();
  });

  it('should validate name max length', () => {
    const nameControl = component.courseForm.get('name');
    const longName = 'a'.repeat(101);
    
    nameControl?.setValue(longName);
    expect(nameControl?.hasError('maxlength')).toBeTrue();
    
    nameControl?.setValue('Valid Name');
    expect(nameControl?.hasError('maxlength')).toBeFalse();
  });
});
