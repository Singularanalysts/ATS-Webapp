import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
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
import { MatCardModule } from '@angular/material/card';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ClientInformationService } from 'src/app/usit/services/client-information.service';

@Component({
  selector: 'app-add-client-information',
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
    MatCardModule
  ],
  templateUrl: './add-client-information.component.html',
  styleUrls: ['./add-client-information.component.scss']
})
export class AddClientInformationComponent implements OnInit, OnDestroy {
  tcvrObj = new Tcvr();
  tcvrForm: any = FormGroup;
  submitted = false;
  companyOptions: any = [];
  cityarr: any = [];
  pinarr: any = [];
  statearr: any = [];
  private snackBarServ = inject(SnackBarService);
  private formBuilder = inject(FormBuilder);
  companySearchData: any[] = [];
  searchCompanyOptions$!: Observable<any>;
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddClientInformationComponent>);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  designation = localStorage.getItem('designation');
  isCompanyDataAvailable: boolean = false;
  private clientInfoServ = inject(ClientInformationService);

  ngOnInit(): void {
    if (this.data.actionName === "edit-tcvr") {
      this.bindFormControlValueOnEdit();
    }
    this.initTcvrForm (new Tcvr());
  }

  private bindFormControlValueOnEdit() {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    this.initTcvrForm (new Tcvr());
    this.clientInfoServ.getTcvrById(this.data.clientData.id).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.tcvrObj = response.data;
          this.initTcvrForm (this.tcvrObj);
        }
      }, error: (err: any) => {
        dataToBeSentToSnackBar.message = err.message;
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      }
    });
  }

  /**
   * initializes Tcvr Form
   */
  private initTcvrForm (tcvrData: Tcvr) {
    this.tcvrForm = this.formBuilder.group({
      client: [tcvrData ? tcvrData.client : ''],
      firstLevelVendor: [tcvrData ? tcvrData.firstLevelVendor : ''],
      comments: [tcvrData ? tcvrData.comments : ''],
      secondLevelVendor: [tcvrData ? tcvrData.secondLevelVendor : ''],
      technology: [tcvrData ? tcvrData.technology : '', [Validators.required]],
      careersPage: [tcvrData ? tcvrData.careersPage : '', [Validators.required]],
      addedby: [tcvrData && tcvrData.addedby ? tcvrData.addedby : localStorage.getItem('userid')],
      updatedby: [this.data.actionName === "edit-tcvr" ? localStorage.getItem('userid') : null],
      user: localStorage.getItem('userid'),
    });

    if (this.data.actionName === 'edit-tcvr') {
      this.tcvrForm.addControl(
        'id',
        this.formBuilder.control(
          tcvrData ? tcvrData.id : ''
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

    if (this.tcvrForm.invalid) {
      this.isFormSubmitted = false;
      this.displayFormErrors();
      return;
    }
    else {
      this.isFormSubmitted = true
    }
    const saveReqObj = this.getSaveData();
    this.clientInfoServ
      .addORUpdateTcvr(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-tcvr'
                ? 'TCVR added successfully'
                : 'TCVR updated successfully';
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
            this.data.actionName === 'add-tcvr'
              ? 'TCVR addition is failed'
              : 'TCVR updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  trimSpacesFromFormValues() {
    Object.keys(this.tcvrForm.controls).forEach((controlName: string) => {
      const control = this.tcvrForm.get(controlName);
      if (control.value && typeof control.value === 'string') {
        control.setValue(control.value.trim());
      }
    });
  }

  // return to be saved/ updated data
  getSaveData() {
    this.trimSpacesFromFormValues();
    // updates employee object form values
    if (this.data.actionName === "edit-tcvr") {
      this.tcvrObj.id = this.data.clientData.id;
      [this.tcvrForm.value].forEach((formVal, idx) => {
        this.tcvrObj.client = formVal.client;
        this.tcvrObj.firstLevelVendor = formVal.firstLevelVendor;
        this.tcvrObj.secondLevelVendor = formVal.secondLevelVendor;
        this.tcvrObj.technology = formVal.technology;
        this.tcvrObj.comments = formVal.comments;
        this.tcvrObj.careersPage = formVal.careersPage;
        this.tcvrObj.addedby = formVal.addedby;;
        this.tcvrObj.updatedby = localStorage.getItem('userid');
      })
      return this.tcvrObj
    }
    return this.tcvrForm.value;
  }

  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.tcvrForm.controls).forEach((field) => {
      const control = this.tcvrForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
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

export class Tcvr {
  id!: any;
  client!: string;
  comments!: string;
  firstLevelVendor!: string;
  secondLevelVendor!: string;
  technology!: string;
  careersPage!: string;
  createddate!: string;
  addedby!: any;
  updatedby!:  any;
}
