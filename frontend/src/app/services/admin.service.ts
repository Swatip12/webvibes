import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CourseDTO, InternshipDTO, MessageResponse,
  InternshipApplicationDTO, CourseEnrollmentDTO, ContactMessageDTO
} from '../models/dtos';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl + '/api/admin';

  constructor(private http: HttpClient) {}

  // ── Courses ──────────────────────────────────────────────────
  getCourses(): Observable<CourseDTO[]> {
    return this.http.get<CourseDTO[]>(`${this.apiUrl}/courses`);
  }
  createCourse(course: CourseDTO): Observable<CourseDTO> {
    return this.http.post<CourseDTO>(`${this.apiUrl}/courses`, course);
  }
  updateCourse(id: number, course: CourseDTO): Observable<CourseDTO> {
    return this.http.put<CourseDTO>(`${this.apiUrl}/courses/${id}`, course);
  }
  deleteCourse(id: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/courses/${id}`);
  }

  // ── Internships ───────────────────────────────────────────────
  getInternships(): Observable<InternshipDTO[]> {
    return this.http.get<InternshipDTO[]>(`${this.apiUrl}/internships`);
  }
  createInternship(internship: InternshipDTO): Observable<InternshipDTO> {
    return this.http.post<InternshipDTO>(`${this.apiUrl}/internships`, internship);
  }
  updateInternship(id: number, internship: InternshipDTO): Observable<InternshipDTO> {
    return this.http.put<InternshipDTO>(`${this.apiUrl}/internships/${id}`, internship);
  }
  deleteInternship(id: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/internships/${id}`);
  }

  // ── Projects ──────────────────────────────────────────────────
  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects`);
  }
  createProject(project: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/projects`, project);
  }
  deleteProject(id: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/projects/${id}`);
  }

  // ── View data ─────────────────────────────────────────────────
  getApplications(): Observable<InternshipApplicationDTO[]> {
    return this.http.get<InternshipApplicationDTO[]>(`${this.apiUrl}/applications`);
  }
  getEnrollments(): Observable<CourseEnrollmentDTO[]> {
    return this.http.get<CourseEnrollmentDTO[]>(`${this.apiUrl}/enrollments`);
  }
  getMessages(): Observable<ContactMessageDTO[]> {
    return this.http.get<ContactMessageDTO[]>(`${this.apiUrl}/messages`);
  }

  // ── Students ──────────────────────────────────────────────────
  getStudents(paymentStatus?: string): Observable<any> {
    let params = 'size=500&sort=id,desc';
    if (paymentStatus && paymentStatus !== 'ALL') {
      params += `&paymentStatus=${paymentStatus}`;
    }
    return this.http.get<any>(`${this.apiUrl}/students?${params}`);
  }

  updateStudentPayment(studentId: number, data: { paidAmount: number; paymentStatus: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/students/${studentId}/payment`, data);
  }
}
