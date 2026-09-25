import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

import { Navbar } from './layout/navbar/navbar';
import { Sidebar } from './layout/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    Sidebar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  title = 'Hostel Management System';

  showLayout = true;

  constructor(
    private router: Router
  ) {

    this.applySavedSettings();

    this.showLayout =
      !this.router.url.startsWith('/login');

    this.router.events
      .pipe(
        filter(
          event => event instanceof NavigationEnd
        )
      )
      .subscribe(
        (event: NavigationEnd) => {

          this.showLayout =
            !event.urlAfterRedirects.startsWith('/login');

        }
      );
  }

  private applySavedSettings(): void {

    const savedSettings =
      localStorage.getItem('hostelSettings');

    if (!savedSettings) {
      return;
    }

    try {

      const settings = JSON.parse(savedSettings);

      if (settings.compactMode === true) {

        document.body.classList.add('compact-mode');

      } else {

        document.body.classList.remove('compact-mode');

      }

    } catch (error) {

      console.error(
        'Unable to apply saved settings:',
        error
      );

    }
  }
}