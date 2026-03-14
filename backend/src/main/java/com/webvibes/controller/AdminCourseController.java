package com.webvibes.controller;

import com.webvibes.dto.CourseDTO;
import com.webvibes.dto.MessageResponse;
import com.webvibes.service.CourseService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/courses")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminCourseController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminCourseController.class);
    
    private final CourseService courseService;
    
    public AdminCourseController(CourseService courseService) {
        this.courseService = courseService;
    }
    
    /**
     * Create a new course.
     * 
     * @param courseDTO the course data
     * @return the created course with 201 status
     */
    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(@Valid @RequestBody CourseDTO courseDTO) {
        logger.info("Admin creating new course: {}", courseDTO.getName());
        
        try {
            CourseDTO createdCourse = courseService.createCourse(courseDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
        } catch (Exception ex) {
            logger.error("Error creating course", ex);
            throw ex;
        }
    }
    
    /**
     * Update an existing course.
     * 
     * @param id the course ID
     * @param courseDTO the updated course data
     * @return the updated course with 200 status
     */
    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseDTO courseDTO) {
        logger.info("Admin updating course with ID: {}", id);
        
        try {
            CourseDTO updatedCourse = courseService.updateCourse(id, courseDTO);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException ex) {
            if (ex.getMessage().contains("not found")) {
                logger.warn("Course not found with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            logger.error("Error updating course", ex);
            throw ex;
        }
    }
    
    /**
     * Delete a course.
     * 
     * @param id the course ID
     * @return success message with 200 status
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteCourse(@PathVariable Long id) {
        logger.info("Admin deleting course with ID: {}", id);
        
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok(new MessageResponse("Course deleted successfully"));
        } catch (RuntimeException ex) {
            if (ex.getMessage().contains("not found")) {
                logger.warn("Course not found with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new MessageResponse("Course with ID " + id + " not found"));
            }
            logger.error("Error deleting course", ex);
            throw ex;
        }
    }
    
    /**
     * Get all courses.
     * 
     * @return list of all courses with 200 status
     */
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        logger.info("Admin fetching all courses");
        
        try {
            List<CourseDTO> courses = courseService.getAllCourses();
            return ResponseEntity.ok(courses);
        } catch (Exception ex) {
            logger.error("Error fetching all courses", ex);
            throw ex;
        }
    }
    
    /**
     * Get a course by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        logger.info("Admin fetching course with ID: {}", id);
        
        try {
            CourseDTO course = courseService.getCourseById(id);
            return ResponseEntity.ok(course);
        } catch (RuntimeException ex) {
            if (ex.getMessage().contains("not found")) {
                logger.warn("Course not found with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            logger.error("Error fetching course", ex);
            throw ex;
        }
    }

    /**
     * Upload syllabus PDF for a course.
     */
    @PostMapping("/{id}/syllabus")
    public ResponseEntity<?> uploadSyllabus(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        logger.info("Admin uploading syllabus for course ID: {}", id);

        try {
            CourseDTO updated = courseService.uploadSyllabus(id, file);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            if (ex.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new MessageResponse(ex.getMessage()));
            }
            if (ex.getMessage().contains("Only PDF")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse(ex.getMessage()));
            }
            logger.error("Error uploading syllabus", ex);
            throw ex;
        }
    }
}
