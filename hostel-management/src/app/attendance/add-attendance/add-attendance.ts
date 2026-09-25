import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

import { AttendanceService } from '../../services/attendance';


@Component({
  selector: 'app-add-attendance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-attendance.html',
  styleUrl: './add-attendance.css'
})
export class AddAttendance implements OnInit {

  attendanceForm!: FormGroup;

  students: any[] = [];

  loadingStudents = false;

  saving = false;

  errorMessage = '';

  successMessage = '';

  private studentsApiUrl =
    'http://localhost:8080/api/students';


  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private router: Router,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.createForm();

    this.loadStudents();

    this.handleStatusChanges();

  }


  createForm(): void {

    this.attendanceForm =
      this.fb.group({

        studentId: [
          '',
          Validators.required
        ],

        attendanceDate: [
          this.getTodayDate(),
          Validators.required
        ],

        status: [
          'PRESENT',
          Validators.required
        ],

        checkInTime: [
          ''
        ],

        checkOutTime: [
          ''
        ],

        remarks: [
          '',
          Validators.maxLength(500)
        ]

      });

  }


  loadStudents(): void {

    this.loadingStudents = true;

    this.http.get<any[]>(
      this.studentsApiUrl
    ).subscribe({

      next: (data) => {

        this.students =
          data || [];

        this.loadingStudents = false;

        this.changeDetectorRef.detectChanges();

      },

      error: (error) => {

        console.error(
          'Error loading students:',
          error
        );

        this.students = [];

        this.loadingStudents = false;

        this.errorMessage =
          'Unable to load students. Please make sure the backend is running.';

        this.changeDetectorRef.detectChanges();

      }

    });

  }


  getStudentName(
    student: any
  ): string {

    const firstName =
      student.firstName || '';

    const lastName =
      student.lastName || '';

    const studentCode =
      student.studentId ||
      student.id ||
      '';


    const fullName =
      `${firstName} ${lastName}`.trim();


    if (
      fullName &&
      studentCode
    ) {

      return `${fullName} (${studentCode})`;

    }


    if (fullName) {

      return fullName;

    }


    return `Student #${student.id}`;

  }


  getTodayDate(): string {

    const today =
      new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        today.getDate()
      ).padStart(2, '0');


    return `${year}-${month}-${day}`;

  }


  handleStatusChanges(): void {

    this.attendanceForm
      .get('status')
      ?.valueChanges
      .subscribe(
        (status: string) => {

          const checkInControl =
            this.attendanceForm.get(
              'checkInTime'
            );

          const checkOutControl =
            this.attendanceForm.get(
              'checkOutTime'
            );


          if (
            status === 'ABSENT' ||
            status === 'LEAVE'
          ) {

            checkInControl?.setValue(
              ''
            );

            checkOutControl?.setValue(
              ''
            );

            checkInControl?.disable({
              emitEvent: false
            });

            checkOutControl?.disable({
              emitEvent: false
            });

          } else {

            checkInControl?.enable({
              emitEvent: false
            });

            checkOutControl?.enable({
              emitEvent: false
            });

          }

        }
      );

  }


  addAttendance(): void {

    this.errorMessage = '';

    this.successMessage = '';


    if (
      this.attendanceForm.invalid
    ) {

      this.attendanceForm
        .markAllAsTouched();

      this.errorMessage =
        'Please complete all required fields correctly.';

      return;

    }


    const formValue =
      this.attendanceForm.getRawValue();


    const attendance = {

      studentId:
        Number(
          formValue.studentId
        ),

      attendanceDate:
        formValue.attendanceDate,

      status:
        formValue.status,

      checkInTime:
        formValue.checkInTime ||
        null,

      checkOutTime:
        formValue.checkOutTime ||
        null,

      remarks:
        formValue.remarks?.trim() ||
        null

    };


    this.saving = true;


    this.attendanceService
      .addAttendance(
        attendance
      )
      .subscribe({

        next: () => {

          this.saving = false;

          this.successMessage =
            'Attendance marked successfully.';

          this.changeDetectorRef
            .detectChanges();


          setTimeout(
            () => {

              this.router.navigate([
                '/attendance'
              ]);

            },
            700
          );

        },


        error: (error) => {

          console.error(
            'Error adding attendance:',
            error
          );

          this.saving = false;


          if (
            typeof error.error ===
            'string'
          ) {

            this.errorMessage =
              error.error;

          } else {

            this.errorMessage =
              'Unable to mark attendance. Please try again.';

          }


          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  cancel(): void {

    this.router.navigate([
      '/attendance'
    ]);

  }

}