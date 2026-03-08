package com.webvibes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class InternshipApplicationDTO {
    
    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 100, message = "Student name must be between 2 and 100 characters")
    private String studentName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Invalid phone number")
    private String phone;
    
    @NotBlank(message = "Internship type is required")
    private String internshipType;
    
    @Size(max = 500, message = "Message must not exceed 500 characters")
    private String message;
    
    // Constructors
    public InternshipApplicationDTO() {
    }
    
    public InternshipApplicationDTO(String studentName, String email, String phone, 
                                   String internshipType, String message) {
        this.studentName = studentName;
        this.email = email;
        this.phone = phone;
        this.internshipType = internshipType;
        this.message = message;
    }
    
    // Getters and Setters
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
}
