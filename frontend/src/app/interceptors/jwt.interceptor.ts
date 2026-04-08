import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StudentAuthService } from '../services/student-auth.service';

/**
 * JWT Interceptor for adding authentication token to HTTP requests.
 *
 * - Student API paths (/api/student/**, /api/payment/**) use student_jwt_token.
 * - All other paths use the admin jwt_token.
 *
 * Validates: Requirements 2.4, 2.5
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private studentAuthService: StudentAuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip public auth endpoints
    if (request.url.includes('/api/auth/login') ||
        request.url.includes('/api/student/auth/')) {
      return next.handle(request);
    }

    // Student API paths — attach student token
    const isStudentPath = request.url.includes('/api/student/') ||
                          request.url.includes('/api/payment/');

    const token = isStudentPath
      ? this.studentAuthService.getToken()
      : this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request);
  }
}
