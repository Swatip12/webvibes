import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../services/admin.service';
import { AttendanceService } from '../../services/attendance.service';
import { AdminStudentDTO } from '../../models/dtos';
import { CalendarDayDTO, PhaseDatesRequest } from '../../models/attendance.models';
import { environment } from '../../../environments/environment';

interface PhaseDatesForm {
  trainingStartDate: string;
  trainingEndDate: string;
  internshipStartDate: string;
  internshipEndDate: string;
}

interface AdminCalendarState {
  open: boolean;
  phase: 'TRAINING' | 'INTERNSHIP';
  year: number;
  month: number;
  days: CalendarDayDTO[];
  loading: boolean;
  error: string;
}

interface PhaseDatesState {
  open: boolean;
  form: PhaseDatesForm;
  saveMsg: string;
  saveError: string;
  saving: boolean;
}

@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.css']
})
export class AdminStudentsComponent implements OnInit {
  students: AdminStudentDTO[] = [];
  loading = false;
  error = '';
  successMsg = '';
  selectedFilter = 'ALL';
  filterOptions = ['ALL', 'NOT_PAID', 'PARTIAL', 'FULL'];

  // inline edit state
  editingId: number | null = null;
  editForm: { paidAmount: number; paymentStatus: string } = { paidAmount: 0, paymentStatus: '' };

  // assign plan state
  assigningId: number | null = null;
  assignForm: { planName: string; totalFee: number } = { planName: '', totalFee: 0 };

  // phase dates state per student (keyed by student id)
  phaseDatesMap: Map<number, PhaseDatesState> = new Map();

  // admin calendar state per student (keyed by student id)
  adminCalendarMap: Map<number, AdminCalendarState> = new Map();

  private readonly apiUrl = environment.apiUrl;

  constructor(
    private adminService: AdminService,
    private http: HttpClient,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getStudents(this.selectedFilter).subscribe({
      next: (page) => {
        this.students = page.content || page;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load students.';
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.loadStudents();
  }

  startEdit(student: AdminStudentDTO): void {
    this.editingId = student.id;
    this.assigningId = null;
    this.editForm = { paidAmount: student.paidAmount || 0, paymentStatus: student.paymentStatus || 'NOT_PAID' };
    this.successMsg = '';
    this.error = '';
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(student: AdminStudentDTO): void {
    this.adminService.updateStudentPayment(student.id, this.editForm).subscribe({
      next: (updated) => {
        const idx = this.students.findIndex(s => s.id === student.id);
        if (idx !== -1) this.students[idx] = { ...this.students[idx], ...updated };
        this.editingId = null;
        this.successMsg = `Payment updated for ${student.name}.`;
      },
      error: () => {
        this.error = 'Failed to update payment.';
      }
    });
  }

  startAssign(student: AdminStudentDTO): void {
    this.assigningId = student.id;
    this.editingId = null;
    this.assignForm = { planName: '', totalFee: 0 };
    this.successMsg = '';
    this.error = '';
  }

  cancelAssign(): void {
    this.assigningId = null;
  }

  saveAssign(student: AdminStudentDTO): void {
    this.http.post<AdminStudentDTO>(
      `${this.apiUrl}/api/admin/students/${student.id}/assign-plan`,
      this.assignForm
    ).subscribe({
      next: (updated) => {
        const idx = this.students.findIndex(s => s.id === student.id);
        if (idx !== -1) this.students[idx] = updated;
        this.assigningId = null;
        this.successMsg = `Plan assigned to ${student.name}.`;
      },
      error: () => {
        this.error = 'Failed to assign plan.';
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'FULL': return 'badge-full';
      case 'PARTIAL': return 'badge-partial';
      default: return 'badge-not-paid';
    }
  }

  // ── Phase Dates ────────────────────────────────────────────────────────────

  getPhaseDatesState(studentId: number): PhaseDatesState {
    if (!this.phaseDatesMap.has(studentId)) {
      this.phaseDatesMap.set(studentId, {
        open: false,
        form: { trainingStartDate: '', trainingEndDate: '', internshipStartDate: '', internshipEndDate: '' },
        saveMsg: '',
        saveError: '',
        saving: false
      });
    }
    return this.phaseDatesMap.get(studentId)!;
  }

  togglePhaseDates(student: AdminStudentDTO): void {
    const state = this.getPhaseDatesState(student.id);
    state.open = !state.open;
    if (state.open) {
      // Pre-populate from student data
      state.form = {
        trainingStartDate: student.trainingStartDate || '',
        trainingEndDate: student.trainingEndDate || '',
        internshipStartDate: student.internshipStartDate || '',
        internshipEndDate: student.internshipEndDate || ''
      };
      state.saveMsg = '';
      state.saveError = '';
    }
  }

  phaseDatesValidationError(state: PhaseDatesState): string {
    const f = state.form;
    if (f.trainingStartDate && f.trainingEndDate && f.trainingEndDate < f.trainingStartDate) {
      return 'Training end date must not be before training start date.';
    }
    if (f.internshipStartDate && f.internshipEndDate && f.internshipEndDate < f.internshipStartDate) {
      return 'Internship end date must not be before internship start date.';
    }
    return '';
  }

  savePhaseDates(student: AdminStudentDTO): void {
    const state = this.getPhaseDatesState(student.id);
    const validationErr = this.phaseDatesValidationError(state);
    if (validationErr) {
      state.saveError = validationErr;
      return;
    }
    state.saving = true;
    state.saveMsg = '';
    state.saveError = '';

    const req: PhaseDatesRequest = {
      trainingStartDate: state.form.trainingStartDate || null,
      trainingEndDate: state.form.trainingEndDate || null,
      internshipStartDate: state.form.internshipStartDate || null,
      internshipEndDate: state.form.internshipEndDate || null
    };

    this.attendanceService.updatePhaseDates(student.id, req).subscribe({
      next: (updated: AdminStudentDTO) => {
        state.saving = false;
        state.saveMsg = 'Phase dates saved successfully.';
        // Update student in list
        const idx = this.students.findIndex(s => s.id === student.id);
        if (idx !== -1) {
          this.students[idx] = { ...this.students[idx], ...updated };
        }
      },
      error: () => {
        state.saving = false;
        state.saveError = 'Failed to save phase dates.';
      }
    });
  }

  // ── Admin Calendar ─────────────────────────────────────────────────────────

  getAdminCalendarState(studentId: number): AdminCalendarState {
    if (!this.adminCalendarMap.has(studentId)) {
      const now = new Date();
      this.adminCalendarMap.set(studentId, {
        open: false,
        phase: 'TRAINING',
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        days: [],
        loading: false,
        error: ''
      });
    }
    return this.adminCalendarMap.get(studentId)!;
  }

  toggleAdminCalendar(student: AdminStudentDTO): void {
    const state = this.getAdminCalendarState(student.id);
    state.open = !state.open;
    if (state.open && state.days.length === 0) {
      this.loadAdminCalendar(student.id);
    }
  }

  loadAdminCalendar(studentId: number): void {
    const state = this.getAdminCalendarState(studentId);
    state.loading = true;
    state.error = '';
    this.attendanceService.getAdminMonthly(studentId, state.year, state.month, state.phase).subscribe({
      next: (days) => {
        state.days = days;
        state.loading = false;
      },
      error: () => {
        state.error = 'Phase not configured or no data available.';
        state.loading = false;
      }
    });
  }

  adminCalPrevMonth(studentId: number): void {
    const state = this.getAdminCalendarState(studentId);
    if (state.month === 1) { state.month = 12; state.year--; }
    else { state.month--; }
    this.loadAdminCalendar(studentId);
  }

  adminCalNextMonth(studentId: number): void {
    const state = this.getAdminCalendarState(studentId);
    if (state.month === 12) { state.month = 1; state.year++; }
    else { state.month++; }
    this.loadAdminCalendar(studentId);
  }

  adminCalSelectPhase(studentId: number, phase: 'TRAINING' | 'INTERNSHIP'): void {
    const state = this.getAdminCalendarState(studentId);
    state.phase = phase;
    this.loadAdminCalendar(studentId);
  }

  adminCalMonthLabel(state: AdminCalendarState): string {
    const d = new Date(state.year, state.month - 1, 1);
    return d.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  adminCalGrid(state: AdminCalendarState): (CalendarDayDTO | null)[][] {
    if (!state.days.length) return [];
    const firstDay = new Date(state.year, state.month - 1, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const cells: (CalendarDayDTO | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    cells.push(...state.days);
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks: (CalendarDayDTO | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  }

  cellClass(day: CalendarDayDTO | null): string {
    if (!day) return 'cell-empty';
    switch (day.displayStatus) {
      case 'PRESENT':      return 'cell-present';
      case 'LATE':         return 'cell-late';
      case 'ABSENT':       return 'cell-absent';
      case 'WEEKEND':      return 'cell-weekend';
      case 'FUTURE':       return 'cell-future';
      case 'OUT_OF_PHASE': return 'cell-out';
      default:             return 'cell-future';
    }
  }

  dayNumber(day: CalendarDayDTO | null): string {
    if (!day) return '';
    return new Date(day.date).getDate().toString();
  }

  formatTime(dt: string | null): string {
    if (!dt) return '—';
    return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
