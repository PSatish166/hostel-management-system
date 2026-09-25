import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { FormsModule } from '@angular/forms';

import { AllocationService } from '../../services/allocation';


@Component({
  selector: 'app-edit-allocation',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './edit-allocation.html',
  styleUrl: './edit-allocation.css'
})
export class EditAllocation implements OnInit {

  allocationId: number = 0;

  allocation: any = {
    studentId: null,
    roomId: null,
    bedNumber: '',
    allocationDate: '',
    status: 'ACTIVE'
  };

  loading = false;

  saving = false;

  errorMessage = '';

  successMessage = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private allocationService: AllocationService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');


    console.log(
      'Allocation ID from URL:',
      id
    );


    if (!id) {

      this.errorMessage =
        'Allocation ID is missing.';

      return;

    }


    this.allocationId =
      Number(id);


    this.loadAllocation();

  }


  // Load allocation from backend
  loadAllocation(): void {

    this.loading = true;

    this.errorMessage = '';


    this.allocationService
      .getAllocationById(this.allocationId)
      .subscribe({

        next: (data) => {

          console.log(
            'Allocation loaded:',
            data
          );


          this.allocation = {

            studentId:
              data.studentId,

            roomId:
              data.roomId,

            bedNumber:
              data.bedNumber,

            allocationDate:
              data.allocationDate,

            status:
              data.status

          };


          console.log(
            'Allocation form data:',
            this.allocation
          );


          this.loading = false;


          console.log(
            'Loading:',
            this.loading
          );


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Error loading allocation:',
            error
          );


          this.errorMessage =
            'Unable to load allocation details.';


          this.loading = false;


          this.cdr.detectChanges();

        }

      });

  }


  // Update allocation
  updateAllocation(): void {

    this.errorMessage = '';

    this.successMessage = '';


    if (
      !this.allocation.studentId ||
      !this.allocation.roomId ||
      !this.allocation.bedNumber ||
      !this.allocation.allocationDate ||
      !this.allocation.status
    ) {

      this.errorMessage =
        'Please fill in all required fields.';

      return;

    }


    this.saving = true;


    this.allocationService
      .updateAllocation(
        this.allocationId,
        this.allocation
      )
      .subscribe({

        next: (data) => {

          console.log(
            'Allocation updated:',
            data
          );


          this.successMessage =
            'Allocation updated successfully.';


          this.saving = false;


          this.cdr.detectChanges();


          setTimeout(() => {

            this.router.navigate([
              '/allocation'
            ]);

          }, 800);

        },


        error: (error) => {

          console.error(
            'Error updating allocation:',
            error
          );


          this.errorMessage =
            'Unable to update allocation. Please try again.';


          this.saving = false;


          this.cdr.detectChanges();

        }

      });

  }


  // Cancel editing
  cancel(): void {

    this.router.navigate([
      '/allocation'
    ]);

  }

}