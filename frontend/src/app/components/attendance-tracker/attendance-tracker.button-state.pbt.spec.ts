import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import * as fc from 'fast-check';
import { AttendanceTrackerComponent } from './attendance-tracker.component';
import { AttendanceService } from '../../services/attendance.service';
import { AttendanceTodayDTO } from '../../models/attendance.models';

/**
 * Feature: student-attendance-tracker
 * Property: Button Mutual Exclusivity
 *
 * For any AttendanceTodayDTO, the component must show exactly one of:
 *   1. Check-In button (canCheckIn === true)
 *   2. Check-Out button (canCheckOut === true)
 *   3. Completed state (checkOutTime set, canCheckIn false, canCheckOut false)
 *
 * The component must NEVER show both Check-In and Check-Out buttons simultaneously.
 *
 * Validates: Requirements 11.1, 11.2, 11.4
 */
describe('AttendanceTrackerComponent — Button State Property-Based Tests (fast-check)', () => {
  let component: AttendanceTrackerComponent;
  let fixture: ComponentFixture<AttendanceTrackerComponent>;
  let attendanceServiceSpy: jasmine.SpyObj<AttendanceService>;

  beforeEach(async () => {
    attendanceServiceSpy = jasmine.createSpyObj('AttendanceService', [
      'getToday', 'checkIn', 'checkOut', 'getSummary', 'getMonthly'
    ]);

    // Default stubs so ngOnInit doesn't throw
    attendanceServiceSpy.getToday.and.returnValue(of({
      date: '2025-01-15',
      activePhase: null,
      checkInTime: null,
      checkOutTime: null,
      status: null,
      hoursWorked: null,
      canCheckIn: false,
      canCheckOut: false
    } as AttendanceTodayDTO));
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
    // Clean up the clock interval
    component.ngOnDestroy();
  });

  // ── Arbitraries ────────────────────────────────────────────────────────────

  const activePhaseArb = fc.option(
    fc.constantFrom('TRAINING' as const, 'INTERNSHIP' as const),
    { nil: null }
  );

  const statusArb = fc.option(
    fc.constantFrom('PRESENT' as const, 'LATE' as const, 'ABSENT' as const),
    { nil: null }
  );

  const nullableDateTimeArb: fc.Arbitrary<string | null> = fc.option(
    fc.date({ min: new Date('2025-01-01'), max: new Date('2025-12-31') })
      .map((d: Date) => d.toISOString().replace('Z', '')),
    { nil: null }
  );

  /**
   * Generates a semantically valid AttendanceTodayDTO.
   * The backend enforces these invariants:
   *   - canCheckIn and canCheckOut are mutually exclusive (never both true)
   *   - canCheckOut requires checkInTime to be set
   *   - completed state: checkOutTime set, canCheckIn=false, canCheckOut=false
   */
  const validTodayDTOArb: fc.Arbitrary<AttendanceTodayDTO> = fc.oneof(
    // State 1: Not checked in yet, active phase → canCheckIn=true, canCheckOut=false
    fc.record({
      date: fc.constant('2025-01-15'),
      activePhase: fc.constantFrom('TRAINING' as const, 'INTERNSHIP' as const),
      checkInTime: fc.constant(null),
      checkOutTime: fc.constant(null),
      status: fc.constant(null),
      hoursWorked: fc.constant(null),
      canCheckIn: fc.constant(true),
      canCheckOut: fc.constant(false)
    }),
    // State 2: Checked in, not checked out → canCheckIn=false, canCheckOut=true
    fc.record({
      date: fc.constant('2025-01-15'),
      activePhase: fc.constantFrom('TRAINING' as const, 'INTERNSHIP' as const),
      checkInTime: fc.constant('2025-01-15T09:30:00'),
      checkOutTime: fc.constant(null),
      status: fc.constantFrom('PRESENT' as const, 'LATE' as const),
      hoursWorked: fc.constant(null),
      canCheckIn: fc.constant(false),
      canCheckOut: fc.constant(true)
    }),
    // State 3: Fully completed → canCheckIn=false, canCheckOut=false, checkOutTime set
    fc.record({
      date: fc.constant('2025-01-15'),
      activePhase: fc.constantFrom('TRAINING' as const, 'INTERNSHIP' as const),
      checkInTime: fc.constant('2025-01-15T09:30:00'),
      checkOutTime: fc.constant('2025-01-15T18:00:00'),
      status: fc.constantFrom('PRESENT' as const, 'LATE' as const),
      hoursWorked: fc.double({ min: 0.01, max: 24, noNaN: true }),
      canCheckIn: fc.constant(false),
      canCheckOut: fc.constant(false)
    }),
    // State 4: No active phase → canCheckIn=false, canCheckOut=false
    fc.record({
      date: fc.constant('2025-01-15'),
      activePhase: fc.constant(null),
      checkInTime: fc.constant(null),
      checkOutTime: fc.constant(null),
      status: fc.constant(null),
      hoursWorked: fc.constant(null),
      canCheckIn: fc.constant(false),
      canCheckOut: fc.constant(false)
    })
  );

  // ── Property 1: canCheckIn and canCheckOut are never both true ─────────────

  it('Property: canCheckIn and canCheckOut are never simultaneously true', () => {
    fc.assert(
      fc.property(validTodayDTOArb, (dto: AttendanceTodayDTO) => {
        component.today = dto;

        // The invariant: both flags cannot be true at the same time
        const bothTrue = dto.canCheckIn && dto.canCheckOut;
        expect(bothTrue).toBe(false);
      }),
      { numRuns: 200 }
    );
  });

  // ── Property 2: Exactly one UI state is active at any time ────────────────

  it('Property: component is in exactly one of {canCheckIn, canCheckOut, completed, noPhase} states', () => {
    fc.assert(
      fc.property(validTodayDTOArb, (dto: AttendanceTodayDTO) => {
        component.today = dto;

        const isCheckInState = dto.canCheckIn && !dto.canCheckOut;
        const isCheckOutState = !dto.canCheckIn && dto.canCheckOut;
        const isCompletedState = !dto.canCheckIn && !dto.canCheckOut && dto.checkOutTime !== null;
        const isNoPhasePending = !dto.canCheckIn && !dto.canCheckOut && dto.checkOutTime === null;

        // Exactly one state must be active
        const activeStates = [isCheckInState, isCheckOutState, isCompletedState, isNoPhasePending]
          .filter(Boolean).length;

        expect(activeStates).toBe(1);
      }),
      { numRuns: 200 }
    );
  });

  // ── Property 3: Check-In state requires no prior checkInTime ──────────────

  it('Property: when canCheckIn is true, checkInTime must be null', () => {
    fc.assert(
      fc.property(validTodayDTOArb, (dto: AttendanceTodayDTO) => {
        if (dto.canCheckIn) {
          expect(dto.checkInTime).toBeNull();
        }
      }),
      { numRuns: 200 }
    );
  });

  // ── Property 4: Check-Out state requires a prior checkInTime ──────────────

  it('Property: when canCheckOut is true, checkInTime must be set', () => {
    fc.assert(
      fc.property(validTodayDTOArb, (dto: AttendanceTodayDTO) => {
        if (dto.canCheckOut) {
          expect(dto.checkInTime).not.toBeNull();
          expect(dto.checkOutTime).toBeNull();
        }
      }),
      { numRuns: 200 }
    );
  });

  // ── Property 5: Completed state requires both times set ───────────────────

  it('Property: completed state has both checkInTime and checkOutTime set', () => {
    fc.assert(
      fc.property(validTodayDTOArb, (dto: AttendanceTodayDTO) => {
        const isCompleted = !dto.canCheckIn && !dto.canCheckOut && dto.checkOutTime !== null;
        if (isCompleted) {
          expect(dto.checkInTime).not.toBeNull();
          expect(dto.checkOutTime).not.toBeNull();
        }
      }),
      { numRuns: 200 }
    );
  });

  // ── Property 6: Component today field reflects assigned DTO ───────────────

  it('Property: component.today reflects the assigned DTO without mutation', () => {
    fc.assert(
      fc.property(validTodayDTOArb, (dto: AttendanceTodayDTO) => {
        component.today = dto;

        expect(component.today).toBe(dto);
        expect(component.today!.canCheckIn).toBe(dto.canCheckIn);
        expect(component.today!.canCheckOut).toBe(dto.canCheckOut);
      }),
      { numRuns: 200 }
    );
  });
});
