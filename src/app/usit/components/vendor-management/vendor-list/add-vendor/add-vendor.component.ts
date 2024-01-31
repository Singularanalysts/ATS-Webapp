import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from 'src/app/usit/services/vendor.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
import { Company } from 'src/app/usit/models/company';
import {
  NgxGpAutocompleteDirective,
  NgxGpAutocompleteOptions,
  NgxGpAutocompleteService
} from "@angular-magic/ngx-gp-autocomplete";

@Component({
  selector: 'app-add-vendor',
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
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss'],
})
export class AddVendorComponent implements OnInit, OnDestroy {
  vendorObj = new Vms();
  vendorForm: any = FormGroup;
  submitted = false;
  companyOptions: any = [];
  cityarr: any = [];
  pinarr: any = [];
  statearr: any = [];
  private vendorServ = inject(VendorService);
  private snackBarServ = inject(SnackBarService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  // options = {
  //   componentRestrictions: { country: ['IN', 'US'] },
  // };

  companySearchData: any[] = [];
  searchCompanyOptions$!: Observable<any>;
  selectOptionObj = {
    companyType: COMPANY_TYPE,
    tierType: TIER_TYPE,
    vendorType: VENDOR_TYPE,
    statusType: STATUS_TYPE,
  };
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddVendorComponent>);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
   
  designation = localStorage.getItem('designation');
  isCompanyDataAvailable: boolean = false;

  constructor(private ngxGpAutocompleteService: NgxGpAutocompleteService,) {
    this.ngxGpAutocompleteService.setOptions({ componentRestrictions: { country: ['US'] } });
  }

  options = {
    componentRestrictions: {
      country: ['US'],
    },
  } as NgxGpAutocompleteOptions;

  ngOnInit(): void {

   // this.getvendorcompanydetails(); 
   //This below snippet will be  for company auto-complete search
    this.searchCompanyOptions$ = this.vendorServ.getCompanies().pipe(map((x:any)=> x.data), tap(resp => {
        if (resp && resp.length) {
          this.getCompanyOptionsForAutoComplete(resp);
        }
    }));
    if(this.data.actionName === "edit-vendor"){
      this.bindFormControlValueOnEdit();
    }
    this.iniVendorForm(new Vms());

  }

  private bindFormControlValueOnEdit() {
    // snackbar
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    this.iniVendorForm(new Vms());
    // api call
    this.vendorServ.getEntity(this.data.vendorData.id).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.vendorObj = response.data;
          //init form and  update control values on edit
          this.iniVendorForm(this.vendorObj);
        }
      }, error: err =>{
        dataToBeSentToSnackBar.message = err.message;
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      }
    });
  }

  /**
   * initializes vendor Form
   */
  private iniVendorForm(vendorData: Vms) {

    this.vendorForm = this.formBuilder.group({
      company: [
        vendorData ? vendorData.company : '',
        [Validators.required],
      ],
      //  fedid: [this.data.vendorData ? this.data.vendorData.fedid : ''],
      vendortype: [
       vendorData ?vendorData.vendortype : '',
        Validators.required,
      ],
      companytype: [
       vendorData ?vendorData.companytype : '',Validators.required,
      ],
      tyretype: [vendorData ?vendorData.tyretype : ''],
      client: [vendorData ?vendorData.client : ''],
      addedby: [this.vendorObj.addedby],
      updatedby: [this.vendorObj.updatedby],
      details: [vendorData ?vendorData.details : ''],
      staff: [vendorData ?vendorData.staff : ''],
      revenue: [vendorData ?vendorData.revenue : ''],
      website: [vendorData ?vendorData.website : ''],
      facebook: [vendorData ?vendorData.facebook : ''],
      industrytype: [
       vendorData ?vendorData.industrytype : '',
      ],
      linkedinid: [vendorData ?vendorData.linkedinid : ''],
      twitterid: [vendorData ?vendorData.twitterid : ''],
      // user: this.formBuilder.group({
      //   userid: localStorage.getItem('userid'),
      // }),
      user: localStorage.getItem('userid'),
      headquerter: [
       vendorData ?vendorData.headquerter : '',
        [Validators.required, this.atLeastTwoNumbers]
      ],
    });
    if (this.data.actionName === 'edit-vendor') {
      this.vendorForm.addControl(
        'status',
        this.formBuilder.control(
          vendorData ? vendorData.status : ''
        )
      );
      this.vendorForm.addControl(
        'vmsid',
        this.formBuilder.control(
          vendorData ? vendorData.vmsid : ''
        )
      );
      this.vendorForm.addControl(
        'vms_stat',
        this.formBuilder.control(
          vendorData ? vendorData.vms_stat : ''
        )
      );
    }
    this.validateControls(this.data.actionName);
  }

  atLeastTwoNumbers(control: AbstractControl): { [key: string]: boolean } | null {
    const value: string = control.value || '';
    const numDigits = value.replace(/[^0-9]/g, '').length;
  
    if (numDigits < 2) {
      return { 'atLeastTwoNumbers': true }; 
    }
  
    return null; 
  }
  
  validateControls(action = 'add-vendor') {
    if (action === 'edit-vendor') {
      this.vendorForm.get('status').valueChanges.subscribe((res: any) => {
        const remarks = this.vendorForm.get('remarks');
        if (res === 'Rejected') {
          //this.rejectionflg = true;
          remarks.setValidators(Validators.required);
        } else {
          //this.rejectionflg = false;
          remarks.clearValidators();
        }
        remarks.updateValueAndValidity();
        if (res == 'Active') {
          this.vendorForm.get('vms_stat').setValue('Initiated');
        }
      });
      return;
    }
    this.vendorForm.get('vendortype').valueChanges.subscribe((res: any) => {
      const vntype = this.vendorForm.get('vendortype').value;
      const trtype = this.vendorForm.get('tyretype');
      if (vntype == 'Primary Vendor') {
        trtype.setValue('Primary Vendor');
      } else if (vntype == 'Implementation Partner') {
        trtype.setValue('Implementation Partner');
      } else if (vntype == 'Client') {
        trtype.setValue('Client');
      } else {
        trtype.setValue('');
      }
      if (res == 'Tier') {
        trtype.setValidators(Validators.required);
      } else {
        trtype.clearValidators();
      }
      trtype.updateValueAndValidity();
    });
  //  this.companyAutoCompleteSearch();
// this.searchCompanyOptions$ =
//     this.vendorForm.controls.company.valueChanges.pipe(
//       startWith(''),
//       map((value: any) =>
//         this._filterOptions({company: value} || '', this.companyOptions)
//       )
//     );
  }
  private _filterOptions(value: any, options: string[]): string[] {
    const filterValue = value.company.trim().toLowerCase();
    const filteredCompanies = options.filter((option: any) =>
      option.company.trim().toLowerCase().includes(filterValue)
    );
    this.isCompanyDataAvailable = filteredCompanies.length === 0;
    return filteredCompanies;

  }
  /**
   * getVendor Company Details : NOT USED
   */
  getvendorcompanydetails() {
    this.vendorServ.getCompanies() .subscribe((response: any) => {
          this.companyOptions = response.data;
          this.searchCompanyOptions$ =
          this.vendorForm.controls.company.valueChanges.pipe(
            startWith(''),
            map((value: any) =>
              this._filterOptions({company: value} || '', this.companyOptions)
            )
          );
      });
  }

  getCompanyOptionsForAutoComplete(data: any){
    this.companyOptions = data;
    this.searchCompanyOptions$ =
    this.vendorForm.controls.company.valueChanges.pipe(
      startWith(''),
      map((value: any) =>
        this._filterOptions({company: value} || '', this.companyOptions)
      )
    );
  }

  // not used
  dupcheck(event: any) {
    const vendor = event.target.value;
    this.vendorServ
      .duplicatecheck(vendor, 0)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        if (response.status == 'success') {
          // this.message = '';
        } else if (response.status == 'duplicate') {
          const cn = this.vendorForm.get('company');
          cn.setValue('');
          // this.message = 'Vendor Company already exist';
          // alertify.error("Vendor Company already exist");
        } else {
          // alertify.error("Internal Server Error");
        }
      });
  }

  /**
   * Submit
   */
  onSubmit() {
    this.submitted = true;
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };

    if (this.vendorForm.invalid) {
      this.displayFormErrors();
      return;
    }
    const saveReqObj = this.getSaveData();
    this.vendorServ
      .addORUpdateVendor(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-vendor'
                ? 'Vendor added successfully'
                : 'Vendor updated successfully';
            this.dialogRef.close();
          } else {
            dataToBeSentToSnackBar.message = 'Vendor already Exists';
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err) => {
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-vendor'
              ? 'Vendor addition is failed'
              : 'Vendor updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  // return to be saved/ updated data
  getSaveData() {
     // updates employee object form values
     if(this.data.actionName === "edit-vendor"){
      [this.vendorForm.value].forEach( (formVal, idx) => {
        this.vendorObj.company = formVal.company;
        this.vendorObj.vendortype = formVal.vendortype;
        this.vendorObj.companytype = formVal.companytype;
        this.vendorObj.tyretype =  formVal.tyretype;
        this.vendorObj.client =  formVal.client;
        this.vendorObj.addedby = localStorage.getItem('userid');;
        this.vendorObj.email =  formVal.email;
        this.vendorObj.updatedby =  localStorage.getItem('userid');
        this.vendorObj.headquerter =  formVal.headquerter;
        this.vendorObj.status =  formVal.status;
        this.vendorObj.vmsid =  this.data.vendorData.id;
        this.vendorObj.vms_stat = formVal.status === "Active" ? "Initiated" : formVal.status === "Approved" ? "Approved" : formVal.vms_stat;
        // this.vendorObj.vms_stat =  formVal.status === "Active"  ? "Initiated" : formVal.vms_stat;
        this.vendorObj.twitterid = formVal.twitterid;
        this.vendorObj.linkedinid =  formVal.linkedinid;
        this.vendorObj.industrytype = formVal.industrytype;
        this.vendorObj.facebook = formVal.facebook;
        this.vendorObj.website = formVal.website;
        this.vendorObj.revenue =  formVal.revenue;
        this.vendorObj.staff = formVal.staff;
        this.vendorObj.details = formVal.details;
        this.vendorObj.client = formVal.client;
      })
      return this.vendorObj
    }
    return this.vendorForm.value;
  }


  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.vendorForm.controls).forEach((field) => {
      const control = this.vendorForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  companyAutoCompleteSearch() {
    this.searchCompanyOptions$ = this.vendorForm.get('company').valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: any) => {
        if (term) {
          return this.getFilteredValue(term);
        } else {
          this.companySearchData = [];
          return of<any>([]);
        }
      })
      // Uncomment below to verify the searched result
      // tap((res) => {
      //   console.log({res})

      // }),
    );
  }
  /**
   * filters the data for searched input query
   * @param term
   * @returns
   */
  getFilteredValue(term: any): Observable<any> {
    if (term && this.companyOptions) {
      const sampleArr = this.companyOptions.filter(
        (val: any) =>
          val.company
            .trim()
            .toLowerCase()
            .includes(term.trim().toLowerCase()) == true
      );
      this.companySearchData = sampleArr;
      return of(this.companySearchData);
    }
    return of([]);
  }

  /**
   * handle address change
   * @param address
   */

  handleAddressChange(address: any) {
    this.vendorForm.controls.headquerter.setValue(address.formatted_address);
    this.vendorForm.controls.website.setValue(address.website);
  }
  /**
   * Cancel
   */
  onCancel() {
    this.dialogRef.close();
  }

  /** clean up subscriptions */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

export const VENDOR_TYPE = [
  'Primary Vendor',
  'Implementation Partner',
  'Client',
  'Tier',
] as const;

export const TIER_TYPE = [
  'Tier One',
  'Tier Two',
  'Tier Three',
  'Primary Vendor',
  'Implementation Partner',
  'Client',
] as const;

export const COMPANY_TYPE = ['Recruiting', 'Bench Sales', 'Both'] as const;

export const STATUS_TYPE = ['Active', 'Approved', 'Rejected'] as const;
