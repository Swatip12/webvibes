import { Component, OnInit, OnDestroy } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import {
  AttendanceTodayDTO,
  CalendarDayDTO,
  AttendanceSummaryDTO
} from '../../models/attendance.models';

@Component({
  selector: 'app-attendance-tracker',
  templateUrl: './attendance-tracker.component.html',
  styleUrls: ['./attendance-tracker.component.css']
})
export class AttendanceTrackerComponent implements OnInit, OnDestroy {

  // Live clock
  currentTime: Date = new Date();
  private clockInterval: any;

  // Today's status
  today: AttendanceTodayDTO | null = null;
  todayLoading = false;
  todayError = '';
  actionLoading = false;

  // Phase tabs
  selectedPhase: 'TRAINING' | 'INTERNSHIP' = 'TRAINING';

  // Summary
  summary: AttendanceSummaryDTO | null = null;
  summaryLoading = false;
  summaryError = '';

  // Calendar
  calendarDays: CalendarDayDTO[] = [];
  calendarLoading = false;
  calendarError = '';
  calendarYear: number = new Date().getFullYear();
  calendarMonth: number = new Date().getMonth() + 1; // 1-based

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.clockInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
    this.loadToday();
    this.loadSummary();
    this.loadCalendar();
  }

  ngOnDestroy(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  // ── Today ──────────────────────────────────────────────────────────────────

  loadToday(): void {
    this.todayLoading = true;
    this.todayError = '';
    this.attendanceService.getToday().subscribe({
      next: (data) => {
        this.today = data;
        this.todayLoading = false;
      },
      error: (err) => {
        this.todayError = err?.error?.error || 'Failed to load today\'s status.';
        this.todayLoading = false;
      }
    });
  }

  checkIn(): void {
    this.actionLoading = true;
    this.todayError = '';
    this.attendanceService.checkIn().subscribe({
      next: (data) => {
        this.today = data;
        this.actionLoading = false;
        this.loadCalendar();
        this.loadSummary();
      },
      error: (err) => {
        this.todayError = err?.error?.error || 'Check-in failed.';
        this.actionLoading = false;
      }
    });
  }

  checkOut(): void {
    this.actionLoading = true;
    this.todayError = '';
    this.attendanceService.checkOut().subscribe({
      next: (data) => {
        this.today = data;
        this.actionLoading = false;
        this.loadCalendar();
        this.loadSummary();
      },
      error: (err) => {
        this.todayError = err?.error?.error || 'Check-out failed.';
        this.actionLoading = false;
      }
    });
  }

  // ── Phase / Summary ────────────────────────────────────────────────────────

  selectPhase(phase: 'TRAINING' | 'INTERNSHIP'): void {
    this.selectedPhase = phase;
    this.loadSummary();
    this.loadCalendar();
  }

  loadSummary(): void {
    this.summaryLoading = true;
    this.summaryError = '';
    this.summary = null;
    this.attendanceService.getSummary(this.selectedPhase).subscribe({
      next: (data) => {
        this.summary = data;
        this.summaryLoading = false;
      },
      error: (err) => {
        this.summaryError = err?.error?.error || 'Phase not configured.';
        this.summaryLoading = false;
      }
    });
  }

  // ── Calendar ───────────────────────────────────────────────────────────────

  loadCalendar(): void {
    this.calendarLoading = true;
    this.calendarError = '';
    this.attendanceService.getMonthly(this.calendarYear, this.calendarMonth, this.selectedPhase).subscribe({
      next: (data) => {
        this.calendarDays = data;
        this.calendarLoading = false;
      },
      error: (err) => {
        this.calendarError = err?.error?.error || 'Phase not configured.';
        this.calendarLoading = false;
      }
    });
  }

  prevMonth(): void {
    if (this.calendarMonth === 1) {
      this.calendarMonth = 12;
      this.calendarYear--;
    } else {
      this.calendarMonth--;
    }
    this.loadCalendar();
  }

  nextMonth(): void {
    if (this.calendarMonth === 12) {
      this.calendarMonth = 1;
      this.calendarYear++;
    } else {
      this.calendarMonth++;
    }
    this.loadCalendar();
  }

  get calendarMonthLabel(): string {
    const d = new Date(this.calendarYear, this.calendarMonth - 1, 1);
    return d.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  /** Returns a 2D grid (weeks) of CalendarDayDTO | null for Mon–Sun layout */
  get calendarGrid(): (CalendarDayDTO | null)[][] {
    if (!this.calendarDays.length) return [];
    const firstDay = new Date(this.calendarYear, this.calendarMonth - 1, 1);
    // Monday=0 ... Sunday=6
    let startOffset = (firstDay.getDay() + 6) % 7;
    const cells: (CalendarDayDTO | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    cells.push(...this.calendarDays);
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks: (CalendarDayDTO | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  formatTime(dt: string | null): string {
    if (!dt) return '—';
    return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(d: string | null): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  }

  statusClass(status: string | null): string {
    switch (status) {
      case 'PRESENT': return 'badge-present';
      case 'LATE':    return 'badge-late';
      case 'ABSENT':  return 'badge-absent';
      default:        return 'badge-none';
    }
  }

  cellClass(day: CalendarDayDTO | null): string {
    if (!day) return 'cell-empty';
    switch (day.displayStatus) {
      case 'PRESENT':     return 'cell-present';
      case 'LATE':        return 'cell-late';
      case 'ABSENT':      return 'cell-absent';
      case 'WEEKEND':     return 'cell-weekend';
      case 'FUTURE':      return 'cell-future';
      case 'OUT_OF_PHASE': return 'cell-out';
      default:            return 'cell-future';
    }
  }

  dayNumber(day: CalendarDayDTO | null): string {
    if (!day) return '';
    return new Date(day.date).getDate().toString();
  }
}
