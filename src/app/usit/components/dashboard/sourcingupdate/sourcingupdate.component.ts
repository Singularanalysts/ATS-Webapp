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
  Observable,
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { InterviewService } from 'src/app/usit/services/interview.service';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { InterviewInfo } from 'src/app/usit/models/interviewinfo';
import { Closure } from 'src/app/usit/models/closure';

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
  interviewObj: any;
  submissiondata: any = [];
  flag!: any;
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<SourcingupdateComponent>);
  private interviewServ = inject(InterviewService);
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private snackBarServ = inject(SnackBarService);
  submitted = false;
  selectOptionObj = {
    selectOptions: SELECT_OPTIONS,
  };
  dataArr: any[] = [];
  entity: any;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  isRadSelected: any;
  isModeRadSelected: any;
  isStatusRadSelected: any;
  payrateFromVendor!:any;
  paymentwithctc!:any;
  intno !: string;
  onBoard!: any;
  closureFlag = false;
  private datePipe = inject(DatePipe);
  intId: any;
  protected isFormSubmitted: boolean = false;
  get controls() {
    return this.sourcingForm.controls;
  }

  ngOnInit(): void {
    this.getFlag(this.data.flag);
    this.getsubdetails(this.flag);
    if (this.flag == 'sales') {
      this.payrateFromVendor = "Pay Rate to Consultant";
      this.paymentwithctc = "Pay Rate From Vendor";
    }
    else if(this.flag == 'Recruiting') {
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

  getFlag(type: string){
    if (type === 'sales') {
      this.flag = 'sales';
    } else if(type === 'recruiting') {
      this.flag = "Recruiting";
    } else {
      this.flag = 'Domrecruiting';
    }
  }

  private initializeInterviewForm(data: any) {
    this.sourcingForm = this.formBuilder.group({
      vid : [data ? data.vid : ''],
      candidate_name: [data ? data.candidate_name : '', Validators.required],
      description: [data ? data.description : ''],
      comments: [data ? data.comments : '', Validators.required],
      status: [data ? data.status : '', Validators.required],
      dateandtime: [data ? data.dateandtime : '', Validators.required],
    });
  }

  userid!: any;
  role!: any;
  getsubdetails(flg: string) {
    this.userid = localStorage.getItem('userid');
    this.role = localStorage.getItem('role');
    this.interviewServ.getsubmissions(flg, this.userid, this.role).subscribe(
      (response: any) => {
        this.submissiondata = response.data;
      });
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
    const saveReqObj = this.getSaveData();
    this.interviewServ
      .addORUpdateInterview(saveReqObj,this.data.actionName)
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
    Object.keys(this.sourcingForm.controls).forEach((field) => {
      const control = this.sourcingForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  getSaveData() {
    if(this.data.actionName === 'edit-interview'){
      return {...this.entity, ...this.sourcingForm.value}
    }
    return this.sourcingForm.value;
  }

  onCancel() {
    this.dialogRef.close();
  }
}


export const SELECT_OPTIONS = {
  status: [
    {value: 'Connection Pending', id: 1},
    {value: 'Connected', id: 2},
    {value: 'Discussion', id: 3},
    {value: 'Interested', id: 4},
    {value: 'Not Interested', id: 5},
    {value: 'Open to Work', id: 6},
    {value: 'On Other W2', id: 7},
    {value: 'Independent', id: 8},
    {value: 'Not Available', id: 9},
    {value: 'Closed', id: 10},
  ]
}

