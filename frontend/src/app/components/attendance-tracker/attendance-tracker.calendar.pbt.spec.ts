import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import * as fc from 'fast-check';
import { AttendanceTrackerComponent } from './attendance-tracker.component';
import { AttendanceService } from '../../services/attendance.service';
import { CalendarDayDTO } from '../../models/attendance.models';

/**
 * Feature: student-attendance-tracker
 * Property 8: Calendar Completeness
 *
 * For any valid year/month, the rendered calendar grid must:
 *   1. Contain exactly N day cells (N = days in that month) — no more, no less
 *   2. Have no duplicate dates
 *   3. Cover a 7-column Mon–Sun layout (total cells divisible by 7)
 *   4. Preserve all displayStatus values from the source data
 *
 * Validates: Requirements 7.1, 12.1
 */

interface YearMonth { year: number; month: number; }

describe('AttendanceTrackerComponent — Calendar Grid Property-Based Tests (fast-check)', () => {
  let component: AttendanceTrackerComponent;
  let fixture: ComponentFixture<AttendanceTrackerComponent>;
  let attendanceServiceSpy: jasmine.SpyObj<AttendanceService>;

  beforeEach(async () => {
    attendanceServiceSpy = jasmine.createSpyObj('AttendanceService', [
      'getToday', 'checkIn', 'checkOut', 'getSummary', 'getMonthly'
    ]);

    attendanceServiceSpy.getToday.and.returnValue(of({
      date: '2025-01-15',
      activePhase: null,
      checkInTime: null,
      checkOutTime: null,
      status: null,
      hoursWorked: null,
      canCheckIn: false,
      canCheckOut: false
    }));
    attendanceServiceSpy.getSummary.and.returnValue(of({
      phase: 'TRAINING',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      presentDays: 0,
      lateDays: 0,
      absentDays: 0,
      totalWorkingDays: 0,
      attendancePercentage: 0
    }));
    attendanceServiceSpy.getMonthly.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [AttendanceTrackerComponent],
      providers: [
        { provide: AttendanceService, useValue: attendanceServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  // ── Helpers ────────────────────────────────────────────────────────────────

  function daysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  function makeDayDTO(year: number, month: number, day: number): CalendarDayDTO {
    const m = String(month).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const statuses: CalendarDayDTO['displayStatus'][] = [
      'PRESENT', 'LATE', 'ABSENT', 'WEEKEND', 'FUTURE', 'OUT_OF_PHASE'
    ];
    return {
      date: `${year}-${m}-${d}`,
      displayStatus: statuses[day % statuses.length],
      checkInTime: null,
      checkOutTime: null
    };
  }

  function buildMonthData(year: number, month: number): CalendarDayDTO[] {
    const n = daysInMonth(year, month);
    return Array.from({ length: n }, (_: unknown, i: number) => makeDayDTO(year, month, i + 1));
  }

  // ── Arbitraries ────────────────────────────────────────────────────────────

  const yearMonthArb: fc.Arbitrary<YearMonth> = fc.record({
    year: fc.integer({ min: 2020, max: 2030 }),
    month: fc.integer({ min: 1, max: 12 })
  });

  // ── Property 1: Grid contains exactly N non-null day cells ────────────────

  it('Property: calendarGrid contains exactly N day cells for any year/month', () => {
    fc.assert(
      fc.property(yearMonthArb, (ym: YearMonth) => {
        const { year, month } = ym;
        const n = daysInMonth(year, month);
        component.calendarYear = year;
        component.calendarMonth = month;
        component.calendarDays = buildMonthData(year, month);

        const nonNullCells = component.calendarGrid.flat().filter((c) => c !== null);
        expect(nonNullCells.length).toBe(n);
      }),
      { numRuns: 100 }
    );
  });

  // ── Property 2: Grid total cells are divisible by 7 (Mon–Sun layout) ──────

  it('Property: total grid cells (including padding nulls) are always divisible by 7', () => {
    fc.assert(
      fc.property(yearMonthArb, (ym: YearMonth) => {
        const { year, month } = ym;
        component.calendarYear = year;
        component.calendarMonth = month;
        component.calendarDays = buildMonthData(year, month);

        const totalCells = component.calendarGrid.flat().length;
        expect(totalCells % 7).toBe(0);
      }),
      { numRuns: 100 }
    );
  });

  // ── Property 3: No duplicate dates in the grid ────────────────────────────

  it('Property: no duplicate dates appear in the calendar grid', () => {
    fc.assert(
      fc.property(yearMonthArb, (ym: YearMonth) => {
        const { year, month } = ym;
        component.calendarYear = year;
        component.calendarMonth = month;
        component.calendarDays = buildMonthData(year, month);

        const dates = component.calendarGrid.flat()
          .filter((cell): cell is CalendarDayDTO => cell !== null)
          .map((cell: CalendarDayDTO) => cell.date);

        expect(new Set(dates).size).toBe(dates.length);
      }),
      { numRuns: 100 }
    );
  });

  // ── Property 4: Each row has exactly 7 cells ──────────────────────────────

  it('Property: every row in the calendar grid has exactly 7 cells', () => {
    fc.assert(
      fc.property(yearMonthArb, (ym: YearMonth) => {
        const { year, month } = ym;
        component.calendarYear = year;
        component.calendarMonth = month;
        component.calendarDays = buildMonthData(year, month);

        component.calendarGrid.forEach((row: (CalendarDayDTO | null)[]) => {
          expect(row.length).toBe(7);
        });
      }),
      { numRuns: 100 }
    );
  });

  // ── Property 5: displayStatus values are preserved in grid order ──────────

  it('Property: displayStatus values in grid match source calendarDays in order', () => {
    fc.assert(
      fc.property(yearMonthArb, (ym: YearMonth) => {
        const { year, month } = ym;
        const monthData = buildMonthData(year, month);
        component.calendarYear = year;
        component.calendarMonth = month;
        component.calendarDays = monthData;

        const gridDays = component.calendarGrid.flat()
          .filter((cell): cell is CalendarDayDTO => cell !== null);

        gridDays.forEach((cell: CalendarDayDTO, i: number) => {
          expect(cell.displayStatus).toBe(monthData[i].displayStatus);
          expect(cell.date).toBe(monthData[i].date);
        });
      }),
      { numRuns: 100 }
    );
  });

  // ── Property 6: Empty calendarDays produces empty grid ────────────────────

  it('Property: empty calendarDays produces an empty grid', () => {
    fc.assert(
      fc.property(yearMonthArb, (ym: YearMonth) => {
        const { year, month } = ym;
        component.calendarYear = year;
        component.calendarMonth = month;
        component.calendarDays = [];

        expect(component.calendarGrid.length).toBe(0);
      }),
      { numRuns: 50 }
    );
  });

  // ── Property 7: Grid covers all days 1..N with correct date strings ────────

  it('Property: grid contains all days 1..N for the given month with correct date strings', () => {
    fc.assert(
      fc.property(yearMonthArb, (ym: YearMonth) => {
        const { year, month } = ym;
        const n = daysInMonth(year, month);
        component.calendarYear = year;
        component.calendarMonth = month;
        component.calendarDays = buildMonthData(year, month);

        const gridDates = component.calendarGrid.flat()
          .filter((cell): cell is CalendarDayDTO => cell !== null)
          .map((cell: CalendarDayDTO) => cell.date);

        for (let day = 1; day <= n; day++) {
          const expected = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          expect(gridDates).toContain(expected);
        }
      }),
      { numRuns: 100 }
    );
  });

  // ── Property 8: Padding nulls appear only at start/end of grid ────────────

  it('Property: null padding cells appear only before the first day and after the last day', () => {
    fc.assert(
      fc.property(yearMonthArb, (ym: YearMonth) => {
        const { year, month } = ym;
        component.calendarYear = year;
        component.calendarMonth = month;
        component.calendarDays = buildMonthData(year, month);

        const flat = component.calendarGrid.flat();
        const firstNonNull = flat.findIndex((c) => c !== null);
        const lastNonNull = flat.length - 1 - [...flat].reverse().findIndex((c) => c !== null);

        for (let i = firstNonNull; i <= lastNonNull; i++) {
          expect(flat[i]).not.toBeNull();
        }
      }),
      { numRuns: 100 }
    );
  });
});
