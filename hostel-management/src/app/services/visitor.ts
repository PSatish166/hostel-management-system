import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private apiUrl = 'http://localhost:8080/api/visitors';

  constructor(
    private http: HttpClient
  ) {}


  getVisitors(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl
    );

  }


  getVisitorById(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );

  }


  getVisitorsByStudentId(
    studentId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/student/${studentId}`
    );

  }


  getVisitorsByDate(
    date: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/date/${date}`
    );

  }


  getVisitorsByStatus(
    status: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/status/${status}`
    );

  }


  addVisitor(
    visitor: any
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      visitor
    );

  }


  updateVisitor(
    id: number,
    visitor: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      visitor
    );

  }


  deleteVisitor(
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