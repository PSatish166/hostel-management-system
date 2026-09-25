package com.hostel.hostel_management.repository;

import com.hostel.hostel_management.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

    List<Attendance> findByStatus(String status);

    Optional<Attendance> findByStudentIdAndAttendanceDate(
            Long studentId,
            LocalDate attendanceDate
    );
}