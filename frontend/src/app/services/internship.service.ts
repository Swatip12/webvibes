import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { InternshipApplicationDTO } from '../models/dtos';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getInternships(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/internships`);
  }

  submitApplication(application: InternshipApplicationDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/internships/apply`, application);
  }
}
