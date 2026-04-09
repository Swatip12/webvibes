package com.webvibes.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_assessment_id", nullable = false, unique = true)
    private StudentAssessment studentAssessment;

    // MCQ/APTITUDE: JSON array of {questionId, selectedIndex}
    @Column(name = "answers_json", columnDefinition = "TEXT")
    private String answersJson;

    // MACHINE_TEST
    @Column(name = "solution_text", columnDefinition = "TEXT")
    private String solutionText;

    // MCQ/APTITUDE score
    @Column
    private Integer score;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    public Submission() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public StudentAssessment getStudentAssessment() { return studentAssessment; }
    public void setStudentAssessment(StudentAssessment studentAssessment) { this.studentAssessment = studentAssessment; }

    public String getAnswersJson() { return answersJson; }
    public void setAnswersJson(String answersJson) { this.answersJson = answersJson; }

    public String getSolutionText() { return solutionText; }
    public void setSolutionText(String solutionText) { this.solutionText = solutionText; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
