package com.webvibes.controller;

import com.webvibes.dto.InternshipApplicationDTO;
import com.webvibes.dto.MessageResponse;
import com.webvibes.service.InternshipService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for handling internship application requests.
 * Provides endpoints for students to apply for internship programs.
 */
@RestController
@RequestMapping("/api/internships")
public class InternshipController {
    
    private static final Logger logger = LoggerFactory.getLogger(InternshipController.class);
    
    private final InternshipService internshipService;
    
    public InternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }
    
    /**
     * Handles internship application submissions.
     * 
     * @param dto the internship application data with validation
     * @return ResponseEntity with HTTP 201 and success message on success
     */
    @PostMapping("/apply")
    public ResponseEntity<MessageResponse> applyForInternship(@Valid @RequestBody InternshipApplicationDTO dto) {
        logger.info("Received internship application request for: {}", dto.getStudentName());
        
        internshipService.saveApplication(dto);
        
        logger.info("Internship application processed successfully for student: {}", dto.getStudentName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("Application submitted successfully"));
    }
}
