import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AttendanceService } from '../../services/attendance';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class Attendance implements OnInit {

  // ROLE
  isAdmin = false;

  attendance: any[] = [];

  students: any[] = [];

  loading = false;

  loadingStudents = false;

  errorMessage = '';

  totalAttendance = 0;

  presentCount = 0;

  absentCount = 0;

  lateCount = 0;

  leaveCount = 0;

  private studentsApiUrl =
    'http://localhost:8080/api/students';

  constructor(
    private attendanceService: AttendanceService,
    private router: Router,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ) {

    this.isAdmin =
      this.authService.getRole() === 'ADMIN';

  }

  ngOnInit(): void {

    this.loadStudents();

    this.loadAttendance();

  }

  loadStudents(): void {

    this.loadingStudents = true;

    this.http
      .get<any[]>(this.studentsApiUrl)
      .subscribe({

        next: (data) => {

          this.students =
            data || [];

          this.loadingStudents = false;

          this.changeDetectorRef
            .detectChanges();

        },

        error: (error) => {

          console.error(
            'Error loading students:',
            error
          );

          this.students = [];

          this.loadingStudents = false;

          this.changeDetectorRef
            .detectChanges();

        }

      });

  }

  loadAttendance(): void {

    this.loading = true;

    this.errorMessage = '';

    this.attendanceService
      .getAttendance()
      .subscribe({

        next: (data) => {

          this.attendance =
            data || [];

          this.calculateSummary();

          this.loading = false;

          this.changeDetectorRef
            .detectChanges();

        },

        error: (error) => {

          console.error(
            'Error loading attendance:',
            error
          );

          this.loading = false;

          this.errorMessage =
            'Unable to load attendance. Please make sure the backend is running.';

          this.changeDetectorRef
            .detectChanges();

        }

      });

  }

  calculateSummary(): void {

    this.totalAttendance =
      this.attendance.length;

    this.presentCount =
      this.attendance.filter(
        record =>
          String(record.status ?? '')
            .toUpperCase() === 'PRESENT'
      ).length;

    this.absentCount =
      this.attendance.filter(
        record =>
          String(record.status ?? '')
            .toUpperCase() === 'ABSENT'
      ).length;

    this.lateCount =
      this.attendance.filter(
        record =>
          String(record.status ?? '')
            .toUpperCase() === 'LATE'
      ).length;

    this.leaveCount =
      this.attendance.filter(
        record =>
          String(record.status ?? '')
            .toUpperCase() === 'LEAVE'
      ).length;

  }

  getStudentName(
    attendanceRecord: any
  ): string {

    const student =
      this.students.find(
        item =>
          Number(item.id) ===
          Number(
            attendanceRecord.studentId
          )
      );

    if (!student) {

      return `Student #${attendanceRecord.studentId}`;

    }

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

  getStatusClass(
    status: string
  ): string {

    switch (
      status?.toUpperCase()
    ) {

      case 'PRESENT':
        return 'present';

      case 'ABSENT':
        return 'absent';

      case 'LATE':
        return 'late';

      case 'LEAVE':
        return 'leave';

      default:
        return 'present';

    }

  }

  formatDate(
    date: string | null
  ): string {

    if (!date) {

      return '-';

    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return date;

    }

    return parsedDate.toLocaleDateString(
      'en-IN'
    );

  }

  formatTime(
    time: string | null
  ): string {

    if (!time) {

      return '-';

    }

    return time.substring(
      0,
      5
    );

  }

  // ADMIN ONLY
  addAttendance(): void {

    if (!this.isAdmin) {
      return;
    }

    this.router.navigate([
      '/attendance/add'
    ]);

  }

  // ADMIN ONLY
  editAttendance(
    id: number
  ): void {

    if (!this.isAdmin) {
      return;
    }

    this.router.navigate([
      '/attendance/edit',
      id
    ]);

  }

  // ADMIN ONLY
  deleteAttendance(
    id: number
  ): void {

    if (!this.isAdmin) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this attendance record?'
      );

    if (!confirmed) {

      return;

    }

    this.attendanceService
      .deleteAttendance(id)
      .subscribe({

        next: () => {

          this.loadAttendance();

        },

        error: (error) => {

          console.error(
            'Error deleting attendance:',
            error
          );

          this.errorMessage =
            'Unable to delete the attendance record. Please try again.';

          this.changeDetectorRef
            .detectChanges();

        }

      });

  }

}