package com.webvibes.dto;

import java.util.List;

public class AssignResponse {

    private int assigned;
    private List<Long> skippedIds;
    private List<Long> alreadyAssigned;

    public AssignResponse() {}

    public AssignResponse(int assigned, List<Long> skippedIds, List<Long> alreadyAssigned) {
        this.assigned = assigned;
        this.skippedIds = skippedIds;
        this.alreadyAssigned = alreadyAssigned;
    }

    public int getAssigned() { return assigned; }
    public void setAssigned(int assigned) { this.assigned = assigned; }

    public List<Long> getSkippedIds() { return skippedIds; }
    public void setSkippedIds(List<Long> skippedIds) { this.skippedIds = skippedIds; }

    public List<Long> getAlreadyAssigned() { return alreadyAssigned; }
    public void setAlreadyAssigned(List<Long> alreadyAssigned) { this.alreadyAssigned = alreadyAssigned; }
}
