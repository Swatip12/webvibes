package com.webvibes.controller;

import com.webvibes.dto.AttendanceSummaryDTO;
import com.webvibes.dto.AttendanceTodayDTO;
import com.webvibes.dto.CalendarDayDTO;
import com.webvibes.entity.AttendancePhase;
import com.webvibes.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/student/attendance")
@PreAuthorize("hasRole('STUDENT')")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/checkin")
    public ResponseEntity<AttendanceTodayDTO> checkIn(Principal principal) {
        return ResponseEntity.ok(attendanceService.checkIn(principal.getName()));
    }

    @PostMapping("/checkout")
    public ResponseEntity<AttendanceTodayDTO> checkOut(Principal principal) {
        return ResponseEntity.ok(attendanceService.checkOut(principal.getName()));
    }

    @GetMapping("/today")
    public ResponseEntity<AttendanceTodayDTO> getToday(Principal principal) {
        return ResponseEntity.ok(attendanceService.getTodayStatus(principal.getName()));
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<CalendarDayDTO>> getMonthly(
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam AttendancePhase phase,
            Principal principal) {
        return ResponseEntity.ok(attendanceService.getMonthlyCalendar(principal.getName(), year, month, phase));
    }

    @GetMapping("/summary")
    public ResponseEntity<AttendanceSummaryDTO> getSummary(
            @RequestParam AttendancePhase phase,
            Principal principal) {
        return ResponseEntity.ok(attendanceService.getSummary(principal.getName(), phase));
    }
}
