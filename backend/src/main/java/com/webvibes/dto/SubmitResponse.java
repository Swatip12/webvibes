package com.webvibes.dto;

import com.webvibes.entity.AssessmentStatus;

public class SubmitResponse {

    private Integer score;
    private Integer total;
    private AssessmentStatus status;

    public SubmitResponse() {}

    public SubmitResponse(Integer score, Integer total, AssessmentStatus status) {
        this.score = score;
        this.total = total;
        this.status = status;
    }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }

    public AssessmentStatus getStatus() { return status; }
    public void setStatus(AssessmentStatus status) { this.status = status; }
}
