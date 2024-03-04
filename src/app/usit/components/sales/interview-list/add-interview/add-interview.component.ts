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
  selector: 'app-add-interview',
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
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.scss']
})
export class AddInterviewComponent implements OnInit {

  interviewForm: any = FormGroup;
  interviewObj: any;
  submissiondata: any = [];
  flag!: any;
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddInterviewComponent>);
  private interviewServ = inject(InterviewService);
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private snackBarServ = inject(SnackBarService);
  submitted = false;
  selectOptionObj = {
    timeZone: TIME_ZONE,
    radioOptions: RADIO_OPTIONS,
  };
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
    return this.interviewForm.controls;
  }

  ngOnInit(): void {
    this.getFlag(this.data.flag.toLocaleLowerCase());
    this.getsubdetails(this.flag);
    if (this.flag == 'sales') {
      this.payrateFromVendor = "Pay Rate to Consultant";
      this.paymentwithctc = "Pay Rate From Vendor";
    }
    else if (this.flag == 'Recruiting') {
      this.payrateFromVendor = "Bill Rate from Client";
      this.paymentwithctc = "Pay Rate To Vendor";
    } else {
      this.payrateFromVendor = "Bill Rate from Client";
      this.paymentwithctc = "Pay Rate To Vendor";
    }
    if (this.data.actionName === "edit-interview") {
      this.initializeInterviewForm(new InterviewInfo());
      this.interviewServ.getEntity(this.data.interviewData.intrid).subscribe(
        (response: any) => {
          // const ctc = response.data.submission.ratetype;
          // if((ctc=='1099' || ctc=='W2') && this.flag != 'sales'){
          //   this.paymentwithctc = "Pay Rate To Consultant";
          // }
          // else{
          //   this.paymentwithctc = "Pay Rate To Vendor";
          // }
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
          this.initializeInterviewForm(response.data);
        });
    } else {
      this.initializeInterviewForm(new InterviewInfo());
    }
  }

  getFlag(type: string) {
    if (type === 'sales') {
      this.flag = 'sales';
    } else if (type === 'recruiting') {
      this.flag = "Recruiting";
    } else {
      this.flag = 'Domrecruiting';
    }
  }

  private initializeInterviewForm(interviewData: any) {
    this.interviewForm = this.formBuilder.group({
      submission: [interviewData ? interviewData.submission : '', [Validators.required]],
      flg: [this.data.flag ? this.data.flag.toLocaleLowerCase() : ''],
      interviewdate: [interviewData ? interviewData.interviewdate : '', Validators.required],
      timezone: [interviewData ? interviewData.timezone : '', Validators.required],
      round: [interviewData ? interviewData.round : '', Validators.required],
      mode: [interviewData ? interviewData.mode : '', Validators.required],
      feedback: [interviewData ? interviewData.feedback : '', Validators.required],
      interviewstatus: [interviewData ? interviewData.interviewstatus : '', [Validators.required]],
      // users: localStorage.getItem('userid'),
      users: [this.data.actionName === "edit-interview" ? interviewData?.users : localStorage.getItem('userid')],
      interviewno: [this.data.actionName === "edit-interview" ? interviewData.interviewno : ''],
      updatedby: [this.data.actionName === "edit-interview" ? localStorage.getItem('userid') : '0'],
      intrid: [interviewData ? interviewData.intrid : ''],
      closure: this.formBuilder.group({
        interviewid: [this.intId],
        closureid: [interviewData && interviewData.closure ? interviewData.closure.closureid : ''],
        visaValidity: [interviewData && interviewData.closure ? interviewData.closure.visaValidity : ''],
        projectDuration: [interviewData && interviewData.closure ? interviewData.closure.projectDuration : ''],
        billRateVendor: [interviewData && interviewData.closure ? interviewData.closure.billRateVendor : ''],
        billingCycle: [interviewData && interviewData.closure ? interviewData.closure.billingCycle : ''],
        projectendtdate: [interviewData && interviewData.closure ? interviewData.closure.projectendtdate : ''],
        projectStartDate: [interviewData && interviewData.closure ? interviewData.closure.projectStartDate : ''],
        payRateConsultant: [interviewData && interviewData.closure ? interviewData.closure.payRateConsultant : ''],
        vendorArPhoneNumber: [interviewData && interviewData.closure ? interviewData.closure.vendorArPhoneNumber : ''],
        paymentCycle: [interviewData && interviewData.closure ? parseInt(interviewData.closure.paymentCycle, 10) : ''],
        vendorApPhoneNumber: this.flag === 'Recruiting' ?
          this.formBuilder.control(interviewData && interviewData.closure ? interviewData.closure.vendorApPhoneNumber : '') :
          null,
      })
    });

    if (this.data.actionName === "edit-interview" && interviewData && interviewData.submission) {
      this.interviewServ.getsubmissionsDropDown(this.flag, this.userid, this.role, interviewData.submission).subscribe(
        (submission: any) => {
          //console.log(JSON.stringify(submission)+" ====================");
          if (submission && submission.data) {
            this.submissionid = submission.data[0].subid;
            this.interviewForm.get('submission').setValue(submission.data[0].subdetails);
          }
        },
        (error: any) => {
          console.error('Error fetching consultant details:', error);
        }
      );
    }

    this.interviewForm.get('interviewstatus').valueChanges.subscribe((res: any) => {
      const visaValidity = this.interviewForm.get('closure.visaValidity');
      const projectStartDate = this.interviewForm.get('closure.projectStartDate');
      const projectDuration = this.interviewForm.get('closure.projectDuration');
      const payRateConsultant = this.interviewForm.get('closure.payRateConsultant');
      const billRateVendor = this.interviewForm.get('closure.billRateVendor');
      const vendorArPhoneNumber = this.interviewForm.get('closure.vendorArPhoneNumber');
      const billingCycle = this.interviewForm.get('closure.billingCycle');
      const paymentCycle = this.interviewForm.get('closure.paymentCycle');
      const projectendtdate = this.interviewForm.get('closure.projectendtdate');
      const vendorApPhoneNumber = this.interviewForm.get('closure.vendorApPhoneNumber');
      if (res == "OnBoarded" && localStorage.getItem('department') == "Accounts") {
        visaValidity.setValidators(Validators.required);
        projectStartDate.setValidators(Validators.required);
        projectDuration.setValidators(Validators.required);
        payRateConsultant.setValidators(Validators.required);
        billRateVendor.setValidators(Validators.required);
        vendorArPhoneNumber.setValidators(Validators.required);
        billingCycle.setValidators(Validators.required);
        paymentCycle.setValidators(Validators.required);
        // projectendtdate.setValidators(Validators.required);
        vendorApPhoneNumber.setValidators(Validators.required);
      } else if (res == "OnBoarded" && localStorage.getItem('department') !== "Accounts") {
        projectStartDate.setValidators(Validators.required);
        projectDuration.setValidators(Validators.required);
        billRateVendor.setValidators(Validators.required);
      }
      else {
        visaValidity.clearValidators();
        projectStartDate.clearValidators();
        projectDuration.clearValidators();
        payRateConsultant.clearValidators();
        billRateVendor.clearValidators();
        vendorArPhoneNumber.clearValidators();
        billingCycle.clearValidators();
        paymentCycle.clearValidators();
        // projectendtdate.clearValidators();
        vendorApPhoneNumber.clearValidators();
      }
      visaValidity.updateValueAndValidity();
      projectStartDate.updateValueAndValidity();
      projectDuration.updateValueAndValidity();
      payRateConsultant.updateValueAndValidity();
      billRateVendor.updateValueAndValidity();
      vendorArPhoneNumber.updateValueAndValidity();
      billingCycle.updateValueAndValidity();
      paymentCycle.updateValueAndValidity();
      // projectendtdate.updateValueAndValidity();
    });
  }

  userid!: any;
  role!: any;
  getsubdetails(flg: string) {
    this.userid = localStorage.getItem('userid');
    this.role = localStorage.getItem('role');

    // this.interviewServ.getsubmissions(flg, this.userid, this.role).subscribe(
    //   (response: any) => {
    //     this.submissiondata = response.data;
    //     console.log( this.submissiondata);
    //   });

    // this.interviewServ.getsubmissionsDropDown(flg, this.userid, this.role).subscribe(
    //   (response: any) => {
    //     this.submissiondata = response.data;
    //     console.log( this.submissiondata);
    //   });
    this.searchSubmissionOptions$ = this.interviewServ.getsubmissionsDropDown(flg, this.userid, this.role, 0).pipe(
      map((response: any) => response.data),
      tap(resp => {
        if (resp && resp.length) {
         // console.log(resp);
          this.getSubmissionOptionsForAutoComplete(resp);
        }
      })
    );
  }

  getSubmissionOptionsForAutoComplete(data: any) {
    this.submissionOptions = data;
    console.log(data);
    this.searchSubmissionOptions$ = this.interviewForm.controls.submission.valueChanges.pipe(
      startWith(''),
      map(value => this._filterSubmissionOptions(value, this.submissionOptions))
    );
  }
  submissionid: any;
  private _filterSubmissionOptions(value: any, options: any[]): any[] {
    console.log(value);
    const filterValue = (value ? value.toString() : '').toLowerCase();
    const filteredOptions = options.filter(option =>
      option.subdetails.toLowerCase().includes(filterValue)
    );
    // console.log(filteredOptions);
    if (filteredOptions.length === 1) {
      this.submissionid = filteredOptions[0].subid;
      console.log(this.submissionid);
    }
    // this.isConsultantDataAvailable = filteredOptions.length === 0;
    return filteredOptions;
  }

  onSubmit() {
    this.submitted = true;
    this.isFormSubmitted = false
    if (this.interviewForm.invalid) {
      this.isFormSubmitted = false;
      this.isRadSelected = true;
      this.isModeRadSelected = true;
      this.isStatusRadSelected = true;
      this.interviewForm.markAllAsTouched();
      this.displayFormErrors();
      return;
    }
    else {
      this.isFormSubmitted = true
    }
    this.interviewForm.get('submission').setValue(this.submissionid);
    if (this.interviewForm.get('interviewstatus').value === "OnBoarded") {
      const visaValidityFormControl = this.interviewForm.get('closure.visaValidity');
      const projectStartFormControl = this.interviewForm.get('closure.projectStartDate');
      const projectEndFormControl = this.interviewForm.get('closure.projectendtdate')
      // const paymentCycleFormControl = this.interviewForm.get('closure.paymentCycle')
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
    ///console.log(saveReqObj)
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

  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.interviewForm.controls).forEach((field) => {
      const control = this.interviewForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  getSaveData() {
    if (this.data.actionName === 'edit-interview') {
      return { ...this.entity, ...this.interviewForm.value }
    }
    return this.interviewForm.value;
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

export const TIME_ZONE = [
  'AST', 'EST', 'EDT', 'CST', 'CDT', 'MST', 'MDT', 'PST', 'PDT', 'AKST', 'AKDT', 'HST', 'HAST', 'HADT', 'SST', 'SDT', 'CHST'
] as const;

export const RADIO_OPTIONS = {
  interviewround: [
    { value: 'First', id: 1, selected: true },
    { value: 'Second', id: 2 },
    { value: 'Third', id: 3 },
  ],
  interviewmode: [
    { value: 'F2F', id: 1 },
    { value: 'Skype', id: 2 },
    { value: 'Telephonic', id: 3 },
    { value: 'Webex', id: 4 },
  ],
  interviewstatus: [
    {value: 'Schedule', id: 1},
    {value: 'Closed', id: 2},
    {value: 'Hold', id: 3},
    {value: 'Rejected', id: 4},
    {value: 'Selected', id: 5},
    {value: 'BackOut', id: 6},
  ]
}
