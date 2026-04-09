package com.webvibes.dto;

import com.webvibes.entity.AssessmentType;
import java.time.LocalDateTime;

public class AssessmentDTO {

    private Long id;
    private AssessmentType type;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private Integer questionCount;

    public AssessmentDTO() {}

    public AssessmentDTO(Long id, AssessmentType type, String title, String description,
                         LocalDateTime createdAt, Integer questionCount) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.questionCount = questionCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AssessmentType getType() { return type; }
    public void setType(AssessmentType type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Integer getQuestionCount() { return questionCount; }
    public void setQuestionCount(Integer questionCount) { this.questionCount = questionCount; }
}
