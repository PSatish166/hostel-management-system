package com.hostel.hostel_management.controller;

import com.hostel.hostel_management.entity.Complaint;
import com.hostel.hostel_management.service.ComplaintService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:4200")
public class ComplaintController {

    private final ComplaintService complaintService;


    public ComplaintController(
            ComplaintService complaintService) {

        this.complaintService =
                complaintService;
    }


    // ==============================
    // Create Complaint
    // ADMIN + USER
    // ==============================

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> createComplaint(
            @RequestBody Complaint complaint) {

        try {

            Complaint savedComplaint =
                    complaintService.saveComplaint(
                            complaint
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedComplaint);

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());
        }
    }


    // ==============================
    // Get All Complaints
    // ADMIN + USER
    // ==============================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Complaint>>
    getAllComplaints() {

        return ResponseEntity.ok(
                complaintService.getAllComplaints()
        );
    }


    // ==============================
    // Get Complaint By ID
    // ADMIN + USER
    // ==============================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getComplaintById(
            @PathVariable Long id) {

        return complaintService
                .getComplaintById(id)
                .<ResponseEntity<?>>map(
                        ResponseEntity::ok
                )
                .orElseGet(
                        () -> ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(
                                        "Complaint not found."
                                )
                );
    }


    // ==============================
    // Get Complaints By Student
    // ADMIN + USER
    // ==============================

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Complaint>>
    getComplaintsByStudentId(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                complaintService
                        .getComplaintsByStudentId(
                                studentId
                        )
        );
    }


    // ==============================
    // Get Complaints By Status
    // ADMIN + USER
    // ==============================

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Complaint>>
    getComplaintsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                complaintService
                        .getComplaintsByStatus(
                                status
                        )
        );
    }


    // ==============================
    // Get Complaints By Priority
    // ADMIN + USER
    // ==============================

    @GetMapping("/priority/{priority}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Complaint>>
    getComplaintsByPriority(
            @PathVariable String priority) {

        return ResponseEntity.ok(
                complaintService
                        .getComplaintsByPriority(
                                priority
                        )
        );
    }


    // ==============================
    // Update Complaint
    // ADMIN only
    // ==============================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateComplaint(
            @PathVariable Long id,
            @RequestBody Complaint complaint) {

        try {

            return complaintService
                    .updateComplaint(
                            id,
                            complaint
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
                                            "Complaint not found."
                                    )
                    );

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            error.getMessage()
                    );
        }
    }


    // ==============================
    // Delete Complaint
    // ADMIN only
    // ==============================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteComplaint(
            @PathVariable Long id) {

        if (!complaintService.deleteComplaint(id)) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "Complaint not found."
                    );
        }

        return ResponseEntity.ok(
                "Complaint deleted successfully."
        );
    }
}