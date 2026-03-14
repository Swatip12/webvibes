import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CourseEnrollmentDTO } from '../../models/dtos';

@Component({
  selector: 'app-admin-enrollments',
  templateUrl: './admin-enrollments.component.html',
  styleUrls: ['./admin-enrollments.component.css']
})
export class AdminEnrollmentsComponent implements OnInit {
  enrollments: CourseEnrollmentDTO[] = [];
  loading = false;
  errorMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.adminService.getEnrollments().subscribe({
      next: (data) => { this.enrollments = data; this.loading = false; },
      error: () => { this.errorMessage = 'Failed to load enrollments'; this.loading = false; }
    });
  }
}
