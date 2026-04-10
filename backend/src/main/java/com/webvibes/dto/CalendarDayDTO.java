package com.webvibes.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CalendarDayDTO {

    private LocalDate date;
    private String displayStatus; // PRESENT | LATE | ABSENT | WEEKEND | FUTURE | OUT_OF_PHASE
    private LocalDateTime checkInTime;   // null unless PRESENT or LATE
    private LocalDateTime checkOutTime;  // null unless checked out

    public CalendarDayDTO() {}

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDisplayStatus() { return displayStatus; }
    public void setDisplayStatus(String displayStatus) { this.displayStatus = displayStatus; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }
}
