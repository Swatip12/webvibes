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
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            // Fonts
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD, BaseColor.DARK_GRAY);
            Font companyFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, new BaseColor(79, 70, 229)); // #4f46e5
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Font bodyFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);
            Font labelFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.GRAY);

            // Header section with border
            Paragraph companyName = new Paragraph("WEBVIBES TECHNOLOGY", companyFont);
            companyName.setAlignment(Element.ALIGN_CENTER);
            document.add(companyName);

            Paragraph tagline = new Paragraph("Where Vibes Meets Innovation", bodyFont);
            tagline.setAlignment(Element.ALIGN_CENTER);
            document.add(tagline);

            document.add(new Paragraph(" ")); // spacer
            
            // Horizontal line
            com.itextpdf.text.pdf.draw.LineSeparator line = new com.itextpdf.text.pdf.draw.LineSeparator();
            line.setLineColor(new BaseColor(200, 200, 200));
            document.add(new Chunk(line));
            
            document.add(new Paragraph(" ")); // spacer

            // Receipt title
            Paragraph receiptTitle = new Paragraph("PAYMENT RECEIPT", titleFont);
            receiptTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(receiptTitle);
            
            document.add(new Paragraph(" ")); // spacer

            // Receipt number and date
            String receiptNo = "WVT-" + si.getStudent().getId() + "-" + 
                              LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            Paragraph receiptInfo = new Paragraph("Receipt No: " + receiptNo, bodyFont);
            receiptInfo.setAlignment(Element.ALIGN_RIGHT);
            document.add(receiptInfo);

            Paragraph dateInfo = new Paragraph("Date: " + LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")), bodyFont);
            dateInfo.setAlignment(Element.ALIGN_RIGHT);
            document.add(dateInfo);

            document.add(new Paragraph(" ")); // spacer
            document.add(new Paragraph(" ")); // spacer

            // Student details section
            document.add(new Paragraph("STUDENT DETAILS", headerFont));
            document.add(new Paragraph(" ")); // spacer

            document.add(new Paragraph("Name: " + si.getStudent().getName(), bodyFont));
            document.add(new Paragraph("Email: " + si.getStudent().getEmail(), bodyFont));
            document.add(new Paragraph("Mobile: " + si.getStudent().getMobile(), bodyFont));

            document.add(new Paragraph(" ")); // spacer
            document.add(new Paragraph(" ")); // spacer

            // Payment details section
            document.add(new Paragraph("PAYMENT DETAILS", headerFont));
            document.add(new Paragraph(" ")); // spacer

            document.add(new Paragraph("Internship Plan: " + si.getPlanName(), bodyFont));
            document.add(new Paragraph("Payment Type: " + paymentType.toUpperCase() + " FEE", bodyFont));
            
            document.add(new Paragraph(" ")); // spacer

            // Amount in a box
            Paragraph amountPara = new Paragraph("Amount Paid: ₹ " + amount.toPlainString(), 
                                                 new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, new BaseColor(22, 163, 74))); // green
            amountPara.setAlignment(Element.ALIGN_CENTER);
            document.add(amountPara);

            document.add(new Paragraph(" ")); // spacer

            document.add(new Paragraph("UTR / Transaction ID: " + transactionId, bodyFont));
            document.add(new Paragraph("Payment Mode: UPI", bodyFont));

            document.add(new Paragraph(" ")); // spacer
            document.add(new Paragraph(" ")); // spacer
            document.add(new Paragraph(" ")); // spacer

            // Footer
            document.add(new Chunk(line));
            document.add(new Paragraph(" ")); // spacer

            Paragraph footer = new Paragraph("Thank you for your payment!", 
                                            new Font(Font.FontFamily.HELVETICA, 11, Font.ITALIC, BaseColor.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            Paragraph contact = new Paragraph("For queries, contact: support@webvibestechnology.in", 
                                             new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, BaseColor.GRAY));
            contact.setAlignment(Element.ALIGN_CENTER);
            document.add(contact);

        } catch (DocumentException e) {
            throw new RuntimeException("Receipt generation failed", e);
        } finally {
            if (document.isOpen()) document.close();
        }
        return baos.toByteArray();
    }
}
