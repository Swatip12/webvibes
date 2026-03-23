package com.webvibes.controller;

import com.webvibes.dto.MessageResponse;
import com.webvibes.dto.ProjectDTO;
import com.webvibes.entity.Project;
import com.webvibes.service.ProjectService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/projects")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProjectController {

    private static final Logger logger = LoggerFactory.getLogger(AdminProjectController.class);

    private final ProjectService projectService;

    public AdminProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectDTO dto) {
        logger.info("Admin creating project: {}", dto.getTitle());
        Project saved = projectService.saveProject(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteProject(@PathVariable Long id) {
        logger.info("Admin deleting project ID: {}", id);
        projectService.deleteProject(id);
        return ResponseEntity.ok(new MessageResponse("Project deleted successfully"));
    }
}
