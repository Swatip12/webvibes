package com.webvibes.dto;

import com.webvibes.entity.AssessmentStatus;

public class UpdateStatusRequest {

    private AssessmentStatus status;

    public UpdateStatusRequest() {}

    public UpdateStatusRequest(AssessmentStatus status) {
        this.status = status;
    }

    public AssessmentStatus getStatus() { return status; }
    public void setStatus(AssessmentStatus status) { this.status = status; }
}
