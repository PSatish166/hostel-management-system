import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { StudentService } from '../services/student.service';
import { AllocationService } from '../services/allocation';
import { RoomService } from '../services/room';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-students',
  imports: [RouterLink],
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class Students implements OnInit {

  // =========================================================
  // ROLE
  // =========================================================

  isAdmin = false;


  // =========================================================
  // DATA
  // =========================================================

  students: any[] = [];

  filteredStudents: any[] = [];

  allocations: any[] = [];

  rooms: any[] = [];

  loading = true;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private studentService: StudentService,
    private allocationService: AllocationService,
    private roomService: RoomService,
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

    console.log(
      'Students component loaded'
    );

    this.loadStudents();

  }


  // =========================================================
  // LOAD STUDENTS
  // =========================================================

  loadStudents(): void {

    console.log(
      'Loading students...'
    );

    this.loading = true;

    this.studentService
      .getStudents()
      .subscribe({

        next: (data) => {

          console.log(
            'Students received:',
            data
          );

          this.students = data;

          this.loadAllocations();

        },

        error: (error) => {

          console.error(
            'Unable to load students:',
            error
          );

          this.students = [];

          this.filteredStudents = [];

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // LOAD ALLOCATIONS
  // =========================================================

  loadAllocations(): void {

    console.log(
      'Loading allocations...'
    );

    this.allocationService
      .getAllocations()
      .subscribe({

        next: (data) => {

          console.log(
            'Allocations received:',
            data
          );

          this.allocations = data;

          this.loadRooms();

        },

        error: (error) => {

          console.error(
            'Unable to load allocations:',
            error
          );

          /*
           * Students can still be displayed if
           * allocation loading fails.
           */

          this.allocations = [];

          this.loadRooms();

        }

      });

  }


  // =========================================================
  // LOAD ROOMS
  // =========================================================

  loadRooms(): void {

    console.log(
      'Loading rooms...'
    );

    this.roomService
      .getRooms()
      .subscribe({

        next: (data) => {

          console.log(
            'Rooms received:',
            data
          );

          this.rooms = data;

          this.filteredStudents =
            this.students;

          this.loading = false;

          this.cdr.detectChanges();

          console.log(
            'Students, allocations and rooms loaded successfully'
          );

        },

        error: (error) => {

          console.error(
            'Unable to load rooms:',
            error
          );

          this.rooms = [];

          this.filteredStudents =
            this.students;

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // GET STUDENT ALLOCATION
  // =========================================================

  getStudentAllocation(
    studentId: number
  ): any | null {

    return this.allocations.find(

      allocation =>

        Number(
          allocation.studentId
        ) === Number(studentId) &&

        String(
          allocation.status ?? 'ACTIVE'
        ).toUpperCase() === 'ACTIVE'

    ) ?? null;

  }


  // =========================================================
  // GET ROOM NUMBER
  // =========================================================

  getRoomNumber(
    studentId: number
  ): string {

    const allocation =
      this.getStudentAllocation(studentId);

    if (!allocation) {

      return 'Not allocated';

    }

    const room =
      this.rooms.find(

        roomItem =>
          Number(roomItem.id) ===
          Number(allocation.roomId)

      );

    if (!room) {

      return 'Room unavailable';

    }

    return room.roomNumber ??
      'Allocated';

  }


  // =========================================================
  // GET BED NUMBER
  // =========================================================

  getBedNumber(
    studentId: number
  ): string {

    const allocation =
      this.getStudentAllocation(studentId);

    if (!allocation) {

      return '';

    }

    return allocation.bedNumber ?? '';

  }


  // =========================================================
  // GET ALLOCATION DISPLAY
  // =========================================================

  getAllocationDisplay(
    studentId: number
  ): string {

    const allocation =
      this.getStudentAllocation(studentId);

    if (!allocation) {

      return 'Not allocated';

    }

    const roomNumber =
      this.getRoomNumber(studentId);

    const bedNumber =
      this.getBedNumber(studentId);

    if (
      roomNumber !==
        'Room unavailable' &&
      bedNumber
    ) {

      return `${roomNumber} / ${bedNumber}`;

    }

    if (roomNumber) {

      return roomNumber;

    }

    if (bedNumber) {

      return bedNumber;

    }

    return 'Allocated';

  }


  // =========================================================
  // ALLOCATED STUDENTS COUNT
  // =========================================================

  getAllocatedStudentsCount(): number {

    return this.students.filter(

      student =>
        this.getStudentAllocation(
          student.id
        ) !== null

    ).length;

  }


  // =========================================================
  // PENDING STUDENTS COUNT
  // =========================================================

  getPendingStudentsCount(): number {

    return this.students.filter(

      student =>
        this.getStudentAllocation(
          student.id
        ) === null

    ).length;

  }


  // =========================================================
  // SEARCH STUDENTS
  // =========================================================

  searchStudents(
    searchText: string
  ): void {

    const search =
      searchText
        .toLowerCase()
        .trim();

    this.filteredStudents =
      this.students.filter(
        (student) => {

          const fullName =
            `${student.firstName ?? ''} ${student.lastName ?? ''}`
              .toLowerCase();

          return (

            fullName.includes(search) ||

            student.email
              ?.toLowerCase()
              .includes(search) ||

            student.studentId
              ?.toLowerCase()
              .includes(search) ||

            student.course
              ?.toLowerCase()
              .includes(search) ||

            student.phone
              ?.includes(search)

          );

        }
      );

  }


  // =========================================================
  // EDIT STUDENT
  // ADMIN ONLY
  // =========================================================

  editStudent(
    id: number
  ): void {

    if (!this.isAdmin) {

      return;

    }

    this.router.navigate([
      '/students/edit',
      id
    ]);

  }


  // =========================================================
  // DELETE STUDENT
  // ADMIN ONLY
  // =========================================================

  deleteStudent(
    id: number
  ): void {

    if (!this.isAdmin) {

      return;

    }

    const confirmed =
      confirm(
        'Are you sure you want to delete this student?'
      );

    if (!confirmed) {

      return;

    }

    this.studentService
      .deleteStudent(id)
      .subscribe({

        next: () => {

          console.log(
            'Student deleted successfully'
          );

          this.loadStudents();

        },

        error: (error) => {

          console.error(
            'Unable to delete the student:',
            error
          );

          alert(
            'Unable to delete the student. Please try again.'
          );

        }

      });

  }

}