package com.webvibes.dto;

public class QuestionDTO {

    private Long id;
    private String prompt;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private Integer correctAnswerIndex;

    public QuestionDTO() {}

    public QuestionDTO(Long id, String prompt, String optionA, String optionB,
                       String optionC, String optionD, Integer correctAnswerIndex) {
        this.id = id;
        this.prompt = prompt;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctAnswerIndex = correctAnswerIndex;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Integer getCorrectAnswerIndex() { return correctAnswerIndex; }
    public void setCorrectAnswerIndex(Integer correctAnswerIndex) { this.correctAnswerIndex = correctAnswerIndex; }
}
