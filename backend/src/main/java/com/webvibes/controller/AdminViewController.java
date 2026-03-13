package com.webvibes.controller;

import com.webvibes.dto.ContactMessageDTO;
import com.webvibes.dto.CourseEnrollmentDTO;
import com.webvibes.dto.InternshipApplicationDTO;
import com.webvibes.entity.ContactMessage;
import com.webvibes.entity.CourseEnrollment;
import com.webvibes.entity.InternshipApplication;
import com.webvibes.repository.ContactRepository;
import com.webvibes.repository.CourseEnrollmentRepository;
import com.webvibes.repository.InternshipApplicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminViewController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminViewController.class);
    
    private final InternshipApplicationRepository internshipApplicationRepository;
    private final CourseEnrollmentRepository courseEnrollmentRepository;
    private final ContactRepository contactRepository;
    
    public AdminViewController(InternshipApplicationRepository internshipApplicationRepository,
                              CourseEnrollmentRepository courseEnrollmentRepository,
                              ContactRepository contactRepository) {
        this.internshipApplicationRepository = internshipApplicationRepository;
        this.courseEnrollmentRepository = courseEnrollmentRepository;
        this.contactRepository = contactRepository;
    }
    
    /**
     * Gets all internship applications sorted by submission date descending.
     * 
     * @return list of all internship applications
     */
    @GetMapping("/applications")
    public ResponseEntity<List<InternshipApplicationDTO>> getAllApplications() {
        logger.info("Fetching all internship applications");
        
        List<InternshipApplication> applications = internshipApplicationRepository.findAllByOrderBySubmittedAtDesc();
        
        List<InternshipApplicationDTO> applicationDTOs = applications.stream()
                .map(this::convertApplicationToDto)
                .collect(Collectors.toList());
        
        logger.info("Retrieved {} internship applications", applicationDTOs.size());
        return ResponseEntity.ok(applicationDTOs);
    }
    
    /**
     * Gets all course enrollments sorted by submission date descending.
     * 
     * @return list of all course enrollments
     */
    @GetMapping("/enrollments")
    public ResponseEntity<List<CourseEnrollmentDTO>> getAllEnrollments() {
        logger.info("Fetching all course enrollments");
        
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findAllByOrderBySubmittedAtDesc();
        
        List<CourseEnrollmentDTO> enrollmentDTOs = enrollments.stream()
                .map(this::convertEnrollmentToDto)
                .collect(Collectors.toList());
        
        logger.info("Retrieved {} course enrollments", enrollmentDTOs.size());
        return ResponseEntity.ok(enrollmentDTOs);
    }
    
    /**
     * Gets all contact messages sorted by submission date descending.
     * 
     * @return list of all contact messages
     */
    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessageDTO>> getAllMessages() {
        logger.info("Fetching all contact messages");
        
        List<ContactMessage> messages = contactRepository.findAllByOrderBySubmittedAtDesc();
        
        List<ContactMessageDTO> messageDTOs = messages.stream()
                .map(this::convertMessageToDto)
                .collect(Collectors.toList());
        
        logger.info("Retrieved {} contact messages", messageDTOs.size());
        return ResponseEntity.ok(messageDTOs);
    }
    
    // ==================== Conversion Methods ====================
    
    /**
     * Converts InternshipApplication entity to InternshipApplicationDTO.
     * 
     * @param application the InternshipApplication entity
     * @return the InternshipApplicationDTO
     */
    private InternshipApplicationDTO convertApplicationToDto(InternshipApplication application) {
        InternshipApplicationDTO dto = new InternshipApplicationDTO();
        dto.setId(application.getId());
        dto.setStudentName(application.getStudentName());
        dto.setEmail(application.getEmail());
        dto.setPhone(application.getPhone());
        dto.setInternshipType(application.getInternshipType());
        dto.setMessage(application.getMessage());
        dto.setSubmittedAt(application.getSubmittedAt());
        return dto;
    }
    
    /**
     * Converts CourseEnrollment entity to CourseEnrollmentDTO.
     * 
     * @param enrollment the CourseEnrollment entity
     * @return the CourseEnrollmentDTO
     */
    private CourseEnrollmentDTO convertEnrollmentToDto(CourseEnrollment enrollment) {
        CourseEnrollmentDTO dto = new CourseEnrollmentDTO();
        dto.setId(enrollment.getId());
        dto.setStudentName(enrollment.getStudentName());
        dto.setEmail(enrollment.getEmail());
        dto.setPhone(enrollment.getPhone());
        dto.setCourseName(enrollment.getCourseName());
        dto.setMessage(enrollment.getMessage());
        dto.setSubmittedAt(enrollment.getSubmittedAt());
        return dto;
    }
    
    /**
     * Converts ContactMessage entity to ContactMessageDTO.
     * 
     * @param message the ContactMessage entity
     * @return the ContactMessageDTO
     */
    private ContactMessageDTO convertMessageToDto(ContactMessage message) {
        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setId(message.getId());
        dto.setName(message.getName());
        dto.setEmail(message.getEmail());
        dto.setMessage(message.getMessage());
        dto.setSubmittedAt(message.getSubmittedAt());
        return dto;
    }
}
