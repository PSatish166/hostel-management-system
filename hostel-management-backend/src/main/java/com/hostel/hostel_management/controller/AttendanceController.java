package com.hostel.hostel_management.controller;

import com.hostel.hostel_management.entity.Attendance;
import com.hostel.hostel_management.service.AttendanceService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:4200")
public class AttendanceController {

    private final AttendanceService attendanceService;


    public AttendanceController(
            AttendanceService attendanceService) {

        this.attendanceService = attendanceService;
    }


    // ==============================
    // Create Attendance
    // ADMIN only
    // ==============================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAttendance(
            @RequestBody Attendance attendance) {

        try {

            Attendance savedAttendance =
                    attendanceService.saveAttendance(
                            attendance
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedAttendance);

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());
        }
    }


    // ==============================
    // Get All Attendance
    // ADMIN + USER
    // ==============================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Attendance>>
    getAllAttendance() {

        return ResponseEntity.ok(
                attendanceService.getAllAttendance()
        );
    }


    // ==============================
    // Get Attendance By ID
    // ADMIN + USER
    // ==============================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getAttendanceById(
            @PathVariable Long id) {

        return attendanceService
                .getAttendanceById(id)
                .<ResponseEntity<?>>map(
                        ResponseEntity::ok
                )
                .orElseGet(
                        () -> ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(
                                        "Attendance record not found."
                                )
                );
    }


    // ==============================
    // Get Attendance By Student
    // ADMIN + USER
    // ==============================

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Attendance>>
    getAttendanceByStudentId(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                attendanceService
                        .getAttendanceByStudentId(
                                studentId
                        )
        );
    }


    // ==============================
    // Get Attendance By Date
    // ADMIN + USER
    // ==============================

    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getAttendanceByDate(
            @PathVariable String date) {

        try {

            LocalDate attendanceDate =
                    LocalDate.parse(date);

            return ResponseEntity.ok(
                    attendanceService
                            .getAttendanceByDate(
                                    attendanceDate
                            )
            );

        } catch (Exception error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Invalid date format. Use YYYY-MM-DD."
                    );
        }
    }


    // ==============================
    // Get Attendance By Status
    // ADMIN + USER
    // ==============================

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Attendance>>
    getAttendanceByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                attendanceService
                        .getAttendanceByStatus(
                                status
                        )
        );
    }


    // ==============================
    // Update Attendance
    // ADMIN only
    // ==============================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAttendance(
            @PathVariable Long id,
            @RequestBody Attendance attendance) {

        try {

            return attendanceService
                    .updateAttendance(
                            id,
                            attendance
                    )
                    .<ResponseEntity<?>>map(
                            ResponseEntity::ok
                    )
                    .orElseGet(
                            () -> ResponseEntity
                                    .status(
                                            HttpStatus.NOT_FOUND
                                    )
                                    .body(
                                            "Attendance record not found."
                                    )
                    );

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());
        }
    }


    // ==============================
    // Delete Attendance
    // ADMIN only
    // ==============================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAttendance(
            @PathVariable Long id) {

        if (!attendanceService.deleteAttendance(id)) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "Attendance record not found."
                    );
        }

        return ResponseEntity.ok(
                "Attendance deleted successfully."
        );
    }
}