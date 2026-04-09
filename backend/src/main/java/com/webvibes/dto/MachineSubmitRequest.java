package com.webvibes.dto;

import jakarta.validation.constraints.Size;

public class MachineSubmitRequest {

    @Size(min = 10, message = "Solution must be at least 10 characters")
    private String solutionText;

    public MachineSubmitRequest() {}

    public MachineSubmitRequest(String solutionText) {
        this.solutionText = solutionText;
    }

    public String getSolutionText() { return solutionText; }
    public void setSolutionText(String solutionText) { this.solutionText = solutionText; }
}
