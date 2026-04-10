package com.webvibes.property;

// Feature: student-attendance-tracker, Property 1: Phase Dates Round-Trip
// Validates: Requirements 1.1, 1.2

import com.webvibes.dto.AdminStudentDTO;
import com.webvibes.dto.PhaseDatesRequest;
import com.webvibes.entity.PaymentStatus;
import com.webvibes.entity.Student;
import com.webvibes.entity.StudentInternship;
import com.webvibes.repository.AttendanceRepository;
import com.webvibes.repository.StudentInternshipRepository;
import com.webvibes.repository.StudentRepository;
import com.webvibes.service.AttendanceService;
import net.jqwik.api.*;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

/**
 * Property-based test for phase dates round-trip.
 *
 * **Validates: Requirements 1.1, 1.2**
 *
 * Property 1: For any valid date pairs where endDate >= startDate,
 * calling updatePhaseDates and reading back the saved entity must
 * return identical date values to what was submitted.
 */
class PhaseDatesPropertyTest {

    private StudentInternshipRepository siRepo;
    private StudentRepository studentRepo;
    private AttendanceRepository attendanceRepo;
    private AttendanceService attendanceService;

    @BeforeProperty
    void setUp() {
        siRepo = Mockito.mock(StudentInternshipRepository.class);
        studentRepo = Mockito.mock(StudentRepository.class);
        attendanceRepo = Mockito.mock(AttendanceRepository.class);
        attendanceService = new AttendanceService(attendanceRepo, siRepo, studentRepo);
    }

    /**
     * Property 1: Phase Dates Round-Trip
     *
     * For random valid date pairs (endDate >= startDate for both training and internship),
     * PUT phase-dates and read back must return identical values.
     *
     * **Validates: Requirements 1.1, 1.2**
     */
    @Property(tries = 100)
    void phaseDatesRoundTrip(
            @ForAll("validTrainingDates") LocalDate[] trainingDates,
            @ForAll("validInternshipDates") LocalDate[] internshipDates
    ) {
        LocalDate trainingStart = trainingDates[0];
        LocalDate trainingEnd   = trainingDates[1];
        LocalDate internshipStart = internshipDates[0];
        LocalDate internshipEnd   = internshipDates[1];

        Long studentId = 1L;

        // Set up a stub Student
        Student student = new Student();
        student.setId(studentId);
        student.setName("Test Student");
        student.setEmail("test@example.com");
        student.setMobile("9876543210");
        student.setPassword("hashed");

        // Set up a stub StudentInternship
        StudentInternship si = new StudentInternship();
        si.setId(1L);
        si.setStudent(student);
        si.setPlanName("Basic Plan");
        si.setTotalFee(BigDecimal.valueOf(10000));
        si.setPaidAmount(BigDecimal.valueOf(5000));
        si.setRemainingAmount(BigDecimal.valueOf(5000));
        si.setPaymentStatus(PaymentStatus.PARTIAL);

        when(studentRepo.findById(studentId)).thenReturn(Optional.of(student));
        when(siRepo.findByStudentId(studentId)).thenReturn(Optional.of(si));

        // Capture what gets saved
        ArgumentCaptor<StudentInternship> captor = ArgumentCaptor.forClass(StudentInternship.class);
        when(siRepo.save(captor.capture())).thenAnswer(inv -> inv.getArgument(0));

        // Build the request with all four dates
        PhaseDatesRequest req = new PhaseDatesRequest();
        req.setTrainingStartDate(trainingStart);
        req.setTrainingEndDate(trainingEnd);
        req.setInternshipStartDate(internshipStart);
        req.setInternshipEndDate(internshipEnd);

        // Call the service
        AdminStudentDTO result = attendanceService.updatePhaseDates(studentId, req);

        // Assert the returned DTO has exactly the submitted dates
        assertThat(result.getTrainingStartDate())
                .as("trainingStartDate must round-trip exactly")
                .isEqualTo(trainingStart);
        assertThat(result.getTrainingEndDate())
                .as("trainingEndDate must round-trip exactly")
                .isEqualTo(trainingEnd);
        assertThat(result.getInternshipStartDate())
                .as("internshipStartDate must round-trip exactly")
                .isEqualTo(internshipStart);
        assertThat(result.getInternshipEndDate())
                .as("internshipEndDate must round-trip exactly")
                .isEqualTo(internshipEnd);

        // Also verify the saved entity has the same dates
        StudentInternship saved = captor.getValue();
        assertThat(saved.getTrainingStartDate()).isEqualTo(trainingStart);
        assertThat(saved.getTrainingEndDate()).isEqualTo(trainingEnd);
        assertThat(saved.getInternshipStartDate()).isEqualTo(internshipStart);
        assertThat(saved.getInternshipEndDate()).isEqualTo(internshipEnd);
    }

    /**
     * Generates a valid [startDate, endDate] pair for the training phase
     * where endDate >= startDate.
     * Base date in [2020-01-01, 2030-12-31], offset in [0, 365].
     */
    @Provide
    Arbitrary<LocalDate[]> validTrainingDates() {
        return validDatePair();
    }

    /**
     * Generates a valid [startDate, endDate] pair for the internship phase
     * where endDate >= startDate.
     * Base date in [2020-01-01, 2030-12-31], offset in [0, 365].
     */
    @Provide
    Arbitrary<LocalDate[]> validInternshipDates() {
        return validDatePair();
    }

    private Arbitrary<LocalDate[]> validDatePair() {
        LocalDate rangeStart = LocalDate.of(2020, 1, 1);
        LocalDate rangeEnd   = LocalDate.of(2030, 12, 31);
        long totalDays = rangeStart.until(rangeEnd, java.time.temporal.ChronoUnit.DAYS);

        Arbitrary<Long> baseOffset = Arbitraries.longs().between(0L, totalDays);
        Arbitrary<Long> durationOffset = Arbitraries.longs().between(0L, 365L);

        return Combinators.combine(baseOffset, durationOffset).as((base, duration) -> {
            LocalDate start = rangeStart.plusDays(base);
            LocalDate end   = start.plusDays(duration);
            // Clamp end to rangeEnd to stay within bounds
            if (end.isAfter(rangeEnd)) {
                end = rangeEnd;
            }
            return new LocalDate[]{start, end};
        });
    }
}
