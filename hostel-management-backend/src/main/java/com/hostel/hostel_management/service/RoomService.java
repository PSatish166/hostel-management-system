package com.hostel.hostel_management.service;

import com.hostel.hostel_management.entity.Room;
import com.hostel.hostel_management.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // Add room
    public Room saveRoom(Room room) {
        if (room.getOccupiedBeds() == null) {
            room.setOccupiedBeds(0);
        }

        updateStatus(room);

        return roomRepository.save(room);
    }

    // Get all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // Get room by ID
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    // Update room
    public Optional<Room> updateRoom(Long id, Room room) {

        return roomRepository.findById(id)
                .map(existingRoom -> {

                    room.setId(id);

                    if (room.getOccupiedBeds() == null) {
                        room.setOccupiedBeds(0);
                    }

                    updateStatus(room);

                    return roomRepository.save(room);
                });
    }

    // Delete room
    public boolean deleteRoom(Long id) {

        if (!roomRepository.existsById(id)) {
            return false;
        }

        roomRepository.deleteById(id);

        return true;
    }

    // Automatically determine room status
    private void updateStatus(Room room) {

        int capacity = room.getCapacity() == null
                ? 0
                : room.getCapacity();

        int occupied = room.getOccupiedBeds() == null
                ? 0
                : room.getOccupiedBeds();

        if (occupied <= 0) {

            room.setStatus("AVAILABLE");

        } else if (occupied < capacity) {

            room.setStatus("PARTIAL");

        } else {

            room.setStatus("FULL");

        }
    }
}