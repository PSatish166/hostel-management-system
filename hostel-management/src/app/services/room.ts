import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiUrl = 'http://localhost:8080/api/rooms';

  constructor(
    private http: HttpClient
  ) {}

  // Get all rooms
  getRooms(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  // Get one room
  getRoomById(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  // Add room
  addRoom(
    room: any
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      room
    );
  }

  // Update room
  updateRoom(
    id: number,
    room: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      room
    );
  }

  // Delete room
  deleteRoom(
    id: number
  ): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        responseType: 'text'
      }
    );
  }
}