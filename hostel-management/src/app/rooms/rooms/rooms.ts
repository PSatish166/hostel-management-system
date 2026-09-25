import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { RoomService } from '../../services/room';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-rooms',
  imports: [RouterLink],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css'
})
export class Rooms implements OnInit {

  // =========================================================
  // ROLE
  // =========================================================

  isAdmin = false;


  // =========================================================
  // DATA
  // =========================================================

  rooms: any[] = [];

  filteredRooms: any[] = [];

  loading = true;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
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

    this.loadRooms();

  }


  // =========================================================
  // LOAD ROOMS
  // =========================================================

  loadRooms(): void {

    console.log(
      'Loading rooms...'
    );

    this.loading = true;

    this.roomService
      .getRooms()
      .subscribe({

        next: (data) => {

          console.log(
            'Rooms received:',
            data
          );

          this.rooms = data;

          this.filteredRooms = data;

          this.loading = false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Unable to load rooms:',
            error
          );

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // SEARCH ROOMS
  // =========================================================

  searchRooms(
    searchText: string
  ): void {

    const search =
      searchText
        .toLowerCase()
        .trim();


    this.filteredRooms =
      this.rooms.filter((room) => {

        return (

          room.roomNumber
            ?.toLowerCase()
            .includes(search) ||

          room.floor
            ?.toLowerCase()
            .includes(search) ||

          room.roomType
            ?.toLowerCase()
            .includes(search) ||

          room.status
            ?.toLowerCase()
            .includes(search)

        );

      });

  }


  // =========================================================
  // GET AVAILABLE BEDS
  // =========================================================

  getAvailableBeds(
    room: any
  ): number {

    return (
      (room.capacity ?? 0) -
      (room.occupiedBeds ?? 0)
    );

  }


  // =========================================================
  // EDIT ROOM
  // ADMIN ONLY
  // =========================================================

  editRoom(
    id: number
  ): void {

    if (!this.isAdmin) {

      return;

    }

    this.router.navigate([
      '/rooms/edit',
      id
    ]);

  }


  // =========================================================
  // DELETE ROOM
  // ADMIN ONLY
  // =========================================================

  deleteRoom(
    id: number
  ): void {

    if (!this.isAdmin) {

      return;

    }

    const confirmed =
      confirm(
        'Are you sure you want to delete this room?'
      );


    if (!confirmed) {

      return;

    }


    this.roomService
      .deleteRoom(id)
      .subscribe({

        next: () => {

          this.loadRooms();

        },


        error: (error) => {

          console.error(
            'Unable to delete room:',
            error
          );

          alert(
            'Unable to delete the room. Please try again.'
          );

        }

      });

  }


  // =========================================================
  // TOTAL ROOMS
  // =========================================================

  getTotalRooms(): number {

    return this.rooms.length;

  }


  // =========================================================
  // AVAILABLE ROOMS
  // =========================================================

  getAvailableRooms(): number {

    return this.rooms.filter(
      room =>
        room.status === 'AVAILABLE'
    ).length;

  }


  // =========================================================
  // PARTIAL ROOMS
  // =========================================================

  getPartialRooms(): number {

    return this.rooms.filter(
      room =>
        room.status === 'PARTIAL'
    ).length;

  }


  // =========================================================
  // FULL ROOMS
  // =========================================================

  getFullRooms(): number {

    return this.rooms.filter(
      room =>
        room.status === 'FULL'
    ).length;

  }

}