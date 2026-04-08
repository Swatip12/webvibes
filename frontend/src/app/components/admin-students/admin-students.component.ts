import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../services/admin.service';
import { AdminStudentDTO } from '../../models/dtos';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.css']
})
export class AdminStudentsComponent implements OnInit {
  students: AdminStudentDTO[] = [];
  loading = false;
  error = '';
  successMsg = '';
  selectedFilter = 'ALL';
  filterOptions = ['ALL', 'NOT_PAID', 'PARTIAL', 'FULL'];

  // inline edit state
  editingId: number | null = null;
  editForm: { paidAmount: number; paymentStatus: string } = { paidAmount: 0, paymentStatus: '' };

  // assign plan state
  assigningId: number | null = null;
  assignForm: { planName: string; totalFee: number } = { planName: '', totalFee: 0 };

  private readonly apiUrl = environment.apiUrl;

  constructor(private adminService: AdminService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getStudents(this.selectedFilter).subscribe({
      next: (page) => {
        this.students = page.content || page;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load students.';
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.loadStudents();
  }

  startEdit(student: AdminStudentDTO): void {
    this.editingId = student.id;
    this.assigningId = null;
    this.editForm = { paidAmount: student.paidAmount || 0, paymentStatus: student.paymentStatus || 'NOT_PAID' };
    this.successMsg = '';
    this.error = '';
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(student: AdminStudentDTO): void {
    this.adminService.updateStudentPayment(student.id, this.editForm).subscribe({
      next: (updated) => {
        const idx = this.students.findIndex(s => s.id === student.id);
        if (idx !== -1) this.students[idx] = updated;
        this.editingId = null;
        this.successMsg = `Payment updated for ${student.name}.`;
      },
      error: () => {
        this.error = 'Failed to update payment.';
      }
    });
  }

  startAssign(student: AdminStudentDTO): void {
    this.assigningId = student.id;
    this.editingId = null;
    this.assignForm = { planName: '', totalFee: 0 };
    this.successMsg = '';
    this.error = '';
  }

  cancelAssign(): void {
    this.assigningId = null;
  }

  saveAssign(student: AdminStudentDTO): void {
    this.http.post<AdminStudentDTO>(
      `${this.apiUrl}/api/admin/students/${student.id}/assign-plan`,
      this.assignForm
    ).subscribe({
      next: (updated) => {
        const idx = this.students.findIndex(s => s.id === student.id);
        if (idx !== -1) this.students[idx] = updated;
        this.assigningId = null;
        this.successMsg = `Plan assigned to ${student.name}.`;
      },
      error: () => {
        this.error = 'Failed to assign plan.';
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'FULL': return 'badge-full';
      case 'PARTIAL': return 'badge-partial';
      default: return 'badge-not-paid';
    }
  }
}
