import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { AllocationService } from '../../services/allocation';
import { StudentService } from '../../services/student.service';
import { RoomService } from '../../services/room';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-allocation',
  imports: [RouterLink],
  templateUrl: './allocation.html',
  styleUrl: './allocation.css'
})
export class Allocation implements OnInit {

  // =========================================================
  // ROLE
  // =========================================================

  isAdmin = false;


  // =========================================================
  // DATA
  // =========================================================

  allocations: any[] = [];

  filteredAllocations: any[] = [];

  students: any[] = [];

  rooms: any[] = [];

  loading = false;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private router: Router,
    private allocationService: AllocationService,
    private studentService: StudentService,
    private roomService: RoomService,
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

    this.loadAllocations();

  }


  // =========================================================
  // LOAD ALLOCATIONS, STUDENTS AND ROOMS
  // =========================================================

  loadAllocations(): void {

    this.loading = true;

    this.cdr.detectChanges();


    this.studentService
      .getStudents()
      .subscribe({

        next: (students) => {

          this.students =
            students ?? [];


          this.roomService
            .getRooms()
            .subscribe({

              next: (rooms) => {

                this.rooms =
                  rooms ?? [];


                this.allocationService
                  .getAllocations()
                  .subscribe({

                    next: (data) => {

                      console.log(
                        'Allocations loaded:',
                        data
                      );


                      this.allocations =
                        (data ?? []).map(
                          (allocation) => {

                            const student =
                              this.students.find(
                                s =>
                                  Number(s.id) ===
                                  Number(
                                    allocation.studentId
                                  )
                              );


                            const room =
                              this.rooms.find(
                                r =>
                                  Number(r.id) ===
                                  Number(
                                    allocation.roomId
                                  )
                              );


                            return {

                              ...allocation,

                              studentName:
                                student
                                  ? `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim()
                                  : `Student #${allocation.studentId}`,

                              roomNumber:
                                room
                                  ? room.roomNumber
                                  : `Room #${allocation.roomId}`

                            };

                          }
                        );


                      this.filteredAllocations = [
                        ...this.allocations
                      ];


                      this.loading = false;


                      console.log(
                        'Final allocation data:',
                        this.allocations
                      );


                      this.cdr.detectChanges();

                    },


                    error: (error) => {

                      console.error(
                        'Error loading allocations:',
                        error
                      );


                      this.allocations = [];

                      this.filteredAllocations = [];

                      this.loading = false;

                      this.cdr.detectChanges();

                    }

                  });

              },


              error: (error) => {

                console.error(
                  'Error loading rooms:',
                  error
                );


                this.allocations = [];

                this.filteredAllocations = [];

                this.loading = false;

                this.cdr.detectChanges();

              }

            });

        },


        error: (error) => {

          console.error(
            'Error loading students:',
            error
          );


          this.allocations = [];

          this.filteredAllocations = [];

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // SEARCH ALLOCATIONS
  // =========================================================

  searchAllocations(
    searchText: string
  ): void {

    const search =
      searchText
        .toLowerCase()
        .trim();


    this.filteredAllocations =
      this.allocations.filter(
        (allocation) => {

          return (

            String(
              allocation.studentName ?? ''
            )
              .toLowerCase()
              .includes(search) ||

            String(
              allocation.studentId ?? ''
            )
              .toLowerCase()
              .includes(search) ||

            String(
              allocation.roomNumber ?? ''
            )
              .toLowerCase()
              .includes(search) ||

            String(
              allocation.roomId ?? ''
            )
              .toLowerCase()
              .includes(search) ||

            String(
              allocation.bedNumber ?? ''
            )
              .toLowerCase()
              .includes(search) ||

            String(
              allocation.status ?? ''
            )
              .toLowerCase()
              .includes(search)

          );

        }
      );

  }


  // =========================================================
  // ACTIVE ALLOCATIONS
  // =========================================================

  getActiveAllocations(): number {

    return this.allocations.filter(
      allocation =>
        allocation.status === 'ACTIVE'
    ).length;

  }


  // =========================================================
  // OCCUPIED BEDS
  // =========================================================

  getOccupiedBeds(): number {

    return this.allocations.filter(
      allocation =>
        allocation.status === 'ACTIVE'
    ).length;

  }


  // =========================================================
  // ALLOCATED STUDENTS
  // =========================================================

  getAllocatedStudents(): number {

    return this.allocations.filter(
      allocation =>
        allocation.status === 'ACTIVE'
    ).length;

  }


  // =========================================================
  // EDIT ALLOCATION
  // ADMIN ONLY
  // =========================================================

  editAllocation(
    id: number
  ): void {

    if (!this.isAdmin) {

      return;

    }


    this.router.navigate([
      '/allocation/edit',
      id
    ]);

  }


  // =========================================================
  // DELETE ALLOCATION
  // ADMIN ONLY
  // =========================================================

  deleteAllocation(
    id: number
  ): void {

    if (!this.isAdmin) {

      return;

    }


    const confirmed =
      confirm(
        'Are you sure you want to delete this allocation?'
      );


    if (!confirmed) {

      return;

    }


    console.log(
      'Deleting allocation:',
      id
    );


    this.allocationService
      .deleteAllocation(id)
      .subscribe({

        next: () => {

          console.log(
            'Allocation deleted successfully:',
            id
          );


          this.loadAllocations();

        },


        error: (error) => {

          console.error(
            'Error deleting allocation:',
            error
          );


          alert(
            'Failed to delete allocation. Please try again.'
          );

        }

      });

  }

}