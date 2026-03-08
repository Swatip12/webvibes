package com.webvibes.repository;

import com.webvibes.entity.InternshipApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InternshipRepository extends JpaRepository<InternshipApplication, Long> {
}
