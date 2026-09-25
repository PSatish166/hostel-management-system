import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-edit-student',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-student.html',
  styleUrl: './edit-student.css'
})
export class EditStudent implements OnInit {

  studentForm: FormGroup;

  studentId!: number;

  loading = true;

  saving = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    this.studentForm = this.fb.group({

      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],

      address: ['', Validators.required],

      studentId: ['', Validators.required],
      course: ['', Validators.required],
      year: ['', Validators.required],
      department: ['', Validators.required],

      guardianName: ['', Validators.required],

      guardianPhone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],

      roomNumber: [''],

      admissionDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    console.log('EditStudent component loaded');

    const id = this.route.snapshot.paramMap.get('id');

    console.log('Route ID:', id);

    if (!id) {
      alert('Student ID not found.');
      this.router.navigate(['/students']);
      return;
    }

    this.studentId = Number(id);

    console.log('Student ID:', this.studentId);

    this.loadStudent();
  }

  loadStudent(): void {

    console.log('Loading student:', this.studentId);

    this.loading = true;

    this.studentService
      .getStudentById(this.studentId)
      .subscribe({

        next: (student) => {

          console.log('Student received:', student);

          this.studentForm.patchValue({

            firstName: student.firstName ?? '',
            lastName: student.lastName ?? '',
            dateOfBirth: student.dateOfBirth ?? '',
            gender: student.gender ?? '',
            email: student.email ?? '',
            phone: student.phone ?? '',
            address: student.address ?? '',
            studentId: student.studentId ?? '',
            course: student.course ?? '',
            year: student.year ?? '',
            department: student.department ?? '',
            guardianName: student.guardianName ?? '',
            guardianPhone: student.guardianPhone ?? '',
            roomNumber: student.roomNumber ?? '',
            admissionDate: student.admissionDate ?? ''

          });

          this.loading = false;

          // Force Angular to refresh the page
          this.cdr.detectChanges();

          console.log('Loading finished:', this.loading);
        },

        error: (error) => {

          console.error(
            'ERROR loading student:',
            error
          );

          this.loading = false;

          this.cdr.detectChanges();

          alert(
            'Unable to load student details.'
          );
        }
      });
  }

  updateStudent(): void {

    if (this.studentForm.invalid) {

      this.studentForm.markAllAsTouched();

      return;
    }

    this.saving = true;

    console.log(
      'Updating student:',
      this.studentId
    );

    this.studentService
      .updateStudent(
        this.studentId,
        this.studentForm.value
      )
      .subscribe({

        next: (updatedStudent) => {

          console.log(
            'Student updated:',
            updatedStudent
          );

          alert(
            'Student updated successfully!'
          );

          this.router.navigate([
            '/students'
          ]);
        },

        error: (error) => {

          console.error(
            'ERROR updating student:',
            error
          );

          this.saving = false;

          alert(
            'Unable to update student. Please try again.'
          );
        }
      });
  }
}