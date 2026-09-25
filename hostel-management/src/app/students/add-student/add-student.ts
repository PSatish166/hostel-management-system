import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-add-student',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css'
})
export class AddStudent {

  studentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private studentService: StudentService
  ) {

    this.studentForm = this.fb.group({

      // Personal Information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],

      // Contact Information
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],
      address: ['', Validators.required],

      // Academic Information
      studentId: ['', Validators.required],
      course: ['', Validators.required],
      year: ['', Validators.required],
      department: ['', Validators.required],

      // Parent / Guardian Information
      guardianName: ['', Validators.required],
      guardianPhone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],

      // Admission Information
      admissionDate: ['', Validators.required]

    });

  }

  saveStudent(): void {

    if (this.studentForm.invalid) {

      this.studentForm.markAllAsTouched();

      return;
    }

    this.studentService
      .addStudent(this.studentForm.value)
      .subscribe({

        next: () => {

          alert('Student saved successfully!');

          this.router.navigate(['/students']);

        },

        error: (error) => {

          console.error(
            'Unable to save student:',
            error
          );

          alert(
            'Unable to save the student. Please try again.'
          );

        }

      });

  }

}