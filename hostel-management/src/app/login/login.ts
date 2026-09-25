import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    this.errorMessage = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter username and password.';
      return;
    }

    this.loading = true;

    this.authService
      .login(
        this.username.trim(),
        this.password
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.router.navigate(['/']);

        },

        error: (error) => {

          this.loading = false;

          console.error(
            'Login failed:',
            error
          );

          if (error.status === 401 || error.status === 403) {

            this.errorMessage =
              'Invalid username or password.';

          } else {

            this.errorMessage =
              'Unable to connect to the server. Please make sure the backend is running.';

          }

        }

      });
  }
}