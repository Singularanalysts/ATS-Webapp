import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
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
import { Vms } from 'src/app/usit/models/vms';
import { MatCardModule } from '@angular/material/card';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  of,
  Subject,
  takeUntil,
  startWith,
  map,
} from 'rxjs';
import {MatRadioChange, MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SubmissionService } from 'src/app/usit/services/submission.service';
import { SubmissionInfo } from 'src/app/usit/models/submissioninfo';


@Component({
  selector: 'app-add-submission',
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
    MatRadioModule,
    MatCheckboxModule
  ],
  providers: [
    {
      provide: Loader,
      useValue: new Loader({
        apiKey: 'AIzaSyCT0z0QHwdq202psuLbL99GGd-QZMTm278',
        libraries: ['places'],
      }),
    },
  ],
  templateUrl: './add-submission.component.html',
  styleUrls: ['./add-submission.component.scss']
})
export class AddSubmissionComponent implements OnInit{

  submissionForm: any = FormGroup;
  submitted = false;
  requirementdata: any = [];
  consultantdata: any = [];
  vendordata: any = [];
  private formBuilder = inject(FormBuilder);
  private submissionServ = inject(SubmissionService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBarServ = inject(SnackBarService);

  searchObs$!: Observable<any>;
  selectOptionObj = {
    sourceType: SOURCE_TYPE,
    radioOptions: RADIO_OPTIONS
  };
  address = '';
  options = {
    componentRestrictions: { country: ['IN', 'US'] },
  };
  flgOpposite !: string;
  flag!: string;
  entity = new SubmissionInfo();
  isRadSelected: any;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  filteredRequirements!: Observable<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddSubmissionComponent>
  ) {}

  get frm() {
    return this.submissionForm.controls;
  }

  ngOnInit(): void {
    this.getCompany();
    this.getFlag(this.data.flag.toLocaleLowerCase());
    this.getConsultant(this.flag)
    if(this.data.actionName === "edit-submission"){
      this.initilizeSubmissionForm(new SubmissionInfo());
      this.submissionServ.getsubdetailsbyid(this.data.submissionData.submissionid).subscribe(
        (response: any) => {
          this.entity = response.data;
          if (this.entity.vendor == null) {
            this.submissionForm.get('vendor').patchValue("");
            this.submissionForm.get('recruiter').patchValue("");
          }
          else {
            
            this.submissionForm.get('vendor').patchValue(this.entity.vendor);
            this.submissionForm.get('recruiter').patchValue(this.entity.recruiter);
            this.recruiterInfo(this.entity.vendor);
          }
          this.initilizeSubmissionForm(response.data);
        }
      );
    } else {
      this.initilizeSubmissionForm(new SubmissionInfo());
    }
    // this.filteredRequirements = this.submissionForm!.get('requirement')!.valueChanges.pipe(
    //   startWith(''),
    //   map((value: any) => this.reqFilter(value)),
    // );
  }

  getFlag(type: string){
    if (type === 'sales') {
      this.flag = 'sales';
      this.flgOpposite = "Recruiter";
    } else if(type === 'recruiting') {
      this.flag = 'Recruiting';
      this.flgOpposite = "Bench Sales";
      this.getRequirements(this.flag);
    }
     else {
      this.flag = 'Domrecruiting';
      this.getRequirements(this.flag);
    }
  }

  private reqFilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.requirementdata.filter((option: string) => option.toLowerCase().includes(filterValue));
  }


  private initilizeSubmissionForm(submissionData: any) {

    this.submissionForm = this.formBuilder.group({

      user: localStorage.getItem('userid'),
      requirement: [submissionData ? submissionData?.requirement : '', [Validators.required]],
      consultant: [submissionData ? submissionData?.consultant : '', [Validators.required]],
      position: [submissionData ? submissionData.position : '', [Validators.required]],
      ratetype: [submissionData ? submissionData.ratetype : '', [Validators.required]],
      submissionrate: [submissionData ? submissionData.submissionrate : '', [Validators.required]],
      endclient: [submissionData ? submissionData.endclient : ''],
      implpartner: [submissionData ? submissionData.implpartner : ''],
      vendor: [submissionData ? submissionData.vendor : ''],
      recruiter: [submissionData ? submissionData.recruiter : ''],
      empcontact: [submissionData ? submissionData.empcontact : ''],
      empmail: [submissionData ? submissionData.empmail : ''],
      source: [submissionData ? submissionData.source : '', [Validators.required]],
      projectlocation: [submissionData ? submissionData.projectlocation : '', [Validators.required]],
      flg: [this.data.flag ? this.data.flag.toLocaleLowerCase() : ''],
      // user: [submissionData ? submissionData.user: ''],
      submissionid: [submissionData ? submissionData.submissionid: ''],
      updatedby: [this.data.actionName === "edit-submission" ?  localStorage.getItem('userid') : '0'],
      status: [this.data.actionName === "edit-submission" ?  submissionData.status : 'Active'],
      remarks: [submissionData ? submissionData.remarks: ''],
      substatus: [this.data.actionName === "edit-submission" ?  submissionData.substatus : 'Submitted'],
      dommaxno: [ submissionData ? submissionData.dommaxno : ''],
    });
    this.submissionForm.get('consultant')?.setValue(submissionData?.consultant);
    this.validateControls();
  }

  private validateControls() {
    const requirement = this.submissionForm.get('requirement');
    if (this.flag == 'Recruiting' || this.flag == 'Domrecruiting') {
      requirement.setValidators(Validators.required);
    }
    else {
      requirement.clearValidators();
      this.submissionForm.get("requirement").patchValue("null");
    }
    requirement.updateValueAndValidity();
    this.submissionForm.get('ratetype').valueChanges.subscribe((res: any) => {
      const vendor = this.submissionForm.get('vendor');
      const recruiter = this.submissionForm.get("recruiter");
      const empmail = this.submissionForm.get('empmail');;
      if (res == '1099' || res == 'W2' || res == 'Full Time') {
        vendor.clearValidators();
        recruiter.clearValidators();
        empmail.clearValidators();
      }
      else {
        empmail.setValidators([Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')]);
        vendor.setValidators(Validators.required);
        recruiter.setValidators(Validators.required);
      }
      empmail.updateValueAndValidity();
      vendor.updateValueAndValidity();
      recruiter.updateValueAndValidity();
    });
  }

  getRequirements(flg: string) {
    this.submissionServ.getRequirements(flg).subscribe(
      (response: any) => {
        this.requirementdata = response.data;
      }
    )
  }

  requirements(event: any) {
    const newVal = event.value;
    this.submissionServ.getRequirementByIdDropdown(newVal).subscribe(
      (response: any) => {
        this.submissionForm.get("position").setValue(response.data.jobtitle);
        this.submissionForm.get("projectlocation").setValue(response.data.location);
        // this.address = response.data.location;
        this.submissionForm.get("ratetype").setValue(response.data.employmenttype);
        this.submissionForm.get("endclient").setValue(response.data.client);
        this.submissionForm.get("implpartner").setValue(response.data.vendor);
      }
    );
    if (newVal == '') {
      this.submissionForm.get("position").setValue('');
      this.submissionForm.get("projectlocation").setValue('');
      // this.address = '';
      this.submissionForm.get("ratetype").setValue('');
      this.submissionForm.get("endclient").setValue('');
      this.submissionForm.get("implpartner").setValue('');
    }
  }

  getConsultant(flg: string) {
    this.submissionServ.getConsultantDropdown(flg).subscribe(
      (response: any) => {
        this.consultantdata = response.data;
      })
  }

  handleAddressChange(address: any) {
    this.submissionForm.controls['projectlocation'].setValue(address.formatted_address);
  }

  get controls() {
    return this.submissionForm.controls;
  }

  flg!: any;
  getCompany() {
    this.flg = localStorage.getItem('department');
    const role = localStorage.getItem('role');
    if (role == 'Super Administrator' || role == 'Administrator' || role == 'Sales Manager'  || role == 'Recruiting Manager' ) {
      this.flg = "all";
    }
    this.submissionServ.getCompanies(this.flg).subscribe(
      (response: any) => {
        this.vendordata = response.data;
      }
    )
  }

  idd!: any;
  recruiterInfo(id: number) {
    this.idd = this.entity.recruiter;
    this.submissionServ.getRecruiterOfTheVendor(id, this.flgOpposite).subscribe(
      (response: any) => {
        this.recruiterName = response.data;
      }
    );
  }

  recruiterName: any[] = [];
  recruiterList(event: any) {
    const newVal = event.value;
    this.submissionServ.getRecruiterOfTheVendor(newVal, this.flgOpposite).subscribe(
      (response: any) => {
        this.recruiterName = response.data;
        this.submissionForm.get("empcontact").patchValue('');
        this.submissionForm.get("empmail").patchValue('');
        this.submissionForm.get("recruiter").patchValue('');
      }
    );
  }

  selectedItems: ContactInfo[] = [];
  recruiterContact(event: any) {
    const newVal = event.value;
    this.recruiterName.forEach(item => {
      if (newVal == item.id) {
        this.selectedItems.push(item);
      }
    });
    this.selectedItems.forEach(item => {
      this.submissionForm.get("empcontact").patchValue(item.usnumber);
      this.submissionForm.get("empmail").patchValue(item.email);

    });
  }

  goToVendorList() {
    this.dialogRef.close();
    this.router.navigate(['/usit/vendors']);
  }

  onSubmit() {

    if (this.submissionForm.invalid) {
      // this.displayFormErrors();
      this.submissionForm.markAllAsTouched();
      this.isRadSelected = true;
      return;
    }
    this.submitted = true;
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };


    const saveReqObj = this.getSaveData();
    this.submissionServ
      .registerSubmission(saveReqObj)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-submission'
                ? 'Submission added successfully'
                : 'Submission updated successfully';
            this.dialogRef.close();
          } else {
            dataToBeSentToSnackBar.message = resp.message ? resp.message : 'Submission already Exists';
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err) => {
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-submission'
              ? 'Submission addition is failed'
              : 'Submission updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.submissionForm.controls).forEach((field) => {
      const control = this.submissionForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  getSaveData() {
    if(this.data.actionName === 'edit-submission'){
      return {...this.entity, ...this.submissionForm.value}
    }
    return this.submissionForm.value;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onRadioChange(event: MatRadioChange){
    this.isRadSelected =  event.value
  }
}

export const SOURCE_TYPE = [
  'ATS',
  'Internal Req',
  'Internal Bench',
  'Dice',
  'Tech Fetch',
  'CareerBuilder',
  'Monster',
  'Job Portal',
  'LinkedIn',
  'Mass Mail',
  'Personal',
  'Reference',
  'Other',
] as const;

export const RADIO_OPTIONS = {
  rate: [
    {value: 'C2C', id: 1 },
    {value: '1099', id: 2},
    {value: 'W2', id: 3},
    {value: 'Full Time', id: 4},
    {value: 'C2H', id: 5}
  ]
}

class ContactInfo {
  company!: string;
  email!: string;
  usnumber!: string;
  id!: string;
  recruiter!: string;
}
