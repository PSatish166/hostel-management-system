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

import { VisitorService } from '../../services/visitor';


@Component({
  selector: 'app-add-visitor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-visitor.html',
  styleUrl: './add-visitor.css'
})
export class AddVisitor implements OnInit {

  visitorForm!: FormGroup;

  students: any[] = [];

  loadingStudents = false;

  saving = false;

  errorMessage = '';

  successMessage = '';

  private studentsApiUrl =
    'http://localhost:8080/api/students';


  constructor(
    private fb: FormBuilder,
    private visitorService: VisitorService,
    private router: Router,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.createForm();

    this.loadStudents();

    this.handleStatusChanges();

  }


  createForm(): void {

    this.visitorForm = this.fb.group({

      studentId: [
        '',
        Validators.required
      ],

      visitorName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      relation: [
        '',
        Validators.maxLength(50)
      ],

      visitDate: [
        this.getTodayDate(),
        Validators.required
      ],

      checkInTime: [
        this.getCurrentTime()
      ],

      checkOutTime: [
        ''
      ],

      purpose: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      status: [
        'CHECKED_IN',
        Validators.required
      ],

      remarks: [
        '',
        Validators.maxLength(500)
      ]

    });

  }


  loadStudents(): void {

    this.loadingStudents = true;

    this.http
      .get<any[]>(
        this.studentsApiUrl
      )
      .subscribe({

        next: (data) => {

          this.students =
            data || [];

          this.loadingStudents =
            false;

          this.changeDetectorRef
            .detectChanges();

        },

        error: (error) => {

          console.error(
            'Error loading students:',
            error
          );

          this.students = [];

          this.loadingStudents =
            false;

          this.errorMessage =
            'Unable to load students. Please make sure the backend is running.';

          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  getStudentName(
    student: any
  ): string {

    const firstName =
      student.firstName || '';

    const lastName =
      student.lastName || '';

    const studentCode =
      student.studentId ||
      student.id ||
      '';

    const fullName =
      `${firstName} ${lastName}`.trim();


    if (
      fullName &&
      studentCode
    ) {

      return `${fullName} (${studentCode})`;

    }


    if (fullName) {

      return fullName;

    }


    return `Student #${student.id}`;

  }


  getTodayDate(): string {

    const today =
      new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        today.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }


  getCurrentTime(): string {

    const now =
      new Date();

    const hours =
      String(
        now.getHours()
      ).padStart(2, '0');

    const minutes =
      String(
        now.getMinutes()
      ).padStart(2, '0');

    return `${hours}:${minutes}`;

  }


  handleStatusChanges(): void {

    this.visitorForm
      .get('status')
      ?.valueChanges
      .subscribe(
        (status: string) => {

          const checkInControl =
            this.visitorForm
              .get('checkInTime');

          const checkOutControl =
            this.visitorForm
              .get('checkOutTime');


          if (
            status === 'CANCELLED'
          ) {

            checkInControl?.setValue(
              ''
            );

            checkOutControl?.setValue(
              ''
            );

            checkInControl?.disable({
              emitEvent: false
            });

            checkOutControl?.disable({
              emitEvent: false
            });

          } else if (
            status === 'CHECKED_OUT'
          ) {

            checkInControl?.enable({
              emitEvent: false
            });

            checkOutControl?.enable({
              emitEvent: false
            });

            if (
              !checkOutControl?.value
            ) {

              checkOutControl?.setValue(
                this.getCurrentTime()
              );

            }

          } else {

            checkInControl?.enable({
              emitEvent: false
            });

            checkOutControl?.disable({
              emitEvent: false
            });

            checkOutControl?.setValue(
              ''
            );

          }

        }
      );

  }


  addVisitor(): void {

    this.errorMessage = '';

    this.successMessage = '';


    if (
      this.visitorForm.invalid
    ) {

      this.visitorForm
        .markAllAsTouched();

      this.errorMessage =
        'Please complete all required fields correctly.';

      return;

    }


    const formValue =
      this.visitorForm.getRawValue();


    const visitor = {

      studentId:
        Number(formValue.studentId),

      visitorName:
        formValue.visitorName
          ?.trim(),

      phone:
        formValue.phone
          ?.trim(),

      relation:
        formValue.relation
          ?.trim() || null,

      visitDate:
        formValue.visitDate,

      checkInTime:
        formValue.checkInTime || null,

      checkOutTime:
        formValue.checkOutTime || null,

      purpose:
        formValue.purpose
          ?.trim(),

      status:
        formValue.status,

      remarks:
        formValue.remarks
          ?.trim() || null

    };


    this.saving = true;


    this.visitorService
      .addVisitor(visitor)
      .subscribe({

        next: () => {

          this.saving = false;

          this.successMessage =
            'Visitor added successfully.';

          this.changeDetectorRef
            .detectChanges();


          setTimeout(() => {

            this.router.navigate([
              '/visitors'
            ]);

          }, 700);

        },


        error: (error) => {

          console.error(
            'Error adding visitor:',
            error
          );

          this.saving = false;


          if (
            typeof error.error ===
            'string'
          ) {

            this.errorMessage =
              error.error;

          } else {

            this.errorMessage =
              'Unable to add visitor. Please try again.';

          }


          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  cancel(): void {

    this.router.navigate([
      '/visitors'
    ]);

  }

}