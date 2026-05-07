package com.webvibes.dto;

import com.webvibes.entity.AssessmentStatus;
import com.webvibes.entity.AssessmentType;
import java.time.LocalDateTime;

public class StudentAssessmentDTO {

    private Long studentAssessmentId;
    private Long assessmentId;
    private String title;
    private AssessmentType type;
    private AssessmentStatus status;
    private LocalDateTime scheduledAt;
    private Integer timeLimitMinutes;
    private Integer score;        // marks scored (marksPerQuestion * correct)
    private Integer totalMarks;   // total possible marks
    private Integer correctAnswers;
    private Integer totalQuestions;

    public StudentAssessmentDTO() {}

    public StudentAssessmentDTO(Long studentAssessmentId, Long assessmentId, String title,
                                AssessmentType type, AssessmentStatus status,
                                LocalDateTime scheduledAt, Integer timeLimitMinutes) {
        this.studentAssessmentId = studentAssessmentId;
        this.assessmentId = assessmentId;
        this.title = title;
        this.type = type;
        this.status = status;
        this.scheduledAt = scheduledAt;
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public Long getStudentAssessmentId() { return studentAssessmentId; }
    public void setStudentAssessmentId(Long studentAssessmentId) { this.studentAssessmentId = studentAssessmentId; }

    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public AssessmentType getType() { return type; }
    public void setType(AssessmentType type) { this.type = type; }

    public AssessmentStatus getStatus() { return status; }
    public void setStatus(AssessmentStatus status) { this.status = status; }

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public Integer getTimeLimitMinutes() { return timeLimitMinutes; }
    public void setTimeLimitMinutes(Integer timeLimitMinutes) { this.timeLimitMinutes = timeLimitMinutes; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }

    public Integer getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(Integer correctAnswers) { this.correctAnswers = correctAnswers; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
}
