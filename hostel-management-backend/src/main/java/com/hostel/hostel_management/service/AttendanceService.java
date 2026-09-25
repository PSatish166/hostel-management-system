package com.hostel.hostel_management.service;

import com.hostel.hostel_management.entity.Attendance;
import com.hostel.hostel_management.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public Attendance saveAttendance(Attendance attendance) {

        validateAttendance(attendance);

        if (attendance.getAttendanceDate() == null) {
            attendance.setAttendanceDate(LocalDate.now());
        }

        if (attendance.getStatus() == null ||
                attendance.getStatus().trim().isEmpty()) {
            attendance.setStatus("PRESENT");
        }

        attendance.setStatus(
                attendance.getStatus().trim().toUpperCase()
        );

        validateStatus(attendance.getStatus());

        Optional<Attendance> existingAttendance =
                attendanceRepository
                        .findByStudentIdAndAttendanceDate(
                                attendance.getStudentId(),
                                attendance.getAttendanceDate()
                        );

        if (existingAttendance.isPresent()) {
            throw new IllegalArgumentException(
                    "Attendance already exists for this student on this date."
            );
        }

        validateTimes(attendance);

        return attendanceRepository.save(attendance);
    }


    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }


    public Optional<Attendance> getAttendanceById(Long id) {
        return attendanceRepository.findById(id);
    }


    public List<Attendance> getAttendanceByStudentId(
            Long studentId
    ) {
        return attendanceRepository.findByStudentId(studentId);
    }


    public List<Attendance> getAttendanceByDate(
            LocalDate attendanceDate
    ) {
        return attendanceRepository.findByAttendanceDate(
                attendanceDate
        );
    }


    public List<Attendance> getAttendanceByStatus(
            String status
    ) {
        return attendanceRepository.findByStatus(
                status.toUpperCase()
        );
    }


    public Optional<Attendance> updateAttendance(
            Long id,
            Attendance attendance
    ) {

        return attendanceRepository.findById(id)
                .map(existingAttendance -> {

                    validateAttendance(attendance);

                    attendance.setId(id);

                    if (attendance.getAttendanceDate() == null) {
                        attendance.setAttendanceDate(
                                existingAttendance.getAttendanceDate()
                        );
                    }

                    if (attendance.getStatus() == null ||
                            attendance.getStatus().trim().isEmpty()) {

                        attendance.setStatus(
                                existingAttendance.getStatus()
                        );
                    }

                    attendance.setStatus(
                            attendance.getStatus()
                                    .trim()
                                    .toUpperCase()
                    );

                    validateStatus(
                            attendance.getStatus()
                    );

                    Optional<Attendance> duplicate =
                            attendanceRepository
                                    .findByStudentIdAndAttendanceDate(
                                            attendance.getStudentId(),
                                            attendance.getAttendanceDate()
                                    );

                    if (duplicate.isPresent() &&
                            !duplicate.get()
                                    .getId()
                                    .equals(id)) {

                        throw new IllegalArgumentException(
                                "Attendance already exists for this student on this date."
                        );
                    }

                    validateTimes(attendance);

                    return attendanceRepository.save(
                            attendance
                    );
                });
    }


    public boolean deleteAttendance(Long id) {

        if (!attendanceRepository.existsById(id)) {
            return false;
        }

        attendanceRepository.deleteById(id);

        return true;
    }


    private void validateAttendance(
            Attendance attendance
    ) {

        if (attendance.getStudentId() == null) {
            throw new IllegalArgumentException(
                    "Student ID is required."
            );
        }

        if (attendance.getAttendanceDate() == null) {
            throw new IllegalArgumentException(
                    "Attendance date is required."
            );
        }
    }


    private void validateStatus(
            String status
    ) {

        if (!status.equals("PRESENT") &&
                !status.equals("ABSENT") &&
                !status.equals("LATE") &&
                !status.equals("LEAVE")) {

            throw new IllegalArgumentException(
                    "Invalid attendance status."
            );
        }
    }


    private void validateTimes(
            Attendance attendance
    ) {

        LocalTime checkIn =
                attendance.getCheckInTime();

        LocalTime checkOut =
                attendance.getCheckOutTime();

        if (checkIn != null &&
                checkOut != null &&
                checkOut.isBefore(checkIn)) {

            throw new IllegalArgumentException(
                    "Check-out time cannot be before check-in time."
            );
        }


        String status =
                attendance.getStatus();


        if (status.equals("ABSENT") ||
                status.equals("LEAVE")) {

            attendance.setCheckInTime(null);
            attendance.setCheckOutTime(null);
        }

    }
}