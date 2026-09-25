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

import { ComplaintService } from '../../services/complaint';


@Component({
  selector: 'app-edit-complaint',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-complaint.html',
  styleUrl: './edit-complaint.css'
})
export class EditComplaint implements OnInit {

  complaintForm!: FormGroup;

  complaintId!: number;

  students: any[] = [];

  loadingComplaint = false;
  loadingStudents = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  private studentsApiUrl =
    'http://localhost:8080/api/students';


  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.createForm();

    const id =
      this.activatedRoute
        .snapshot
        .paramMap
        .get('id');


    if (!id) {

      this.errorMessage =
        'Complaint ID is missing.';

      return;

    }


    this.complaintId =
      Number(id);


    this.loadStudents();

    this.loadComplaint();

  }


  createForm(): void {

    this.complaintForm =
      this.fb.group({

        studentId: [
          '',
          Validators.required
        ],

        subject: [
          '',
          [
            Validators.required,
            Validators.maxLength(150)
          ]
        ],

        description: [
          '',
          [
            Validators.required,
            Validators.minLength(5)
          ]
        ],

        complaintDate: [
          '',
          Validators.required
        ],

        priority: [
          'MEDIUM',
          Validators.required
        ],

        status: [
          'OPEN',
          Validators.required
        ],

        resolution: [
          ''
        ],

        resolvedDate: [
          ''
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

          this.loadingStudents =
            false;

          this.errorMessage =
            'Unable to load students. Please make sure the backend is running.';

          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  loadComplaint(): void {

    this.loadingComplaint = true;

    this.errorMessage = '';


    this.complaintService
      .getComplaintById(
        this.complaintId
      )
      .subscribe({

        next: (complaint) => {

          this.complaintForm
            .patchValue({

              studentId:
                complaint.studentId,

              subject:
                complaint.subject,

              description:
                complaint.description,

              complaintDate:
                complaint.complaintDate,

              priority:
                complaint.priority,

              status:
                complaint.status,

              resolution:
                complaint.resolution || '',

              resolvedDate:
                complaint.resolvedDate || ''

            });


          this.loadingComplaint =
            false;

          this.changeDetectorRef
            .detectChanges();

        },

        error: (error) => {

          console.error(
            'Error loading complaint:',
            error
          );

          this.loadingComplaint =
            false;

          this.errorMessage =
            'Unable to load the complaint record.';

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

    const studentId =
      student.studentId ||
      student.id ||
      '';

    const fullName =
      `${firstName} ${lastName}`.trim();


    if (
      fullName &&
      studentId
    ) {

      return `${fullName} (${studentId})`;

    }


    if (fullName) {

      return fullName;

    }


    return `Student #${student.id}`;

  }


  updateComplaint(): void {

    this.errorMessage = '';
    this.successMessage = '';


    if (
      this.complaintForm.invalid
    ) {

      this.complaintForm
        .markAllAsTouched();

      this.errorMessage =
        'Please complete all required fields correctly.';

      return;

    }


    const formValue =
      this.complaintForm
        .getRawValue();


    const complaint = {

      studentId:
        Number(formValue.studentId),

      subject:
        formValue.subject.trim(),

      description:
        formValue.description.trim(),

      complaintDate:
        formValue.complaintDate,

      priority:
        formValue.priority,

      status:
        formValue.status,

      resolution:
        formValue.resolution?.trim() ||
        null,

      resolvedDate:
        formValue.resolvedDate ||
        null

    };


    if (
      !complaint.subject
    ) {

      this.errorMessage =
        'Complaint subject is required.';

      return;

    }


    if (
      !complaint.description
    ) {

      this.errorMessage =
        'Complaint description is required.';

      return;

    }


    this.saving = true;


    this.complaintService
      .updateComplaint(
        this.complaintId,
        complaint
      )
      .subscribe({

        next: () => {

          this.saving = false;

          this.successMessage =
            'Complaint updated successfully.';

          this.changeDetectorRef
            .detectChanges();


          setTimeout(() => {

            this.router.navigate([
              '/complaints'
            ]);

          }, 700);

        },

        error: (error) => {

          console.error(
            'Error updating complaint:',
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
              'Unable to update the complaint. Please try again.';

          }


          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  cancel(): void {

    this.router.navigate([
      '/complaints'
    ]);

  }

}