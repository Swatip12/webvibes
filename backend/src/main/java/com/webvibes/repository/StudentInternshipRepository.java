package com.webvibes.repository;

import com.webvibes.entity.StudentInternship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentInternshipRepository extends JpaRepository<StudentInternship, Long> {

    Optional<StudentInternship> findByStudentId(Long studentId);

    Optional<StudentInternship> findByStudentEmail(String email);
}
