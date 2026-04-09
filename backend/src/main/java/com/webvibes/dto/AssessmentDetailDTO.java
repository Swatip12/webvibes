package com.webvibes.dto;

import com.webvibes.entity.AssessmentType;
import java.time.LocalDateTime;

public class AssessmentDetailDTO {

    private Long id;
    private String title;
    private String description;
    private AssessmentType type;
    private LocalDateTime scheduledAt;
    private String videoLink;
    private String problemStatement;
    private Integer timeLimitMinutes;
    private LocalDateTime createdAt;

    public AssessmentDetailDTO() {}

    public AssessmentDetailDTO(Long id, String title, String description, AssessmentType type,
                               LocalDateTime scheduledAt, String videoLink, String problemStatement,
                               Integer timeLimitMinutes, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.scheduledAt = scheduledAt;
        this.videoLink = videoLink;
        this.problemStatement = problemStatement;
        this.timeLimitMinutes = timeLimitMinutes;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public AssessmentType getType() { return type; }
    public void setType(AssessmentType type) { this.type = type; }

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public String getVideoLink() { return videoLink; }
    public void setVideoLink(String videoLink) { this.videoLink = videoLink; }

    public String getProblemStatement() { return problemStatement; }
    public void setProblemStatement(String problemStatement) { this.problemStatement = problemStatement; }

    public Integer getTimeLimitMinutes() { return timeLimitMinutes; }
    public void setTimeLimitMinutes(Integer timeLimitMinutes) { this.timeLimitMinutes = timeLimitMinutes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
