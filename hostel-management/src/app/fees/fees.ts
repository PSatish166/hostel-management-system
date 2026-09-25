import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { FeeService } from '../services/fee';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fees.html',
  styleUrl: './fees.css'
})
export class Fees implements OnInit {

  // ROLE
  isAdmin = false;

  // DATA
  fees: any[] = [];

  loading = false;
  errorMessage = '';

  totalFees = 0;
  totalPaid = 0;
  totalPending = 0;

  constructor(
    private feeService: FeeService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ) {

    this.isAdmin =
      this.authService.getRole() === 'ADMIN';

  }

  ngOnInit(): void {
    this.loadFees();
  }

  loadFees(): void {

    this.loading = true;
    this.errorMessage = '';

    this.feeService.getFees().subscribe({

      next: (data) => {

        this.fees = data || [];

        this.calculateSummary();

        this.loading = false;

        this.changeDetectorRef.detectChanges();

      },

      error: (error) => {

        console.error(
          'Error loading fees:',
          error
        );

        this.errorMessage =
          'Unable to load fees. Please make sure the backend is running.';

        this.loading = false;

        this.changeDetectorRef.detectChanges();

      }

    });

  }

  calculateSummary(): void {

    this.totalFees =
      this.fees.reduce(
        (sum, fee) =>
          sum + Number(fee.amount || 0),
        0
      );

    this.totalPaid =
      this.fees.reduce(
        (sum, fee) =>
          sum + Number(fee.paidAmount || 0),
        0
      );

    this.totalPending =
      this.totalFees -
      this.totalPaid;

  }

  getBalance(fee: any): number {

    return (
      Number(fee.amount || 0) -
      Number(fee.paidAmount || 0)
    );

  }

  getStudentName(
    studentId: number
  ): string {

    return `Student #${studentId}`;

  }

  getStatusClass(
    status: string
  ): string {

    switch (
      status?.toUpperCase()
    ) {

      case 'PAID':
        return 'status-paid';

      case 'PARTIAL':
        return 'status-partial';

      case 'PENDING':
        return 'status-pending';

      default:
        return '';

    }

  }

  addFee(): void {

    if (!this.isAdmin) {
      return;
    }

    this.router.navigate([
      '/fees/add'
    ]);

  }

  editFee(
    id: number
  ): void {

    if (!this.isAdmin) {
      return;
    }

    this.router.navigate([
      '/fees/edit',
      id
    ]);

  }

  deleteFee(
    id: number
  ): void {

    if (!this.isAdmin) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this fee record?'
      );

    if (!confirmed) {
      return;
    }

    this.feeService
      .deleteFee(id)
      .subscribe({

        next: () => {

          this.loadFees();

        },

        error: (error) => {

          console.error(
            'Error deleting fee:',
            error
          );

          window.alert(
            'Unable to delete the fee record.'
          );

        }

      });

  }

  formatAmount(
    amount: number
  ): string {

    return Number(
      amount || 0
    ).toFixed(2);

  }

  formatDate(
    date: string
  ): string {

    if (!date) {
      return '-';
    }

    const parsedDate =
      new Date(date);

    if (
      isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      'en-IN'
    );

  }

}