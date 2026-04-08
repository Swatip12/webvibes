package com.webvibes.dto;

import com.webvibes.entity.PaymentStatus;

import java.math.BigDecimal;

public class AdminPaymentUpdateRequest {

    private BigDecimal paidAmount;
    private PaymentStatus paymentStatus;

    public AdminPaymentUpdateRequest() {}

    public AdminPaymentUpdateRequest(BigDecimal paidAmount, PaymentStatus paymentStatus) {
        this.paidAmount = paidAmount;
        this.paymentStatus = paymentStatus;
    }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
}
