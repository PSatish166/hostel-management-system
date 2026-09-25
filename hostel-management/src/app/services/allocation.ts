import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllocationService {

  private apiUrl = 'http://localhost:8080/api/allocations';

  constructor(private http: HttpClient) {}

  getAllocations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAllocationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addAllocation(allocation: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      allocation
    );
  }

  updateAllocation(
    id: number,
    allocation: any
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      allocation
    );
  }

  deleteAllocation(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}