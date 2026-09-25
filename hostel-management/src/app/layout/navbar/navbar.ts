import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';
import { ComplaintService } from '../../services/complaint';
import { FeeService } from '../../services/fee';
import { VisitorService } from '../../services/visitor';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  username = 'Admin';

  role = 'Administrator';

  notificationOpen = false;

  complaintCount = 0;

  feeCount = 0;

  visitorCount = 0;

  notificationCount = 0;

  constructor(
    private authService: AuthService,
    private complaintService: ComplaintService,
    private feeService: FeeService,
    private visitorService: VisitorService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {

    this.username =
      this.authService.getUsername() || 'Admin';

    const savedRole =
      this.authService.getRole();

    if (savedRole) {

      this.role =
        savedRole.charAt(0).toUpperCase() +
        savedRole.slice(1).toLowerCase();

    }

  }

  ngOnInit(): void {

    /*
     * Do not load notifications on the login page.
     * Notification APIs require authentication.
     */
    if (!this.authService.isLoggedIn()) {

      return;

    }

    this.loadNotifications();

  }

  loadNotifications(): void {

    this.loadComplaintNotifications();

    this.loadFeeNotifications();

    this.loadVisitorNotifications();

  }

  loadComplaintNotifications(): void {

    this.complaintService
      .getComplaints()
      .subscribe({

        next: (complaints) => {

          this.complaintCount =
            (complaints || []).filter(
              complaint => {

                const status =
                  String(
                    complaint.status ?? ''
                  ).toUpperCase();

                return (
                  status === 'OPEN' ||
                  status === 'IN_PROGRESS'
                );

              }
            ).length;

          this.calculateNotificationCount();

        },

        error: (error) => {

          console.error(
            'Error loading complaint notifications:',
            error
          );

          this.complaintCount = 0;

          this.calculateNotificationCount();

        }

      });

  }

  loadFeeNotifications(): void {

    this.feeService
      .getFees()
      .subscribe({

        next: (fees) => {

          this.feeCount =
            (fees || []).filter(
              fee => {

                const status =
                  String(
                    fee.status ?? ''
                  ).toUpperCase();

                return (
                  status === 'PENDING' ||
                  status === 'PARTIAL'
                );

              }
            ).length;

          this.calculateNotificationCount();

        },

        error: (error) => {

          console.error(
            'Error loading fee notifications:',
            error
          );

          this.feeCount = 0;

          this.calculateNotificationCount();

        }

      });

  }

  loadVisitorNotifications(): void {

    this.visitorService
      .getVisitors()
      .subscribe({

        next: (visitors) => {

          this.visitorCount =
            (visitors || []).filter(
              visitor => {

                const status =
                  String(
                    visitor.status ?? ''
                  ).toUpperCase();

                return status === 'CHECKED_IN';

              }
            ).length;

          this.calculateNotificationCount();

        },

        error: (error) => {

          console.error(
            'Error loading visitor notifications:',
            error
          );

          this.visitorCount = 0;

          this.calculateNotificationCount();

        }

      });

  }

  calculateNotificationCount(): void {

    this.notificationCount =
      this.complaintCount +
      this.feeCount +
      this.visitorCount;

    this.changeDetectorRef.detectChanges();

  }

  toggleNotifications(): void {

    this.notificationOpen =
      !this.notificationOpen;

  }

  closeNotifications(): void {

    this.notificationOpen = false;

  }

  openComplaints(): void {

    this.closeNotifications();

    this.router.navigate([
      '/complaints'
    ]);

  }

  openFees(): void {

    this.closeNotifications();

    this.router.navigate([
      '/fees'
    ]);

  }

  openVisitors(): void {

    this.closeNotifications();

    this.router.navigate([
      '/visitors'
    ]);

  }

}