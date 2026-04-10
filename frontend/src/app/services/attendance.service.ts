import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AttendanceTodayDTO,
  CalendarDayDTO,
  AttendanceSummaryDTO,
  PhaseDatesRequest
} from '../models/attendance.models';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly studentUrl = environment.apiUrl + '/api/student/attendance';
  private readonly adminUrl = environment.apiUrl + '/api/admin/students';

  constructor(private http: HttpClient) {}

  checkIn(): Observable<AttendanceTodayDTO> {
    return this.http.post<AttendanceTodayDTO>(`${this.studentUrl}/checkin`, {});
  }

  checkOut(): Observable<AttendanceTodayDTO> {
    return this.http.post<AttendanceTodayDTO>(`${this.studentUrl}/checkout`, {});
  }

  getToday(): Observable<AttendanceTodayDTO> {
    return this.http.get<AttendanceTodayDTO>(`${this.studentUrl}/today`);
  }

  getMonthly(year: number, month: number, phase: string): Observable<CalendarDayDTO[]> {
    const params = new HttpParams()
      .set('year', year)
      .set('month', month)
      .set('phase', phase);
    return this.http.get<CalendarDayDTO[]>(`${this.studentUrl}/monthly`, { params });
  }

  getSummary(phase: string): Observable<AttendanceSummaryDTO> {
    const params = new HttpParams().set('phase', phase);
    return this.http.get<AttendanceSummaryDTO>(`${this.studentUrl}/summary`, { params });
  }

  updatePhaseDates(studentId: number, req: PhaseDatesRequest): Observable<any> {
    return this.http.put(`${this.adminUrl}/${studentId}/phase-dates`, req);
  }

  getAdminMonthly(studentId: number, year: number, month: number, phase: string): Observable<CalendarDayDTO[]> {
    const params = new HttpParams()
      .set('year', year)
      .set('month', month)
      .set('phase', phase);
    return this.http.get<CalendarDayDTO[]>(`${this.adminUrl}/${studentId}/attendance`, { params });
  }
}
