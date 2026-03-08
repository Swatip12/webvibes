package com.webvibes.service;

import com.webvibes.dto.InternshipApplicationDTO;
import com.webvibes.entity.InternshipApplication;
import com.webvibes.repository.InternshipRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class InternshipService {
    
    private static final Logger logger = LoggerFactory.getLogger(InternshipService.class);
    
    private final InternshipRepository internshipRepository;
    
    public InternshipService(InternshipRepository internshipRepository) {
        this.internshipRepository = internshipRepository;
    }
    
    /**
     * Saves an internship application by converting DTO to entity and persisting to database.
     * 
     * @param dto the internship application data transfer object
     * @return the saved InternshipApplication entity
     * @throws RuntimeException if database operation fails
     */
    public InternshipApplication saveApplication(InternshipApplicationDTO dto) {
        try {
            logger.info("Processing internship application for student: {}", dto.getStudentName());
            
            // Convert DTO to entity
            InternshipApplication application = new InternshipApplication();
            application.setStudentName(dto.getStudentName());
            application.setEmail(dto.getEmail());
            application.setPhone(dto.getPhone());
            application.setInternshipType(dto.getInternshipType());
            application.setMessage(dto.getMessage());
            application.setSubmittedAt(LocalDateTime.now());
            
            // Save to repository
            InternshipApplication saved = internshipRepository.save(application);
            
            logger.info("Internship application saved successfully with ID: {}", saved.getId());
            return saved;
            
        } catch (DataAccessException ex) {
            logger.error("Database error while saving internship application for student: {}", 
                        dto.getStudentName(), ex);
            throw new RuntimeException("Failed to save internship application", ex);
        } catch (Exception ex) {
            logger.error("Unexpected error while saving internship application for student: {}", 
                        dto.getStudentName(), ex);
            throw new RuntimeException("An unexpected error occurred while processing the application", ex);
        }
    }
}
