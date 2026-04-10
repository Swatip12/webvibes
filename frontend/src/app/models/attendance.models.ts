export interface AttendanceTodayDTO {
  date: string;
  activePhase: 'TRAINING' | 'INTERNSHIP' | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | null;
  hoursWorked: number | null;
  canCheckIn: boolean;
  canCheckOut: boolean;
}

export interface CalendarDayDTO {
  date: string;
  displayStatus: 'PRESENT' | 'LATE' | 'ABSENT' | 'WEEKEND' | 'FUTURE' | 'OUT_OF_PHASE';
  checkInTime: string | null;
  checkOutTime: string | null;
}

export interface AttendanceSummaryDTO {
  phase: 'TRAINING' | 'INTERNSHIP';
  startDate: string;
  endDate: string;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  totalWorkingDays: number;
  attendancePercentage: number;
}

export interface PhaseDatesRequest {
  trainingStartDate: string | null;
  trainingEndDate: string | null;
  internshipStartDate: string | null;
  internshipEndDate: string | null;
}
