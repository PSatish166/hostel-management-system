import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {

  // =========================================================
  // REPORT DATA
  // =========================================================

  students: any[] = [];
  rooms: any[] = [];
  allocations: any[] = [];
  fees: any[] = [];
  complaints: any[] = [];
  attendance: any[] = [];
  visitors: any[] = [];


  // =========================================================
  // STATE
  // =========================================================

  loading = true;
  errorMessage = '';

  private completedRequests = 0;
  private totalRequests = 7;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.loadReports();
  }


  // =========================================================
  // LOAD ALL REPORT DATA
  // =========================================================

  loadReports(): void {

    this.loading = true;
    this.errorMessage = '';

    this.completedRequests = 0;


    // ---------------------------------------------------------
    // Load Students
    // ---------------------------------------------------------

    this.loadStudents();


    // ---------------------------------------------------------
    // Load Rooms
    // ---------------------------------------------------------

    this.loadRooms();


    // ---------------------------------------------------------
    // Load Allocations
    // ---------------------------------------------------------

    this.loadAllocations();


    // ---------------------------------------------------------
    // Load Fees
    // ---------------------------------------------------------

    this.loadFees();


    // ---------------------------------------------------------
    // Load Complaints
    // ---------------------------------------------------------

    this.loadComplaints();


    // ---------------------------------------------------------
    // Load Attendance
    // ---------------------------------------------------------

    this.loadAttendance();


    // ---------------------------------------------------------
    // Load Visitors
    // ---------------------------------------------------------

    this.loadVisitors();
  }


  // =========================================================
  // REQUEST COMPLETED
  // =========================================================

  private requestCompleted(): void {

    this.completedRequests++;


    console.log(
      `Reports request completed: ${this.completedRequests}/${this.totalRequests}`
    );


    if (
      this.completedRequests >=
      this.totalRequests
    ) {

      this.loading = false;


      console.log(
        'Reports loading completed.'
      );


      console.log(
        'Students:',
        this.students
      );


      console.log(
        'Rooms:',
        this.rooms
      );


      console.log(
        'Allocations:',
        this.allocations
      );


      console.log(
        'Fees:',
        this.fees
      );


      console.log(
        'Complaints:',
        this.complaints
      );


      console.log(
        'Attendance:',
        this.attendance
      );


      console.log(
        'Visitors:',
        this.visitors
      );


      // -------------------------------------------------------
      // Force Angular to update the Reports page
      // -------------------------------------------------------

      this.cdr.detectChanges();
    }
  }


  // =========================================================
  // STUDENTS
  // =========================================================

  private loadStudents(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/api/students'
      )
      .subscribe({

        next: (data) => {

          this.students =
            data ?? [];


          console.log(
            'Students loaded:',
            this.students
          );


          this.requestCompleted();
        },


        error: (error) => {

          console.error(
            'Students API error:',
            error
          );


          this.students = [];


          this.requestCompleted();
        }

      });
  }


  // =========================================================
  // ROOMS
  // =========================================================

  private loadRooms(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/api/rooms'
      )
      .subscribe({

        next: (data) => {

          this.rooms =
            data ?? [];


          console.log(
            'Rooms loaded:',
            this.rooms
          );


          this.requestCompleted();
        },


        error: (error) => {

          console.error(
            'Rooms API error:',
            error
          );


          this.rooms = [];


          this.requestCompleted();
        }

      });
  }


  // =========================================================
  // ALLOCATIONS
  // =========================================================

  private loadAllocations(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/api/allocations'
      )
      .subscribe({

        next: (data) => {

          this.allocations =
            data ?? [];


          console.log(
            'Allocations loaded:',
            this.allocations
          );


          this.requestCompleted();
        },


        error: (error) => {

          console.error(
            'Allocations API error:',
            error
          );


          this.allocations = [];


          this.requestCompleted();
        }

      });
  }


  // =========================================================
  // FEES
  // =========================================================

  private loadFees(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/api/fees'
      )
      .subscribe({

        next: (data) => {

          this.fees =
            data ?? [];


          console.log(
            'Fees loaded:',
            this.fees
          );


          this.requestCompleted();
        },


        error: (error) => {

          console.error(
            'Fees API error:',
            error
          );


          this.fees = [];


          this.requestCompleted();
        }

      });
  }


  // =========================================================
  // COMPLAINTS
  // =========================================================

  private loadComplaints(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/api/complaints'
      )
      .subscribe({

        next: (data) => {

          this.complaints =
            data ?? [];


          console.log(
            'Complaints loaded:',
            this.complaints
          );


          this.requestCompleted();
        },


        error: (error) => {

          console.error(
            'Complaints API error:',
            error
          );


          this.complaints = [];


          this.requestCompleted();
        }

      });
  }


  // =========================================================
  // ATTENDANCE
  // =========================================================

  private loadAttendance(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/api/attendance'
      )
      .subscribe({

        next: (data) => {

          this.attendance =
            data ?? [];


          console.log(
            'Attendance loaded:',
            this.attendance
          );


          this.requestCompleted();
        },


        error: (error) => {

          console.error(
            'Attendance API error:',
            error
          );


          this.attendance = [];


          this.requestCompleted();
        }

      });
  }


  // =========================================================
  // VISITORS
  // =========================================================

  private loadVisitors(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/api/visitors'
      )
      .subscribe({

        next: (data) => {

          this.visitors =
            data ?? [];


          console.log(
            'Visitors loaded:',
            this.visitors
          );


          this.requestCompleted();
        },


        error: (error) => {

          console.error(
            'Visitors API error:',
            error
          );


          this.visitors = [];


          this.requestCompleted();
        }

      });
  }


  // =========================================================
  // TOTAL STUDENTS
  // =========================================================

  get totalStudents(): number {

    return this.students.length;
  }


  // =========================================================
  // TOTAL ROOMS
  // =========================================================

  get totalRooms(): number {

    return this.rooms.length;
  }


  // =========================================================
  // TOTAL ALLOCATIONS
  // =========================================================

  get totalAllocations(): number {

    return this.allocations.length;
  }


  // =========================================================
  // TOTAL FEES
  // =========================================================

  get totalFees(): number {

    return this.fees.length;
  }


  // =========================================================
  // TOTAL COMPLAINTS
  // =========================================================

  get totalComplaints(): number {

    return this.complaints.length;
  }


  // =========================================================
  // TOTAL ATTENDANCE
  // =========================================================

  get totalAttendance(): number {

    return this.attendance.length;
  }


  // =========================================================
  // TOTAL VISITORS
  // =========================================================

  get totalVisitors(): number {

    return this.visitors.length;
  }


  // =========================================================
  // CHECKED-IN VISITORS
  // =========================================================

  get checkedInVisitors(): number {

    return this.visitors.filter(
      visitor =>
        String(
          visitor.status ?? ''
        ).toUpperCase() ===
        'CHECKED_IN'
    ).length;
  }


  // =========================================================
  // CHECKED-OUT VISITORS
  // =========================================================

  get checkedOutVisitors(): number {

    return this.visitors.filter(
      visitor =>
        String(
          visitor.status ?? ''
        ).toUpperCase() ===
        'CHECKED_OUT'
    ).length;
  }


  // =========================================================
  // CANCELLED VISITORS
  // =========================================================

  get cancelledVisitors(): number {

    return this.visitors.filter(
      visitor =>
        String(
          visitor.status ?? ''
        ).toUpperCase() ===
        'CANCELLED'
    ).length;
  }


  // =========================================================
  // REFRESH REPORTS
  // =========================================================

  refreshReports(): void {

    this.loadReports();
  }

}