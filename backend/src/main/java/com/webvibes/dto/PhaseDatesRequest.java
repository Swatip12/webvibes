package com.webvibes.dto;

import java.time.LocalDate;

public class PhaseDatesRequest {

    private LocalDate trainingStartDate;
    private LocalDate trainingEndDate;
    private LocalDate internshipStartDate;
    private LocalDate internshipEndDate;
    private String batchTime; // e.g. "12:00" or "14:00"

    public PhaseDatesRequest() {}

    public LocalDate getTrainingStartDate() { return trainingStartDate; }
    public void setTrainingStartDate(LocalDate trainingStartDate) { this.trainingStartDate = trainingStartDate; }

    public LocalDate getTrainingEndDate() { return trainingEndDate; }
    public void setTrainingEndDate(LocalDate trainingEndDate) { this.trainingEndDate = trainingEndDate; }

    public LocalDate getInternshipStartDate() { return internshipStartDate; }
    public void setInternshipStartDate(LocalDate internshipStartDate) { this.internshipStartDate = internshipStartDate; }

    public LocalDate getInternshipEndDate() { return internshipEndDate; }
    public void setInternshipEndDate(LocalDate internshipEndDate) { this.internshipEndDate = internshipEndDate; }

    public String getBatchTime() { return batchTime; }
    public void setBatchTime(String batchTime) { this.batchTime = batchTime; }
}
