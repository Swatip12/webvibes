package com.webvibes.dto;

import com.webvibes.entity.AssessmentStatus;
import java.time.LocalDateTime;

public class ResultDTO {

    private Long studentAssessmentId;
    private String studentName;
    private String studentEmail;
    private AssessmentStatus status;
    private Integer score;
    private Integer total;
    private String solutionText;
    private LocalDateTime scheduledAt;
    private LocalDateTime submittedAt;

    public ResultDTO() {}

    public ResultDTO(Long studentAssessmentId, String studentName, String studentEmail,
                     AssessmentStatus status, Integer score, Integer total,
                     String solutionText, LocalDateTime scheduledAt, LocalDateTime submittedAt) {
        this.studentAssessmentId = studentAssessmentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.status = status;
        this.score = score;
        this.total = total;
        this.solutionText = solutionText;
        this.scheduledAt = scheduledAt;
        this.submittedAt = submittedAt;
    }

    public Long getStudentAssessmentId() { return studentAssessmentId; }
    public void setStudentAssessmentId(Long studentAssessmentId) { this.studentAssessmentId = studentAssessmentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public AssessmentStatus getStatus() { return status; }
    public void setStatus(AssessmentStatus status) { this.status = status; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }

    public String getSolutionText() { return solutionText; }
    public void setSolutionText(String solutionText) { this.solutionText = solutionText; }

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
