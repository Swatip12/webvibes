import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as fc from 'fast-check';
import { AttendanceService } from './attendance.service';
import { CalendarDayDTO } from '../models/attendance.models';
import { environment } from '../../environments/environment';
/**
 * Feature: student-attendance-tracker
 * Property: AttendanceService HTTP Mapping
 *
 * For any CalendarDayDTO[] response from the server, the Angular service must
 * return an array of the same length with all displayStatus values preserved.
 *
 * Validates: Requirements 7.2
 */
describe('AttendanceService — Property-Based Tests (fast-check)', () => {
  let service: AttendanceService;
  let httpMock: HttpTestingController;

  const baseUrl = environment.apiUrl + '/api/student/attendance';
  const adminUrl = environment.apiUrl + '/api/admin/students';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AttendanceService]
    });
    service = TestBed.inject(AttendanceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ── Arbitraries ────────────────────────────────────────────────────────────

  const displayStatusArb = fc.constantFrom(
    'PRESENT', 'LATE', 'ABSENT', 'WEEKEND', 'FUTURE', 'OUT_OF_PHASE'
  ) as fc.Arbitrary<CalendarDayDTO['displayStatus']>;

  const dateStringArb: fc.Arbitrary<string> = fc.date({
    min: new Date('2020-01-01'),
    max: new Date('2030-12-31')
  }).map((d: Date) => d.toISOString().split('T')[0]);

  const nullableDateTimeArb: fc.Arbitrary<string | null> = fc.option(
    fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
      .map((d: Date) => d.toISOString().replace('Z', '')),
    { nil: null }
  );

  const calendarDayArb: fc.Arbitrary<CalendarDayDTO> = fc.record({
    date: dateStringArb,
    displayStatus: displayStatusArb,
    checkInTime: nullableDateTimeArb,
    checkOutTime: nullableDateTimeArb
  });

  const calendarDayArrayArb: fc.Arbitrary<CalendarDayDTO[]> = fc.array(calendarDayArb, {
    minLength: 1,
    maxLength: 31
  });

  // ── Property 1: Array length is preserved ─────────────────────────────────

  it('Property: getMonthly returns array of same length as server response', () => {
    fc.assert(
      fc.property(
        calendarDayArrayArb,
        fc.integer({ min: 2020, max: 2030 }),
        fc.integer({ min: 1, max: 12 }),
        fc.constantFrom('TRAINING', 'INTERNSHIP'),
        (serverData: CalendarDayDTO[], year: number, month: number, phase: string) => {
          let result: CalendarDayDTO[] | undefined;

          service.getMonthly(year, month, phase).subscribe((data: CalendarDayDTO[]) => {
            result = data;
          });

          const req = httpMock.expectOne((r) =>
            r.url === `${baseUrl}/monthly` &&
            r.params.get('year') === String(year) &&
            r.params.get('month') === String(month) &&
            r.params.get('phase') === phase
          );
          req.flush(serverData);

          expect(result).toBeDefined();
          expect(result!.length).toBe(serverData.length);
        }
      ),
      { numRuns: 50 }
    );
  });

  // ── Property 2: All displayStatus values are preserved exactly ─────────────

  it('Property: getMonthly preserves all displayStatus values from server response', () => {
    fc.assert(
      fc.property(
        calendarDayArrayArb,
        fc.integer({ min: 2020, max: 2030 }),
        fc.integer({ min: 1, max: 12 }),
        fc.constantFrom('TRAINING', 'INTERNSHIP'),
        (serverData: CalendarDayDTO[], year: number, month: number, phase: string) => {
          let result: CalendarDayDTO[] | undefined;

          service.getMonthly(year, month, phase).subscribe((data: CalendarDayDTO[]) => {
            result = data;
          });

          const req = httpMock.expectOne((r) =>
            r.url === `${baseUrl}/monthly` &&
            r.params.get('year') === String(year) &&
            r.params.get('month') === String(month) &&
            r.params.get('phase') === phase
          );
          req.flush(serverData);

          expect(result).toBeDefined();
          result!.forEach((day: CalendarDayDTO, i: number) => {
            expect(day.displayStatus).toBe(serverData[i].displayStatus);
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  // ── Property 3: Date values are preserved exactly ──────────────────────────

  it('Property: getMonthly preserves all date values from server response', () => {
    fc.assert(
      fc.property(
        calendarDayArrayArb,
        fc.integer({ min: 2020, max: 2030 }),
        fc.integer({ min: 1, max: 12 }),
        fc.constantFrom('TRAINING', 'INTERNSHIP'),
        (serverData: CalendarDayDTO[], year: number, month: number, phase: string) => {
          let result: CalendarDayDTO[] | undefined;

          service.getMonthly(year, month, phase).subscribe((data: CalendarDayDTO[]) => {
            result = data;
          });

          const req = httpMock.expectOne((r) => r.url === `${baseUrl}/monthly`);
          req.flush(serverData);

          expect(result).toBeDefined();
          result!.forEach((day: CalendarDayDTO, i: number) => {
            expect(day.date).toBe(serverData[i].date);
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  // ── Property 4: getAdminMonthly also preserves length and displayStatus ────

  it('Property: getAdminMonthly preserves array length and displayStatus values', () => {
    fc.assert(
      fc.property(
        calendarDayArrayArb,
        fc.integer({ min: 1, max: 9999 }),
        fc.integer({ min: 2020, max: 2030 }),
        fc.integer({ min: 1, max: 12 }),
        fc.constantFrom('TRAINING', 'INTERNSHIP'),
        (serverData: CalendarDayDTO[], studentId: number, year: number, month: number, phase: string) => {
          let result: CalendarDayDTO[] | undefined;

          service.getAdminMonthly(studentId, year, month, phase).subscribe((data: CalendarDayDTO[]) => {
            result = data;
          });

          const req = httpMock.expectOne((r) =>
            r.url === `${adminUrl}/${studentId}/attendance`
          );
          req.flush(serverData);

          expect(result).toBeDefined();
          expect(result!.length).toBe(serverData.length);
          result!.forEach((day: CalendarDayDTO, i: number) => {
            expect(day.displayStatus).toBe(serverData[i].displayStatus);
          });
        }
      ),
      { numRuns: 50 }
    );
  });
});
