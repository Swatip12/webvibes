import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css']
})
export class ProjectManagementComponent implements OnInit {
  projects: any[] = [];
  loading = true;
  error = '';
  successMessage = '';
  showForm = false;
  submitting = false;

  projectForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      githubLink: ['', [Validators.required]],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.adminService.getProjects().subscribe({
      next: (data) => { this.projects = data; this.loading = false; },
      error: () => { this.error = 'Failed to load projects.'; this.loading = false; }
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) return;
    this.submitting = true;
    this.error = '';
    this.adminService.createProject(this.projectForm.value).subscribe({
      next: () => {
        this.successMessage = 'Project added successfully!';
        this.projectForm.reset();
        this.showForm = false;
        this.submitting = false;
        this.loadProjects();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.error = 'Failed to add project.';
        this.submitting = false;
      }
    });
  }

  deleteProject(id: number): void {
    if (!confirm('Delete this project?')) return;
    this.adminService.deleteProject(id).subscribe({
      next: () => {
        this.successMessage = 'Project deleted.';
        this.projects = this.projects.filter(p => p.id !== id);
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => { this.error = 'Failed to delete project.'; }
    });
  }

  goBack(): void { this.router.navigate(['/admin/dashboard']); }
}
