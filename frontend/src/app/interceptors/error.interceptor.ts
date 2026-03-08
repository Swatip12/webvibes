import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * HTTP Interceptor for global error handling.
 * 
 * This interceptor catches all HTTP errors and formats them into user-friendly messages.
 * It handles both client-side errors (network issues, etc.) and server-side errors
 * (validation errors, server errors, etc.).
 * 
 * Error Handling:
 * - Client-side errors (ErrorEvent): Network failures, client exceptions
 * - HTTP 0: Connection errors (server unreachable)
 * - HTTP 400: Validation errors (formats field errors from backend)
 * - HTTP 500: Server errors (generic server error message)
 * - Other HTTP errors: Uses error message from response or status code
 * 
 * Validates: Requirements 17.3, 17.4
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 0) {
            errorMessage = 'Unable to connect to server. Please check your connection.';
          } else if (error.status === 400) {
            errorMessage = this.formatValidationErrors(error.error);
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = error.error?.message || `Error: ${error.status}`;
          }
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  
  private formatValidationErrors(errors: any): string {
    if (typeof errors === 'object' && errors !== null) {
      const errorMessages = Object.values(errors);
      if (errorMessages.length > 0) {
        return errorMessages.join(', ');
      }
    }
    return errors?.message || 'Validation failed';
  }
}
