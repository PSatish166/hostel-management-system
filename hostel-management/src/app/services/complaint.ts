import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private apiUrl = 'http://localhost:8080/api/complaints';

  constructor(
    private http: HttpClient
  ) {}

  getComplaints(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  getComplaintById(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  getComplaintsByStudentId(
    studentId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/student/${studentId}`
    );
  }

  getComplaintsByStatus(
    status: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/status/${status}`
    );
  }

  getComplaintsByPriority(
    priority: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/priority/${priority}`
    );
  }

  addComplaint(
    complaint: any
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      complaint
    );
  }

  updateComplaint(
    id: number,
    complaint: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      complaint
    );
  }

  deleteComplaint(
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