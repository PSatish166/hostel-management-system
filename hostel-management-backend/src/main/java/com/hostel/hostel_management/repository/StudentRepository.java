package com.hostel.hostel_management.repository;

import com.hostel.hostel_management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

}