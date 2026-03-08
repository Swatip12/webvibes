package com.webvibes.service;

import com.webvibes.dto.ProjectDTO;
import com.webvibes.entity.Project;
import com.webvibes.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    
    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);
    
    private final ProjectRepository projectRepository;
    
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }
    
    /**
     * Saves a project by converting DTO to entity and persisting to database.
     * 
     * @param dto the project data transfer object
     * @return the saved Project entity
     * @throws RuntimeException if database operation fails
     */
    public Project saveProject(ProjectDTO dto) {
        try {
            logger.info("Processing project submission: {}", dto.getTitle());
            
            // Convert DTO to entity
            Project project = new Project();
            project.setTitle(dto.getTitle());
            project.setDescription(dto.getDescription());
            project.setGithubLink(dto.getGithubLink());
            project.setImageUrl(dto.getImageUrl());
            project.setCreatedAt(LocalDateTime.now());
            
            // Save to repository
            Project saved = projectRepository.save(project);
            
            logger.info("Project saved successfully with ID: {}", saved.getId());
            return saved;
            
        } catch (DataAccessException ex) {
            logger.error("Database error while saving project: {}", 
                        dto.getTitle(), ex);
            throw new RuntimeException("Failed to save project", ex);
        } catch (Exception ex) {
            logger.error("Unexpected error while saving project: {}", 
                        dto.getTitle(), ex);
            throw new RuntimeException("An unexpected error occurred while processing the project", ex);
        }
    }
    
    /**
     * Retrieves all projects from the database and converts them to DTOs.
     * 
     * @return list of ProjectDTO objects
     * @throws RuntimeException if database operation fails
     */
    public List<ProjectDTO> getAllProjects() {
        try {
            logger.info("Retrieving all projects");
            
            List<Project> projects = projectRepository.findAll();
            List<ProjectDTO> projectDTOs = projects.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
            
            logger.info("Retrieved {} projects", projectDTOs.size());
            return projectDTOs;
            
        } catch (DataAccessException ex) {
            logger.error("Database error while retrieving projects", ex);
            throw new RuntimeException("Failed to retrieve projects", ex);
        } catch (Exception ex) {
            logger.error("Unexpected error while retrieving projects", ex);
            throw new RuntimeException("An unexpected error occurred while retrieving projects", ex);
        }
    }
    
    /**
     * Converts a Project entity to a ProjectDTO.
     * 
     * @param project the Project entity
     * @return the ProjectDTO
     */
    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setGithubLink(project.getGithubLink());
        dto.setImageUrl(project.getImageUrl());
        return dto;
    }
}
