import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Authentication Guard for protecting admin routes.
 * 
 * This guard implements the CanActivate interface to protect routes from
 * unauthorized access. It checks if the user is authenticated using the
 * AuthService and redirects to the login page if not authenticated.
 * 
 * Usage:
 * Add this guard to route configuration:
 * { path: 'admin', canActivate: [AuthGuard], component: AdminComponent }
 * 
 * Validates: Requirements 2.3
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Determines if a route can be activated based on authentication status.
   * 
   * @param route - The activated route snapshot
   * @param state - The router state snapshot
   * @returns true if user is authenticated, false otherwise
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // User is not authenticated, redirect to login page
    this.router.navigate(['/login']);
    return false;
  }
}
