package com.hostel.hostel_management.controller;

import com.hostel.hostel_management.entity.Student;
import com.hostel.hostel_management.service.StudentService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentController {

    private final StudentService studentService;


    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }


    // ==============================
    // Add Student
    // ADMIN only
    // ==============================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Student> addStudent(
            @RequestBody Student student) {

        Student savedStudent =
                studentService.saveStudent(student);

        return ResponseEntity.ok(savedStudent);
    }


    // ==============================
    // Get All Students
    // ADMIN + USER
    // ==============================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Student>> getAllStudents() {

        return ResponseEntity.ok(
                studentService.getAllStudents()
        );
    }


    // ==============================
    // Get Student By ID
    // ADMIN + USER
    // ==============================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Student> getStudentById(
            @PathVariable Long id) {

        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // ==============================
    // Update Student
    // ADMIN only
    // ==============================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestBody Student student) {

        return studentService.getStudentById(id)
                .map(existingStudent -> {

                    student.setId(id);

                    Student updatedStudent =
                            studentService.saveStudent(student);

                    return ResponseEntity.ok(updatedStudent);
                })
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // ==============================
    // Delete Student
    // ADMIN only
    // ==============================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable Long id) {

        studentService.deleteStudent(id);

        return ResponseEntity.noContent().build();
    }
}