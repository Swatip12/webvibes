package com.webvibes.dto;

public class QuestionStudentDTO {

    private Long questionId;
    private String prompt;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    public QuestionStudentDTO() {}

    public QuestionStudentDTO(Long questionId, String prompt,
                              String optionA, String optionB, String optionC, String optionD) {
        this.questionId = questionId;
        this.prompt = prompt;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
    }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getOptionA() { return optionA; }
    public void setOptionA(String optionA) { this.optionA = optionA; }

    public String getOptionB() { return optionB; }
    public void setOptionB(String optionB) { this.optionB = optionB; }

    public String getOptionC() { return optionC; }
    public void setOptionC(String optionC) { this.optionC = optionC; }

    public String getOptionD() { return optionD; }
    public void setOptionD(String optionD) { this.optionD = optionD; }
}
