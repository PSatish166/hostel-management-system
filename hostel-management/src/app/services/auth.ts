import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(
    username: string,
    password: string
  ): Observable<LoginResponse> {

    const request: LoginRequest = {
      username,
      password
    };

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        request
      )
      .pipe(
        tap(response => {

          localStorage.setItem(
            'authToken',
            response.token
          );

          localStorage.setItem(
            'username',
            response.username
          );

          localStorage.setItem(
            'role',
            response.role
          );

        })
      );
  }

  register(
    username: string,
    password: string
  ): Observable<any> {

    const request: LoginRequest = {
      username,
      password
    };

    return this.http.post(
      `${this.apiUrl}/register`,
      request
    );
  }

  logout(): void {

    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }

  getToken(): string | null {

    return localStorage.getItem('authToken');
  }

  getUsername(): string | null {

    return localStorage.getItem('username');
  }

  getRole(): string | null {

    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {

    return !!this.getToken();
  }
}