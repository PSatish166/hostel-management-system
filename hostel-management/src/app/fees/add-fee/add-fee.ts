import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { FeeService } from '../../services/fee';


@Component({
  selector: 'app-add-fee',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './add-fee.html',
  styleUrl: './add-fee.css'
})
export class AddFee implements OnInit {

  feeForm!: FormGroup;

  students: any[] = [];

  loadingStudents = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  private studentsApiUrl =
    'http://localhost:8080/api/students';


  constructor(
    private fb: FormBuilder,
    private feeService: FeeService,
    private router: Router,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.createForm();
    this.loadStudents();
  }


  createForm(): void {

    this.feeForm = this.fb.group({

      studentId: [
        '',
        Validators.required
      ],

      feeType: [
        '',
        Validators.required
      ],

      amount: [
        '',
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ],

      paidAmount: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      dueDate: [
        this.getTodayDate(),
        Validators.required
      ],

      paidDate: [
        ''
      ],

      remarks: [
        ''
      ]

    });
  }


  loadStudents(): void {

    this.loadingStudents = true;
    this.errorMessage = '';

    this.http
      .get<any[]>(this.studentsApiUrl)
      .subscribe({

        next: (data) => {

          console.log(
            'Students loaded:',
            data
          );

          this.students = data || [];

          this.loadingStudents = false;

          this.changeDetectorRef.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error loading students:',
            error
          );

          this.errorMessage =
            'Unable to load students. Please make sure the backend is running.';

          this.loadingStudents = false;

          this.changeDetectorRef.detectChanges();
        }

      });
  }


  getTodayDate(): string {

    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(today.getMonth() + 1)
        .padStart(2, '0');

    const day =
      String(today.getDate())
        .padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  getStudentName(student: any): string {

    const firstName =
      student.firstName || '';

    const lastName =
      student.lastName || '';

    const studentId =
      student.studentId ||
      student.id ||
      '';

    const fullName =
      `${firstName} ${lastName}`.trim();


    if (fullName && studentId) {

      return `${fullName} (${studentId})`;

    }


    if (fullName) {

      return fullName;

    }


    return `Student #${student.id}`;
  }


  getBalance(): number {

    const amount =
      Number(
        this.feeForm
          ?.get('amount')
          ?.value || 0
      );

    const paidAmount =
      Number(
        this.feeForm
          ?.get('paidAmount')
          ?.value || 0
      );

    return amount - paidAmount;
  }


  getAmountError(): string {

    const control =
      this.feeForm.get('amount');


    if (
      !control ||
      !control.touched
    ) {

      return '';

    }


    if (
      control.hasError('required')
    ) {

      return 'Fee amount is required.';

    }


    if (
      control.hasError('min')
    ) {

      return 'Fee amount must be greater than zero.';

    }


    return '';
  }


  getPaidAmountError(): string {

    const control =
      this.feeForm.get('paidAmount');


    if (
      !control ||
      !control.touched
    ) {

      return '';

    }


    if (
      control.hasError('required')
    ) {

      return 'Paid amount is required.';

    }


    if (
      control.hasError('min')
    ) {

      return 'Paid amount cannot be negative.';

    }


    return '';
  }


  saveFee(): void {

    this.errorMessage = '';
    this.successMessage = '';


    if (this.feeForm.invalid) {

      this.feeForm.markAllAsTouched();

      this.errorMessage =
        'Please complete all required fields correctly.';

      return;
    }


    const formValue =
      this.feeForm.getRawValue();


    const amount =
      Number(
        formValue.amount || 0
      );

    const paidAmount =
      Number(
        formValue.paidAmount || 0
      );


    if (amount <= 0) {

      this.errorMessage =
        'Fee amount must be greater than zero.';

      return;
    }


    if (paidAmount < 0) {

      this.errorMessage =
        'Paid amount cannot be negative.';

      return;
    }


    if (paidAmount > amount) {

      this.errorMessage =
        'Paid amount cannot be greater than fee amount.';

      return;
    }


    const fee = {

      studentId:
        Number(formValue.studentId),

      feeType:
        formValue.feeType,

      amount:
        amount,

      paidAmount:
        paidAmount,

      dueDate:
        formValue.dueDate,

      paidDate:
        paidAmount === amount &&
        formValue.paidDate
          ? formValue.paidDate
          : null,

      remarks:
        formValue.remarks || null

    };


    this.saving = true;


    this.feeService
      .addFee(fee)
      .subscribe({

        next: () => {

          this.saving = false;

          this.successMessage =
            'Fee record added successfully.';


          setTimeout(() => {

            this.router.navigate([
              '/fees'
            ]);

          }, 700);

        },


        error: (error) => {

          console.error(
            'Error adding fee:',
            error
          );

          this.saving = false;


          if (
            typeof error.error === 'string'
          ) {

            this.errorMessage =
              error.error;

          } else {

            this.errorMessage =
              'Unable to add the fee record. Please try again.';

          }

        }

      });
  }


  cancel(): void {

    this.router.navigate([
      '/fees'
    ]);

  }

}