import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CourseEnrollmentDTO } from '../models/dtos';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  submitEnrollment(enrollment: CourseEnrollmentDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/courses/enroll`, enrollment);
  }
}
