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
  ISnackBarData, SnackBarService,
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
import { Subject, takeUntil } from 'rxjs';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
@Component({
  selector: 'app-add-email-extraction',
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
    NgxGpAutocompleteModule
  ],
  providers: [DatePipe],
  templateUrl: './add-email-extraction.component.html',
  styleUrls: ['./add-email-extraction.component.scss']
})

export class AddEmailExtractionComponent implements OnInit {
  private service = inject(OpenreqService);
  emailExtractForm!: FormGroup;
  protected isFormSubmitted: boolean = false;

  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddEmailExtractionComponent>);
  private formBuilder = inject(FormBuilder);
  submitted = false;
  // to clear subscriptions
  private datePipe = inject(DatePipe);
 

  ngOnInit(): void {
    this.emailExtractForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      fromDate: [new Date(), Validators.required],
      toDate: [new Date(), Validators.required],
    });
  }

  get controls() {
    return this.emailExtractForm.controls;
  }
  private destroyed$ = new Subject<void>();
  vo = new RequestVo();
  private snackBarServ = inject(SnackBarService);
  displayFormErrors() {
    Object.keys(this.emailExtractForm.controls).forEach((field) => {
      const control = this.emailExtractForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }
  
  onSubmit() {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };

    this.submitted = true;
    this.isFormSubmitted = true
    if (this.emailExtractForm.invalid) {
      this.isFormSubmitted = false;
      dataToBeSentToSnackBar.message ='Please fill all fields and extract between 2 dates for fast performance';
      dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
      this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      this.displayFormErrors();
      return;
    }
    else {
      this.isFormSubmitted = true
    }
  

    const joiningDateFormControl = this.emailExtractForm.get('fromDate');
    const relievingDateFormControl = this.emailExtractForm.get('toDate');
    if (joiningDateFormControl?.value) {
      const formattedJoiningDate = this.datePipe.transform(joiningDateFormControl.value, 'yyyy-MM-dd');
      const formattedRelievingDate = this.datePipe.transform(relievingDateFormControl?.value, 'yyyy-MM-dd');
      // Update the form controls with the formatted dates
      joiningDateFormControl.setValue(formattedJoiningDate);
      relievingDateFormControl?.setValue(formattedRelievingDate);
    }

    this.vo.fromDate = joiningDateFormControl?.value;
    this.vo.toDate = relievingDateFormControl?.value;

    this.vo.email = this.emailExtractForm.get('email')?.value;
    this.vo.password = this.emailExtractForm.get('password')?.value;

    this.service
      .readmail(this.vo)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message ='Email Extraction Completed';
            this.dialogRef.close();
          } 
          else {
            this.isFormSubmitted = false;
            dataToBeSentToSnackBar.message = resp.message ? resp.message : 'Extraction Falied';
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          this.isFormSubmitted = false;
          dataToBeSentToSnackBar.message ='Extraction Falied';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  onCancel() {
    this.dialogRef.close();
  }
}


export class RequestVo {
  fromDate: any;
  toDate: any;
  email: any;
  password: any;
}