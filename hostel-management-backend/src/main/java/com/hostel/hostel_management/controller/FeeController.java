package com.hostel.hostel_management.controller;

import com.hostel.hostel_management.entity.Fee;
import com.hostel.hostel_management.service.FeeService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin(origins = "http://localhost:4200")
public class FeeController {

    private final FeeService feeService;


    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }


    // ==============================
    // Create Fee
    // ADMIN only
    // ==============================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createFee(
            @RequestBody Fee fee) {

        try {

            Fee savedFee =
                    feeService.saveFee(fee);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedFee);

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());
        }
    }


    // ==============================
    // Get All Fees
    // ADMIN + USER
    // ==============================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Fee>> getAllFees() {

        return ResponseEntity.ok(
                feeService.getAllFees()
        );
    }


    // ==============================
    // Get Fee By ID
    // ADMIN + USER
    // ==============================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getFeeById(
            @PathVariable Long id) {

        return feeService.getFeeById(id)
                .<ResponseEntity<?>>map(
                        ResponseEntity::ok
                )
                .orElseGet(
                        () -> ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body("Fee not found.")
                );
    }


    // ==============================
    // Get Fees By Student ID
    // ADMIN + USER
    // ==============================

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Fee>> getFeesByStudentId(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                feeService.getFeesByStudentId(studentId)
        );
    }


    // ==============================
    // Get Fees By Status
    // ADMIN + USER
    // ==============================

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Fee>> getFeesByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                feeService.getFeesByStatus(
                        status.toUpperCase()
                )
        );
    }


    // ==============================
    // Update Fee
    // ADMIN only
    // ==============================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateFee(
            @PathVariable Long id,
            @RequestBody Fee fee) {

        try {

            return feeService.updateFee(id, fee)
                    .<ResponseEntity<?>>map(
                            ResponseEntity::ok
                    )
                    .orElseGet(
                            () -> ResponseEntity
                                    .status(HttpStatus.NOT_FOUND)
                                    .body("Fee not found.")
                    );

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());
        }
    }


    // ==============================
    // Delete Fee
    // ADMIN only
    // ==============================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFee(
            @PathVariable Long id) {

        if (!feeService.deleteFee(id)) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Fee not found.");
        }

        return ResponseEntity.ok(
                "Fee deleted successfully."
        );
    }
}