package com.webvibes.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "internship_applications", indexes = {
    @Index(name = "idx_iapp_email", columnList = "email"),
    @Index(name = "idx_iapp_submitted_at", columnList = "submitted_at")
})
public class InternshipApplication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "student_name", nullable = false, length = 100)
    private String studentName;
    
    @Column(nullable = false, length = 100)
    private String email;
    
    @Column(nullable = false, length = 15)
    private String phone;
    
    @Column(name = "internship_type", nullable = false, length = 50)
    private String internshipType;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
    
    // Constructors
    public InternshipApplication() {
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getStudentName() {
        return studentName;
    }
    
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getInternshipType() {
        return internshipType;
    }
    
    public void setInternshipType(String internshipType) {
        this.internshipType = internshipType;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
    
    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
