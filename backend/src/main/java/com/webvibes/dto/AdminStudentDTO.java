package com.webvibes.dto;

import com.webvibes.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AdminStudentDTO {

    private Long id;
    private String name;
    private String email;
    private String mobile;
    private boolean planAssigned;
    private String planName;
    private BigDecimal totalFee;
    private BigDecimal paidAmount;
    private BigDecimal remainingAmount;
    private PaymentStatus paymentStatus;
    private String utrNumber;
    private String pendingUtrType;
    private LocalDate trainingStartDate;
    private LocalDate trainingEndDate;
    private LocalDate internshipStartDate;
    private LocalDate internshipEndDate;

    public AdminStudentDTO() {}

    // Constructor for students without a plan
    public AdminStudentDTO(Long id, String name, String email, String mobile) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.planAssigned = false;
    }

    public AdminStudentDTO(Long id, String name, String email, String mobile,
                           String planName, BigDecimal totalFee, BigDecimal paidAmount,
                           BigDecimal remainingAmount, PaymentStatus paymentStatus) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.planAssigned = true;
        this.planName = planName;
        this.totalFee = totalFee;
        this.paidAmount = paidAmount;
        this.remainingAmount = remainingAmount;
        this.paymentStatus = paymentStatus;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public boolean isPlanAssigned() { return planAssigned; }
    public void setPlanAssigned(boolean planAssigned) { this.planAssigned = planAssigned; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public BigDecimal getTotalFee() { return totalFee; }
    public void setTotalFee(BigDecimal totalFee) { this.totalFee = totalFee; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }

    public BigDecimal getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getUtrNumber() { return utrNumber; }
    public void setUtrNumber(String utrNumber) { this.utrNumber = utrNumber; }

    public String getPendingUtrType() { return pendingUtrType; }
    public void setPendingUtrType(String pendingUtrType) { this.pendingUtrType = pendingUtrType; }

    public LocalDate getTrainingStartDate() { return trainingStartDate; }
    public void setTrainingStartDate(LocalDate trainingStartDate) { this.trainingStartDate = trainingStartDate; }

    public LocalDate getTrainingEndDate() { return trainingEndDate; }
    public void setTrainingEndDate(LocalDate trainingEndDate) { this.trainingEndDate = trainingEndDate; }

    public LocalDate getInternshipStartDate() { return internshipStartDate; }
    public void setInternshipStartDate(LocalDate internshipStartDate) { this.internshipStartDate = internshipStartDate; }

    public LocalDate getInternshipEndDate() { return internshipEndDate; }
    public void setInternshipEndDate(LocalDate internshipEndDate) { this.internshipEndDate = internshipEndDate; }
}
