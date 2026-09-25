import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RoomService } from '../../services/room';

@Component({
  selector: 'app-edit-room',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './edit-room.html',
  styleUrl: './edit-room.css'
})
export class EditRoom implements OnInit {

  roomForm: FormGroup;

  roomId!: number;

  loading = true;

  saving = false;

  private readonly roomTypeCapacity: Record<string, number> = {
    Single: 1,
    Double: 2,
    Triple: 3,
    'Four Bed': 4
  };

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.roomForm = this.fb.group({
      roomNumber: [
        '',
        Validators.required
      ],

      floor: [
        '',
        Validators.required
      ],

      roomType: [
        '',
        Validators.required
      ],

      capacity: [
        { value: 1, disabled: true },
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      occupiedBeds: [
        0,
        [
          Validators.min(0)
        ]
      ]
    });

    this.roomForm.get('roomType')?.valueChanges.subscribe(
      (roomType: string) => {
        this.updateCapacityFromRoomType(roomType);
      }
    );
  }

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {

      alert('Invalid room ID.');

      this.router.navigate([
        '/rooms'
      ]);

      return;
    }

    this.roomId = Number(id);

    this.loadRoom();
  }

  loadRoom(): void {

    this.loading = true;

    this.roomService
      .getRoomById(this.roomId)
      .subscribe({

        next: (room) => {

          console.log(
            'Room received:',
            room
          );

          this.roomForm.patchValue(
            {
              roomNumber:
                room.roomNumber ?? '',

              floor:
                room.floor ?? '',

              roomType:
                room.roomType ?? '',

              occupiedBeds:
                room.occupiedBeds ?? 0
            },
            {
              emitEvent: false
            }
          );

          const roomType =
            room.roomType ?? '';

          const automaticCapacity =
            this.roomTypeCapacity[roomType];

          const capacity =
            automaticCapacity ??
            room.capacity ??
            1;

          this.roomForm
            .get('capacity')
            ?.setValue(
              capacity,
              {
                emitEvent: false
              }
            );

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Unable to load room:',
            error
          );

          this.loading = false;

          this.cdr.detectChanges();

          alert(
            'Unable to load room details.'
          );
        }

      });
  }

  private updateCapacityFromRoomType(
    roomType: string
  ): void {

    const capacity =
      this.roomTypeCapacity[roomType];

    if (capacity === undefined) {
      return;
    }

    const occupiedBeds =
      Number(
        this.roomForm
          .get('occupiedBeds')
          ?.value ?? 0
      );

    if (occupiedBeds > capacity) {

      alert(
        `This room has ${occupiedBeds} occupied bed(s). ` +
        `A ${roomType} room can have only ${capacity} bed(s).`
      );

      return;
    }

    this.roomForm
      .get('capacity')
      ?.setValue(
        capacity,
        {
          emitEvent: false
        }
      );
  }

  updateRoom(): void {

    if (this.roomForm.invalid) {

      this.roomForm.markAllAsTouched();

      return;
    }

    const formValue =
      this.roomForm.getRawValue();

    const capacity =
      Number(formValue.capacity);

    const occupiedBeds =
      Number(formValue.occupiedBeds);

    if (occupiedBeds < 0) {

      alert(
        'Occupied beds cannot be less than 0.'
      );

      return;
    }

    if (occupiedBeds > capacity) {

      alert(
        'Occupied beds cannot be greater than room capacity.'
      );

      return;
    }

    const room = {

      roomNumber:
        formValue.roomNumber,

      floor:
        formValue.floor,

      roomType:
        formValue.roomType,

      capacity:
        capacity,

      occupiedBeds:
        occupiedBeds
    };

    this.saving = true;

    this.roomService
      .updateRoom(
        this.roomId,
        room
      )
      .subscribe({

        next: (updatedRoom) => {

          console.log(
            'Room updated:',
            updatedRoom
          );

          alert(
            'Room updated successfully!'
          );

          this.router.navigate([
            '/rooms'
          ]);
        },

        error: (error) => {

          console.error(
            'Unable to update room:',
            error
          );

          this.saving = false;

          alert(
            'Unable to update room. Please try again.'
          );
        }

      });
  }
}