import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StudentAuthService } from '../services/student-auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {

  constructor(
    private studentAuthService: StudentAuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.studentAuthService.isStudentAuthenticated()) {
      return true;
    }
    // Pass the attempted URL so login can redirect back after authentication
    this.router.navigate(['/student/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
