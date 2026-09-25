package com.hostel.hostel_management.repository;

import com.hostel.hostel_management.entity.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AllocationRepository extends JpaRepository<Allocation, Long> {
}