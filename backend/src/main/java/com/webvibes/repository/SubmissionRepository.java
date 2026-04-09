package com.webvibes.repository;

import com.webvibes.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    Optional<Submission> findByStudentAssessmentId(Long studentAssessmentId);

    boolean existsByStudentAssessmentId(Long studentAssessmentId);
}
