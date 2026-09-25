package com.hostel.hostel_management.repository;

import com.hostel.hostel_management.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    List<Visitor> findByStudentId(Long studentId);

    List<Visitor> findByVisitDate(LocalDate visitDate);

    List<Visitor> findByStatus(String status);

}