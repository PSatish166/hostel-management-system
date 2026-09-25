package com.hostel.hostel_management.service;

import com.hostel.hostel_management.entity.Fee;
import com.hostel.hostel_management.repository.FeeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FeeService {

    private final FeeRepository feeRepository;

    public FeeService(FeeRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    public Fee saveFee(Fee fee) {
        validateFee(fee);
        calculateStatus(fee);

        return feeRepository.save(fee);
    }

    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    public Optional<Fee> getFeeById(Long id) {
        return feeRepository.findById(id);
    }

    public List<Fee> getFeesByStudentId(Long studentId) {
        return feeRepository.findByStudentId(studentId);
    }

    public List<Fee> getFeesByStatus(String status) {
        return feeRepository.findByStatus(status);
    }

    public Optional<Fee> updateFee(Long id, Fee fee) {
        return feeRepository.findById(id)
                .map(existingFee -> {

                    fee.setId(id);

                    validateFee(fee);
                    calculateStatus(fee);

                    return feeRepository.save(fee);
                });
    }

    public boolean deleteFee(Long id) {
        if (!feeRepository.existsById(id)) {
            return false;
        }

        feeRepository.deleteById(id);
        return true;
    }

    private void validateFee(Fee fee) {

        if (fee.getStudentId() == null) {
            throw new IllegalArgumentException(
                    "Student ID is required."
            );
        }

        if (fee.getFeeType() == null ||
                fee.getFeeType().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Fee type is required."
            );
        }

        if (fee.getAmount() == null ||
                fee.getAmount().compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Fee amount must be greater than zero."
            );
        }

        if (fee.getDueDate() == null) {
            throw new IllegalArgumentException(
                    "Due date is required."
            );
        }

        if (fee.getPaidAmount() == null) {
            fee.setPaidAmount(BigDecimal.ZERO);
        }

        if (fee.getPaidAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Paid amount cannot be negative."
            );
        }

        if (fee.getPaidAmount().compareTo(fee.getAmount()) > 0) {
            throw new IllegalArgumentException(
                    "Paid amount cannot be greater than fee amount."
            );
        }
    }

    private void calculateStatus(Fee fee) {

        BigDecimal amount = fee.getAmount();
        BigDecimal paidAmount = fee.getPaidAmount();

        if (paidAmount.compareTo(BigDecimal.ZERO) == 0) {

            fee.setStatus("PENDING");
            fee.setPaidDate(null);

        } else if (paidAmount.compareTo(amount) < 0) {

            fee.setStatus("PARTIAL");
            fee.setPaidDate(null);

        } else {

            fee.setStatus("PAID");

            if (fee.getPaidDate() == null) {
                fee.setPaidDate(LocalDate.now());
            }
        }
    }
}