package com.webvibes.controller;

import com.webvibes.dto.InternshipApplicationDTO;
import com.webvibes.dto.InternshipDTO;
import com.webvibes.dto.MessageResponse;
import com.webvibes.service.InternshipService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for handling internship-related requests.
 * Provides public endpoints for fetching internships and applying for internships.
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
     * Gets all internships from the database.
     * Public endpoint - no authentication required.
     * 
     * @return ResponseEntity with HTTP 200 and list of all internships sorted by createdAt descending
     */
    @GetMapping
    public ResponseEntity<List<InternshipDTO>> getAllInternships() {
        logger.info("Received request to fetch all internships");
        
        List<InternshipDTO> internships = internshipService.getAllInternships();
        
        logger.info("Returning {} internships", internships.size());
        return ResponseEntity.ok(internships);
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
