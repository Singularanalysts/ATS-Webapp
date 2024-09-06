import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SnackBarService, ISnackBarData } from 'src/app/services/snack-bar.service';
import { Project } from 'src/app/taskmodule/models/project.model';
import { OpenreqService } from 'src/app/usit/services/openreq.service';

@Component({
  selector: 'app-add-email-configuration',
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
    MatRippleModule,
  ],
  templateUrl: './add-email-configuration.component.html',
  styleUrls: ['./add-email-configuration.component.scss']
})
export class AddEmailConfigurationComponent implements OnInit, OnDestroy {
  emailConfigObj : any;
  emailConfigurationForm: any = FormGroup;
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
  dialogRef = inject(MatDialogRef<AddEmailConfigurationComponent>);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  designation = localStorage.getItem('designation');
  isCompanyDataAvailable: boolean = false;
  private OpenReqServ = inject(OpenreqService);
  message: any;
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };

  ngOnInit(): void {
    this.initProjectForm(null);
    if (this.data.actionName === "edit-email-configuration") {
      this.bindFormControlValueOnEdit();
    }
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
    this.initProjectForm(null);
    // api call
    this.OpenReqServ.getEmailById(this.data.emailData.id).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.emailConfigObj = response.data;
          //init form and  update control values on edit
          this.initProjectForm(this.emailConfigObj);
        }
      }, error: (err: any) => {
        dataToBeSentToSnackBar.message = err.message;
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      }
    });
  }

  /**
   * initializes Project Form
   */
  private initProjectForm(emailConfigData: any) {

    this.emailConfigurationForm = this.formBuilder.group({
      email: [emailConfigData ? emailConfigData.email : '', [Validators.required, Validators.email]],
      password: [emailConfigData ? emailConfigData.password : '', [Validators.required]],
      technology: [emailConfigData ? emailConfigData.technology : ''],
      userid: localStorage.getItem('userid'),
      addedBy: [emailConfigData && emailConfigData.addedBy ? emailConfigData.addedBy : localStorage.getItem('userid')],
      updatedby: [this.data.actionName === "edit-email-configuration" ? localStorage.getItem('userid') : null]
    });

    if (this.data.actionName === 'edit-email-configuration') {
      this.emailConfigurationForm.addControl(
        'id',
        this.formBuilder.control(
          emailConfigData ? emailConfigData.id : ''
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

    if (this.emailConfigurationForm.invalid) {
      this.isFormSubmitted = false;
      this.displayFormErrors();
      return;
    }
    else {
      this.isFormSubmitted = true
    }
    const saveReqObj = this.getSaveData();
    this.OpenReqServ
      .addORUpdateEmailConfiguration(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'Success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-email-configuration'
                ? 'Email Configuration saved successfully'
                : 'Email Configuration updated successfully';
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
            this.data.actionName === 'add-project'
              ? 'Email Configuration addition is failed'
              : 'Email Configuration updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  trimSpacesFromFormValues() {
    Object.keys(this.emailConfigurationForm.controls).forEach((controlName: string) => {
      const control = this.emailConfigurationForm.get(controlName);
      if (control.value && typeof control.value === 'string') {
        control.setValue(control.value.trim());
      }
    });
  }

  getSaveData() {
    this.trimSpacesFromFormValues();
    if (this.data.actionName === "edit-email-configuration") {
      [this.emailConfigurationForm.value].forEach((formVal, idx) => {
        this.emailConfigObj.email = formVal.email;
        this.emailConfigObj.password = formVal.password;
        this.emailConfigObj.technology = formVal.technology;
        this.emailConfigObj.userid = localStorage.getItem('userid');
        this.emailConfigObj.addedBy = formVal.addedBy;
        this.emailConfigObj.updatedBy = localStorage.getItem('userid');
      })
      return this.emailConfigObj
    }
    return this.emailConfigurationForm.value;
  }

  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.emailConfigurationForm.controls).forEach((field) => {
      const control = this.emailConfigurationForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  emailDuplicate(event: any) {
    const emailObj = {
      email: event.target.value
    }
    this.OpenReqServ.duplicatecheckEmail(emailObj).subscribe((response: any) => {
      if (response.status == 'Success') {
        this.message = '';
      } else if (response.status == 'Exist') {
        const configEmail = this.emailConfigurationForm.get('email');
        configEmail.setValue('');
        this.message = 'Record already available with given Mail address';
        this.dataToBeSentToSnackBar.message = 'Record already available with given Mail address';
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      } else {
        this.dataToBeSentToSnackBar.message = 'Internal Server Error';
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
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
