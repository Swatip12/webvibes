package com.webvibes.repository;

import com.webvibes.entity.Attendance;
import com.webvibes.entity.AttendancePhase;
import com.webvibes.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByStudentAndDateAndPhase(Student student, LocalDate date, AttendancePhase phase);

    List<Attendance> findByStudentAndPhaseAndDateBetween(Student student, AttendancePhase phase, LocalDate start, LocalDate end);
}
