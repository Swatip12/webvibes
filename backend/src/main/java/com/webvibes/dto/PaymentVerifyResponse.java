package com.webvibes.dto;

import com.webvibes.entity.PaymentStatus;

public class PaymentVerifyResponse {

    private boolean success;
    private PaymentStatus paymentStatus;

    public PaymentVerifyResponse() {}

    public PaymentVerifyResponse(boolean success, PaymentStatus paymentStatus) {
        this.success = success;
        this.paymentStatus = paymentStatus;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
}
