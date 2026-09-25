import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    this.isAdmin =
      this.authService.getRole() === 'ADMIN';
  }

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);
  }
}