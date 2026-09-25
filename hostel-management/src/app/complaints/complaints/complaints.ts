import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

import { ComplaintService } from '../../services/complaint';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './complaints.html',
  styleUrl: './complaints.css'
})
export class Complaints implements OnInit {

  // ROLE
  isAdmin = false;

  // DATA
  complaints: any[] = [];

  students: any[] = [];

  loading = false;
  loadingStudents = false;

  errorMessage = '';

  totalComplaints = 0;
  openComplaints = 0;
  inProgressComplaints = 0;
  resolvedComplaints = 0;

  private studentsApiUrl =
    'http://localhost:8080/api/students';

  constructor(
    private complaintService: ComplaintService,
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

    this.loadComplaints();

  }

  loadStudents(): void {

    this.loadingStudents = true;

    this.http
      .get<any[]>(
        this.studentsApiUrl
      )
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

  loadComplaints(): void {

    this.loading = true;

    this.errorMessage = '';

    this.complaintService
      .getComplaints()
      .subscribe({

        next: (data) => {

          this.complaints =
            data || [];

          this.calculateSummary();

          this.loading = false;

          this.changeDetectorRef
            .detectChanges();

        },

        error: (error) => {

          console.error(
            'Error loading complaints:',
            error
          );

          this.loading = false;

          this.errorMessage =
            'Unable to load complaints. Please make sure the backend is running.';

          this.changeDetectorRef
            .detectChanges();

        }

      });

  }

  calculateSummary(): void {

    this.totalComplaints =
      this.complaints.length;

    this.openComplaints =
      this.complaints.filter(
        complaint =>
          complaint.status === 'OPEN'
      ).length;

    this.inProgressComplaints =
      this.complaints.filter(
        complaint =>
          complaint.status === 'IN_PROGRESS'
      ).length;

    this.resolvedComplaints =
      this.complaints.filter(
        complaint =>
          complaint.status === 'RESOLVED' ||
          complaint.status === 'CLOSED'
      ).length;

  }

  getStudentName(
    complaint: any
  ): string {

    const student =
      this.students.find(
        item =>
          Number(item.id) ===
          Number(complaint.studentId)
      );

    if (!student) {

      return `Student #${complaint.studentId}`;

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

  getPriorityClass(
    priority: string
  ): string {

    switch (
      priority?.toUpperCase()
    ) {

      case 'LOW':
        return 'low';

      case 'MEDIUM':
        return 'medium';

      case 'HIGH':
        return 'high';

      case 'URGENT':
        return 'urgent';

      default:
        return 'medium';

    }

  }

  getStatusClass(
    status: string
  ): string {

    switch (
      status?.toUpperCase()
    ) {

      case 'OPEN':
        return 'open';

      case 'IN_PROGRESS':
        return 'in-progress';

      case 'RESOLVED':
        return 'resolved';

      case 'CLOSED':
        return 'closed';

      default:
        return 'open';

    }

  }

  formatStatus(
    status: string
  ): string {

    if (!status) {

      return '';

    }

    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        letter =>
          letter.toUpperCase()
      );

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

  // ADMIN + USER
  addComplaint(): void {

    this.router.navigate([
      '/complaints/add'
    ]);

  }

  // ADMIN ONLY
  editComplaint(
    id: number
  ): void {

    if (!this.isAdmin) {
      return;
    }

    this.router.navigate([
      '/complaints/edit',
      id
    ]);

  }

  // ADMIN ONLY
  deleteComplaint(
    id: number
  ): void {

    if (!this.isAdmin) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this complaint?'
      );

    if (!confirmed) {

      return;

    }

    this.complaintService
      .deleteComplaint(id)
      .subscribe({

        next: () => {

          this.loadComplaints();

        },

        error: (error) => {

          console.error(
            'Error deleting complaint:',
            error
          );

          this.errorMessage =
            'Unable to delete the complaint. Please try again.';

          this.changeDetectorRef
            .detectChanges();

        }

      });

  }

}