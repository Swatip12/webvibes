import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  StudentAssessmentDTO,
  AssessmentDetailDTO,
  QuestionStudentDTO,
  McqSubmitRequest,
  MachineSubmitRequest,
  SubmitResponse
} from '../models/dtos';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private readonly apiUrl = environment.apiUrl + '/api/student/assessments';

  constructor(private http: HttpClient) {}

  getMyAssessments(): Observable<StudentAssessmentDTO[]> {
    return this.http.get<StudentAssessmentDTO[]>(this.apiUrl);
  }

  getAssessmentDetail(saId: number): Observable<AssessmentDetailDTO> {
    return this.http.get<AssessmentDetailDTO>(`${this.apiUrl}/${saId}`);
  }

  getQuestions(saId: number): Observable<QuestionStudentDTO[]> {
    return this.http.get<QuestionStudentDTO[]>(`${this.apiUrl}/${saId}/questions`);
  }

  submitTest(saId: number, answers: McqSubmitRequest): Observable<SubmitResponse> {
    return this.http.post<SubmitResponse>(`${this.apiUrl}/${saId}/submit`, answers);
  }

  submitMachineTest(saId: number, solution: MachineSubmitRequest): Observable<SubmitResponse> {
    return this.http.post<SubmitResponse>(`${this.apiUrl}/${saId}/submit`, solution);
  }
}
