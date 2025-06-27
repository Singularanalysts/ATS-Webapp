import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from 'src/app/usit/services/vendor.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
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
import { Loader } from '@googlemaps/js-api-loader';
import { Observable, Subject, takeUntil } from 'rxjs';
import { NgxMatInputTelComponent } from 'ngx-mat-input-tel';

@Component({
  selector: 'app-add-known-vendor-contacts',
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
    MatCardModule,
    NgxGpAutocompleteModule,
    NgxMatInputTelComponent
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
  templateUrl: './add-known-vendor-contacts.component.html',
  styleUrls: ['./add-known-vendor-contacts.component.scss']
})
export class AddKnownVendorContactsComponent implements OnInit, OnDestroy {
  hotlistObj = new KnownVendorContact();
  hotlistForm: any = FormGroup;
  submitted = false;
  companyOptions: any = [];
  cityarr: any = [];
  pinarr: any = [];
  statearr: any = [];
  private vendorServ = inject(VendorService);
  private snackBarServ = inject(SnackBarService);
  private formBuilder = inject(FormBuilder);
  options = {
    componentRestrictions: { country: ['IN', 'US'] },
  };
  companySearchData: any[] = [];
  searchCompanyOptions$!: Observable<any>;
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddKnownVendorContactsComponent>);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  designation = localStorage.getItem('designation');
  isCompanyDataAvailable: boolean = false;

  ngOnInit(): void {
    if (this.data.actionName === "edit-known-vendor-contact") {
      this.bindFormControlValueOnEdit();
    }
    this.inihotlistForm(new KnownVendorContact());
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
    this.inihotlistForm(new KnownVendorContact());
    // api call
    this.vendorServ.getKnownVendorContactById(this.data.KnownVendorContactData.id).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.hotlistObj = response.data;
          //init form and  update control values on edit
          this.inihotlistForm(this.hotlistObj);
        }
      }, error: err => {
        dataToBeSentToSnackBar.message = err.message;
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      }
    });
  }

  /**
   * initializes hotlist Form
   */
  private inihotlistForm(hotlistProviderData: KnownVendorContact) {

    this.hotlistForm = this.formBuilder.group({
      vendor: [hotlistProviderData ? hotlistProviderData.vendor : '', [Validators.required]],
      employeeName: [hotlistProviderData ? hotlistProviderData.employeeName : '', [Validators.required ,this.noInvalidEmployeeName]],
      email: [hotlistProviderData ? hotlistProviderData.email : '', [ Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z]{2,}\\.[a-zA-Z]{2,}$')]],
      referenceContactNumber: [hotlistProviderData ? hotlistProviderData.referenceContactNumber : ''],
      client: [hotlistProviderData ? hotlistProviderData.client : ''],
      linkedinProfilesUrl: [hotlistProviderData ? hotlistProviderData.linkedinProfilesUrl : '', [Validators.required]],
      comments: [hotlistProviderData ? hotlistProviderData.comments : ''],
      addedBy: [hotlistProviderData && hotlistProviderData.addedBy ? hotlistProviderData.addedBy : localStorage.getItem('userid')],
      updatedby: [this.data.actionName === "edit-known-vendor-contact" ? localStorage.getItem('userid') : null],
      user: localStorage.getItem('userid'),
    });

    if (this.data.actionName === 'edit-known-vendor-contact') {
      
      this.hotlistForm.addControl(
        'id',
        this.formBuilder.control(
          hotlistProviderData ? hotlistProviderData.id : ''
        )
      );
    }
  }
noInvalidEmployeeName(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';

  // Reject empty or whitespace-only strings
  if (value.trim() === '') {
    return { whitespace: true };
  }

  // Require at least one letter
  const hasLetter = /[A-Za-z]/.test(value);
  if (!hasLetter) {
    return { invalidName: true };
  }

  return null; // valid
}


  /**
   * Submit
   */
  protected isFormSubmitted: boolean = false;
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

    if (this.hotlistForm.invalid) {
      this.isFormSubmitted = false;
      this.displayFormErrors();
      return;
    }
    else {
      this.isFormSubmitted = true
    }
    const saveReqObj = this.getSaveData();
    this.vendorServ
      .SaveOrUpdateKnownUpdateContact(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-known-vendor-contact'
                ? 'Known Vendor Contact added successfully'
                : 'Known Vendor Contact updated successfully';
            this.dialogRef.close();
          } else {
            this.isFormSubmitted = false;
            dataToBeSentToSnackBar.message =resp.message;
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err) => {
          this.isFormSubmitted = false;
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-known-vendor-contact'
              ? 'Known Vendor Contact addition is failed'
              : 'Known Vendor Contact updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  trimSpacesFromFormValues() {
    Object.keys(this.hotlistForm.controls).forEach((controlName: string) => {
      const control = this.hotlistForm.get(controlName);
      if (control.value && typeof control.value === 'string') {
        control.setValue(control.value.trim());
      }
    });
  }

  // return to be saved/ updated data
  getSaveData() {
    this.trimSpacesFromFormValues();
    // updates employee object form values
    if (this.data.actionName === "edit-known-vendor-contact") {
      [this.hotlistForm.value].forEach((formVal, idx) => {
        this.hotlistObj.vendor = formVal.vendor;
        this.hotlistObj.addedBy = formVal.addedBy;;
        this.hotlistObj.email = formVal.email;
        this.hotlistObj.updatedBy = localStorage.getItem('userid');
        this.hotlistObj.id = this.data.KnownVendorContactData.id;
        this.hotlistObj.employeeName = formVal.employeeName;
        this.hotlistObj.referenceContactNumber = formVal.referenceContactNumber;
        this.hotlistObj.linkedinProfilesUrl = formVal.linkedinProfilesUrl;
        this.hotlistObj.comments = formVal.comments;
        this.hotlistObj.client = formVal.client;
      })
      return this.hotlistObj
    }
    return this.hotlistForm.value;
  }

  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.hotlistForm.controls).forEach((field) => {
      const control = this.hotlistForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  emailDuplicate(event: any) {

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

export class KnownVendorContact {
  id!: any;
  vendor!: string;
  employeeName!: string;
  referenceContactNumber!: string;
  email!: string;
  client!: any;
  createddate!: string;
  addedBy!: any;
  updatedBy!:  any;
  linkedinProfilesUrl!: string;
  comments!: string;
}
