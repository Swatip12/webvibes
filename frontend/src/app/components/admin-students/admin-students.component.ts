import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminStudentDTO } from '../../models/dtos';

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

  // inline edit state: map of studentId -> edit form data
  editingId: number | null = null;
  editForm: { paidAmount: number; paymentStatus: string } = { paidAmount: 0, paymentStatus: '' };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getStudents(this.selectedFilter).subscribe({
      next: (page) => {
        this.students = page.content || page; // handle both Page and plain array
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
    this.editForm = { paidAmount: student.paidAmount, paymentStatus: student.paymentStatus };
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'FULL': return 'badge-full';
      case 'PARTIAL': return 'badge-partial';
      default: return 'badge-not-paid';
    }
  }
}
