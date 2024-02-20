import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { MatCardModule } from '@angular/material/card';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { OpenreqService } from 'src/app/usit/services/openreq.service';

@Component({
  selector: 'app-sourcingupdate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    SearchPipe,
    MatCardModule,
    NgxMatIntlTelInputComponent,
    NgxGpAutocompleteModule,
    MatRadioModule
  ],
  providers: [DatePipe],
  templateUrl: './sourcingupdate.component.html',
  styleUrls: ['./sourcingupdate.component.scss']
})

export class SourcingupdateComponent implements OnInit {

  sourcingForm!: FormGroup;

  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<SourcingupdateComponent>);
  private service = inject(OpenreqService);
  private formBuilder = inject(FormBuilder);
  private snackBarServ = inject(SnackBarService);
  submitted = false;
  selectOptionObj = {
    selectOptions: SELECT_OPTIONS,
  };
  dataArr: any[] = [];

  protected isFormSubmitted: boolean = false;
  get controls() {
    return this.sourcingForm.controls;
  }

  ngOnInit(): void {
   // console.log(this.data);
    this.initializeInterviewForm(this.data.souringData);
    this.service.getLeadById(this.data.souringData.c_id).subscribe(
      (response: any) => {
      //  console.log(response.data)
        this.dataArr = response.data
      });
  }

  private initializeInterviewForm(data: any) {
    this.sourcingForm = this.formBuilder.group({
      email: [data ? data.email : '', [
        Validators.email,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ],],
      contactno: [data ? data.contactno : ''],
      comments: [data ? data.comments : '', Validators.required],
      status: [data ? data.status : ''],
      candidate_name: [data ? data.candidate_name : ''],
      appointmentdate: [data ? data.appointmentdate : ''],
      category: [data ? data.category : ''],
      address: [data ? data.address : ''],
      id: [data ? data.c_id : ''],
      lockedby: [data ? data.lockedby : ''],
      profile_url: [data ? data.profile_url : ''],
      pseudoname: [data ? data.pseudoname : ''],
      track: this.formBuilder.group({
        cid: [data.c_id],
        userid: [localStorage.getItem('userid')],
        comments: [''],
        consultantname: [data.candidate_name],
        pseudoname: [data.pseudoname],
        appointmentdate: [''],
        status: ['']
      })
    });

    this.sourcingForm.get('comments')?.valueChanges.subscribe((value) => {
      this.sourcingForm.get('track.comments')?.setValue(value);
    });

    this.sourcingForm.get('appointmentdate')?.valueChanges.subscribe((value) => {
      this.sourcingForm.get('track.appointmentdate')?.setValue(value);
    });

    const AppointmentDate = this.sourcingForm.get('appointmentdate')?.value;
    this.sourcingForm.get('track.appointmentdate')?.setValue(AppointmentDate);

    this.sourcingForm.get('status')?.valueChanges.subscribe((value) => {
      this.sourcingForm.get('track.status')?.setValue(value);
    });

    const status = this.sourcingForm.get('status')?.value;
    this.sourcingForm.get('track.status')?.setValue(status);

  }

  onSubmit() {
    this.submitted = true;
    this.isFormSubmitted = false
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    if (this.sourcingForm.invalid) {
      this.displayFormErrors();
      this.sourcingForm.markAllAsTouched();
      this.isFormSubmitted = false
      return;
    }
    // const saveReqObj = this.getSaveData();
   // console.log(JSON.stringify(this.sourcingForm.value));
    // updateSourcingLead
    this.service.updateSourcingLead(this.sourcingForm.value).subscribe(
      {
        next: (data: any) => {
          if (data.status == 'success') {
            dataToBeSentToSnackBar.message = 'Track updated successfully!';
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
            this.dialogRef.close();

          } else {
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure']
            dataToBeSentToSnackBar.message = 'Error While Updating!'
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          }

        }, error: (err: any) => {
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure']
          dataToBeSentToSnackBar.message = err.message
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        }
      });
  }

  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.sourcingForm.controls).forEach((field) => {
      const control = this.sourcingForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}


export const SELECT_OPTIONS = {
  status: [
    { value: 'Locked', id: 1 },
    { value: 'Connection Pending', id: 1 },
    { value: 'Connected', id: 2 },
    { value: 'Discussion', id: 3 },
    { value: 'Interested', id: 4 },
    { value: 'Not Interested', id: 5 },
    { value: 'Open to Work', id: 6 },
    { value: 'On Other W2', id: 7 },
    { value: 'Independent', id: 8 },
    { value: 'Not Available', id: 9 },
    { value: 'Closed', id: 10 },
  ]
}

