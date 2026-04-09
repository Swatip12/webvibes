package com.webvibes.controller;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import com.webvibes.dto.DashboardResponse;
import com.webvibes.entity.StudentInternship;
import com.webvibes.exception.StudentInternshipNotFoundException;
import com.webvibes.repository.StudentInternshipRepository;
import com.webvibes.service.StudentInternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/student")
public class StudentDashboardController {

    @Autowired
    private StudentInternshipService studentInternshipService;

    @Autowired
    private StudentInternshipRepository studentInternshipRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
        String email = authentication.getName();
        DashboardResponse response = studentInternshipService.getDashboard(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/receipt/{paymentType}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Resource> getReceipt(@PathVariable String paymentType,
                                               Authentication authentication) {
        String email = authentication.getName();

        StudentInternship si = studentInternshipRepository.findByStudentEmail(email)
                .orElseThrow(() -> new StudentInternshipNotFoundException("No internship plan assigned"));

        // Determine amount and transaction ID based on payment type
        BigDecimal amount;
        String transactionId;
        if ("registration".equalsIgnoreCase(paymentType)) {
            amount = new BigDecimal("1000");
            transactionId = si.getUtrNumber() != null ? si.getUtrNumber() : "N/A";
        } else if ("remaining".equalsIgnoreCase(paymentType)) {
            amount = si.getRemainingAmount() != null ? si.getTotalFee().subtract(new BigDecimal("1000")) : BigDecimal.ZERO;
            transactionId = si.getUtrNumber() != null ? si.getUtrNumber() : "N/A";
        } else {
            return ResponseEntity.badRequest().build();
        }

        // Generate PDF in memory
        byte[] pdfBytes = generateReceiptPdf(si, paymentType, amount, transactionId);

        ByteArrayResource resource = new ByteArrayResource(pdfBytes);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"receipt_" + paymentType + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdfBytes.length)
                .body(resource);
    }

    private byte[] generateReceiptPdf(StudentInternship si, String paymentType,
                                       BigDecimal amount, String transactionId) {
        Document document = new Document();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Font bodyFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL);

            Paragraph title = new Paragraph("Payment Receipt", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            Paragraph company = new Paragraph("WebVibes Technology", headerFont);
            company.setAlignment(Element.ALIGN_CENTER);
            document.add(company);
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("Student Name: " + si.getStudent().getName(), bodyFont));
            document.add(new Paragraph("Email: " + si.getStudent().getEmail(), bodyFont));
            document.add(new Paragraph("Plan: " + si.getPlanName(), bodyFont));
            document.add(new Paragraph("Payment Type: " + paymentType.toUpperCase(), bodyFont));
            document.add(new Paragraph("Amount Paid: Rs. " + amount.toPlainString(), bodyFont));
            document.add(new Paragraph("UTR / Transaction ID: " + transactionId, bodyFont));
            document.add(new Paragraph("Date: " + LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")), bodyFont));
            document.add(Chunk.NEWLINE);

            Paragraph footer = new Paragraph("Thank you for your payment.", bodyFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

        } catch (DocumentException e) {
            throw new RuntimeException("Receipt generation failed", e);
        } finally {
            if (document.isOpen()) document.close();
        }
        return baos.toByteArray();
    }
}
