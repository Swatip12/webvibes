package com.webvibes.repository;

import com.webvibes.entity.InternshipApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipApplicationRepository extends JpaRepository<InternshipApplication, Long> {
    
    List<InternshipApplication> findAllByOrderBySubmittedAtDesc();
}
