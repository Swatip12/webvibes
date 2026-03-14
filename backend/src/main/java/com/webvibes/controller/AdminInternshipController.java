package com.webvibes.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webvibes.dto.InternshipDTO;
import com.webvibes.dto.MessageResponse;
import com.webvibes.service.InternshipService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/internships")
@PreAuthorize("hasRole('ADMIN')")
public class AdminInternshipController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminInternshipController.class);
    
    private final InternshipService internshipService;
    
    public AdminInternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }
    
    /**
     * Create a new internship.
     * 
     * @param internshipDTO the internship data
     * @return the created internship with 201 status
     */
    @PostMapping
    public ResponseEntity<InternshipDTO> createInternship(@Valid @RequestBody InternshipDTO internshipDTO) {
        logger.info("Admin creating new internship: {}", internshipDTO.getType());
        
        try {
            InternshipDTO createdInternship = internshipService.createInternship(internshipDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdInternship);
        } catch (Exception ex) {
            logger.error("Error creating internship", ex);
            throw ex;
        }
    }
    
    /**
     * Update an existing internship.
     * 
     * @param id the internship ID
     * @param internshipDTO the updated internship data
     * @return the updated internship with 200 status
     */
    @PutMapping("/{id}")
    public ResponseEntity<InternshipDTO> updateInternship(
            @PathVariable Long id,
            @Valid @RequestBody InternshipDTO internshipDTO) {
        logger.info("Admin updating internship with ID: {}", id);
        
        try {
            InternshipDTO updatedInternship = internshipService.updateInternship(id, internshipDTO);
            return ResponseEntity.ok(updatedInternship);
        } catch (RuntimeException ex) {
            if (ex.getMessage().contains("not found")) {
                logger.warn("Internship not found with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            logger.error("Error updating internship", ex);
            throw ex;
        }
    }
    
    /**
     * Delete an internship.
     * 
     * @param id the internship ID
     * @return success message with 200 status
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteInternship(@PathVariable Long id) {
        logger.info("Admin deleting internship with ID: {}", id);
        
        try {
            internshipService.deleteInternship(id);
            return ResponseEntity.ok(new MessageResponse("Internship deleted successfully"));
        } catch (RuntimeException ex) {
            if (ex.getMessage().contains("not found")) {
                logger.warn("Internship not found with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new MessageResponse("Internship with ID " + id + " not found"));
            }
            logger.error("Error deleting internship", ex);
            throw ex;
        }
    }
    
    /**
     * Get all internships.
     * 
     * @return list of all internships with 200 status
     */
    @GetMapping
    public ResponseEntity<List<InternshipDTO>> getAllInternships() {
        logger.info("Admin fetching all internships");
        
        try {
            List<InternshipDTO> internships = internshipService.getAllInternships();
            return ResponseEntity.ok(internships);
        } catch (Exception ex) {
            logger.error("Error fetching all internships", ex);
            throw ex;
        }
    }
    
    /**
     * Get an internship by ID.
     * 
     * @param id the internship ID
     * @return the internship with 200 status
     */
    @GetMapping("/{id}")
    public ResponseEntity<InternshipDTO> getInternshipById(@PathVariable Long id) {
        logger.info("Admin fetching internship with ID: {}", id);
        
        try {
            InternshipDTO internship = internshipService.getInternshipById(id);
            return ResponseEntity.ok(internship);
        } catch (RuntimeException ex) {
            if (ex.getMessage().contains("not found")) {
                logger.warn("Internship not found with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            logger.error("Error fetching internship", ex);
            throw ex;
        }
    }
}
