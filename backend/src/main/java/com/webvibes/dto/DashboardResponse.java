package com.webvibes.dto;

import com.webvibes.entity.PaymentStatus;

import java.math.BigDecimal;

public class DashboardResponse {

    private String name;
    private String email;
    private boolean planAssigned;
    private String planName;
    private BigDecimal totalFee;
    private BigDecimal paidAmount;
    private BigDecimal remainingAmount;
    private PaymentStatus paymentStatus;

    public DashboardResponse() {}

    // Constructor for when no plan is assigned
    public DashboardResponse(String name, String email) {
        this.name = name;
        this.email = email;
        this.planAssigned = false;
    }

    public DashboardResponse(String name, String email, String planName, BigDecimal totalFee,
                              BigDecimal paidAmount, BigDecimal remainingAmount,
                              PaymentStatus paymentStatus) {
        this.name = name;
        this.email = email;
        this.planAssigned = true;
        this.planName = planName;
        this.totalFee = totalFee;
        this.paidAmount = paidAmount;
        this.remainingAmount = remainingAmount;
        this.paymentStatus = paymentStatus;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

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
}
