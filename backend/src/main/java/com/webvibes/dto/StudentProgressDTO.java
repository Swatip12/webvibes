package com.webvibes.dto;

public class StudentProgressDTO {

    private int totalAssigned;
    private int totalCompleted;

    private int mockInterviewTotal;
    private int mockInterviewCompleted;

    private int aptitudeTestTotal;
    private int aptitudeTestCompleted;

    private int machineTestTotal;
    private int machineTestCompleted;

    private int technicalMcqTotal;
    private int technicalMcqCompleted;

    public StudentProgressDTO() {}

    public int getTotalAssigned() { return totalAssigned; }
    public void setTotalAssigned(int totalAssigned) { this.totalAssigned = totalAssigned; }

    public int getTotalCompleted() { return totalCompleted; }
    public void setTotalCompleted(int totalCompleted) { this.totalCompleted = totalCompleted; }

    public int getMockInterviewTotal() { return mockInterviewTotal; }
    public void setMockInterviewTotal(int mockInterviewTotal) { this.mockInterviewTotal = mockInterviewTotal; }

    public int getMockInterviewCompleted() { return mockInterviewCompleted; }
    public void setMockInterviewCompleted(int mockInterviewCompleted) { this.mockInterviewCompleted = mockInterviewCompleted; }

    public int getAptitudeTestTotal() { return aptitudeTestTotal; }
    public void setAptitudeTestTotal(int aptitudeTestTotal) { this.aptitudeTestTotal = aptitudeTestTotal; }

    public int getAptitudeTestCompleted() { return aptitudeTestCompleted; }
    public void setAptitudeTestCompleted(int aptitudeTestCompleted) { this.aptitudeTestCompleted = aptitudeTestCompleted; }

    public int getMachineTestTotal() { return machineTestTotal; }
    public void setMachineTestTotal(int machineTestTotal) { this.machineTestTotal = machineTestTotal; }

    public int getMachineTestCompleted() { return machineTestCompleted; }
    public void setMachineTestCompleted(int machineTestCompleted) { this.machineTestCompleted = machineTestCompleted; }

    public int getTechnicalMcqTotal() { return technicalMcqTotal; }
    public void setTechnicalMcqTotal(int technicalMcqTotal) { this.technicalMcqTotal = technicalMcqTotal; }

    public int getTechnicalMcqCompleted() { return technicalMcqCompleted; }
    public void setTechnicalMcqCompleted(int technicalMcqCompleted) { this.technicalMcqCompleted = technicalMcqCompleted; }
}
