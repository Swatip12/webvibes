package com.webvibes.controller;

import com.webvibes.dto.CourseEnrollmentDTO;
import com.webvibes.dto.MessageResponse;
import com.webvibes.service.CourseService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for handling course enrollment requests.
 * Provides endpoints for students to enroll in courses.
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {
    
    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);
    
    private final CourseService courseService;
    
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }
    
    /**
     * Handles course enrollment submissions.
     * 
     * @param dto the course enrollment data with validation
     * @return ResponseEntity with HTTP 201 and success message on success
     */
    @PostMapping("/enroll")
    public ResponseEntity<MessageResponse> enrollInCourse(@Valid @RequestBody CourseEnrollmentDTO dto) {
        logger.info("Received course enrollment request for: {}", dto.getStudentName());
        
        courseService.saveEnrollment(dto);
        
        logger.info("Course enrollment processed successfully for student: {}", dto.getStudentName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("Enrollment submitted successfully"));
    }
}
