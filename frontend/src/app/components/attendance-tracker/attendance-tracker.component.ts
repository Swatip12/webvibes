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

  refresh(): void {
    this.loadToday();
    this.loadSummary();
    this.loadCalendar();
  }

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

  /** Live elapsed hours since check-in (for internship minimum hours display) */
  get elapsedHours(): string {
    if (!this.today?.checkInTime) return '0.0';
    const checkIn = new Date(this.today.checkInTime).getTime();
    const now = this.currentTime.getTime();
    const hours = (now - checkIn) / (1000 * 60 * 60);
    return hours.toFixed(1);
  }

  formatTime(dt: string | null): string {
    if (!dt) return '—';
    // dt is "2026-04-10T14:07:00" (no Z) — treat as local time directly
    return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(d: string | null): string {
    if (!d) return '—';
    // Date-only strings like "2026-04-10" are parsed as UTC midnight by browsers.
    // Append T00:00:00 to force local-time parsing and avoid off-by-one-day issues.
    const safe = d.includes('T') ? d : d + 'T00:00:00';
    return new Date(safe).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
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
    // Force local-time parsing to avoid UTC midnight shifting the date back by 1 day in IST
    return new Date(day.date + 'T00:00:00').getDate().toString();
  }

  // ── PDF Download ───────────────────────────────────────────────────────────

  downloadReport(): void {
    if (!this.summary || !this.calendarDays.length) return;

    const monthName = new Date(this.calendarYear, this.calendarMonth - 1, 1)
      .toLocaleString('default', { month: 'long', year: 'numeric' });

    // Build calendar rows
    const firstDay = new Date(this.calendarYear, this.calendarMonth - 1, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const cells: (CalendarDayDTO | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    cells.push(...this.calendarDays);
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks: (CalendarDayDTO | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    const statusColor: Record<string, string> = {
      PRESENT: '#d4edda', LATE: '#fff3cd', ABSENT: '#f8d7da',
      WEEKEND: '#f0f0f0', FUTURE: '#f0f0f0', OUT_OF_PHASE: '#f0f0f0'
    };
    const statusText: Record<string, string> = {
      PRESENT: '#155724', LATE: '#856404', ABSENT: '#721c24',
      WEEKEND: '#aaa', FUTURE: '#aaa', OUT_OF_PHASE: '#aaa'
    };

    const calRows = weeks.map(week => {
      const cells = week.map(day => {
        if (!day) return '<td style="background:#fff;border:1px solid #eee;padding:8px;"></td>';
        const bg = statusColor[day.displayStatus] || '#fff';
        const tc = statusText[day.displayStatus] || '#333';
        const num = new Date(day.date + 'T00:00:00').getDate();
        const time = (day.displayStatus === 'PRESENT' || day.displayStatus === 'LATE') && day.checkInTime
          ? `<br><small style="font-size:10px">${this.formatTime(day.checkInTime)}</small>` : '';
        return `<td style="background:${bg};color:${tc};border:1px solid #ddd;padding:8px;text-align:center;font-weight:600">${num}${time}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Attendance Report - ${monthName}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
    h1 { color: #1e1b4b; margin-bottom: 4px; }
    .subtitle { color: #666; margin-bottom: 20px; font-size: 14px; }
    .summary { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat { padding: 12px 20px; border-radius: 8px; text-align: center; min-width: 80px; }
    .stat .num { font-size: 24px; font-weight: 800; display: block; }
    .stat .lbl { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-p { background: #d4edda; color: #155724; }
    .stat-l { background: #fff3cd; color: #856404; }
    .stat-a { background: #f8d7da; color: #721c24; }
    .stat-t { background: #e9ecef; color: #495057; }
    .stat-pct { background: #e8e4ff; color: #4f46e5; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1e1b4b; color: #fff; padding: 10px; text-align: center; font-size: 13px; }
    td { height: 50px; vertical-align: top; }
    .legend { display: flex; gap: 16px; margin-top: 16px; font-size: 12px; flex-wrap: wrap; }
    .leg { display: flex; align-items: center; gap: 6px; }
    .dot { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
    @media print { body { padding: 10px; } }
  </style>
</head>
<body>
  <h1>Attendance Report</h1>
  <div class="subtitle">${this.selectedPhase} Phase &nbsp;·&nbsp; ${monthName}</div>
  <div class="summary">
    <div class="stat stat-p"><span class="num">${this.summary.presentDays}</span><span class="lbl">Present</span></div>
    <div class="stat stat-l"><span class="num">${this.summary.lateDays}</span><span class="lbl">Late</span></div>
    <div class="stat stat-a"><span class="num">${this.summary.absentDays}</span><span class="lbl">Absent</span></div>
    <div class="stat stat-t"><span class="num">${this.summary.totalWorkingDays}</span><span class="lbl">Working Days</span></div>
    <div class="stat stat-pct"><span class="num">${this.summary.attendancePercentage}%</span><span class="lbl">Attendance</span></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th>
      </tr>
    </thead>
    <tbody>${calRows}</tbody>
  </table>
  <div class="legend">
    <div class="leg"><span class="dot" style="background:#28a745"></span>Present</div>
    <div class="leg"><span class="dot" style="background:#ffc107"></span>Late</div>
    <div class="leg"><span class="dot" style="background:#dc3545"></span>Absent</div>
    <div class="leg"><span class="dot" style="background:#ccc"></span>Weekend / Out of phase</div>
  </div>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
    }
  }
}
