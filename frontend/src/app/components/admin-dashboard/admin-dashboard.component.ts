import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  adminUsername = '';
  stats = { courses: 0, internships: 0, applications: 0, enrollments: 0, messages: 0 };
  loading = true;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) this.adminUsername = user.username;
    this.loadStats();
  }

  loadStats(): void {
    forkJoin({
      courses: this.adminService.getCourses(),
      internships: this.adminService.getInternships(),
      applications: this.adminService.getApplications(),
      enrollments: this.adminService.getEnrollments(),
      messages: this.adminService.getMessages()
    }).subscribe({
      next: (data) => {
        this.stats.courses = data.courses.length;
        this.stats.internships = data.internships.length;
        this.stats.applications = data.applications.length;
        this.stats.enrollments = data.enrollments.length;
        this.stats.messages = data.messages.length;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  logout(): void { this.authService.logout(); this.router.navigate(['/login']); }
  navigateTo(route: string): void { this.router.navigate([route]); }
}
