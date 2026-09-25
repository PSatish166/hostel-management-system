package com.hostel.hostel_management.service;

import com.hostel.hostel_management.entity.Allocation;
import com.hostel.hostel_management.entity.Room;
import com.hostel.hostel_management.repository.AllocationRepository;
import com.hostel.hostel_management.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AllocationService {

    private final AllocationRepository allocationRepository;
    private final RoomRepository roomRepository;

    public AllocationService(
            AllocationRepository allocationRepository,
            RoomRepository roomRepository
    ) {
        this.allocationRepository = allocationRepository;
        this.roomRepository = roomRepository;
    }

    // =========================================================
    // ADD ALLOCATION
    // =========================================================

    @Transactional
    public Allocation saveAllocation(Allocation allocation) {

        if (allocation.getStatus() == null
                || allocation.getStatus().isBlank()) {

            allocation.setStatus("ACTIVE");
        }

        allocation.setStatus(
                allocation.getStatus().toUpperCase()
        );

        // -----------------------------------------------------
        // Validate room
        // -----------------------------------------------------

        Room room = roomRepository
                .findById(allocation.getRoomId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Room not found."
                        )
                );

        // -----------------------------------------------------
        // Do not allow allocation to maintenance room
        // -----------------------------------------------------

        if ("MAINTENANCE".equalsIgnoreCase(
                room.getStatus()
        )) {

            throw new IllegalArgumentException(
                    "This room is under maintenance."
            );
        }

        // -----------------------------------------------------
        // If ACTIVE, validate student and bed
        // -----------------------------------------------------

        if ("ACTIVE".equalsIgnoreCase(
                allocation.getStatus()
        )) {

            // Prevent same student from having another
            // active allocation
            boolean studentAlreadyAllocated =
                    allocationRepository.findAll()
                            .stream()
                            .anyMatch(existing ->
                                    existing.getStudentId()
                                            .equals(
                                                    allocation.getStudentId()
                                            )
                                            &&
                                    "ACTIVE".equalsIgnoreCase(
                                            existing.getStatus()
                                    )
                            );

            if (studentAlreadyAllocated) {

                throw new IllegalArgumentException(
                        "This student already has an active room allocation."
                );
            }

            // -------------------------------------------------
            // Check room capacity
            // -------------------------------------------------

            int capacity =
                    room.getCapacity() == null
                            ? 0
                            : room.getCapacity();

            int occupied =
                    allocationRepository.findAll()
                            .stream()
                            .filter(existing ->
                                    existing.getRoomId()
                                            .equals(
                                                    allocation.getRoomId()
                                            )
                                            &&
                                    "ACTIVE".equalsIgnoreCase(
                                            existing.getStatus()
                                    )
                            )
                            .toList()
                            .size();

            if (occupied >= capacity) {

                throw new IllegalArgumentException(
                        "This room is already full."
                );
            }

            // -------------------------------------------------
            // Check duplicate bed
            // -------------------------------------------------

            String requestedBed =
                    allocation.getBedNumber()
                            .trim()
                            .toUpperCase();

            boolean bedAlreadyAllocated =
                    allocationRepository.findAll()
                            .stream()
                            .anyMatch(existing ->

                                    existing.getRoomId()
                                            .equals(
                                                    allocation.getRoomId()
                                            )

                                            &&

                                    "ACTIVE".equalsIgnoreCase(
                                            existing.getStatus()
                                    )

                                            &&

                                    requestedBed.equals(
                                            existing.getBedNumber()
                                                    .trim()
                                                    .toUpperCase()
                                    )
                            );

            if (bedAlreadyAllocated) {

                throw new IllegalArgumentException(
                        "This bed is already occupied."
                );
            }

            allocation.setBedNumber(
                    requestedBed
            );
        }

        // -----------------------------------------------------
        // Save allocation
        // -----------------------------------------------------

        Allocation savedAllocation =
                allocationRepository.save(
                        allocation
                );

        // -----------------------------------------------------
        // Synchronize room occupancy
        // -----------------------------------------------------

        syncRoomOccupancy(
                allocation.getRoomId()
        );

        return savedAllocation;
    }


    // =========================================================
    // GET ALL ALLOCATIONS
    // =========================================================

    public List<Allocation> getAllAllocations() {

        return allocationRepository.findAll();
    }


    // =========================================================
    // GET ALLOCATION BY ID
    // =========================================================

    public Optional<Allocation> getAllocationById(
            Long id
    ) {

        return allocationRepository.findById(id);
    }


    // =========================================================
    // UPDATE ALLOCATION
    // =========================================================

    @Transactional
    public Optional<Allocation> updateAllocation(
            Long id,
            Allocation allocation
    ) {

        return allocationRepository
                .findById(id)
                .map(existingAllocation -> {

                    // -------------------------------------------------
                    // Store old room
                    // -------------------------------------------------

                    Long oldRoomId =
                            existingAllocation.getRoomId();

                    // -------------------------------------------------
                    // Normalize status
                    // -------------------------------------------------

                    if (allocation.getStatus() == null
                            || allocation.getStatus().isBlank()) {

                        allocation.setStatus("ACTIVE");
                    }

                    allocation.setStatus(
                            allocation.getStatus()
                                    .toUpperCase()
                    );

                    // -------------------------------------------------
                    // Validate new room
                    // -------------------------------------------------

                    Room newRoom =
                            roomRepository
                                    .findById(
                                            allocation.getRoomId()
                                    )
                                    .orElseThrow(() ->
                                            new IllegalArgumentException(
                                                    "Room not found."
                                            )
                                    );

                    if ("MAINTENANCE".equalsIgnoreCase(
                            newRoom.getStatus()
                    )) {

                        throw new IllegalArgumentException(
                                "This room is under maintenance."
                        );
                    }

                    // -------------------------------------------------
                    // ACTIVE allocation validations
                    // -------------------------------------------------

                    if ("ACTIVE".equalsIgnoreCase(
                            allocation.getStatus()
                    )) {

                        // ---------------------------------------------
                        // Check another active allocation for student
                        // ---------------------------------------------

                        boolean studentAlreadyAllocated =
                                allocationRepository
                                        .findAll()
                                        .stream()
                                        .anyMatch(other ->

                                                !other.getId()
                                                        .equals(id)

                                                        &&

                                                other.getStudentId()
                                                        .equals(
                                                                allocation
                                                                        .getStudentId()
                                                        )

                                                        &&

                                                "ACTIVE".equalsIgnoreCase(
                                                        other.getStatus()
                                                )
                                        );

                        if (studentAlreadyAllocated) {

                            throw new IllegalArgumentException(
                                    "This student already has an active room allocation."
                            );
                        }

                        // ---------------------------------------------
                        // Check room capacity
                        // ---------------------------------------------

                        int capacity =
                                newRoom.getCapacity() == null
                                        ? 0
                                        : newRoom.getCapacity();

                        long occupied =
                                allocationRepository
                                        .findAll()
                                        .stream()
                                        .filter(other ->

                                                !other.getId()
                                                        .equals(id)

                                                        &&

                                                other.getRoomId()
                                                        .equals(
                                                                allocation
                                                                        .getRoomId()
                                                        )

                                                        &&

                                                "ACTIVE".equalsIgnoreCase(
                                                        other.getStatus()
                                                )
                                        )
                                        .count();

                        if (occupied >= capacity) {

                            throw new IllegalArgumentException(
                                    "This room is already full."
                            );
                        }

                        // ---------------------------------------------
                        // Check duplicate bed
                        // ---------------------------------------------

                        String requestedBed =
                                allocation.getBedNumber()
                                        .trim()
                                        .toUpperCase();

                        boolean bedAlreadyAllocated =
                                allocationRepository
                                        .findAll()
                                        .stream()
                                        .anyMatch(other ->

                                                !other.getId()
                                                        .equals(id)

                                                        &&

                                                other.getRoomId()
                                                        .equals(
                                                                allocation
                                                                        .getRoomId()
                                                        )

                                                        &&

                                                "ACTIVE".equalsIgnoreCase(
                                                        other.getStatus()
                                                )

                                                        &&

                                                requestedBed.equals(
                                                        other.getBedNumber()
                                                                .trim()
                                                                .toUpperCase()
                                                )
                                        );

                        if (bedAlreadyAllocated) {

                            throw new IllegalArgumentException(
                                    "This bed is already occupied."
                            );
                        }

                        allocation.setBedNumber(
                                requestedBed
                        );
                    }

                    // -------------------------------------------------
                    // Preserve ID
                    // -------------------------------------------------

                    allocation.setId(id);

                    // -------------------------------------------------
                    // Save updated allocation
                    // -------------------------------------------------

                    Allocation updatedAllocation =
                            allocationRepository.save(
                                    allocation
                            );

                    // -------------------------------------------------
                    // Synchronize old room
                    // -------------------------------------------------

                    syncRoomOccupancy(
                            oldRoomId
                    );

                    // -------------------------------------------------
                    // Synchronize new room
                    // -------------------------------------------------

                    if (!oldRoomId.equals(
                            allocation.getRoomId()
                    )) {

                        syncRoomOccupancy(
                                allocation.getRoomId()
                        );
                    }

                    return updatedAllocation;
                });
    }


    // =========================================================
    // DELETE ALLOCATION
    // =========================================================

    @Transactional
    public boolean deleteAllocation(
            Long id
    ) {

        Optional<Allocation> allocation =
                allocationRepository.findById(id);

        if (allocation.isEmpty()) {
            return false;
        }

        Long roomId =
                allocation.get().getRoomId();

        allocationRepository.deleteById(id);

        // -----------------------------------------------------
        // Recalculate room occupancy after deletion
        // -----------------------------------------------------

        syncRoomOccupancy(roomId);

        return true;
    }


    // =========================================================
    // SYNCHRONIZE ONE ROOM
    // =========================================================

    private void syncRoomOccupancy(
            Long roomId
    ) {

        if (roomId == null) {
            return;
        }

        Optional<Room> roomOptional =
                roomRepository.findById(roomId);

        if (roomOptional.isEmpty()) {
            return;
        }

        Room room =
                roomOptional.get();

        int capacity =
                room.getCapacity() == null
                        ? 0
                        : room.getCapacity();

        // -----------------------------------------------------
        // Count ACTIVE allocations from allocation table
        // -----------------------------------------------------

        int actualOccupiedBeds =
                (int) allocationRepository
                        .findAll()
                        .stream()
                        .filter(allocation ->

                                roomId.equals(
                                        allocation.getRoomId()
                                )

                                        &&

                                "ACTIVE".equalsIgnoreCase(
                                        allocation.getStatus()
                                )
                        )
                        .count();

        // -----------------------------------------------------
        // Never allow occupied count above capacity
        // -----------------------------------------------------

        actualOccupiedBeds =
                Math.min(
                        actualOccupiedBeds,
                        capacity
                );

        room.setOccupiedBeds(
                actualOccupiedBeds
        );

        // -----------------------------------------------------
        // Automatically calculate status
        // -----------------------------------------------------

        if (actualOccupiedBeds <= 0) {

            room.setStatus("AVAILABLE");

        } else if (actualOccupiedBeds < capacity) {

            room.setStatus("PARTIAL");

        } else {

            room.setStatus("FULL");
        }

        roomRepository.save(room);

        System.out.println(
                "Room occupancy synchronized: "
                        + room.getRoomNumber()
                        + " | Capacity: "
                        + capacity
                        + " | Occupied: "
                        + actualOccupiedBeds
                        + " | Status: "
                        + room.getStatus()
        );
    }
}