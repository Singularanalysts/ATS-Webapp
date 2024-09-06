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
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
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
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SubmissionService } from 'src/app/usit/services/submission.service';
import { SubmissionInfo } from 'src/app/usit/models/submissioninfo';
import { DialogService } from 'src/app/services/dialog.service';
import { AddRecruiterComponent } from '../../../vendor-management/recruiter-list/add-recruiter/add-recruiter.component';
import { AddVendorComponent } from '../../../vendor-management/vendor-list/add-vendor/add-vendor.component';


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
export class AddSubmissionComponent implements OnInit {
  protected isFormSubmitted: boolean = false;
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
  searchConsultantOptions$!: Observable<any>;
  consultantOptions: any = [];
  isConsultantDataAvailable: boolean = false;
  searchCompanyOptions$!: Observable<any>;
  companyOptions: any = [];
  isCompanyDataAvailable: boolean = false;
  private dialogServ = inject(DialogService);

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddSubmissionComponent>
  ) { }

  get frm() {
    return this.submissionForm.controls;
  }
  userid!: any;
  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.getCompany();
    this.getFlag(this.data.flag.toLocaleLowerCase());
    this.getConsultant(this.flag)
    if (this.data.actionName === "edit-submission") {
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
  }

  getFlag(type: string) {
    if (type === 'sales') {
      this.flag = 'sales';
      this.flgOpposite = "Recruiter";
    } else if (type === 'recruiting') {
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
      // user:  [submissionData ? submissionData?.user : this.userid],
      user: [this.data.actionName === "edit-submission" ? submissionData?.user : localStorage.getItem('userid')],
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
      submissionid: [submissionData ? submissionData.submissionid : ''],
      updatedby: [this.data.actionName === "edit-submission" ? localStorage.getItem('userid') : '0'],
      status: [ submissionData ? submissionData.status : '', [Validators.required]],
      remarks: [submissionData ? submissionData.remarks : ''],
      substatus: [this.data.actionName === "edit-submission" ? submissionData.substatus : 'Submitted'],
      dommaxno: [submissionData ? submissionData.dommaxno : ''],
    });
    if (this.data.actionName === "edit-submission" && submissionData && submissionData.consultant) {
      this.submissionServ.getConsultantDropdown(this.flag, submissionData.consultant).subscribe(
        (consultant: any) => {
          if (consultant && consultant.data[0].consultantname) {
            this.obj = consultant.data[0].consultantid;
            this.submissionForm.get('consultant').setValue(consultant.data[0].consultantname);
          }
        },
        (error: any) => {
          console.error('Error fetching consultant details:', error);
        }
      );
    }
    if (this.data.actionName === "edit-submission" && submissionData && submissionData.vendor) {
      this.submissionServ.getVendorById(submissionData.vendor).subscribe(
        (vendor: any) => {
          if (vendor && vendor.data.company) {
            this.companyid = vendor.data.vmsid;
            this.submissionForm.get('vendor').setValue(vendor.data.company);
          }
        },
        (error: any) => {
          console.error('Error fetching consultant details:', error);
        }
      );
    }
    // this.submissionForm.get('consultant')?.setValue(submissionData?.consultant);
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
    this.validateRatetypeControls()
    this.submissionForm.get('ratetype').valueChanges.subscribe((res: any) => {
      this.validateRatetypeControls();
      // const vendor = this.submissionForm.get('vendor');
      // const recruiter = this.submissionForm.get("recruiter");
      // const empmail = this.submissionForm.get('empmail');;
      // if (res == '1099' || res == 'W2' || res == 'Full Time') {
      //   vendor.clearValidators();
      //   recruiter.clearValidators();
      //   empmail.clearValidators();
      // }
      // else {
      //   empmail.setValidators([Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')]);
      //   vendor.setValidators(Validators.required);
      //   recruiter.setValidators(Validators.required);
      // }
      // empmail.updateValueAndValidity();
      // vendor.updateValueAndValidity();
      // recruiter.updateValueAndValidity();
    });
  }

  private validateRatetypeControls() {
    const vendor = this.submissionForm.get('vendor');
    const recruiter = this.submissionForm.get("recruiter");
    const empmail = this.submissionForm.get('empmail');
    const ratetype = this.submissionForm.get('ratetype').value;

    if (ratetype == '1099' || ratetype == 'W2' || ratetype == 'Full Time') {
      vendor.clearValidators();
      recruiter.clearValidators();
      empmail.clearValidators();
    } else {
      empmail.setValidators([Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')]);
      vendor.setValidators(Validators.required);
      recruiter.setValidators(Validators.required);
    }
    empmail.updateValueAndValidity();
    vendor.updateValueAndValidity();
    recruiter.updateValueAndValidity();
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
    this.searchConsultantOptions$ = this.submissionServ.getConsultantDropdown(flg, 0).pipe(
      map((response: any) => response.data),
      tap(resp => {
        if (resp && resp.length) {
          this.getConsultantOptionsForAutoComplete(resp);
        }
      })
    );

    // this.submissionServ.getConsultantDropdown(flg).subscribe(
    //   (response: any) => {
    //     this.consultantdata = response.data;
    //   })
  }

  getConsultantOptionsForAutoComplete(data: any) {
    this.consultantOptions = data;
    this.searchConsultantOptions$ = this.submissionForm.controls.consultant.valueChanges.pipe(
      startWith(''),
      map(value => this._filterOptions(value, this.consultantOptions))
    );
  }

  obj: any;
  private _filterOptions(value: any, options: any[]): any[] {

    const filterValue = (value ? value.toString() : '').toLowerCase();
    const filteredOptions = options.filter(option =>
      option.consultantname.toLowerCase().includes(filterValue)
    );

    if (filteredOptions.length === 1) {
      this.obj = filteredOptions[0].consultantid;
    }
    this.isConsultantDataAvailable = filteredOptions.length === 0;
    return filteredOptions;
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
    if (role == 'Super Administrator' || role == 'Administrator' || role == 'Sales Manager' || role == 'Recruiting Manager') {
      this.flg = "all";
    }
    // this.submissionServ.getCompanies(this.flg).subscribe(
    //   (response: any) => {
    //     this.vendordata = response.data;
    //   }
    // )

    this.searchCompanyOptions$ = this.submissionServ.getCompanies(this.flg).pipe(
      map((response: any) => response.data),
      tap(resp => {
        if (resp && resp.length) {
          this.getCompanyOptionsForAutoComplete(resp);
        }
      })
    );
  }

  getCompanyOptionsForAutoComplete(data: any) {
    this.companyOptions = data;
    this.searchCompanyOptions$ = this.submissionForm.controls.vendor.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCompanyOptions(value, this.companyOptions))
    );
  }
  companyid: any;
  private _filterCompanyOptions(value: any, options: any[]): any[] {
    const filterValue = (value ? value.toString() : '').toLowerCase();
    const filteredOptions = options.filter(option =>
      option.company.toLowerCase().includes(filterValue)
    );
    return filteredOptions;
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
  recruiterList(option: any) {
    this.companyid = option.vmsid;
    const newVal = option.vmsid;
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
      this.isFormSubmitted = false
      this.submissionForm.markAllAsTouched();
      this.isRadSelected = true;
      return;
    }
    else {
      this.isFormSubmitted = true
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
    // alert()
    this.trimSpacesFromFormValues();
    this.submissionForm.get('consultant').setValue(this.obj);
    this.submissionForm.get('vendor').setValue(this.companyid);
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
            this.isFormSubmitted = false;
            dataToBeSentToSnackBar.message = resp.message ? resp.message : 'Submission already Exists';
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err) => {
          this.isFormSubmitted = false;
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-submission'
              ? 'Submission addition is failed'
              : 'Submission updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }
  trimSpacesFromFormValues() {
    Object.keys(this.submissionForm.controls).forEach((controlName: string) => {
      const control = this.submissionForm.get(controlName);
      if (control.value && typeof control.value === 'string') {
        control.setValue(control.value.trim());
      }
    });
  }

  camelCase(event: any) {
    const inputValue = event.target.value;
    event.target.value = this.capitalizeFirstLetter(inputValue);
  }

  capitalizeFirstLetter(input: string): string {
    return input.toLowerCase().replace(/(?:^|\s)\S/g, function (char) {
      return char.toUpperCase();
    });
    // return input.toLowerCase().replace(/\b\w/g, function(char) {
    //   return char.toUpperCase();
    // });
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
    this.trimSpacesFromFormValues();
    if (this.data.actionName === 'edit-submission') {
      return { ...this.entity, ...this.submissionForm.value }
    }
    return this.submissionForm.value;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onRadioChange(event: MatRadioChange) {
    this.isRadSelected = event.value
  }

  addVendor() {
    const actionData = {
      title: 'Add Vendor',
      vendorData: null,
      actionName: 'add-vendor',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-vendor';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddVendorComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        // this.getAllData(this.currentPageIndex + 1);
      }
    });
  }
  onlyNumberKey(evt: any) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if ((ASCIICode >= 48 && ASCIICode <= 57) || // Numbers 0-9
     (ASCIICode >= 65 && ASCIICode <= 90) || // Uppercase letters A-Z
     (ASCIICode >= 97 && ASCIICode <= 122)) 
        return true;
        return false;
  }

  addRecruiter() {
    const actionData = {
      title: 'Add Recruiter',
      recruiterData: null,
      actionName: 'add-recruiter',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    //dialogConfig.height = "100vh";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-recruiter';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddRecruiterComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        // this.getAllRecruiters(this.currentPageIndex + 1);
      }
    });

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
  'Email',
  'Mass Mail',
  'Personal',
  'Reference',
  'Other',
] as const;

export const RADIO_OPTIONS = {
  rate: [
    { value: 'C2C', id: 1 },
    { value: '1099', id: 2 },
    { value: 'W2', id: 3 },
    { value: 'Full Time', id: 4 },
    { value: 'C2H', id: 5 }
  ]
}

class ContactInfo {
  company!: string;
  email!: string;
  usnumber!: string;
  id!: string;
  recruiter!: string;
}
