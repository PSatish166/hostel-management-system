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

import { ComplaintService } from '../../services/complaint';

@Component({
  selector: 'app-add-complaint',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-complaint.html',
  styleUrl: './add-complaint.css'
})
export class AddComplaint implements OnInit {

  complaintForm!: FormGroup;

  students: any[] = [];

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
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.createForm();

    this.loadStudents();

  }


  createForm(): void {

    this.complaintForm = this.fb.group({

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
        this.getTodayDate(),
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
      .get<any[]>(this.studentsApiUrl)
      .subscribe({

        next: (data) => {

          this.students = data || [];

          this.loadingStudents = false;

          this.changeDetectorRef.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error loading students:',
            error
          );

          this.loadingStudents = false;

          this.errorMessage =
            'Unable to load students. Please make sure the backend is running.';

          this.changeDetectorRef.detectChanges();

        }

      });

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


  getTodayDate(): string {

    const today = new Date();

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


  addComplaint(): void {

    this.errorMessage = '';
    this.successMessage = '';


    if (this.complaintForm.invalid) {

      this.complaintForm.markAllAsTouched();

      this.errorMessage =
        'Please complete all required fields correctly.';

      return;

    }


    const formValue =
      this.complaintForm.getRawValue();


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


    this.saving = true;


    this.complaintService
      .addComplaint(complaint)
      .subscribe({

        next: () => {

          this.saving = false;

          this.successMessage =
            'Complaint added successfully.';

          this.changeDetectorRef.detectChanges();


          setTimeout(() => {

            this.router.navigate([
              '/complaints'
            ]);

          }, 700);

        },

        error: (error) => {

          console.error(
            'Error adding complaint:',
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
              'Unable to add the complaint. Please try again.';

          }

          this.changeDetectorRef.detectChanges();

        }

      });

  }


  cancel(): void {

    this.router.navigate([
      '/complaints'
    ]);

  }

}