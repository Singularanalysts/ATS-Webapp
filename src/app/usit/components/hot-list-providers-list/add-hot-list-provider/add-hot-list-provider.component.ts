import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from 'src/app/usit/services/vendor.service';
import {
  AbstractControl,
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
import {
  NgxGpAutocompleteOptions,
  NgxGpAutocompleteService
} from "@angular-magic/ngx-gp-autocomplete";

@Component({
  selector: 'app-add-hot-list-provider',
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
  templateUrl: './add-hot-list-provider.component.html',
  styleUrls: ['./add-hot-list-provider.component.scss']
})
export class AddHotListProviderComponent implements OnInit, OnDestroy {
  hotlistObj = new Hlp();
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
  dialogRef = inject(MatDialogRef<AddHotListProviderComponent>);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  designation = localStorage.getItem('designation');
  isCompanyDataAvailable: boolean = false;

  ngOnInit(): void {
    if (this.data.actionName === "edit-hotlist-provider") {
      this.bindFormControlValueOnEdit();
    }
    this.inihotlistForm(new Hlp());
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
    this.inihotlistForm(new Hlp());
    // api call
    this.vendorServ.getHotlistProviderById(this.data.hotlistProviderData.id).subscribe({
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
  private inihotlistForm(hotlistProviderData: Hlp) {

    this.hotlistForm = this.formBuilder.group({
      vendor: [hotlistProviderData ? hotlistProviderData.vendor : '', [Validators.required]],
      recruiterName: [hotlistProviderData ? hotlistProviderData.recruiterName : '', [Validators.required]],
      email: [hotlistProviderData ? hotlistProviderData.email : '', [Validators.required]],
      contactNumber: [hotlistProviderData ? hotlistProviderData.contactNumber : '', [Validators.required]],
      addedby: [this.hotlistObj.addedby],
      updatedby: [this.hotlistObj.updatedby],
      user: localStorage.getItem('userid'),
      
    });

    if (this.data.actionName === 'edit-hotlist-provider') {
      
      this.hotlistForm.addControl(
        'hlpid',
        this.formBuilder.control(
          hotlistProviderData ? hotlistProviderData.hlpid : ''
        )
      );
    }
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
      .addORHotlistProvider(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-hotlist-provider'
                ? 'Hotlist Provider added successfully'
                : 'Hotlist Provider updated successfully';
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
            this.data.actionName === 'add-hotlist-provider'
              ? 'Hotlist Provider addition is failed'
              : 'Hotlist Provider updation is failed';
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
    if (this.data.actionName === "edit-hotlist-provider") {
      [this.hotlistForm.value].forEach((formVal, idx) => {
        this.hotlistObj.vendor = formVal.vendor;
        this.hotlistObj.addedby = localStorage.getItem('userid');;
        this.hotlistObj.email = formVal.email;
        this.hotlistObj.updatedby = localStorage.getItem('userid');
        this.hotlistObj.hlpid = this.data.hotlistProviderData.id;
        this.hotlistObj.recruiterName = formVal.recruiterName;
        this.hotlistObj.contactNumber = formVal.contactNumber;
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

  camelCase(event: any) {

  }

  convertToLowerCase(event: any) {

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

export class Hlp {
  hlpid!: any;
  vendor!: string;
  recruiterName!: string;
  contactNumber!: string;
  email!: string;
  createddate!: string;
  addedby = localStorage.getItem('userid');
  updatedby !:  any;
}

