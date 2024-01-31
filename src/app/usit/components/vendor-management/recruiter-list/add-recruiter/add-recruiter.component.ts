import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
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
import { RecruiterService } from 'src/app/usit/services/recruiter.service';
import { Observable, debounceTime, distinctUntilChanged, tap, switchMap, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { AddVendorComponent, COMPANY_TYPE, STATUS_TYPE } from '../../vendor-list/add-vendor/add-vendor.component';
import { DialogService } from 'src/app/services/dialog.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { Recruiter } from 'src/app/usit/models/recruiter';

@Component({
  selector: 'app-add-recruiter',
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
    NgxMatIntlTelInputComponent
  ],
  templateUrl: './add-recruiter.component.html',
  styleUrls: ['./add-recruiter.component.scss']
})
export class AddRecruiterComponent implements OnInit {
  recruiterObj = new Recruiter();
  recruiterForm: any = FormGroup;
  submitted = false;
  companyOptions: any = [];
  cityarr: any = [];
  pinarr: any = [];
  statearr: any = [];
  filteredOptions: any;
  vmsid!: any;
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  private recruiterServ = inject(RecruiterService);
  private snackBarServ = inject(SnackBarService);
  private dialogServ = inject(DialogService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  searchObs$!: Observable<any>;
  searchCompanyOptions$!: Observable<any>;
  companySearchData: any[] = [];
  selectOptionObj = {

    statusType: STATUS_TYPE,
  };
  isCompanyDataAvailable: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddRecruiterComponent>
  ) { }
  designation = localStorage.getItem('designation');
  ngOnInit(): void {
    //this.getvendorcompanydetails();
    this.getFlagDetails();
    this.searchCompanyOptions$ = this.recruiterServ.getCompanies(this.dept).pipe(map((x:any)=> x.data), tap(resp =>{
      if(resp && resp.length) {
        this.getCompanyOptionsForAutoComplete(resp);
      }
    }));
    if (this.data.actionName === 'edit-recruiter') {
      this.iniRecruiterForm(new Recruiter());
      this.recruiterServ.getEntity(this.data.recruiterData.id).subscribe(
        (response: any) => {
          this.recruiterObj = response.data;
          this.iniRecruiterForm(response.data);
        }
      );


    } else {
      this.iniRecruiterForm(null);
    }
    // this.filteredOptions = this.autoInput.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value || '')),
    // );
  }

  // private _filter(value: any) {
  //   const filterValue = value.toLowerCase();

  //   return this.rolearr.filter(option => option.toLowerCase().includes(filterValue));
  // }

  /**
   * initializes Recruiter Form
   */
  private iniRecruiterForm(recruiterData: any) {
    this.recruiterForm = this.formBuilder.group(
      {
        recruiter: [recruiterData ? recruiterData.recruiter : ''],
        email: [recruiterData ? recruiterData.email : '', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')]],
        usnumber: [recruiterData ? recruiterData.usnumber : ''],
        contactnumber: [recruiterData ? recruiterData.contactnumber : ''],
        extension: [recruiterData ? recruiterData.extension : ''],
        recruitertype: [recruiterData ? recruiterData.recruitertype : '', Validators.required],
        details: [recruiterData ? recruiterData.details : ''],
        addedby: [recruiterData ? recruiterData.addedby:  ''],
        updatedby: [recruiterData ? recruiterData.updatedby : ''],
        vendor: this.formBuilder.group({
          vmsid: [recruiterData ? recruiterData.vendor.vmsid   : ''],
          company: [recruiterData ? recruiterData.vendor.company   : '', Validators.required],
        }),
        user: localStorage.getItem('userid'),
      }
    );
    if (this.data.actionName === 'edit-recruiter') {
      this.recruiterForm.addControl('recid',this.formBuilder.control(recruiterData ? recruiterData.recid : ''));
      this.recruiterForm.addControl('status',this.formBuilder.control(recruiterData ? recruiterData.status : ''));
      this.recruiterForm.addControl('remarks',this.formBuilder.control(recruiterData ? recruiterData.remarks : ''));
      this.recruiterForm.addControl('rec_stat',this.formBuilder.control(recruiterData ? recruiterData.rec_stat : ''));
    }
    this.validateControls()
    // this.companyAutoCompleteSearch()
  }

  validateControls(action = 'add-recruiter') {
    if (action === 'edit-recruiter') {
      this.recruiterForm.get('status').valueChanges.subscribe((res: any) => {
        // const remarks = this.recruiterForm.get('remarks');
        // if (res?.trim() === 'Rejected') {
        //   //this.rejectionflg = true;
        //   remarks.setValidators(Validators.required);
        // } else {
        //   //this.rejectionflg = false;
        //   remarks.clearValidators();
        // }
        // remarks.updateValueAndValidity();
        if (res == 'Active') {
          this.recruiterForm.get('rec_stat').setValue('Initiated');
        }
      });
      return;
    }
  }

  // validateControls() {

  //   this.companyAutoCompleteSearch()
  // }

  companyAutoCompleteSearch() {
    this.searchObs$ = this.recruiterForm.get('vendor.company').valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: any) => {
        if (term) {
          return this.getFilteredValue(term);
        }
        else {
          this.companySearchData = [];
          return of<any>([]);
        }
      }
      ),
      // Uncomment below to verify the searched result
      // tap((res) => {
      //   console.log({res})

      // }),

    );



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
    if (this.recruiterForm.invalid) {
      //this.blur = "enable"
      this.recruiterForm.markAllAsTouched();
      this.displayFormErrors();
      return;
    }
    this.submitted=true;
    const saveReqObj = this.getSaveData();
    this.recruiterServ.addOrUpdateRecruiter(saveReqObj, this.data.actionName)
      .subscribe({
         next: (data: any) => {
          if (data.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-recruiter'
                ? 'Recruiter added successfully'
                : 'Recruiter updated successfully';
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          }
          else {
            // this.blur = "enable"
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-recruiter'
                ? 'Recruiter addition is failed'
                : 'Recruiter updation is failed';
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          }
          this.dialogRef.close();
        },
        error: (err) => {
          //this.blur = 'enable';
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-recruiter'
              ? 'Recruiter addition is failed'
              : 'Recruiter updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
  });

  }
  getSaveData() {
    // updates employee object form values
    if(this.data.actionName === "edit-recruiter"){
    const obj = {...this.recruiterObj, ...this.recruiterForm.value};
    obj.rec_stat = this.recruiterForm.value.status === "Active" ? "Initiated" : this.recruiterForm.value.status === "Approved" ? "Approved" : this.recruiterForm.value.rec_stat;
    return obj
   }
   return this.recruiterForm.value;
 }

  flg!: any;
  dept = 'all';

  getvendorcompanydetails() {
    this.getFlagDetails();
    this.recruiterServ.getCompanies(this.dept).subscribe(
      (response: any) => {
        this.companyOptions = response.data;
        this.searchCompanyOptions$ =
          this.recruiterForm.controls.vendor.controls.company.valueChanges.pipe(
            startWith(''),
            map((value: any) =>
              this._filterOptions({ company: value }  || '', this.companyOptions)
            )
          );
      }
    )
  }

  private getFlagDetails() {
    this.flg = localStorage.getItem('department');
    const role = localStorage.getItem('role');

    if (role == 'Super Admin' || role == 'Admin') {
      this.dept = "all";
    }
    if (this.flg == 'Recruiting') {
      this.dept = 'Recruiting';
    }
    if (this.flg == 'Bench Sales') {
      this.dept = 'Bench Sales';
    }
  }

  private _filterOptions(value: any, options: string[]): string[] {
    const filterValue = value.company.trim().toLowerCase();
    const filteredCompanies = options.filter((option: any) =>
      option.company.trim().toLowerCase().includes(filterValue)
    );
    this.isCompanyDataAvailable = filteredCompanies.length === 0;
    return filteredCompanies;

  }

  getCompanyOptionsForAutoComplete(data: any){
    this.companyOptions = data;
    this.searchCompanyOptions$ =
      this.recruiterForm.controls.vendor.controls.company.valueChanges.pipe(
        startWith(''),
        map((value: any) =>
          this._filterOptions({ company: value }  || '', this.companyOptions)
        )
      );
  }

  displayFormErrors() {
    Object.keys(this.recruiterForm.controls).forEach((field) => {
      const control = this.recruiterForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  emailDuplicate(event: any) {
    const email = event.target.value;
    this.recruiterServ.duplicatecheckEmail(email).subscribe(
      (response: any) => {
        if (response.status == 'success') {
          //this.message = '';
        }
        else if (response.status == 'duplicate') {
          const cn = this.recruiterForm.get('email');
          cn.setValue('');
          this.dataToBeSentToSnackBar.message =  'Record already available with given Mail address';
              this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
              this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
        else {
          this.dataToBeSentToSnackBar.message =  'Internal Server Error';
              this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
              this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
      }
    )
  }


  onCancel() {
    this.dialogRef.close();
  }

  /**
   * filters the data for searched input query
   * @param term
   * @returns
   */
  getFilteredValue(term: any): Observable<any> {
    if (term && this.companyOptions) {
      const sampleArr = this.companyOptions.filter((val: any) => val.company.trim().toLowerCase().includes(term.trim().toLowerCase()) == true)
      this.companySearchData = sampleArr;
      return of(this.companySearchData);
    }
    return of([])
  }

  navigateToAddVendor() {
    const actionData = {
      title: 'Add Vendor',
      vendorData: null,
      actionName: 'add',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    // dialogConfig.height = "100vh";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-vendor';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(AddVendorComponent, dialogConfig);

  }

  goToVendorList() {
    this.dialogRef.close();
    this.router.navigate(['/usit/vendors']);
  }

  onVendorSelect(vendor: any){
    this.recruiterForm.get('vendor.vmsid').setValue(vendor.id);
  }

}
