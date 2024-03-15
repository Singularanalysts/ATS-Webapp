import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
import {

  Subject,
  map,
  startWith,
  takeUntil,
  tap,
} from 'rxjs';
import { InterviewService } from 'src/app/usit/services/interview.service';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { InterviewInfo } from 'src/app/usit/models/interviewinfo';
import { Closure } from 'src/app/usit/models/closure';

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
    NgxGpAutocompleteModule,
    MatRadioModule
  ],
  providers: [DatePipe],
  templateUrl: './add-email-extraction.component.html',
  styleUrls: ['./add-email-extraction.component.scss']
})

export class AddEmailExtractionComponent implements OnInit {

  emailExtractForm: any = FormGroup;
  interviewObj: any;
  submissiondata: any = [];
  flag!: any;
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddEmailExtractionComponent>);
  private interviewServ = inject(InterviewService);
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private snackBarServ = inject(SnackBarService);
  submitted = false;
  entity: any;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  isRadSelected: any;
  isModeRadSelected: any;
  isStatusRadSelected: any;
  payrateFromVendor!: any;
  paymentwithctc!: any;
  intno !: string;
  onBoard!: any;
  closureFlag = false;
  private datePipe = inject(DatePipe);
  intId: any;
  protected isFormSubmitted: boolean = false;
  searchSubmissionOptions$: any;
  submissionOptions: any;

  get frm() {
    return this.emailExtractForm.controls;
  }

  ngOnInit(): void {
    this.initializeemailExtractForm(null);
    if (this.data.actionName === "edit-interview") {
      this.initializeemailExtractForm(new InterviewInfo());
      this.interviewServ.getEntity(this.data.interviewData.intrid).subscribe(
        (response: any) => {
          this.entity = response.data;
          this.intno = this.entity.interviewno;
          this.onBoard = this.entity.interviewstatus;
          this.intId = this.entity.intrid;
          if (this.onBoard == 'OnBoarded') {
            this.closureFlag = true;
          }
          else {
            this.closureFlag = false;
          }
          this.initializeemailExtractForm(response.data);
        });
    } else {
      this.initializeemailExtractForm(new InterviewInfo());
    }
  }

  

  private initializeemailExtractForm(interviewData: any) {
    this.emailExtractForm = this.formBuilder.group({
      email: [interviewData ? interviewData.submission : '', [Validators.required]],
      password: [this.data.flag ? this.data.flag.toLocaleLowerCase() : '', [Validators.required]],
      fromdate: [interviewData ? interviewData.interviewdate : '', Validators.required],
      todate: [interviewData ? interviewData.timezone : '', Validators.required],
    });

    

  }

 

  
 
  onSubmit() {
    this.submitted = true;
    this.isFormSubmitted = false
    if (this.emailExtractForm.invalid) {
      this.isFormSubmitted = false;
      this.isRadSelected = true;
      this.isModeRadSelected = true;
      this.isStatusRadSelected = true;
      this.emailExtractForm.markAllAsTouched();
      return;
    }
    else {
      this.isFormSubmitted = true
    }
    if (this.emailExtractForm.get('interviewstatus').value === "OnBoarded") {
      const visaValidityFormControl = this.emailExtractForm.get('closure.visaValidity');
      const projectStartFormControl = this.emailExtractForm.get('closure.projectStartDate');
      const projectEndFormControl = this.emailExtractForm.get('closure.projectendtdate')
      // const paymentCycleFormControl = this.emailExtractForm.get('closure.paymentCycle')
      const formattedVisaValidity = this.datePipe.transform(visaValidityFormControl.value, 'yyyy-MM-dd');
      const formattedProjectStart = this.datePipe.transform(projectStartFormControl.value, 'yyyy-MM-dd');
      const formattedProjectEnd = this.datePipe.transform(projectEndFormControl.value, 'yyyy-MM-dd');
      // const formattedPaymentCycle = paymentCycleFormControl.value.toString();
      visaValidityFormControl.setValue(formattedVisaValidity);
      projectStartFormControl.setValue(formattedProjectStart);
      projectEndFormControl.setValue(formattedProjectEnd);
      // paymentCycleFormControl.setValue(formattedPaymentCycle);
    }
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    const saveReqObj = this.getSaveData();
    console.log(saveReqObj)
    this.interviewServ
      .addORUpdateInterview(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'Success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-interview'
                ? 'Interview added successfully'
                : 'Interview updated successfully';
            this.dialogRef.close();
          } else {
            this.isFormSubmitted = false;
            dataToBeSentToSnackBar.message = resp.message ? resp.message : 'Interview already Exists';
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          this.isFormSubmitted = false;
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-interview'
              ? 'Interview addition is failed'
              : 'Interview updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });

      

  }


  getSaveData() {
    if (this.data.actionName === 'edit-interview') {
      return { ...this.entity, ...this.emailExtractForm.value }
    }
    return this.emailExtractForm.value;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onRadioChange(event: MatRadioChange) {
    this.isRadSelected = event.value
  }

  onModeRadioChange(event: MatRadioChange) {
    this.isModeRadSelected = event.value
  }

  onStatusRadioChange(event: MatRadioChange) {
    this.isStatusRadSelected = event.value
  }

  Closure(val: string) {
    if (val == 'true')
      this.closureFlag = true;
    else
      this.closureFlag = false;
  }
}
