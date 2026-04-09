package com.webvibes.dto;

import java.util.List;

public class McqSubmitRequest {

    private List<AnswerDTO> answers;

    public McqSubmitRequest() {}

    public McqSubmitRequest(List<AnswerDTO> answers) {
        this.answers = answers;
    }

    public List<AnswerDTO> getAnswers() { return answers; }
    public void setAnswers(List<AnswerDTO> answers) { this.answers = answers; }
}
