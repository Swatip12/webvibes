package com.webvibes.controller;

import com.webvibes.dto.CourseDTO;
import com.webvibes.dto.CourseEnrollmentDTO;
import com.webvibes.dto.MessageResponse;
import com.webvibes.service.CourseService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
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
     */
    @PostMapping("/enroll")
    public ResponseEntity<MessageResponse> enrollInCourse(@Valid @RequestBody CourseEnrollmentDTO dto) {
        logger.info("Received course enrollment request for: {}", dto.getStudentName());
        
        courseService.saveEnrollment(dto);
        
        logger.info("Course enrollment processed successfully for student: {}", dto.getStudentName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("Enrollment submitted successfully"));
    }

    /**
     * Download syllabus PDF for a course.
     */
    @GetMapping("/{id}/syllabus")
    public ResponseEntity<Resource> downloadSyllabus(@PathVariable Long id) {
        logger.info("Received request to download syllabus for course ID: {}", id);

        try {
            String syllabusPath = courseService.getSyllabusPath(id);
            Path filePath = Paths.get(syllabusPath);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"syllabus_course_" + id + ".pdf\"")
                    .body(resource);

        } catch (RuntimeException ex) {
            if (ex.getMessage().contains("not found") || ex.getMessage().contains("No syllabus")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            throw ex;
        } catch (MalformedURLException ex) {
            logger.error("Malformed URL for syllabus path", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
