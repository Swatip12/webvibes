import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { CourseDTO } from '../../models/dtos';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css']
})
export class CourseManagementComponent implements OnInit {
  courses: CourseDTO[] = [];
  selectedCourse: CourseDTO | null = null;
  courseForm: FormGroup;
  isEditMode: boolean = false;
  showForm: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder
  ) {
    this.courseForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      technologies: ['']
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.adminService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load courses';
        this.loading = false;
        console.error('Error loading courses:', error);
      }
    });
  }

  onCreateCourse(): void {
    this.isEditMode = false;
    this.selectedCourse = null;
    this.courseForm.reset();
    this.showForm = true;
    this.clearMessages();
  }

  onEditCourse(course: CourseDTO): void {
    this.isEditMode = true;
    this.selectedCourse = course;
    this.courseForm.patchValue({
      name: course.name,
      description: course.description,
      duration: course.duration,
      technologies: course.technologies || ''
    });
    this.showForm = true;
    this.clearMessages();
  }

  onSaveCourse(): void {
    if (this.courseForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    const courseData: CourseDTO = this.courseForm.value;
    this.loading = true;

    if (this.isEditMode && this.selectedCourse?.id) {
      // Update existing course
      this.adminService.updateCourse(this.selectedCourse.id, courseData).subscribe({
        next: (updatedCourse) => {
          this.successMessage = 'Course updated successfully';
          this.loading = false;
          this.showForm = false;
          this.loadCourses();
        },
        error: (error) => {
          this.errorMessage = 'Failed to update course';
          this.loading = false;
          console.error('Error updating course:', error);
        }
      });
    } else {
      // Create new course
      this.adminService.createCourse(courseData).subscribe({
        next: (newCourse) => {
          this.successMessage = 'Course created successfully';
          this.loading = false;
          this.showForm = false;
          this.loadCourses();
        },
        error: (error) => {
          this.errorMessage = 'Failed to create course';
          this.loading = false;
          console.error('Error creating course:', error);
        }
      });
    }
  }

  onDeleteCourse(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this course?')) {
      this.loading = true;
      this.adminService.deleteCourse(id).subscribe({
        next: (response) => {
          this.successMessage = 'Course deleted successfully';
          this.loading = false;
          this.loadCourses();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete course';
          this.loading = false;
          console.error('Error deleting course:', error);
        }
      });
    }
  }

  onCancelEdit(): void {
    this.showForm = false;
    this.courseForm.reset();
    this.selectedCourse = null;
    this.clearMessages();
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
