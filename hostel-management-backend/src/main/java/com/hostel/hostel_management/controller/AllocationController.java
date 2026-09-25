package com.hostel.hostel_management.controller;

import com.hostel.hostel_management.entity.Allocation;
import com.hostel.hostel_management.service.AllocationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
@CrossOrigin(origins = "http://localhost:4200")
public class AllocationController {

    private final AllocationService allocationService;


    public AllocationController(AllocationService allocationService) {
        this.allocationService = allocationService;
    }


    // ==============================
    // Add Allocation
    // ADMIN only
    // ==============================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Allocation> addAllocation(
            @RequestBody Allocation allocation) {

        Allocation savedAllocation =
                allocationService.saveAllocation(allocation);

        return ResponseEntity.ok(savedAllocation);
    }


    // ==============================
    // Get All Allocations
    // ADMIN + USER
    // ==============================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Allocation>> getAllAllocations() {

        return ResponseEntity.ok(
                allocationService.getAllAllocations()
        );
    }


    // ==============================
    // Get Allocation By ID
    // ADMIN + USER
    // ==============================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Allocation> getAllocationById(
            @PathVariable Long id) {

        return allocationService.getAllocationById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // ==============================
    // Update Allocation
    // ADMIN only
    // ==============================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Allocation> updateAllocation(
            @PathVariable Long id,
            @RequestBody Allocation allocation) {

        return allocationService.updateAllocation(
                id,
                allocation
        )
        .map(ResponseEntity::ok)
        .orElse(
                ResponseEntity.notFound().build()
        );
    }


    // ==============================
    // Delete Allocation
    // ADMIN only
    // ==============================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAllocation(
            @PathVariable Long id) {

        boolean deleted =
                allocationService.deleteAllocation(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}