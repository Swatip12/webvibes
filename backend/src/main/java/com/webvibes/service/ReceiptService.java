package com.webvibes.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import com.webvibes.entity.Student;
import com.webvibes.entity.StudentInternship;
import com.webvibes.repository.StudentInternshipRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ReceiptService {

    private static final Logger logger = LoggerFactory.getLogger(ReceiptService.class);
    private static final BigDecimal REGISTRATION_FEE = new BigDecimal("1000");

    @Value("${app.receipt.dir}")
    private String receiptDir;

    @Autowired
    private StudentInternshipRepository studentInternshipRepository;

    /**
     * Generates a PDF receipt for the given payment and persists the file path
     * on the StudentInternship record.
     *
     * @param student           the student making the payment
     * @param studentInternship the internship record (already updated with new amounts)
     * @param paymentType       "REGISTRATION" or "REMAINING"
     * @param transactionId     the Razorpay payment ID
     * @return the file path of the generated PDF
     */
    public String generateReceipt(Student student, StudentInternship studentInternship,
                                   String paymentType, String transactionId) {
        // Ensure receipt directory exists
        File dir = new File(receiptDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Determine amount to display on receipt
        BigDecimal amount;
        if ("REGISTRATION".equalsIgnoreCase(paymentType)) {
            amount = REGISTRATION_FEE;
        } else {
            // For REMAINING, show the cumulative paid amount (total fee)
            amount = studentInternship.getPaidAmount();
        }

        // Build file name: {studentId}_{paymentType}_{timestamp}.pdf
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String fileName = student.getId() + "_" + paymentType.toUpperCase() + "_" + timestamp + ".pdf";
        String filePath = receiptDir + File.separator + fileName;

        // Generate PDF
        generatePdf(filePath, student, studentInternship, paymentType, transactionId, amount);

        // Persist receipt path on StudentInternship
        if ("REGISTRATION".equalsIgnoreCase(paymentType)) {
            studentInternship.setRegistrationReceiptPath(filePath);
        } else {
            studentInternship.setRemainingReceiptPath(filePath);
        }
        studentInternshipRepository.save(studentInternship);

        logger.info("Receipt generated at {} for student {} paymentType {}", filePath, student.getEmail(), paymentType);
        return filePath;
    }

    private void generatePdf(String filePath, Student student, StudentInternship studentInternship,
                              String paymentType, String transactionId, BigDecimal amount) {
        Document document = new Document();
        try {
            PdfWriter.getInstance(document, new FileOutputStream(filePath));
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Font bodyFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL);

            // Title
            Paragraph title = new Paragraph("Payment Receipt", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // Company name
            Paragraph company = new Paragraph("WebVibes Technology", headerFont);
            company.setAlignment(Element.ALIGN_CENTER);
            document.add(company);
            document.add(Chunk.NEWLINE);

            // Receipt details
            document.add(new Paragraph("Student Name: " + student.getName(), bodyFont));
            document.add(new Paragraph("Email: " + student.getEmail(), bodyFont));
            document.add(new Paragraph("Plan: " + studentInternship.getPlanName(), bodyFont));
            document.add(new Paragraph("Payment Type: " + paymentType.toUpperCase(), bodyFont));
            document.add(new Paragraph("Amount Paid: Rs. " + amount.toPlainString(), bodyFont));
            document.add(new Paragraph("Transaction ID: " + transactionId, bodyFont));
            document.add(new Paragraph("Date: " + LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")), bodyFont));
            document.add(Chunk.NEWLINE);

            Paragraph footer = new Paragraph("Thank you for your payment.", bodyFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

        } catch (DocumentException | IOException e) {
            logger.error("Failed to generate receipt PDF at {}: {}", filePath, e.getMessage());
            throw new RuntimeException("Receipt generation failed", e);
        } finally {
            if (document.isOpen()) {
                document.close();
            }
        }
    }
}
