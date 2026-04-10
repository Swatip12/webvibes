package com.webvibes.dto;

import com.webvibes.entity.AttendancePhase;
import com.webvibes.entity.AttendanceStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AttendanceTodayDTO {

    private LocalDate date;
    private AttendancePhase activePhase;   // null if no active phase
    private LocalDateTime checkInTime;     // null if not checked in
    private LocalDateTime checkOutTime;    // null if not checked out
    private AttendanceStatus status;       // null if not checked in
    private Double hoursWorked;            // null if not checked out
    private boolean canCheckIn;
    private boolean canCheckOut;

    public AttendanceTodayDTO() {}

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public AttendancePhase getActivePhase() { return activePhase; }
    public void setActivePhase(AttendancePhase activePhase) { this.activePhase = activePhase; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }

    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }

    public Double getHoursWorked() { return hoursWorked; }
    public void setHoursWorked(Double hoursWorked) { this.hoursWorked = hoursWorked; }

    public boolean isCanCheckIn() { return canCheckIn; }
    public void setCanCheckIn(boolean canCheckIn) { this.canCheckIn = canCheckIn; }

    public boolean isCanCheckOut() { return canCheckOut; }
    public void setCanCheckOut(boolean canCheckOut) { this.canCheckOut = canCheckOut; }
}
