package com.webvibes.dto;

public class AnswerDTO {

    private Long questionId;
    private Integer selectedIndex;

    public AnswerDTO() {}

    public AnswerDTO(Long questionId, Integer selectedIndex) {
        this.questionId = questionId;
        this.selectedIndex = selectedIndex;
    }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public Integer getSelectedIndex() { return selectedIndex; }
    public void setSelectedIndex(Integer selectedIndex) { this.selectedIndex = selectedIndex; }
}
