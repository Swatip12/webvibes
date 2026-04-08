package com.webvibes.dto;

public class RazorpayOrderResponse {

    private String orderId;
    private long amount; // in paise
    private String currency;
    private String keyId;

    public RazorpayOrderResponse() {}

    public RazorpayOrderResponse(String orderId, long amount, String currency, String keyId) {
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.keyId = keyId;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public long getAmount() { return amount; }
    public void setAmount(long amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }
}
