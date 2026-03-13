import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface DashboardStats {
  totalCourses: number;
  totalInternships: number;
  totalApplications: number;
  totalEnrollments: number;
  totalMessages: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  adminUsername: string = '';
  stats: DashboardStats = {
    totalCourses: 0,
    totalInternships: 0,
    totalApplications: 0,
    totalEnrollments: 0,
    totalMessages: 0
  };
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get admin username from auth service
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.adminUsername = currentUser.username;
    }

    // Load dashboard statistics
    this.loadStatistics();
  }

  loadStatistics(): void {
    // For now, we'll set loading to false
    // In a real implementation, this would fetch from AdminService
    // Since AdminService doesn't exist yet, we'll use placeholder values
    this.loading = false;
    
    // TODO: Replace with actual API calls when AdminService is implemented
    // this.adminService.getStatistics().subscribe({
    //   next: (stats) => {
    //     this.stats = stats;
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading statistics:', error);
    //     this.loading = false;
    //   }
    // });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
