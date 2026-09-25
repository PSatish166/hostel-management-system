package com.hostel.hostel_management.controller;

import com.hostel.hostel_management.entity.Visitor;
import com.hostel.hostel_management.service.VisitorService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/visitors")
@CrossOrigin(origins = "http://localhost:4200")
public class VisitorController {

    private final VisitorService visitorService;


    public VisitorController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }


    // ==============================
    // Create Visitor
    // ADMIN only
    // ==============================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createVisitor(
            @RequestBody Visitor visitor) {

        try {

            Visitor savedVisitor =
                    visitorService.saveVisitor(visitor);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedVisitor);

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());
        }
    }


    // ==============================
    // Get All Visitors
    // ADMIN + USER
    // ==============================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Visitor>> getAllVisitors() {

        return ResponseEntity.ok(
                visitorService.getAllVisitors()
        );
    }


    // ==============================
    // Get Visitor By ID
    // ADMIN + USER
    // ==============================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getVisitorById(
            @PathVariable Long id) {

        return visitorService
                .getVisitorById(id)
                .<ResponseEntity<?>>map(
                        ResponseEntity::ok
                )
                .orElseGet(() ->
                        ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(
                                        "Visitor not found."
                                )
                );
    }


    // ==============================
    // Get Visitors By Student
    // ADMIN + USER
    // ==============================

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Visitor>>
    getVisitorsByStudentId(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                visitorService
                        .getVisitorsByStudentId(studentId)
        );
    }


    // ==============================
    // Get Visitors By Date
    // ADMIN + USER
    // ==============================

    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getVisitorsByVisitDate(
            @PathVariable String date) {

        try {

            LocalDate visitDate =
                    LocalDate.parse(date);

            return ResponseEntity.ok(
                    visitorService
                            .getVisitorsByVisitDate(
                                    visitDate
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
    // Get Visitors By Status
    // ADMIN + USER
    // ==============================

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Visitor>>
    getVisitorsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                visitorService
                        .getVisitorsByStatus(status)
        );
    }


    // ==============================
    // Update Visitor
    // ADMIN only
    // ==============================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateVisitor(
            @PathVariable Long id,
            @RequestBody Visitor visitor) {

        try {

            return visitorService
                    .updateVisitor(id, visitor)
                    .<ResponseEntity<?>>map(
                            ResponseEntity::ok
                    )
                    .orElseGet(() ->
                            ResponseEntity
                                    .status(
                                            HttpStatus.NOT_FOUND
                                    )
                                    .body(
                                            "Visitor not found."
                                    )
                    );

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());
        }
    }


    // ==============================
    // Delete Visitor
    // ADMIN only
    // ==============================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteVisitor(
            @PathVariable Long id) {

        if (!visitorService.deleteVisitor(id)) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "Visitor not found."
                    );
        }

        return ResponseEntity.ok(
                "Visitor deleted successfully."
        );
    }
}