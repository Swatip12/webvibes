package com.webvibes.service;

import com.webvibes.dto.CourseEnrollmentDTO;
import com.webvibes.entity.CourseEnrollment;
import com.webvibes.repository.CourseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CourseService {
    
    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);
    
    private final CourseRepository courseRepository;
    
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }
    
    /**
     * Saves a course enrollment by converting DTO to entity and persisting to database.
     * 
     * @param dto the course enrollment data transfer object
     * @return the saved CourseEnrollment entity
     * @throws RuntimeException if database operation fails
     */
    public CourseEnrollment saveEnrollment(CourseEnrollmentDTO dto) {
        try {
            logger.info("Processing course enrollment for student: {}", dto.getStudentName());
            
            // Convert DTO to entity
            CourseEnrollment enrollment = new CourseEnrollment();
            enrollment.setStudentName(dto.getStudentName());
            enrollment.setEmail(dto.getEmail());
            enrollment.setPhone(dto.getPhone());
            enrollment.setCourseName(dto.getCourseName());
            enrollment.setMessage(dto.getMessage());
            enrollment.setSubmittedAt(LocalDateTime.now());
            
            // Save to repository
            CourseEnrollment saved = courseRepository.save(enrollment);
            
            logger.info("Course enrollment saved successfully with ID: {}", saved.getId());
            return saved;
            
        } catch (DataAccessException ex) {
            logger.error("Database error while saving course enrollment for student: {}", 
                        dto.getStudentName(), ex);
            throw new RuntimeException("Failed to save course enrollment", ex);
        } catch (Exception ex) {
            logger.error("Unexpected error while saving course enrollment for student: {}", 
                        dto.getStudentName(), ex);
            throw new RuntimeException("An unexpected error occurred while processing the enrollment", ex);
        }
    }
}
