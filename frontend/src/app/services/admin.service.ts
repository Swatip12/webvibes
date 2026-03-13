import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CourseDTO, InternshipDTO, MessageResponse } from '../models/dtos';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl + '/api/admin';

  constructor(private http: HttpClient) {}

  // Course operations
  createCourse(course: CourseDTO): Observable<CourseDTO> {
    return this.http.post<CourseDTO>(`${this.apiUrl}/courses`, course);
  }

  updateCourse(id: number, course: CourseDTO): Observable<CourseDTO> {
    return this.http.put<CourseDTO>(`${this.apiUrl}/courses/${id}`, course);
  }

  deleteCourse(id: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/courses/${id}`);
  }

  getCourses(): Observable<CourseDTO[]> {
    return this.http.get<CourseDTO[]>(`${this.apiUrl}/courses`);
  }
}
