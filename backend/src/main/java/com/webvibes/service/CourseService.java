package com.webvibes.service;

import com.webvibes.dto.CourseDTO;
import com.webvibes.dto.CourseEnrollmentDTO;
import com.webvibes.entity.Course;
import com.webvibes.entity.CourseEnrollment;
import com.webvibes.repository.CourseEnrollmentRepository;
import com.webvibes.repository.CourseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CourseService {
    
    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);
    
    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository courseEnrollmentRepository;

    @Value("${app.upload.dir:uploads/syllabi}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    
    public CourseService(CourseRepository courseRepository, CourseEnrollmentRepository courseEnrollmentRepository) {
        this.courseRepository = courseRepository;
        this.courseEnrollmentRepository = courseEnrollmentRepository;
    }
    
    // ==================== Admin Operations ====================
    
    /**
     * Creates a new course.
     * 
     * @param courseDTO the course data transfer object
     * @return the created CourseDTO with generated ID
     * @throws RuntimeException if database operation fails
     */
    public CourseDTO createCourse(CourseDTO courseDTO) {
        try {
            logger.info("Creating new course: {}", courseDTO.getName());
            
            Course course = convertDtoToEntity(courseDTO);
            Course savedCourse = courseRepository.save(course);
            
            logger.info("Course created successfully with ID: {}", savedCourse.getId());
            return convertEntityToDto(savedCourse);
            
        } catch (DataAccessException ex) {
            logger.error("Database error while creating course: {}", courseDTO.getName(), ex);
            throw new RuntimeException("Failed to create course", ex);
        } catch (Exception ex) {
            logger.error("Unexpected error while creating course: {}", courseDTO.getName(), ex);
            throw new RuntimeException("An unexpected error occurred while creating the course", ex);
        }
    }
    
    /**
     * Updates an existing course.
     * 
     * @param id the course ID
     * @param courseDTO the updated course data
     * @return the updated CourseDTO
     * @throws RuntimeException if course not found or database operation fails
     */
    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        try {
            logger.info("Updating course with ID: {}", id);
            
            Course course = courseRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Course with ID " + id + " not found"));
            
            // Update fields
            course.setName(courseDTO.getName());
            course.setDescription(courseDTO.getDescription());
            course.setDuration(courseDTO.getDuration());
            course.setTechnologies(courseDTO.getTechnologies());
            
            Course updatedCourse = courseRepository.save(course);
            
            logger.info("Course updated successfully with ID: {}", updatedCourse.getId());
            return convertEntityToDto(updatedCourse);
            
        } catch (DataAccessException ex) {
            logger.error("Database error while updating course with ID: {}", id, ex);
            throw new RuntimeException("Failed to update course", ex);
        } catch (Exception ex) {
            logger.error("Error while updating course with ID: {}", id, ex);
            throw ex;
        }
    }
    
    /**
     * Deletes a course by ID.
     * 
     * @param id the course ID
     * @throws RuntimeException if course not found or database operation fails
     */
    public void deleteCourse(Long id) {
        try {
            logger.info("Deleting course with ID: {}", id);
            
            if (!courseRepository.existsById(id)) {
                throw new RuntimeException("Course with ID " + id + " not found");
            }
            
            courseRepository.deleteById(id);
            
            logger.info("Course deleted successfully with ID: {}", id);
            
        } catch (DataAccessException ex) {
            logger.error("Database error while deleting course with ID: {}", id, ex);
            throw new RuntimeException("Failed to delete course", ex);
        } catch (Exception ex) {
            logger.error("Error while deleting course with ID: {}", id, ex);
            throw ex;
        }
    }
    
    /**
     * Gets a course by ID.
     * 
     * @param id the course ID
     * @return the CourseDTO
     * @throws RuntimeException if course not found
     */
    public CourseDTO getCourseById(Long id) {
        try {
            logger.info("Fetching course with ID: {}", id);
            
            Course course = courseRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Course with ID " + id + " not found"));
            
            return convertEntityToDto(course);
            
        } catch (Exception ex) {
            logger.error("Error while fetching course with ID: {}", id, ex);
            throw ex;
        }
    }
    
    /**
     * Gets all courses for public access.
     * 
     * @return list of all courses
     */
    public List<CourseDTO> getAllCourses() {
        try {
            logger.info("Fetching all courses");
            
            List<Course> courses = courseRepository.findAllByOrderByCreatedAtDesc();
            
            return courses.stream()
                    .map(this::convertEntityToDto)
                    .collect(Collectors.toList());
            
        } catch (DataAccessException ex) {
            logger.error("Database error while fetching all courses", ex);
            throw new RuntimeException("Failed to fetch courses", ex);
        } catch (Exception ex) {
            logger.error("Unexpected error while fetching all courses", ex);
            throw new RuntimeException("An unexpected error occurred while fetching courses", ex);
        }
    }
    
    // ==================== Conversion Methods ====================
    
    /**
     * Converts Course entity to CourseDTO.
     */
    private CourseDTO convertEntityToDto(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setName(course.getName());
        dto.setDescription(course.getDescription());
        dto.setDuration(course.getDuration());
        dto.setTechnologies(course.getTechnologies());
        dto.setCreatedAt(course.getCreatedAt());
        dto.setUpdatedAt(course.getUpdatedAt());
        if (course.getSyllabusPath() != null) {
            dto.setSyllabusUrl(baseUrl + "/api/courses/" + course.getId() + "/syllabus");
        }
        return dto;
    }
    
    /**
     * Converts CourseDTO to Course entity.
     * 
     * @param dto the CourseDTO
     * @return the Course entity
     */
    private Course convertDtoToEntity(CourseDTO dto) {
        Course course = new Course();
        course.setName(dto.getName());
        course.setDescription(dto.getDescription());
        course.setDuration(dto.getDuration());
        course.setTechnologies(dto.getTechnologies());
        return course;
    }
    
    // ==================== Syllabus Operations ====================

    /**
     * Uploads a syllabus PDF for a course.
     */
    public CourseDTO uploadSyllabus(Long courseId, MultipartFile file) {
        try {
            logger.info("Uploading syllabus for course ID: {}", courseId);

            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course with ID " + courseId + " not found"));

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.equals("application/pdf")) {
                throw new RuntimeException("Only PDF files are allowed");
            }

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            // Delete old syllabus if exists
            if (course.getSyllabusPath() != null) {
                Path oldFile = Paths.get(course.getSyllabusPath());
                Files.deleteIfExists(oldFile);
            }

            // Save new file with unique name
            String filename = "syllabus_" + courseId + "_" + UUID.randomUUID() + ".pdf";
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            course.setSyllabusPath(filePath.toString());
            Course saved = courseRepository.save(course);

            logger.info("Syllabus uploaded successfully for course ID: {}", courseId);
            return convertEntityToDto(saved);

        } catch (IOException ex) {
            logger.error("IO error uploading syllabus for course ID: {}", courseId, ex);
            throw new RuntimeException("Failed to store syllabus file", ex);
        } catch (Exception ex) {
            logger.error("Error uploading syllabus for course ID: {}", courseId, ex);
            throw ex;
        }
    }

    /**
     * Returns the filesystem path of the syllabus for a course.
     */
    public String getSyllabusPath(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course with ID " + courseId + " not found"));
        if (course.getSyllabusPath() == null) {
            throw new RuntimeException("No syllabus found for course ID " + courseId);
        }
        return course.getSyllabusPath();
    }

    // ==================== Enrollment Operations ====================
    
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
            CourseEnrollment saved = courseEnrollmentRepository.save(enrollment);
            
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
