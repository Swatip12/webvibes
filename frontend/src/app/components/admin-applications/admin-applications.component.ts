import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { InternshipApplicationDTO } from '../../models/dtos';

@Component({
  selector: 'app-admin-applications',
  templateUrl: './admin-applications.component.html',
  styleUrls: ['./admin-applications.component.css']
})
export class AdminApplicationsComponent implements OnInit {
  applications: InternshipApplicationDTO[] = [];
  loading = false;
  errorMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.adminService.getApplications().subscribe({
      next: (data) => { this.applications = data; this.loading = false; },
      error: () => { this.errorMessage = 'Failed to load applications'; this.loading = false; }
    });
  }
}
