package com.webvibes.controller;

import com.webvibes.dto.CourseDTO;
import com.webvibes.dto.CourseEnrollmentDTO;
import com.webvibes.dto.MessageResponse;
import com.webvibes.service.CourseService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for handling course-related requests.
 * Provides public endpoints for fetching courses and enrolling in courses.
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
     * Gets all courses from the database.
     * Public endpoint - no authentication required.
     * 
     * @return ResponseEntity with HTTP 200 and list of all courses sorted by createdAt descending
     */
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        logger.info("Received request to fetch all courses");
        
        List<CourseDTO> courses = courseService.getAllCourses();
        
        logger.info("Returning {} courses", courses.size());
        return ResponseEntity.ok(courses);
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
