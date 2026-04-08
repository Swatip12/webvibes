import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { StudentRegisterRequest, StudentLoginRequest, StudentAuthResponse } from '../models/dtos';

@Injectable({
  providedIn: 'root'
})
export class StudentAuthService {
  private readonly TOKEN_KEY = 'student_jwt_token';
  private readonly USER_KEY = 'student_current_user';
  private readonly apiUrl = environment.apiUrl + '/api/student/auth';

  constructor(private http: HttpClient) {}

  register(req: StudentRegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, req);
  }

  login(req: StudentLoginRequest): Observable<StudentAuthResponse> {
    return this.http.post<StudentAuthResponse>(`${this.apiUrl}/login`, req).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify({ name: response.name, role: response.role }));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isStudentAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  getCurrentStudent(): { name: string; role: string } | null {
    const json = localStorage.getItem(this.USER_KEY);
    if (!json) return null;
    try { return JSON.parse(json); } catch { return null; }
  }
}
