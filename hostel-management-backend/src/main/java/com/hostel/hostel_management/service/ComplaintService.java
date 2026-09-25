package com.hostel.hostel_management.service;

import com.hostel.hostel_management.entity.Complaint;
import com.hostel.hostel_management.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }


    public Complaint saveComplaint(Complaint complaint) {

        validateComplaint(complaint);

        if (complaint.getComplaintDate() == null) {
            complaint.setComplaintDate(LocalDate.now());
        }

        if (complaint.getPriority() == null ||
                complaint.getPriority().trim().isEmpty()) {

            complaint.setPriority("MEDIUM");

        }

        if (complaint.getStatus() == null ||
                complaint.getStatus().trim().isEmpty()) {

            complaint.setStatus("OPEN");

        }

        complaint.setPriority(
                complaint.getPriority().toUpperCase()
        );

        complaint.setStatus(
                complaint.getStatus().toUpperCase()
        );

        updateResolutionDetails(complaint);

        return complaintRepository.save(complaint);
    }


    public List<Complaint> getAllComplaints() {

        return complaintRepository.findAll();

    }


    public Optional<Complaint> getComplaintById(Long id) {

        return complaintRepository.findById(id);

    }


    public List<Complaint> getComplaintsByStudentId(
            Long studentId
    ) {

        return complaintRepository.findByStudentId(
                studentId
        );

    }


    public List<Complaint> getComplaintsByStatus(
            String status
    ) {

        return complaintRepository.findByStatus(
                status.toUpperCase()
        );

    }


    public List<Complaint> getComplaintsByPriority(
            String priority
    ) {

        return complaintRepository.findByPriority(
                priority.toUpperCase()
        );

    }


    public Optional<Complaint> updateComplaint(
            Long id,
            Complaint complaint
    ) {

        return complaintRepository.findById(id)
                .map(existingComplaint -> {

                    validateComplaint(complaint);

                    complaint.setId(id);

                    if (complaint.getComplaintDate() == null) {

                        complaint.setComplaintDate(
                                existingComplaint.getComplaintDate()
                        );

                    }

                    if (complaint.getPriority() == null ||
                            complaint.getPriority().trim().isEmpty()) {

                        complaint.setPriority(
                                existingComplaint.getPriority()
                        );

                    }

                    if (complaint.getStatus() == null ||
                            complaint.getStatus().trim().isEmpty()) {

                        complaint.setStatus(
                                existingComplaint.getStatus()
                        );

                    }

                    complaint.setPriority(
                            complaint.getPriority().toUpperCase()
                    );

                    complaint.setStatus(
                            complaint.getStatus().toUpperCase()
                    );

                    updateResolutionDetails(
                            complaint
                    );

                    return complaintRepository.save(
                            complaint
                    );

                });

    }


    public boolean deleteComplaint(Long id) {

        if (!complaintRepository.existsById(id)) {

            return false;

        }

        complaintRepository.deleteById(id);

        return true;

    }


    private void validateComplaint(
            Complaint complaint
    ) {

        if (complaint.getStudentId() == null) {

            throw new IllegalArgumentException(
                    "Student ID is required."
            );

        }


        if (complaint.getSubject() == null ||
                complaint.getSubject().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Complaint subject is required."
            );

        }


        if (complaint.getDescription() == null ||
                complaint.getDescription().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Complaint description is required."
            );

        }


        if (complaint.getPriority() != null) {

            String priority =
                    complaint.getPriority()
                            .trim()
                            .toUpperCase();

            if (!priority.equals("LOW") &&
                    !priority.equals("MEDIUM") &&
                    !priority.equals("HIGH") &&
                    !priority.equals("URGENT")) {

                throw new IllegalArgumentException(
                        "Invalid complaint priority."
                );

            }

        }


        if (complaint.getStatus() != null) {

            String status =
                    complaint.getStatus()
                            .trim()
                            .toUpperCase();

            if (!status.equals("OPEN") &&
                    !status.equals("IN_PROGRESS") &&
                    !status.equals("RESOLVED") &&
                    !status.equals("CLOSED")) {

                throw new IllegalArgumentException(
                        "Invalid complaint status."
                );

            }

        }

    }


    private void updateResolutionDetails(
            Complaint complaint
    ) {

        String status =
                complaint.getStatus()
                        .toUpperCase();


        if (status.equals("RESOLVED") ||
                status.equals("CLOSED")) {

            if (complaint.getResolvedDate() == null) {

                complaint.setResolvedDate(
                        LocalDate.now()
                );

            }

        } else {

            complaint.setResolvedDate(null);

        }

    }

}