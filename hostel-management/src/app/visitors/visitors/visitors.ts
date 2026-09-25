import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { VisitorService } from '../../services/visitor';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitors.html',
  styleUrl: './visitors.css'
})
export class Visitors implements OnInit {

  // ROLE
  isAdmin = false;

  visitors: any[] = [];

  students: any[] = [];

  loading = false;

  loadingStudents = false;

  errorMessage = '';

  totalVisitors = 0;

  checkedInCount = 0;

  checkedOutCount = 0;

  cancelledCount = 0;

  private studentsApiUrl =
    'http://localhost:8080/api/students';

  constructor(
    private visitorService: VisitorService,
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

    this.loadVisitors();

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

  loadVisitors(): void {

    this.loading = true;

    this.errorMessage = '';

    this.visitorService
      .getVisitors()
      .subscribe({

        next: (data) => {

          this.visitors =
            data || [];

          this.calculateSummary();

          this.loading = false;

          this.changeDetectorRef
            .detectChanges();

        },

        error: (error) => {

          console.error(
            'Error loading visitors:',
            error
          );

          this.loading = false;

          this.errorMessage =
            'Unable to load visitors. Please make sure the backend is running.';

          this.changeDetectorRef
            .detectChanges();

        }

      });

  }

  calculateSummary(): void {

    this.totalVisitors =
      this.visitors.length;

    this.checkedInCount =
      this.visitors.filter(
        visitor =>
          String(visitor.status ?? '')
            .toUpperCase() === 'CHECKED_IN'
      ).length;

    this.checkedOutCount =
      this.visitors.filter(
        visitor =>
          String(visitor.status ?? '')
            .toUpperCase() === 'CHECKED_OUT'
      ).length;

    this.cancelledCount =
      this.visitors.filter(
        visitor =>
          String(visitor.status ?? '')
            .toUpperCase() === 'CANCELLED'
      ).length;

  }

  getStudentName(
    visitor: any
  ): string {

    const student =
      this.students.find(
        item =>
          Number(item.id) ===
          Number(visitor.studentId)
      );

    if (!student) {

      return `Student #${visitor.studentId}`;

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

      case 'CHECKED_IN':
        return 'checked-in';

      case 'CHECKED_OUT':
        return 'checked-out';

      case 'CANCELLED':
        return 'cancelled';

      default:
        return 'checked-in';

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
  addVisitor(): void {

    if (!this.isAdmin) {
      return;
    }

    this.router.navigate([
      '/visitors/add'
    ]);

  }

  // ADMIN ONLY
  editVisitor(
    id: number
  ): void {

    if (!this.isAdmin) {
      return;
    }

    this.router.navigate([
      '/visitors/edit',
      id
    ]);

  }

  // ADMIN ONLY
  deleteVisitor(
    id: number
  ): void {

    if (!this.isAdmin) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this visitor record?'
      );

    if (!confirmed) {

      return;

    }

    this.visitorService
      .deleteVisitor(id)
      .subscribe({

        next: () => {

          this.loadVisitors();

        },

        error: (error) => {

          console.error(
            'Error deleting visitor:',
            error
          );

          if (
            typeof error.error === 'string'
          ) {

            this.errorMessage =
              error.error;

          } else {

            this.errorMessage =
              'Unable to delete the visitor record. Please try again.';

          }

          this.changeDetectorRef
            .detectChanges();

        }

      });

  }

}