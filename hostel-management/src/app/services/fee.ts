import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeeService {

  private apiUrl = 'http://localhost:8080/api/fees';

  constructor(
    private http: HttpClient
  ) {}

  getFees(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  getFeeById(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  getFeesByStudentId(
    studentId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/student/${studentId}`
    );
  }

  getFeesByStatus(
    status: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/status/${status}`
    );
  }

  addFee(
    fee: any
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      fee
    );
  }

  updateFee(
    id: number,
    fee: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      fee
    );
  }

  deleteFee(
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