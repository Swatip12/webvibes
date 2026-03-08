package com.webvibes.controller;

import com.webvibes.dto.ProjectDTO;
import com.webvibes.entity.Project;
import com.webvibes.service.ProjectService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing project showcase data.
 * Provides endpoints to retrieve all projects and add new projects.
 */
@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);
    
    private final ProjectService projectService;
    
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }
    
    /**
     * Retrieves all projects from the database.
     * 
     * @return ResponseEntity with HTTP 200 and list of ProjectDTO
     */
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        logger.info("Received request to retrieve all projects");
        
        List<ProjectDTO> projects = projectService.getAllProjects();
        
        logger.info("Returning {} projects", projects.size());
        return ResponseEntity.ok(projects);
    }
    
    /**
     * Adds a new project to the database.
     * 
     * @param dto the project data with validation
     * @return ResponseEntity with HTTP 201 and the created project
     */
    @PostMapping
    public ResponseEntity<Project> addProject(@Valid @RequestBody ProjectDTO dto) {
        logger.info("Received request to add new project: {}", dto.getTitle());
        
        Project project = projectService.saveProject(dto);
        
        logger.info("Project added successfully with ID: {}", project.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }
}
