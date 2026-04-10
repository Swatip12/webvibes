package com.webvibes.service;

import com.webvibes.dto.AdminStudentDTO;
import com.webvibes.dto.AttendanceSummaryDTO;
import com.webvibes.dto.AttendanceTodayDTO;
import com.webvibes.dto.CalendarDayDTO;
import com.webvibes.dto.PhaseDatesRequest;
import com.webvibes.entity.Attendance;
import com.webvibes.entity.AttendancePhase;
import com.webvibes.entity.AttendanceStatus;
import com.webvibes.entity.Student;
import com.webvibes.entity.StudentInternship;
import com.webvibes.exception.AttendanceAlreadyExistsException;
import com.webvibes.exception.AttendanceNotFoundException;
import com.webvibes.exception.NoActivePhaseException;
import com.webvibes.exception.PhaseNotConfiguredException;
import com.webvibes.repository.AttendanceRepository;
import com.webvibes.repository.StudentInternshipRepository;
import com.webvibes.repository.StudentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentInternshipRepository studentInternshipRepository;
    private final StudentRepository studentRepository;

    @Value("${attendance.late-threshold:10:00}")
    private String lateThreshold;

    @Value("${attendance.min-internship-hours:4.0}")
    private double minInternshipHours;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             StudentInternshipRepository studentInternshipRepository,
                             StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentInternshipRepository = studentInternshipRepository;
        this.studentRepository = studentRepository;
    }

    // -------------------------------------------------------------------------
    // 6.2 detectActivePhase
    // -------------------------------------------------------------------------

    /**
     * Returns TRAINING if today falls within [trainingStartDate, trainingEndDate],
     * INTERNSHIP if today falls within [internshipStartDate, internshipEndDate] (and not training),
     * or null if today is in neither range.
     */
    public AttendancePhase detectActivePhase(String studentEmail) {
        StudentInternship si = studentInternshipRepository.findByStudentEmail(studentEmail)
                .orElse(null);
        if (si == null) return null;
        return detectActivePhaseFromSI(si);
    }

    private AttendancePhase detectActivePhaseFromSI(StudentInternship si) {
        LocalDate today = LocalDate.now();

        if (si.getTrainingStartDate() != null && si.getTrainingEndDate() != null
                && !today.isBefore(si.getTrainingStartDate())
                && !today.isAfter(si.getTrainingEndDate())) {
            return AttendancePhase.TRAINING;
        }

        if (si.getInternshipStartDate() != null && si.getInternshipEndDate() != null
                && !today.isBefore(si.getInternshipStartDate())
                && !today.isAfter(si.getInternshipEndDate())) {
            return AttendancePhase.INTERNSHIP;
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // 6.3 checkIn
    // -------------------------------------------------------------------------

    @Transactional
    public AttendanceTodayDTO checkIn(String studentEmail) {
        LocalDate today = LocalDate.now();

        // Reject weekends
        if (isWeekend(today)) {
            throw new NoActivePhaseException("Check-in is not available on weekends");
        }

        Student student = requireStudent(studentEmail);
        AttendancePhase phase = detectActivePhase(studentEmail);

        if (phase == null) {
            throw new NoActivePhaseException("No active phase configured for today");
        }

        // Reject duplicate check-in
        if (attendanceRepository.findByStudentAndDateAndPhase(student, today, phase).isPresent()) {
            throw new AttendanceAlreadyExistsException("Already checked in today");
        }

        LocalDateTime now = LocalDateTime.now();
        AttendanceStatus status = resolveCheckInStatus(now.toLocalTime());

        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setPhase(phase);
        attendance.setDate(today);
        attendance.setCheckInTime(now);
        attendance.setStatus(status);
        attendanceRepository.save(attendance);

        return buildTodayDTO(student, today, phase, attendance);
    }

    // -------------------------------------------------------------------------
    // 6.4 checkOut
    // -------------------------------------------------------------------------

    @Transactional
    public AttendanceTodayDTO checkOut(String studentEmail) {
        LocalDate today = LocalDate.now();

        // Reject weekends
        if (isWeekend(today)) {
            throw new NoActivePhaseException("Check-out is not available on weekends");
        }

        Student student = requireStudent(studentEmail);
        AttendancePhase phase = detectActivePhase(studentEmail);

        if (phase == null) {
            throw new NoActivePhaseException("No active phase configured for today");
        }

        Attendance attendance = attendanceRepository.findByStudentAndDateAndPhase(student, today, phase)
                .orElseThrow(() -> new AttendanceNotFoundException("Cannot check out without a prior check-in today"));

        if (attendance.getCheckOutTime() != null) {
            throw new AttendanceAlreadyExistsException("Already checked out today");
        }

        LocalDateTime now = LocalDateTime.now();

        // Enforce minimum hours for INTERNSHIP phase only
        if (phase == AttendancePhase.INTERNSHIP) {
            double hoursElapsed = computeHoursWorked(attendance.getCheckInTime(), now);
            if (hoursElapsed < minInternshipHours) {
                throw new NoActivePhaseException(
                    "Cannot check out yet. Internship requires a minimum of " + minInternshipHours + " hours. " +
                    "You have worked " + String.format("%.1f", hoursElapsed) + " hour(s) so far."
                );
            }
        }

        attendance.setCheckOutTime(now);

        double hours = computeHoursWorked(attendance.getCheckInTime(), now);
        attendance.setHoursWorked(hours);
        attendanceRepository.save(attendance);

        return buildTodayDTO(student, today, phase, attendance);
    }

    // -------------------------------------------------------------------------
    // 6.5 getTodayStatus
    // -------------------------------------------------------------------------

    public AttendanceTodayDTO getTodayStatus(String studentEmail) {
        LocalDate today = LocalDate.now();
        Student student = requireStudent(studentEmail);
        AttendancePhase phase = detectActivePhase(studentEmail);

        Optional<Attendance> existing = (phase != null)
                ? attendanceRepository.findByStudentAndDateAndPhase(student, today, phase)
                : Optional.empty();

        return buildTodayDTO(student, today, phase, existing.orElse(null));
    }

    // -------------------------------------------------------------------------
    // 6.6 getMonthlyCalendar (student)
    // -------------------------------------------------------------------------

    public List<CalendarDayDTO> getMonthlyCalendar(String studentEmail, int year, int month, AttendancePhase phase) {
        StudentInternship si = studentInternshipRepository.findByStudentEmail(studentEmail)
                .orElseThrow(() -> new PhaseNotConfiguredException("Phase " + phase + " is not configured for this student"));

        validatePhaseConfigured(si, phase);

        Student student = si.getStudent();
        return buildCalendar(student, si, year, month, phase);
    }

    // -------------------------------------------------------------------------
    // 6.7 getSummary
    // -------------------------------------------------------------------------

    public AttendanceSummaryDTO getSummary(String studentEmail, AttendancePhase phase) {
        StudentInternship si = studentInternshipRepository.findByStudentEmail(studentEmail)
                .orElseThrow(() -> new PhaseNotConfiguredException("Phase " + phase + " is not configured for this student"));

        validatePhaseConfigured(si, phase);

        LocalDate startDate = getPhaseStart(si, phase);
        LocalDate endDate = getPhaseEnd(si, phase);
        Student student = si.getStudent();

        return computeSummary(student, phase, startDate, endDate);
    }

    // -------------------------------------------------------------------------
    // 6.8 getMonthlyCalendarForAdmin
    // -------------------------------------------------------------------------

    public List<CalendarDayDTO> getMonthlyCalendarForAdmin(Long studentId, int year, int month, AttendancePhase phase) {
        studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        StudentInternship si = studentInternshipRepository.findByStudentId(studentId)
                .orElseThrow(() -> new PhaseNotConfiguredException("Phase " + phase + " is not configured for this student"));

        validatePhaseConfigured(si, phase);

        Student student = si.getStudent();
        return buildCalendar(student, si, year, month, phase);
    }

    // -------------------------------------------------------------------------
    // 6.9 updatePhaseDates
    // -------------------------------------------------------------------------

    @Transactional
    public AdminStudentDTO updatePhaseDates(Long studentId, PhaseDatesRequest req) {
        studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        StudentInternship si = studentInternshipRepository.findByStudentId(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        // Validate training date range
        LocalDate tStart = req.getTrainingStartDate() != null ? req.getTrainingStartDate() : si.getTrainingStartDate();
        LocalDate tEnd   = req.getTrainingEndDate()   != null ? req.getTrainingEndDate()   : si.getTrainingEndDate();
        if (tStart != null && tEnd != null && tEnd.isBefore(tStart)) {
            throw new IllegalArgumentException("trainingEndDate must not be before trainingStartDate");
        }

        // Validate internship date range
        LocalDate iStart = req.getInternshipStartDate() != null ? req.getInternshipStartDate() : si.getInternshipStartDate();
        LocalDate iEnd   = req.getInternshipEndDate()   != null ? req.getInternshipEndDate()   : si.getInternshipEndDate();
        if (iStart != null && iEnd != null && iEnd.isBefore(iStart)) {
            throw new IllegalArgumentException("internshipEndDate must not be before internshipStartDate");
        }

        // Partial update — only overwrite non-null fields
        if (req.getTrainingStartDate()   != null) si.setTrainingStartDate(req.getTrainingStartDate());
        if (req.getTrainingEndDate()     != null) si.setTrainingEndDate(req.getTrainingEndDate());
        if (req.getInternshipStartDate() != null) si.setInternshipStartDate(req.getInternshipStartDate());
        if (req.getInternshipEndDate()   != null) si.setInternshipEndDate(req.getInternshipEndDate());

        StudentInternship saved = studentInternshipRepository.save(si);
        return toAdminStudentDTO(saved);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private Student requireStudent(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Student not found: " + email));
    }

    private boolean isWeekend(LocalDate date) {
        DayOfWeek dow = date.getDayOfWeek();
        return dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY;
    }

    private AttendanceStatus resolveCheckInStatus(LocalTime checkInTime) {
        LocalTime threshold = LocalTime.parse(lateThreshold);
        return checkInTime.isAfter(threshold) ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
    }

    private double computeHoursWorked(LocalDateTime checkIn, LocalDateTime checkOut) {
        long minutes = ChronoUnit.MINUTES.between(checkIn, checkOut);
        double hours = minutes / 60.0;
        return BigDecimal.valueOf(hours).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    private AttendanceTodayDTO buildTodayDTO(Student student, LocalDate today,
                                              AttendancePhase phase, Attendance attendance) {
        AttendanceTodayDTO dto = new AttendanceTodayDTO();
        dto.setDate(today);
        dto.setActivePhase(phase);

        boolean weekend = isWeekend(today);

        if (attendance != null) {
            dto.setCheckInTime(attendance.getCheckInTime());
            dto.setCheckOutTime(attendance.getCheckOutTime());
            dto.setStatus(attendance.getStatus());
            dto.setHoursWorked(attendance.getHoursWorked());
            dto.setCanCheckIn(false);
            dto.setCanCheckOut(attendance.getCheckOutTime() == null && !weekend && phase != null);
        } else {
            dto.setCanCheckIn(!weekend && phase != null);
            dto.setCanCheckOut(false);
        }

        return dto;
    }

    private void validatePhaseConfigured(StudentInternship si, AttendancePhase phase) {
        if (phase == AttendancePhase.TRAINING
                && (si.getTrainingStartDate() == null || si.getTrainingEndDate() == null)) {
            throw new PhaseNotConfiguredException("Phase TRAINING is not configured for this student");
        }
        if (phase == AttendancePhase.INTERNSHIP
                && (si.getInternshipStartDate() == null || si.getInternshipEndDate() == null)) {
            throw new PhaseNotConfiguredException("Phase INTERNSHIP is not configured for this student");
        }
    }

    private LocalDate getPhaseStart(StudentInternship si, AttendancePhase phase) {
        return phase == AttendancePhase.TRAINING ? si.getTrainingStartDate() : si.getInternshipStartDate();
    }

    private LocalDate getPhaseEnd(StudentInternship si, AttendancePhase phase) {
        return phase == AttendancePhase.TRAINING ? si.getTrainingEndDate() : si.getInternshipEndDate();
    }

    private List<CalendarDayDTO> buildCalendar(Student student, StudentInternship si,
                                                int year, int month, AttendancePhase phase) {
        LocalDate phaseStart = getPhaseStart(si, phase);
        LocalDate phaseEnd   = getPhaseEnd(si, phase);
        LocalDate today      = LocalDate.now();
        YearMonth ym         = YearMonth.of(year, month);

        // Fetch all attendance records for the month in one query
        LocalDate monthStart = ym.atDay(1);
        LocalDate monthEnd   = ym.atEndOfMonth();
        List<Attendance> records = attendanceRepository
                .findByStudentAndPhaseAndDateBetween(student, phase, monthStart, monthEnd);

        Map<LocalDate, Attendance> recordMap = records.stream()
                .collect(Collectors.toMap(Attendance::getDate, a -> a));

        List<CalendarDayDTO> result = new ArrayList<>();

        for (int day = 1; day <= ym.lengthOfMonth(); day++) {
            LocalDate date = ym.atDay(day);
            CalendarDayDTO cell = new CalendarDayDTO();
            cell.setDate(date);

            if (isWeekend(date)) {
                cell.setDisplayStatus("WEEKEND");
            } else if (date.isAfter(today)) {
                cell.setDisplayStatus("FUTURE");
            } else if (phaseStart == null || phaseEnd == null
                    || date.isBefore(phaseStart) || date.isAfter(phaseEnd)) {
                cell.setDisplayStatus("OUT_OF_PHASE");
            } else {
                Attendance rec = recordMap.get(date);
                if (rec != null) {
                    cell.setDisplayStatus(rec.getStatus().name()); // PRESENT or LATE
                    cell.setCheckInTime(rec.getCheckInTime());
                    cell.setCheckOutTime(rec.getCheckOutTime());
                } else {
                    cell.setDisplayStatus("ABSENT");
                }
            }

            result.add(cell);
        }

        return result;
    }

    private AttendanceSummaryDTO computeSummary(Student student, AttendancePhase phase,
                                                 LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();
        // Cap the end at today for counting purposes
        LocalDate effectiveEnd = endDate.isAfter(today) ? today : endDate;

        AttendanceSummaryDTO dto = new AttendanceSummaryDTO();
        dto.setPhase(phase);
        dto.setStartDate(startDate);
        dto.setEndDate(endDate);

        // Phase hasn't started yet
        if (startDate.isAfter(today)) {
            dto.setPresentDays(0);
            dto.setLateDays(0);
            dto.setAbsentDays(0);
            dto.setTotalWorkingDays(0);
            dto.setAttendancePercentage(0.0);
            return dto;
        }

        List<Attendance> records = attendanceRepository
                .findByStudentAndPhaseAndDateBetween(student, phase, startDate, effectiveEnd);

        Map<LocalDate, Attendance> recordMap = records.stream()
                .collect(Collectors.toMap(Attendance::getDate, a -> a));

        int present = 0, late = 0, absent = 0, total = 0;

        LocalDate cursor = startDate;
        while (!cursor.isAfter(effectiveEnd)) {
            if (!isWeekend(cursor)) {
                total++;
                Attendance rec = recordMap.get(cursor);
                if (rec == null) {
                    absent++;
                } else if (rec.getStatus() == AttendanceStatus.PRESENT) {
                    present++;
                } else if (rec.getStatus() == AttendanceStatus.LATE) {
                    late++;
                }
            }
            cursor = cursor.plusDays(1);
        }

        double percentage = total == 0 ? 0.0
                : BigDecimal.valueOf((present + late) * 100.0 / total)
                            .setScale(1, RoundingMode.HALF_UP)
                            .doubleValue();

        dto.setPresentDays(present);
        dto.setLateDays(late);
        dto.setAbsentDays(absent);
        dto.setTotalWorkingDays(total);
        dto.setAttendancePercentage(percentage);
        return dto;
    }

    private AdminStudentDTO toAdminStudentDTO(StudentInternship si) {
        AdminStudentDTO dto = new AdminStudentDTO(
                si.getStudent().getId(),
                si.getStudent().getName(),
                si.getStudent().getEmail(),
                si.getStudent().getMobile(),
                si.getPlanName(),
                si.getTotalFee(),
                si.getPaidAmount(),
                si.getRemainingAmount(),
                si.getPaymentStatus()
        );
        dto.setUtrNumber(si.getUtrNumber());
        dto.setPendingUtrType(si.getPendingUtrType());
        dto.setTrainingStartDate(si.getTrainingStartDate());
        dto.setTrainingEndDate(si.getTrainingEndDate());
        dto.setInternshipStartDate(si.getInternshipStartDate());
        dto.setInternshipEndDate(si.getInternshipEndDate());
        return dto;
    }
}
