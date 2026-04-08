package com.webvibes.service;

import com.webvibes.dto.AdminPaymentUpdateRequest;
import com.webvibes.dto.DashboardResponse;
import com.webvibes.entity.StudentInternship;
import com.webvibes.exception.StudentInternshipNotFoundException;
import com.webvibes.repository.StudentInternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class StudentInternshipService {

    @Autowired
    private StudentInternshipRepository studentInternshipRepository;

    public DashboardResponse getDashboard(String email) {
        StudentInternship si = studentInternshipRepository.findByStudentEmail(email)
                .orElseThrow(() -> new StudentInternshipNotFoundException("No internship plan assigned"));

        return new DashboardResponse(
                si.getStudent().getName(),
                si.getPlanName(),
                si.getTotalFee(),
                si.getPaidAmount(),
                si.getRemainingAmount(),
                si.getPaymentStatus()
        );
    }

    public StudentInternship updatePayment(Long studentId, AdminPaymentUpdateRequest request) {
        StudentInternship si = studentInternshipRepository.findByStudentId(studentId)
                .orElseThrow(() -> new StudentInternshipNotFoundException("Student not found"));

        si.setPaidAmount(request.getPaidAmount());
        BigDecimal remaining = si.getTotalFee().subtract(request.getPaidAmount());
        si.setRemainingAmount(remaining);
        si.setPaymentStatus(request.getPaymentStatus());

        return studentInternshipRepository.save(si);
    }
}
