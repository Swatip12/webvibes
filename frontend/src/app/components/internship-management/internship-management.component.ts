import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { InternshipDTO } from '../../models/dtos';

@Component({
  selector: 'app-internship-management',
  templateUrl: './internship-management.component.html',
  styleUrls: ['./internship-management.component.css']
})
export class InternshipManagementComponent implements OnInit {
  internships: InternshipDTO[] = [];
  selectedInternship: InternshipDTO | null = null;
  form: FormGroup;
  isEditMode = false;
  showForm = false;
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.form = this.fb.group({
      type: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      skills: ['']
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.adminService.getInternships().subscribe({
      next: (data) => { this.internships = data; this.loading = false; },
      error: () => { this.errorMessage = 'Failed to load internships'; this.loading = false; }
    });
  }

  onCreate(): void {
    this.isEditMode = false; this.selectedInternship = null;
    this.form.reset(); this.showForm = true; this.clearMessages();
  }

  onEdit(item: InternshipDTO): void {
    this.isEditMode = true; this.selectedInternship = item;
    this.form.patchValue({ type: item.type, description: item.description, duration: item.duration, skills: item.skills || '' });
    this.showForm = true; this.clearMessages();
  }

  onSave(): void {
    if (this.form.invalid) { this.errorMessage = 'Please fill in all required fields'; return; }
    const data: InternshipDTO = this.form.value;
    this.loading = true;
    if (this.isEditMode && this.selectedInternship?.id) {
      this.adminService.updateInternship(this.selectedInternship.id, data).subscribe({
        next: () => { this.successMessage = 'Internship updated'; this.loading = false; this.showForm = false; this.load(); },
        error: () => { this.errorMessage = 'Failed to update internship'; this.loading = false; }
      });
    } else {
      this.adminService.createInternship(data).subscribe({
        next: () => { this.successMessage = 'Internship created'; this.loading = false; this.showForm = false; this.load(); },
        error: () => { this.errorMessage = 'Failed to create internship'; this.loading = false; }
      });
    }
  }

  onDelete(id: number | undefined): void {
    if (!id || !confirm('Delete this internship?')) return;
    this.loading = true;
    this.adminService.deleteInternship(id).subscribe({
      next: () => { this.successMessage = 'Internship deleted'; this.loading = false; this.load(); },
      error: () => { this.errorMessage = 'Failed to delete internship'; this.loading = false; }
    });
  }

  onCancel(): void { this.showForm = false; this.form.reset(); this.clearMessages(); }
  private clearMessages(): void { this.successMessage = ''; this.errorMessage = ''; }
}
