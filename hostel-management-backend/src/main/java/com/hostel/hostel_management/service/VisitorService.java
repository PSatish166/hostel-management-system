package com.hostel.hostel_management.service;

import com.hostel.hostel_management.entity.Visitor;
import com.hostel.hostel_management.repository.VisitorRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class VisitorService {

    private final VisitorRepository visitorRepository;

    public VisitorService(VisitorRepository visitorRepository) {
        this.visitorRepository = visitorRepository;
    }


    public Visitor saveVisitor(Visitor visitor) {

        validateVisitor(visitor);

        if (visitor.getVisitDate() == null) {
            visitor.setVisitDate(LocalDate.now());
        }

        if (visitor.getStatus() == null ||
                visitor.getStatus().trim().isEmpty()) {

            visitor.setStatus("CHECKED_IN");
        }

        visitor.setStatus(
                visitor.getStatus()
                        .trim()
                        .toUpperCase()
        );

        validateStatus(visitor.getStatus());

        validateTimes(visitor);

        return visitorRepository.save(visitor);
    }


    public List<Visitor> getAllVisitors() {

        return visitorRepository.findAll();
    }


    public Optional<Visitor> getVisitorById(Long id) {

        return visitorRepository.findById(id);
    }


    public List<Visitor> getVisitorsByStudentId(
            Long studentId) {

        return visitorRepository.findByStudentId(
                studentId
        );
    }


    public List<Visitor> getVisitorsByVisitDate(
            LocalDate visitDate) {

        return visitorRepository.findByVisitDate(
                visitDate
        );
    }


    public List<Visitor> getVisitorsByStatus(
            String status) {

        return visitorRepository.findByStatus(
                status.toUpperCase()
        );
    }


    public Optional<Visitor> updateVisitor(
            Long id,
            Visitor visitor) {

        return visitorRepository.findById(id)
                .map(existingVisitor -> {

                    validateVisitor(visitor);

                    visitor.setId(id);

                    if (visitor.getVisitDate() == null) {

                        visitor.setVisitDate(
                                existingVisitor.getVisitDate()
                        );
                    }

                    if (visitor.getStatus() == null ||
                            visitor.getStatus()
                                    .trim()
                                    .isEmpty()) {

                        visitor.setStatus(
                                existingVisitor.getStatus()
                        );
                    }

                    visitor.setStatus(
                            visitor.getStatus()
                                    .trim()
                                    .toUpperCase()
                    );

                    validateStatus(
                            visitor.getStatus()
                    );

                    validateTimes(visitor);

                    return visitorRepository.save(
                            visitor
                    );
                });
    }


    public boolean deleteVisitor(Long id) {

        if (!visitorRepository.existsById(id)) {

            return false;
        }

        visitorRepository.deleteById(id);

        return true;
    }


    private void validateVisitor(
            Visitor visitor) {

        if (visitor.getStudentId() == null) {

            throw new IllegalArgumentException(
                    "Student ID is required."
            );
        }

        if (visitor.getVisitorName() == null ||
                visitor.getVisitorName()
                        .trim()
                        .isEmpty()) {

            throw new IllegalArgumentException(
                    "Visitor name is required."
            );
        }

        if (visitor.getPhone() == null ||
                visitor.getPhone()
                        .trim()
                        .isEmpty()) {

            throw new IllegalArgumentException(
                    "Visitor phone number is required."
            );
        }

        if (visitor.getVisitDate() == null) {

            visitor.setVisitDate(
                    LocalDate.now()
            );
        }

        if (visitor.getPurpose() == null ||
                visitor.getPurpose()
                        .trim()
                        .isEmpty()) {

            throw new IllegalArgumentException(
                    "Visit purpose is required."
            );
        }
    }


    private void validateStatus(
            String status) {

        if (!status.equals("CHECKED_IN") &&
                !status.equals("CHECKED_OUT") &&
                !status.equals("CANCELLED")) {

            throw new IllegalArgumentException(
                    "Invalid visitor status."
            );
        }
    }


    private void validateTimes(
            Visitor visitor) {

        LocalTime checkIn =
                visitor.getCheckInTime();

        LocalTime checkOut =
                visitor.getCheckOutTime();


        if (checkIn != null &&
                checkOut != null &&
                checkOut.isBefore(checkIn)) {

            throw new IllegalArgumentException(
                    "Check-out time cannot be before check-in time."
            );
        }


        String status =
                visitor.getStatus();


        if (status.equals("CHECKED_OUT") &&
                checkOut == null) {

            throw new IllegalArgumentException(
                    "Check-out time is required for checked-out visitors."
            );
        }


        if (status.equals("CHECKED_IN")) {

            visitor.setCheckOutTime(null);
        }


        if (status.equals("CANCELLED")) {

            visitor.setCheckInTime(null);
            visitor.setCheckOutTime(null);
        }
    }

}