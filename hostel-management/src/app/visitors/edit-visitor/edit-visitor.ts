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

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { HttpClient } from '@angular/common/http';

import { VisitorService } from '../../services/visitor';


@Component({
  selector: 'app-edit-visitor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-visitor.html',
  styleUrl: './edit-visitor.css'
})
export class EditVisitor implements OnInit {

  visitorForm!: FormGroup;

  visitorId!: number;

  students: any[] = [];

  loading = false;

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
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.visitorId = Number(
      this.activatedRoute.snapshot
        .paramMap
        .get('id')
    );

    this.createForm();

    this.loadStudents();

    this.loadVisitor();

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
        '',
        Validators.required
      ],

      checkInTime: [
        ''
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

          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  loadVisitor(): void {

    if (!this.visitorId) {

      this.errorMessage =
        'Invalid visitor ID.';

      return;

    }


    this.loading = true;

    this.errorMessage = '';


    this.visitorService
      .getVisitorById(this.visitorId)
      .subscribe({

        next: (visitor) => {

          this.visitorForm.patchValue({

            studentId:
              visitor.studentId,

            visitorName:
              visitor.visitorName,

            phone:
              visitor.phone,

            relation:
              visitor.relation || '',

            visitDate:
              visitor.visitDate,

            checkInTime:
              visitor.checkInTime
                ? visitor.checkInTime
                    .substring(0, 5)
                : '',

            checkOutTime:
              visitor.checkOutTime
                ? visitor.checkOutTime
                    .substring(0, 5)
                : '',

            purpose:
              visitor.purpose,

            status:
              visitor.status || 'CHECKED_IN',

            remarks:
              visitor.remarks || ''

          });

          this.updateTimeControls(
            visitor.status || 'CHECKED_IN'
          );

          this.loading = false;

          this.changeDetectorRef
            .detectChanges();

        },

        error: (error) => {

          console.error(
            'Error loading visitor:',
            error
          );

          this.loading = false;

          this.errorMessage =
            'Unable to load visitor details.';

          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  handleStatusChanges(): void {

    this.visitorForm
      .get('status')
      ?.valueChanges
      .subscribe(
        (status: string) => {

          this.updateTimeControls(
            status
          );

        }
      );

  }


  updateTimeControls(
    status: string
  ): void {

    const checkInControl =
      this.visitorForm
        .get('checkInTime');

    const checkOutControl =
      this.visitorForm
        .get('checkOutTime');


    if (
      status === 'CANCELLED'
    ) {

      checkInControl?.setValue('');

      checkOutControl?.setValue('');

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

    } else {

      checkInControl?.enable({
        emitEvent: false
      });

      checkOutControl?.disable({
        emitEvent: false
      });

      checkOutControl?.setValue('');

    }

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


  updateVisitor(): void {

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
      .updateVisitor(
        this.visitorId,
        visitor
      )
      .subscribe({

        next: () => {

          this.saving = false;

          this.successMessage =
            'Visitor updated successfully.';

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
            'Error updating visitor:',
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
              'Unable to update visitor. Please try again.';

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