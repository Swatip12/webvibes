package com.webvibes.dto;

import java.util.List;

public class AssignRequest {

    private List<Long> studentIds;
    private String batchName;

    public AssignRequest() {}

    public List<Long> getStudentIds() { return studentIds; }
    public void setStudentIds(List<Long> studentIds) { this.studentIds = studentIds; }

    public String getBatchName() { return batchName; }
    public void setBatchName(String batchName) { this.batchName = batchName; }
}
