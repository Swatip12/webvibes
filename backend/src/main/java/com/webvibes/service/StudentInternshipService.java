package com.webvibes.service;

import com.webvibes.dto.AdminPaymentUpdateRequest;
import com.webvibes.dto.DashboardResponse;
import com.webvibes.entity.Student;
import com.webvibes.entity.StudentInternship;
import com.webvibes.exception.StudentInternshipNotFoundException;
import com.webvibes.repository.StudentInternshipRepository;
import com.webvibes.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class StudentInternshipService {

    @Autowired
    private StudentInternshipRepository studentInternshipRepository;

    @Autowired
    private StudentRepository studentRepository;

    public DashboardResponse getDashboard(String email) {
        // Always return student info; plan details only if assigned
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new StudentInternshipNotFoundException("Student not found"));

        return studentInternshipRepository.findByStudentEmail(email)
                .map(si -> new DashboardResponse(
                        si.getStudent().getName(),
                        si.getStudent().getEmail(),
                        si.getPlanName(),
                        si.getTotalFee(),
                        si.getPaidAmount(),
                        si.getRemainingAmount(),
                        si.getPaymentStatus()
                ))
                .orElse(new DashboardResponse(student.getName(), student.getEmail()));
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
