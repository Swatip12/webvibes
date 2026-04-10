package com.webvibes.dto;

import com.webvibes.entity.AttendancePhase;
import java.time.LocalDate;

public class AttendanceSummaryDTO {

    private AttendancePhase phase;
    private LocalDate startDate;
    private LocalDate endDate;
    private int presentDays;
    private int lateDays;
    private int absentDays;
    private int totalWorkingDays;
    private double attendancePercentage; // rounded to 1 decimal place

    public AttendanceSummaryDTO() {}

    public AttendancePhase getPhase() { return phase; }
    public void setPhase(AttendancePhase phase) { this.phase = phase; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public int getPresentDays() { return presentDays; }
    public void setPresentDays(int presentDays) { this.presentDays = presentDays; }

    public int getLateDays() { return lateDays; }
    public void setLateDays(int lateDays) { this.lateDays = lateDays; }

    public int getAbsentDays() { return absentDays; }
    public void setAbsentDays(int absentDays) { this.absentDays = absentDays; }

    public int getTotalWorkingDays() { return totalWorkingDays; }
    public void setTotalWorkingDays(int totalWorkingDays) { this.totalWorkingDays = totalWorkingDays; }

    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
}
