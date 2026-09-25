import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room';

@Component({
  selector: 'app-add-room',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-room.html',
  styleUrl: './add-room.css'
})
export class AddRoom {

  roomForm: FormGroup;

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
    private router: Router
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

  private updateCapacityFromRoomType(roomType: string): void {
    const capacity = this.roomTypeCapacity[roomType] ?? 1;

    this.roomForm.get('capacity')?.setValue(
      capacity,
      { emitEvent: false }
    );
  }

  saveRoom(): void {
    if (this.roomForm.invalid) {
      this.roomForm.markAllAsTouched();
      return;
    }

    const formValue = this.roomForm.getRawValue();

    const capacity = Number(formValue.capacity);
    const occupiedBeds = Number(formValue.occupiedBeds);

    if (occupiedBeds < 0) {
      alert('Occupied beds cannot be less than 0.');
      return;
    }

    if (occupiedBeds > capacity) {
      alert(
        'Occupied beds cannot be greater than room capacity.'
      );
      return;
    }

    const room = {
      roomNumber: formValue.roomNumber,
      floor: formValue.floor,
      roomType: formValue.roomType,
      capacity: capacity,
      occupiedBeds: occupiedBeds
    };

    this.saving = true;

    this.roomService
      .addRoom(room)
      .subscribe({
        next: (savedRoom) => {
          console.log(
            'Room saved successfully:',
            savedRoom
          );

          alert(
            'Room added successfully!'
          );

          this.router.navigate([
            '/rooms'
          ]);
        },

        error: (error) => {
          console.error(
            'Unable to save room:',
            error
          );

          this.saving = false;

          if (error.status === 409) {
            alert(
              'Room number already exists.'
            );
          } else {
            alert(
              'Unable to save the room. Please try again.'
            );
          }
        }
      });
  }
}