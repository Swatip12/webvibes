import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudentProgressDTO } from '../../models/progress.models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-student-progress',
  templateUrl: './student-progress.component.html',
  styleUrls: ['./student-progress.component.css']
})
export class StudentProgressComponent implements OnInit {

  progress: StudentProgressDTO | null = null;
  loading = true;
  error = '';

  categories = [
    { key: 'mockInterview',  label: 'Mock Interviews',  icon: '🎤', color: 'purple' },
    { key: 'aptitudeTest',   label: 'Aptitude Tests',   icon: '🧠', color: 'blue'   },
    { key: 'machineTest',    label: 'Machine Tests',    icon: '💻', color: 'orange' },
    { key: 'technicalMcq',  label: 'Technical MCQs',   icon: '📝', color: 'green'  },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('studentToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<StudentProgressDTO>(`${environment.apiUrl}/api/student/assessments/progress`, { headers })
      .subscribe({
        next: (data) => { this.progress = data; this.loading = false; },
        error: () => { this.error = 'Failed to load progress.'; this.loading = false; }
      });
  }

  total(key: string): number {
    if (!this.progress) return 0;
    return (this.progress as any)[key + 'Total'] ?? 0;
  }

  completed(key: string): number {
    if (!this.progress) return 0;
    return (this.progress as any)[key + 'Completed'] ?? 0;
  }

  pct(key: string): number {
    const t = this.total(key);
    if (t === 0) return 0;
    return Math.round((this.completed(key) / t) * 100);
  }

  overallPct(): number {
    if (!this.progress || this.progress.totalAssigned === 0) return 0;
    return Math.round((this.progress.totalCompleted / this.progress.totalAssigned) * 100);
  }

  allDone(): boolean {
    return !!this.progress && this.progress.totalAssigned > 0 &&
           this.progress.totalCompleted === this.progress.totalAssigned;
  }
}
