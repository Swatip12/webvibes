package com.webvibes.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_internships")
public class StudentInternship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    @Column(name = "plan_name", nullable = false, length = 200)
    private String planName;

    @Column(name = "total_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalFee;

    @Column(name = "paid_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "remaining_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal remainingAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private PaymentStatus paymentStatus = PaymentStatus.NOT_PAID;

    @Column(name = "registration_receipt_path")
    private String registrationReceiptPath;

    @Column(name = "remaining_receipt_path")
    private String remainingReceiptPath;

    @Column(name = "razorpay_registration_payment_id")
    private String razorpayRegistrationPaymentId;

    @Column(name = "razorpay_remaining_payment_id")
    private String razorpayRemainingPaymentId;

    @Column(name = "utr_number")
    private String utrNumber;

    @Column(name = "pending_utr_type")
    private String pendingUtrType; // REGISTRATION or REMAINING — set when student submits UTR, cleared after admin confirms

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "training_start_date")
    private LocalDate trainingStartDate;

    @Column(name = "training_end_date")
    private LocalDate trainingEndDate;

    @Column(name = "internship_start_date")
    private LocalDate internshipStartDate;

    @Column(name = "internship_end_date")
    private LocalDate internshipEndDate;

    public StudentInternship() {
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public BigDecimal getTotalFee() {
        return totalFee;
    }

    public void setTotalFee(BigDecimal totalFee) {
        this.totalFee = totalFee;
    }

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getRegistrationReceiptPath() {
        return registrationReceiptPath;
    }

    public void setRegistrationReceiptPath(String registrationReceiptPath) {
        this.registrationReceiptPath = registrationReceiptPath;
    }

    public String getRemainingReceiptPath() {
        return remainingReceiptPath;
    }

    public void setRemainingReceiptPath(String remainingReceiptPath) {
        this.remainingReceiptPath = remainingReceiptPath;
    }

    public String getRazorpayRegistrationPaymentId() {
        return razorpayRegistrationPaymentId;
    }

    public void setRazorpayRegistrationPaymentId(String razorpayRegistrationPaymentId) {
        this.razorpayRegistrationPaymentId = razorpayRegistrationPaymentId;
    }

    public String getRazorpayRemainingPaymentId() {
        return razorpayRemainingPaymentId;
    }

    public void setRazorpayRemainingPaymentId(String razorpayRemainingPaymentId) {
        this.razorpayRemainingPaymentId = razorpayRemainingPaymentId;
    }

    public String getUtrNumber() { return utrNumber; }
    public void setUtrNumber(String utrNumber) { this.utrNumber = utrNumber; }

    public String getPendingUtrType() { return pendingUtrType; }
    public void setPendingUtrType(String pendingUtrType) { this.pendingUtrType = pendingUtrType; }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDate getTrainingStartDate() { return trainingStartDate; }
    public void setTrainingStartDate(LocalDate trainingStartDate) { this.trainingStartDate = trainingStartDate; }

    public LocalDate getTrainingEndDate() { return trainingEndDate; }
    public void setTrainingEndDate(LocalDate trainingEndDate) { this.trainingEndDate = trainingEndDate; }

    public LocalDate getInternshipStartDate() { return internshipStartDate; }
    public void setInternshipStartDate(LocalDate internshipStartDate) { this.internshipStartDate = internshipStartDate; }

    public LocalDate getInternshipEndDate() { return internshipEndDate; }
    public void setInternshipEndDate(LocalDate internshipEndDate) { this.internshipEndDate = internshipEndDate; }
}
