import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { AllocationService } from '../../services/allocation';
import { StudentService } from '../../services/student.service';
import { RoomService } from '../../services/room';

@Component({
  selector: 'app-add-allocation',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './add-allocation.html',
  styleUrl: './add-allocation.css'
})
export class AddAllocation implements OnInit {

  number = Number;

  allocationForm: FormGroup;

  students: any[] = [];

  rooms: any[] = [];

  allocations: any[] = [];

  beds: string[] = [];

  saving = false;

  loadingStudents = false;

  loadingRooms = false;

  loadingAllocations = false;

  constructor(
    private fb: FormBuilder,
    private allocationService: AllocationService,
    private studentService: StudentService,
    private roomService: RoomService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    this.allocationForm = this.fb.group({

      studentId: [
        '',
        Validators.required
      ],

      roomId: [
        '',
        Validators.required
      ],

      bedNumber: [
        '',
        Validators.required
      ],

      allocationDate: [
        this.getTodayDate(),
        Validators.required
      ],

      status: [
        'ACTIVE',
        Validators.required
      ]

    });

  }

  ngOnInit(): void {

    this.loadStudents();

    this.loadRooms();

    this.loadAllocations();

    // Whenever the room changes,
    // recalculate the available beds.
    this.allocationForm
      .get('roomId')
      ?.valueChanges
      .subscribe((roomId) => {

        this.updateBeds(roomId);

      });

  }


  // =========================================================
  // LOAD STUDENTS
  // =========================================================

  loadStudents(): void {

    this.loadingStudents = true;

    this.studentService
      .getStudents()
      .subscribe({

        next: (data) => {

          console.log(
            'Students loaded for allocation:',
            data
          );

          const allStudents =
            Array.isArray(data)
              ? [...data]
              : [];

          /*
           * Only show students who do NOT already
           * have an ACTIVE allocation.
           */
          this.students =
            allStudents.filter(
              (student: any) => {

                const studentId =
                  Number(student.id);

                const alreadyAllocated =
                  this.allocations.some(
                    (allocation: any) => {

                      return (
                        Number(
                          allocation.studentId
                        ) === studentId &&

                        String(
                          allocation.status ?? ''
                        ).toUpperCase() === 'ACTIVE'
                      );

                    }
                  );

                return !alreadyAllocated;

              }
            );

          this.loadingStudents = false;

          console.log(
            'Available students:',
            this.students
          );

          console.log(
            'Students count:',
            this.students.length
          );

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Unable to load students:',
            error
          );

          this.students = [];

          this.loadingStudents = false;

          this.cdr.detectChanges();

          alert(
            'Unable to load students. Please try again.'
          );

        }

      });

  }


  // =========================================================
  // LOAD ROOMS
  // =========================================================

  loadRooms(): void {

    this.loadingRooms = true;

    this.roomService
      .getRooms()
      .subscribe({

        next: (data) => {

          console.log(
            'Rooms loaded for allocation:',
            data
          );

          const allRooms =
            Array.isArray(data)
              ? [...data]
              : [];

          /*
           * Only show rooms which have at least
           * one available bed.
           */
          this.rooms =
            allRooms.filter(
              (room: any) => {

                const capacity =
                  Number(
                    room.capacity ?? 0
                  );

                const occupiedBeds =
                  Number(
                    room.occupiedBeds ?? 0
                  );

                const status =
                  String(
                    room.status ?? ''
                  ).toUpperCase();

                return (
                  capacity > occupiedBeds &&
                  status !== 'MAINTENANCE'
                );

              }
            );

          this.loadingRooms = false;

          console.log(
            'Available rooms for allocation:',
            this.rooms
          );

          console.log(
            'Rooms count:',
            this.rooms.length
          );

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Unable to load rooms:',
            error
          );

          this.rooms = [];

          this.loadingRooms = false;

          this.cdr.detectChanges();

          alert(
            'Unable to load rooms. Please try again.'
          );

        }

      });

  }


  // =========================================================
  // LOAD EXISTING ALLOCATIONS
  // =========================================================

  loadAllocations(): void {

    this.loadingAllocations = true;

    this.allocationService
      .getAllocations()
      .subscribe({

        next: (data) => {

          console.log(
            'Existing allocations:',
            data
          );

          this.allocations =
            Array.isArray(data)
              ? [...data]
              : [];

          this.loadingAllocations = false;

          /*
           * IMPORTANT:
           *
           * If the room was already selected before
           * allocations finished loading, recalculate
           * the beds now.
           *
           * This fixes the problem where a room with
           * 2 available beds was showing all 4 beds.
           */
          const selectedRoomId =
            this.allocationForm
              .get('roomId')
              ?.value;

          if (selectedRoomId) {

            this.updateBeds(
              selectedRoomId
            );

          }

          console.log(
            'Allocations count:',
            this.allocations.length
          );

          /*
           * Recalculate the student list after
           * allocations have loaded.
           *
           * This prevents already allocated students
           * from appearing in the new allocation form.
           */
          const currentStudents =
            [...this.students];

          this.students =
            currentStudents.filter(
              (student: any) => {

                const studentId =
                  Number(student.id);

                return !this.allocations.some(
                  (allocation: any) => {

                    return (
                      Number(
                        allocation.studentId
                      ) === studentId &&

                      String(
                        allocation.status ?? ''
                      ).toUpperCase() === 'ACTIVE'
                    );

                  }
                );

              }
            );

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Unable to load allocations:',
            error
          );

          this.allocations = [];

          this.loadingAllocations = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // UPDATE AVAILABLE BEDS
  // =========================================================

  updateBeds(roomId: any): void {

    /*
     * Always clear the previous bed selection
     * when the room changes.
     */
    this.beds = [];

    this.allocationForm
      .get('bedNumber')
      ?.setValue('');

    if (!roomId) {

      return;

    }


    // ---------------------------------------------------------
    // Find selected room
    // ---------------------------------------------------------

    const selectedRoom =
      this.rooms.find(
        (room: any) =>
          Number(room.id) ===
          Number(roomId)
      );


    if (!selectedRoom) {

      console.log(
        'Selected room not found:',
        roomId
      );

      return;

    }


    // ---------------------------------------------------------
    // Room capacity
    // ---------------------------------------------------------

    const capacity =
      Number(
        selectedRoom.capacity ?? 0
      );


    if (capacity <= 0) {

      return;

    }


    // ---------------------------------------------------------
    // Generate all beds
    // ---------------------------------------------------------

    const allBeds: string[] = [];

    for (
      let index = 1;
      index <= capacity;
      index++
    ) {

      allBeds.push(
        `BED-${index}`
      );

    }


    // ---------------------------------------------------------
    // Find ACTIVE allocations for this room
    // ---------------------------------------------------------

    const occupiedBedNumbers =
      this.allocations
        .filter(
          (allocation: any) => {

            return (

              Number(
                allocation.roomId
              ) === Number(roomId)

              &&

              String(
                allocation.status ?? ''
              ).toUpperCase() === 'ACTIVE'

            );

          }
        )
        .map(
          (allocation: any) =>
            String(
              allocation.bedNumber ?? ''
            )
              .trim()
              .toUpperCase()
        )
        .filter(
          (bedNumber: string) =>
            bedNumber !== ''
        );


    // ---------------------------------------------------------
    // Calculate occupied beds
    // ---------------------------------------------------------

    const occupiedSet =
      new Set<string>(
        occupiedBedNumbers
      );


    /*
     * IMPORTANT:
     *
     * We use the actual ACTIVE allocations to determine
     * which specific beds are occupied.
     *
     * Example:
     *
     * Capacity = 4
     * Existing allocations:
     * BED-1
     * BED-2
     *
     * Available:
     * BED-3
     * BED-4
     */

    this.beds =
      allBeds.filter(
        (bed: string) =>
          !occupiedSet.has(
            bed.toUpperCase()
          )
      );


    // ---------------------------------------------------------
    // Safety check using room occupied count
    // ---------------------------------------------------------

    const roomOccupiedBeds =
      Number(
        selectedRoom.occupiedBeds ?? 0
      );

    const requiredOccupiedCount =
      Math.min(
        roomOccupiedBeds,
        capacity
      );


    /*
     * If the room says that beds are occupied but
     * the allocation table does not contain all of
     * those bed numbers, fill the missing occupied
     * positions from the beginning.
     *
     * This protects the UI from inconsistent room data.
     */
    if (
      occupiedSet.size <
      requiredOccupiedCount
    ) {

      for (
        const bed of allBeds
      ) {

        if (
          occupiedSet.size >=
          requiredOccupiedCount
        ) {

          break;

        }

        const normalizedBed =
          bed.toUpperCase();

        if (
          !occupiedSet.has(
            normalizedBed
          )
        ) {

          occupiedSet.add(
            normalizedBed
          );

        }

      }

      /*
       * Recalculate after filling missing
       * occupied positions.
       */
      this.beds =
        allBeds.filter(
          (bed: string) =>
            !occupiedSet.has(
              bed.toUpperCase()
            )
        );

    }


    // ---------------------------------------------------------
    // Debug information
    // ---------------------------------------------------------

    console.log(
      'Selected room:',
      selectedRoom.roomNumber
    );

    console.log(
      'Room capacity:',
      capacity
    );

    console.log(
      'Room occupiedBeds:',
      roomOccupiedBeds
    );

    console.log(
      'Existing allocated beds:',
      occupiedBedNumbers
    );

    console.log(
      'Final occupied beds:',
      Array.from(
        occupiedSet
      )
    );

    console.log(
      'Available beds:',
      this.beds
    );

    console.log(
      'Available bed count:',
      this.beds.length
    );


    this.cdr.detectChanges();

  }


  // =========================================================
  // GET TODAY DATE
  // =========================================================

  private getTodayDate(): string {

    const today =
      new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      )
        .padStart(2, '0');

    const day =
      String(
        today.getDate()
      )
        .padStart(2, '0');

    return `${year}-${month}-${day}`;

  }


  // =========================================================
  // SAVE ALLOCATION
  // =========================================================

  saveAllocation(): void {

    if (
      this.allocationForm.invalid
    ) {

      this.allocationForm
        .markAllAsTouched();

      return;

    }


    const allocation = {

      studentId:
        Number(
          this.allocationForm
            .get('studentId')
            ?.value
        ),

      roomId:
        Number(
          this.allocationForm
            .get('roomId')
            ?.value
        ),

      bedNumber:
        this.allocationForm
          .get('bedNumber')
          ?.value,

      allocationDate:
        this.allocationForm
          .get('allocationDate')
          ?.value,

      status:
        this.allocationForm
          .get('status')
          ?.value

    };


    console.log(
      'Sending allocation:',
      allocation
    );


    this.saving = true;


    this.allocationService
      .addAllocation(allocation)
      .subscribe({

        next: (savedAllocation) => {

          console.log(
            'Allocation saved:',
            savedAllocation
          );

          alert(
            'Room allocation saved successfully!'
          );

          this.router.navigate([
            '/allocation'
          ]);

        },

        error: (error) => {

          console.error(
            'Unable to save allocation:',
            error
          );

          this.saving = false;

          /*
           * Show backend validation message
           * when available.
           */
          const backendMessage =
            error?.error?.message;

          alert(
            backendMessage ||
            'Unable to save allocation. Please try again.'
          );

          this.cdr.detectChanges();

        }

      });

  }

}