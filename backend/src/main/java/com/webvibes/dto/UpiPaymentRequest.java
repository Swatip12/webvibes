package com.webvibes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpiPaymentRequest {

    @NotBlank
    private String paymentType; // REGISTRATION or REMAINING

    @NotBlank
    @Pattern(regexp = "^[A-Za-z0-9]{6,22}$", message = "Invalid UTR number")
    private String utrNumber; // UPI transaction reference number

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

    public String getUtrNumber() { return utrNumber; }
    public void setUtrNumber(String utrNumber) { this.utrNumber = utrNumber; }
}
