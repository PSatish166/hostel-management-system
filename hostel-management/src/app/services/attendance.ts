import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'http://localhost:8080/api/attendance';

  constructor(
    private http: HttpClient
  ) {}

  getAttendance(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  getAttendanceById(
    id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  getAttendanceByStudentId(
    studentId: number
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/student/${studentId}`
    );
  }

  getAttendanceByDate(
    date: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/date/${date}`
    );
  }

  getAttendanceByStatus(
    status: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/status/${status}`
    );
  }

  addAttendance(
    attendance: any
  ): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      attendance
    );
  }

  updateAttendance(
    id: number,
    attendance: any
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      attendance
    );
  }

  deleteAttendance(
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