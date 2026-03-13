package com.webvibes.service;

import com.webvibes.dto.InternshipApplicationDTO;
import com.webvibes.dto.InternshipDTO;
import com.webvibes.entity.Internship;
import com.webvibes.entity.InternshipApplication;
import com.webvibes.repository.InternshipApplicationRepository;
import com.webvibes.repository.InternshipRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InternshipService {
    
    private static final Logger logger = LoggerFactory.getLogger(InternshipService.class);
    
    private final InternshipApplicationRepository internshipApplicationRepository;
    private final InternshipRepository internshipRepository;
    
    public InternshipService(InternshipApplicationRepository internshipApplicationRepository,
                            InternshipRepository internshipRepository) {
        this.internshipApplicationRepository = internshipApplicationRepository;
        this.internshipRepository = internshipRepository;
    }
    
    // ==================== Admin Operations ====================
    
    /**
     * Creates a new internship.
     * 
     * @param internshipDTO the internship data transfer object
     * @return the created InternshipDTO with generated ID
     * @throws RuntimeException if database operation fails
     */
    public InternshipDTO createInternship(InternshipDTO internshipDTO) {
        try {
            logger.info("Creating new internship: {}", internshipDTO.getType());
            
            Internship internship = convertDtoToEntity(internshipDTO);
            Internship savedInternship = internshipRepository.save(internship);
            
            logger.info("Internship created successfully with ID: {}", savedInternship.getId());
            return convertEntityToDto(savedInternship);
            
        } catch (DataAccessException ex) {
            logger.error("Database error while creating internship: {}", internshipDTO.getType(), ex);
            throw new RuntimeException("Failed to create internship", ex);
        } catch (Exception ex) {
            logger.error("Unexpected error while creating internship: {}", internshipDTO.getType(), ex);
            throw new RuntimeException("An unexpected error occurred while creating the internship", ex);
        }
    }
    
    /**
     * Updates an existing internship.
     * 
     * @param id the internship ID
     * @param internshipDTO the updated internship data
     * @return the updated InternshipDTO
     * @throws RuntimeException if internship not found or database operation fails
     */
    public InternshipDTO updateInternship(Long id, InternshipDTO internshipDTO) {
        try {
            logger.info("Updating internship with ID: {}", id);
            
            Internship internship = internshipRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Internship with ID " + id + " not found"));
            
            // Update fields
            internship.setType(internshipDTO.getType());
            internship.setDescription(internshipDTO.getDescription());
            internship.setDuration(internshipDTO.getDuration());
            internship.setSkills(internshipDTO.getSkills());
            
            Internship updatedInternship = internshipRepository.save(internship);
            
            logger.info("Internship updated successfully with ID: {}", updatedInternship.getId());
            return convertEntityToDto(updatedInternship);
            
        } catch (DataAccessException ex) {
            logger.error("Database error while updating internship with ID: {}", id, ex);
            throw new RuntimeException("Failed to update internship", ex);
        } catch (Exception ex) {
            logger.error("Error while updating internship with ID: {}", id, ex);
            throw ex;
        }
    }
    
    /**
     * Deletes an internship by ID.
     * 
     * @param id the internship ID
     * @throws RuntimeException if internship not found or database operation fails
     */
    public void deleteInternship(Long id) {
        try {
            logger.info("Deleting internship with ID: {}", id);
            
            if (!internshipRepository.existsById(id)) {
                throw new RuntimeException("Internship with ID " + id + " not found");
            }
            
            internshipRepository.deleteById(id);
            
            logger.info("Internship deleted successfully with ID: {}", id);
            
        } catch (DataAccessException ex) {
            logger.error("Database error while deleting internship with ID: {}", id, ex);
            throw new RuntimeException("Failed to delete internship", ex);
        } catch (Exception ex) {
            logger.error("Error while deleting internship with ID: {}", id, ex);
            throw ex;
        }
    }
    
    /**
     * Gets an internship by ID.
     * 
     * @param id the internship ID
     * @return the InternshipDTO
     * @throws RuntimeException if internship not found
     */
    public InternshipDTO getInternshipById(Long id) {
        try {
            logger.info("Fetching internship with ID: {}", id);
            
            Internship internship = internshipRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Internship with ID " + id + " not found"));
            
            return convertEntityToDto(internship);
            
        } catch (Exception ex) {
            logger.error("Error while fetching internship with ID: {}", id, ex);
            throw ex;
        }
    }
    
    /**
     * Gets all internships for public access.
     * 
     * @return list of all internships
     */
    public List<InternshipDTO> getAllInternships() {
        try {
            logger.info("Fetching all internships");
            
            List<Internship> internships = internshipRepository.findAllByOrderByCreatedAtDesc();
            
            return internships.stream()
                    .map(this::convertEntityToDto)
                    .collect(Collectors.toList());
            
        } catch (DataAccessException ex) {
            logger.error("Database error while fetching all internships", ex);
            throw new RuntimeException("Failed to fetch internships", ex);
        } catch (Exception ex) {
            logger.error("Unexpected error while fetching all internships", ex);
            throw new RuntimeException("An unexpected error occurred while fetching internships", ex);
        }
    }
    
    // ==================== Conversion Methods ====================
    
    /**
     * Converts Internship entity to InternshipDTO.
     * 
     * @param internship the Internship entity
     * @return the InternshipDTO
     */
    private InternshipDTO convertEntityToDto(Internship internship) {
        InternshipDTO dto = new InternshipDTO();
        dto.setId(internship.getId());
        dto.setType(internship.getType());
        dto.setDescription(internship.getDescription());
        dto.setDuration(internship.getDuration());
        dto.setSkills(internship.getSkills());
        dto.setCreatedAt(internship.getCreatedAt());
        dto.setUpdatedAt(internship.getUpdatedAt());
        return dto;
    }
    
    /**
     * Converts InternshipDTO to Internship entity.
     * 
     * @param dto the InternshipDTO
     * @return the Internship entity
     */
    private Internship convertDtoToEntity(InternshipDTO dto) {
        Internship internship = new Internship();
        internship.setType(dto.getType());
        internship.setDescription(dto.getDescription());
        internship.setDuration(dto.getDuration());
        internship.setSkills(dto.getSkills());
        return internship;
    }
    
    // ==================== Application Operations ====================
    
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
            InternshipApplication saved = internshipApplicationRepository.save(application);
            
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
