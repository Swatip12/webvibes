package com.webvibes.repository;

import com.webvibes.entity.AssessmentStatus;
import com.webvibes.entity.AssessmentType;
import com.webvibes.entity.StudentAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentAssessmentRepository extends JpaRepository<StudentAssessment, Long> {

    List<StudentAssessment> findByStudentId(Long studentId);

    Optional<StudentAssessment> findByStudentIdAndAssessmentId(Long studentId, Long assessmentId);

    List<StudentAssessment> findByAssessmentId(Long assessmentId);

    boolean existsByStudentIdAndAssessmentId(Long studentId, Long assessmentId);

    List<StudentAssessment> findByAssessmentType(AssessmentType type);

    List<StudentAssessment> findByStatus(AssessmentStatus status);

    List<StudentAssessment> findByAssessmentTypeAndStatus(AssessmentType type, AssessmentStatus status);
}
