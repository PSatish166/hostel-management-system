package com.hostel.hostel_management.repository;

import com.hostel.hostel_management.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {

}