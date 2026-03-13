import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * JWT Interceptor for adding authentication token to HTTP requests.
 * 
 * This interceptor automatically adds the JWT token from AuthService to the
 * Authorization header of all outgoing HTTP requests, except for the login endpoint.
 * 
 * The token is added in the format: "Bearer <token>"
 * 
 * Validates: Requirements 2.4, 2.5
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  /**
   * Intercepts HTTP requests and adds JWT token to Authorization header.
   * 
   * @param request - The outgoing HTTP request
   * @param next - The next handler in the chain
   * @returns Observable of the HTTP event
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding token for login endpoint
    if (request.url.includes('/api/auth/login')) {
      return next.handle(request);
    }

    // Get the token from AuthService
    const token = this.authService.getToken();

    // If token exists, clone the request and add Authorization header
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
