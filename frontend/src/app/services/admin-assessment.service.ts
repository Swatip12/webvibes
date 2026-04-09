import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AssessmentDTO,
  CreateAssessmentRequest,
  CreateQuestionRequest,
  QuestionDTO,
  AssignRequest,
  AssignResponse,
  ResultDTO,
  StudentAssessmentDTO,
  UpdateStatusRequest,
  AssessmentType,
  AssessmentStatus
} from '../models/dtos';

@Injectable({
  providedIn: 'root'
})
export class AdminAssessmentService {
  private readonly apiUrl = environment.apiUrl + '/api/admin/assessments';
  private readonly saUrl = environment.apiUrl + '/api/admin/student-assessments';

  constructor(private http: HttpClient) {}

  createAssessment(req: CreateAssessmentRequest): Observable<AssessmentDTO> {
    return this.http.post<AssessmentDTO>(this.apiUrl, req);
  }

  listAssessments(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getAssessment(id: number): Observable<AssessmentDTO> {
    return this.http.get<AssessmentDTO>(`${this.apiUrl}/${id}`);
  }

  deleteAssessment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addQuestion(assessmentId: number, req: CreateQuestionRequest): Observable<QuestionDTO> {
    return this.http.post<QuestionDTO>(`${this.apiUrl}/${assessmentId}/questions`, req);
  }

  deleteQuestion(assessmentId: number, questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${assessmentId}/questions/${questionId}`);
  }

  assignAssessment(assessmentId: number, req: AssignRequest): Observable<AssignResponse> {
    return this.http.post<AssignResponse>(`${this.apiUrl}/${assessmentId}/assign`, req);
  }

  getAssignedStudents(assessmentId: number): Observable<StudentAssessmentDTO[]> {
    return this.http.get<StudentAssessmentDTO[]>(`${this.apiUrl}/${assessmentId}/students`);
  }

  getResults(assessmentId: number): Observable<ResultDTO[]> {
    return this.http.get<ResultDTO[]>(`${this.apiUrl}/${assessmentId}/results`);
  }

  getAllStudentAssessments(assessmentType?: AssessmentType, assessmentStatus?: AssessmentStatus): Observable<StudentAssessmentDTO[]> {
    let params = new HttpParams();
    if (assessmentType) params = params.set('assessmentType', assessmentType);
    if (assessmentStatus) params = params.set('assessmentStatus', assessmentStatus);
    return this.http.get<StudentAssessmentDTO[]>(this.saUrl, { params });
  }

  updateStudentAssessmentStatus(saId: number, req: UpdateStatusRequest): Observable<void> {
    return this.http.put<void>(`${this.saUrl}/${saId}/status`, req);
  }
}
