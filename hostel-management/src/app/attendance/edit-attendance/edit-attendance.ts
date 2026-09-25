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

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AttendanceService } from '../../services/attendance';


@Component({
  selector: 'app-edit-attendance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-attendance.html',
  styleUrl: './edit-attendance.css'
})
export class EditAttendance implements OnInit {

  attendanceForm!: FormGroup;

  attendanceId!: number;

  students: any[] = [];

  loading = true;
  loadingStudents = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  private studentsApiUrl =
    'http://localhost:8080/api/students';


  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.createForm();

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id || id <= 0) {

      this.errorMessage =
        'Invalid attendance record ID.';

      this.loading = false;

      return;
    }

    this.attendanceId = id;

    this.loadStudents();

    this.loadAttendance();

    this.handleStatusChanges();
  }


  // =========================================
  // CREATE FORM
  // =========================================

  createForm(): void {

    this.attendanceForm = this.fb.group({

      studentId: [
        '',
        Validators.required
      ],

      attendanceDate: [
        '',
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


  // =========================================
  // LOAD STUDENTS
  // =========================================

  loadStudents(): void {

    this.loadingStudents = true;

    this.http
      .get<any[]>(this.studentsApiUrl)
      .subscribe({

        next: (data) => {

          this.students = data || [];

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


  // =========================================
  // LOAD ATTENDANCE
  // =========================================

  loadAttendance(): void {

    this.loading = true;

    this.errorMessage = '';

    this.attendanceService
      .getAttendanceById(this.attendanceId)
      .subscribe({

        next: (attendance) => {

          if (!attendance) {

            this.errorMessage =
              'Attendance record not found.';

            this.loading = false;

            this.changeDetectorRef.detectChanges();

            return;
          }


          this.attendanceForm.patchValue({

            studentId: attendance.studentId,

            attendanceDate:
              attendance.attendanceDate || '',

            status:
              attendance.status || 'PRESENT',

            checkInTime:
              this.formatTimeForInput(
                attendance.checkInTime
              ),

            checkOutTime:
              this.formatTimeForInput(
                attendance.checkOutTime
              ),

            remarks:
              attendance.remarks || ''

          });


          this.applyStatusState(
            attendance.status
          );


          this.loading = false;

          this.changeDetectorRef.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error loading attendance:',
            error
          );

          this.loading = false;

          if (error.status === 404) {

            this.errorMessage =
              'Attendance record not found.';

          } else {

            this.errorMessage =
              'Unable to load attendance record. Please try again.';

          }

          this.changeDetectorRef.detectChanges();

        }

      });

  }


  // =========================================
  // STUDENT NAME
  // =========================================

  getStudentName(student: any): string {

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


    if (fullName && studentCode) {

      return `${fullName} (${studentCode})`;

    }


    if (fullName) {

      return fullName;

    }


    return `Student #${student.id}`;

  }


  // =========================================
  // STATUS CHANGES
  // =========================================

  handleStatusChanges(): void {

    this.attendanceForm
      .get('status')
      ?.valueChanges
      .subscribe((status: string) => {

        this.applyStatusState(status);

      });

  }


  // =========================================
  // APPLY STATUS STATE
  // =========================================

  applyStatusState(status: string): void {

    const checkInControl =
      this.attendanceForm.get('checkInTime');

    const checkOutControl =
      this.attendanceForm.get('checkOutTime');


    if (
      status === 'ABSENT' ||
      status === 'LEAVE'
    ) {

      checkInControl?.setValue(
        '',
        {
          emitEvent: false
        }
      );

      checkOutControl?.setValue(
        '',
        {
          emitEvent: false
        }
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


  // =========================================
  // FORMAT TIME
  // =========================================

  formatTimeForInput(
    time: string | null
  ): string {

    if (!time) {

      return '';

    }

    return time.substring(0, 5);

  }


  // =========================================
  // UPDATE ATTENDANCE
  // =========================================

  updateAttendance(): void {

    this.errorMessage = '';

    this.successMessage = '';


    if (this.attendanceForm.invalid) {

      this.attendanceForm.markAllAsTouched();

      this.errorMessage =
        'Please complete all required fields correctly.';

      return;

    }


    const formValue =
      this.attendanceForm.getRawValue();


    const attendance = {

      studentId:
        Number(formValue.studentId),

      attendanceDate:
        formValue.attendanceDate,

      status:
        formValue.status,

      checkInTime:
        formValue.checkInTime || null,

      checkOutTime:
        formValue.checkOutTime || null,

      remarks:
        formValue.remarks?.trim() || null

    };


    this.saving = true;


    this.attendanceService
      .updateAttendance(
        this.attendanceId,
        attendance
      )
      .subscribe({

        next: () => {

          this.saving = false;

          this.successMessage =
            'Attendance updated successfully.';

          this.changeDetectorRef.detectChanges();


          setTimeout(() => {

            this.router.navigate([
              '/attendance'
            ]);

          }, 700);

        },

        error: (error) => {

          console.error(
            'Error updating attendance:',
            error
          );

          this.saving = false;


          if (
            typeof error.error === 'string'
          ) {

            this.errorMessage =
              error.error;

          } else {

            this.errorMessage =
              'Unable to update attendance. Please try again.';

          }


          this.changeDetectorRef.detectChanges();

        }

      });

  }


  // =========================================
  // CANCEL
  // =========================================

  cancel(): void {

    this.router.navigate([
      '/attendance'
    ]);

  }

}