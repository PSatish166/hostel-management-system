import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import { StudentService } from '../services/student.service';
import { RoomService } from '../services/room';
import { AllocationService } from '../services/allocation';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  // =========================================================
  // ROLE
  // =========================================================

  isAdmin = false;


  // =========================================================
  // STATISTICS
  // =========================================================

  totalStudents = 0;

  availableRooms = 0;

  occupiedBeds = 0;

  totalBeds = 0;

  occupancyPercentage = 0;


  // =========================================================
  // FEES
  // =========================================================

  pendingFees = 0;


  // =========================================================
  // ROOM STATISTICS
  // =========================================================

  occupiedRooms = 0;

  maintenanceRooms = 0;


  // =========================================================
  // RECENT STUDENTS
  // =========================================================

  recentStudents: any[] = [];

  students: any[] = [];

  rooms: any[] = [];

  allocations: any[] = [];


  // =========================================================
  // COMPLAINTS
  // =========================================================

  complaints: any[] = [];


  // =========================================================
  // STATE
  // =========================================================

  loading = false;

  errorMessage = '';


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private studentService: StudentService,
    private roomService: RoomService,
    private allocationService: AllocationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {

    this.isAdmin =
      this.authService.getRole() === 'ADMIN';

  }


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadDashboardData();

  }


  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  loadDashboardData(): void {

    this.loading = true;

    this.errorMessage = '';


    forkJoin({

      students:
        this.studentService.getStudents(),

      rooms:
        this.roomService.getRooms(),

      allocations:
        this.allocationService.getAllocations()

    }).subscribe({

      next: ({
        students,
        rooms,
        allocations
      }) => {

        console.log(
          'Dashboard students:',
          students
        );

        console.log(
          'Dashboard rooms:',
          rooms
        );

        console.log(
          'Dashboard allocations:',
          allocations
        );


        const studentList =
          students ?? [];

        const roomList =
          rooms ?? [];

        const allocationList =
          allocations ?? [];


        // =====================================================
        // STORE DATA
        // =====================================================

        this.students =
          studentList;

        this.rooms =
          roomList;

        this.allocations =
          allocationList;


        // =====================================================
        // STUDENTS
        // =====================================================

        this.totalStudents =
          studentList.length;


        // =====================================================
        // ACTIVE ALLOCATIONS
        // =====================================================

        const activeAllocations =
          allocationList.filter(
            (allocation: any) =>
              String(
                allocation.status ?? ''
              ).toUpperCase() ===
              'ACTIVE'
          );


        // =====================================================
        // RECENT STUDENTS
        // =====================================================

        this.recentStudents =
          [...studentList]
            .sort((a, b) => {

              const dateA =
                a.admissionDate
                  ? new Date(
                      a.admissionDate
                    ).getTime()
                  : 0;

              const dateB =
                b.admissionDate
                  ? new Date(
                      b.admissionDate
                    ).getTime()
                  : 0;

              return dateB - dateA;

            })
            .slice(0, 4);


        // =====================================================
        // ROOM INFORMATION
        // =====================================================

        this.totalBeds =
          roomList.reduce(
            (
              total: number,
              room: any
            ) => {

              return (
                total +
                Number(
                  room.capacity ?? 0
                )
              );

            },
            0
          );


        this.maintenanceRooms =
          roomList.filter(
            (room: any) =>
              String(
                room.status ?? ''
              ).toUpperCase() ===
              'MAINTENANCE'
          ).length;


        // =====================================================
        // OCCUPIED BEDS
        // =====================================================

        this.occupiedBeds =
          activeAllocations.length;


        // =====================================================
        // OCCUPIED ROOMS
        // =====================================================

        const occupiedRoomIds =
          new Set(
            activeAllocations.map(
              (allocation: any) =>
                Number(
                  allocation.roomId
                )
            )
          );


        this.occupiedRooms =
          occupiedRoomIds.size;


        // =====================================================
        // AVAILABLE ROOMS
        // =====================================================

        this.availableRooms =
          roomList.filter(
            (room: any) => {

              const roomStatus =
                String(
                  room.status ?? ''
                ).toUpperCase();


              if (
                roomStatus ===
                'MAINTENANCE'
              ) {

                return false;

              }


              const roomId =
                Number(
                  room.id
                );


              const roomCapacity =
                Number(
                  room.capacity ?? 0
                );


              const usedBeds =
                activeAllocations.filter(
                  (allocation: any) =>
                    Number(
                      allocation.roomId
                    ) === roomId
                ).length;


              return (
                roomCapacity > 0 &&
                usedBeds < roomCapacity
              );

            }
          ).length;


        // =====================================================
        // OCCUPANCY PERCENTAGE
        // =====================================================

        if (this.totalBeds > 0) {

          this.occupancyPercentage =
            Math.round(
              (
                this.occupiedBeds /
                this.totalBeds
              ) * 100
            );

        } else {

          this.occupancyPercentage = 0;

        }


        // =====================================================
        // LOAD COMPLAINTS
        // =====================================================

        this.loadComplaints();


        // =====================================================
        // FINISH LOADING
        // =====================================================

        this.loading = false;


        console.log(
          'Dashboard totals:',
          {
            totalStudents:
              this.totalStudents,

            availableRooms:
              this.availableRooms,

            occupiedBeds:
              this.occupiedBeds,

            totalBeds:
              this.totalBeds,

            occupancyPercentage:
              this.occupancyPercentage
          }
        );


        this.cdr.detectChanges();

      },


      error: (error) => {

        console.error(
          'Dashboard loading error:',
          error
        );


        this.errorMessage =
          'Unable to load dashboard data.';


        this.loading = false;


        this.cdr.detectChanges();

      }

    });

  }


  // =========================================================
  // LOAD COMPLAINTS
  // =========================================================

  private loadComplaints(): void {

    fetch(
      'http://localhost:8080/api/complaints'
    )
      .then(response => {

        if (!response.ok) {

          throw new Error(
            `Complaint API returned ${response.status}`
          );

        }

        return response.json();

      })
      .then(data => {

        this.complaints =
          data ?? [];

        console.log(
          'Dashboard complaints:',
          this.complaints
        );


        this.cdr.detectChanges();

      })
      .catch(error => {

        console.error(
          'Dashboard complaints error:',
          error
        );

        this.complaints = [];

        this.cdr.detectChanges();

      });

  }


  // =========================================================
  // FIND ACTIVE ALLOCATION
  // =========================================================

  getStudentAllocation(
    studentId: number
  ): any | null {

    return (
      this.allocations.find(
        (allocation: any) =>
          Number(
            allocation.studentId
          ) ===
          Number(studentId)

          &&

          String(
            allocation.status ?? ''
          ).toUpperCase() ===
          'ACTIVE'
      ) ?? null
    );

  }


  // =========================================================
  // GET ROOM NUMBER
  // =========================================================

  getRoomNumber(
    studentId: number
  ): string {

    const allocation =
      this.getStudentAllocation(
        studentId
      );


    if (!allocation) {

      return 'Not Allocated';

    }


    const room =
      this.rooms.find(
        (item: any) =>
          Number(item.id) ===
          Number(allocation.roomId)
      );


    return (
      room?.roomNumber ??
      room?.roomNo ??
      'N/A'
    );

  }


  // =========================================================
  // GET BED NUMBER
  // =========================================================

  getBedNumber(
    studentId: number
  ): string {

    const allocation =
      this.getStudentAllocation(
        studentId
      );


    if (!allocation) {

      return '';

    }


    return (
      allocation.bedNumber ??
      allocation.bedNo ??
      ''
    );

  }


  // =========================================================
  // VIEW STUDENTS
  // =========================================================

  viewStudents(): void {

    this.router.navigate([
      '/students'
    ]);

  }


  // =========================================================
  // VIEW COMPLAINTS
  // =========================================================

  viewComplaints(): void {

    this.router.navigate([
      '/complaints'
    ]);

  }


  // =========================================================
  // ADD STUDENT
  // =========================================================

  addStudent(): void {

    if (!this.isAdmin) {

      return;

    }


    this.router.navigate([
      '/students/add'
    ]);

  }


  // =========================================================
  // ADD ROOM
  // =========================================================

  addRoom(): void {

    if (!this.isAdmin) {

      return;

    }


    this.router.navigate([
      '/rooms/add'
    ]);

  }


  // =========================================================
  // ADD ALLOCATION
  // =========================================================

  addAllocation(): void {

    if (!this.isAdmin) {

      return;

    }


    this.router.navigate([
      '/allocation/add'
    ]);

  }

}