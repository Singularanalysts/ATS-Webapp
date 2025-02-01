import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { OpenreqService } from '../../services/openreq.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, take, takeUntil } from 'rxjs';
import { MatDialogConfig } from '@angular/material/dialog';
import { AddEmailConfigurationComponent } from './add-email-configuration/add-email-configuration.component';
import { DialogService } from 'src/app/services/dialog.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-email-configuration',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './email-configuration.component.html',
  styleUrls: ['./email-configuration.component.scss']
})
export class EmailConfigurationComponent {
  emailForm!: FormGroup;
  private OpenReqServ = inject(OpenreqService);
  userid!: string;
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  private snackBarServ = inject(SnackBarService);
  hideOPassword = true;
  hideNPassword = true;
  hideCPassword = true;
  buttonText: string = 'Save';
  showOldPasswordField: boolean = false;
  forgotPassword: boolean = false;
  otpSent: boolean = false;
  otpId!: number;
  otpValidated: boolean = false;
  showOtpField: boolean = false;
  private router = inject(Router);
  emailValidationId: any;
  role!: string ;
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Technology',
    'Email',
    'Password',
    'ReceivedDate',
    'StopExtraction',
    'Status',
    'Action'
  ];
  entity: any;
  private destroyed$ = new Subject<void>();
  currentPageIndex = 0;
  private dialogServ = inject(DialogService);
  private openServ = inject(OpenreqService);
  message: any;
  private breakpointObserver = inject(BreakpointObserver);

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.role = localStorage.getItem('role') || '';
    this.userid = localStorage.getItem('userid') || '';
    this.emailForm = this.fb.group({
      email: [''],
      oldpassword: [''],
      password: [''],
      otp: [''],
      conformpassword: [''],
      technology: ['']
    }, { validator: this.passwordMatchValidator });
    this.checkExistingDetails();
  }

  private passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')!.value;
    const confirmPassword = formGroup.get('conformpassword')!.value;
    if (confirmPassword && password && password !== confirmPassword) {
      formGroup.get('conformpassword')!.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }
// check(){
//   this.OpenReqServ.getConfiguredEmailById(this.userid).subscribe({
//     next: (response: any) => {
//       console.log(response)
//     },
//     error: (err: any) => {
//       console.error(err);
//     }
//   });
// }
  checkExistingDetails() {
    // alert("ttt")
    // if (this.userid && this.role !== "Super Administrator") {
    //   this.OpenReqServ.getConfiguredEmailById(this.userid).subscribe({
    //     next: (response: any) => {
    //       if (response && response.status == "Success") {
    //         this.buttonText = 'Update';
    //         this.showOldPasswordField = true;
    //         this.otpSent = false;
    //         this.emailValidationId = response.data[0].id;
    //         this.emailForm.get('oldpassword')!.clearValidators();
    //         this.emailForm.get('password')!.clearValidators();
    //         this.emailForm.get('conformpassword')!.clearValidators();

    //         this.emailForm.get('oldpassword')!.updateValueAndValidity();
    //         this.emailForm.get('password')!.updateValueAndValidity();
    //         this.emailForm.get('conformpassword')!.updateValueAndValidity();
    //         this.emailForm.patchValue({
    //           email: response.data[0].email,
    //           oldpassword: '',
    //           password: '',
    //           conformpassword: '',
    //         });
    //       } else {
    //         this.buttonText = 'Save';
    //         this.showOldPasswordField = false;
    //         this.emailForm.get('oldpassword')?.setValidators(null);
    //       }
    //     },
    //     error: (err: any) => {
    //       console.error(err);
    //     }
    //   });
    // } else {
     
      this.OpenReqServ.getConfiguredEmailById(this.userid)
      .pipe(takeUntil(this.destroyed$)).subscribe(
        (response: any) => {
          this.entity = response.data;
          this.dataSource.data = response.data;

          
          // console.log("hello"+JSON.stringify(this.dataSource.data));
          // this.totalItems = response.data.totalElements;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
        }
      )
    }
  

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  validateOldPassword(event: any) {
    const oldPasswordObj = {
      // userid: this.userid,
      oldpassword: event.target.value,
      id: this.emailValidationId
    }
    this.OpenReqServ.validateOldPassword(oldPasswordObj).subscribe({
      next: (response: any) => {
        if (response.status == 'Success') {
          this.dataToBeSentToSnackBar.message = "Old password validated Successfully";
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
        } else if (response.status == 'Mismatch') {
          this.dataToBeSentToSnackBar.message = "The old password you entered is incorrect. Please try again.";
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          const oldPassword = this.emailForm.get('oldpassword');
          oldPassword!.setValue('');
        } else {
          this.dataToBeSentToSnackBar.message = response.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          const oldPassword = this.emailForm.get('oldpassword');
          oldPassword!.setValue('');
        }
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      },
      error: (err: any) => {
        this.dataToBeSentToSnackBar.message = err.message;
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      }
    })
  }

  saveDetails() {
    this.emailForm.get('email')?.setValidators([Validators.required, Validators.email]);
    this.emailForm.get('password')?.setValidators([Validators.required]);

    if (this.buttonText === 'Update') {
      this.emailForm.get('oldpassword')?.setValidators([Validators.required]);
      this.emailForm.get('conformpassword')?.setValidators([Validators.required]);

      this.emailForm.get('email')?.updateValueAndValidity();
      this.emailForm.get('oldpassword')?.updateValueAndValidity();
      this.emailForm.get('password')?.updateValueAndValidity();
      this.emailForm.get('conformpassword')?.updateValueAndValidity();
      this.emailForm.updateValueAndValidity();
    }

    this.emailForm.markAllAsTouched();
    if (this.emailForm.invalid) {
      return;
    }
    if (this.buttonText === 'Save') {
      const formValues = this.emailForm.value;
      formValues.userid = this.userid;
      this.OpenReqServ.saveConfiguredEmail(formValues).subscribe({
        next: (response: any) => {
          if (response.status === 'Success') {
            this.dataToBeSentToSnackBar.message = response.message;
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
            this.snackBarServ.openSnackBarFromComponent(
              this.dataToBeSentToSnackBar
            );
            this.router.navigate(['usit/email-extraction-list']);
          } else if (response.status === 'Fail') {
            this.dataToBeSentToSnackBar.message = response.message;
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(
              this.dataToBeSentToSnackBar
            );
          }
          else {
            this.dataToBeSentToSnackBar.message = response.message;
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(
              this.dataToBeSentToSnackBar
            );
          }
          this.checkExistingDetails()
        },
        error: (err: any) => {
          this.dataToBeSentToSnackBar.message = err.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
      });
    } else if (this.buttonText === 'Update') {
      const formValues = this.emailForm.value;
      formValues.id = this.emailValidationId;
      formValues.userid = this.userid;
      this.OpenReqServ.updateConfiguredEmail(formValues).subscribe({
        next: (response: any) => {
          if (response.status === 'Success') {
            this.dataToBeSentToSnackBar.message = 'Password updated Successfully';
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
            this.snackBarServ.openSnackBarFromComponent(
              this.dataToBeSentToSnackBar
            );
            this.router.navigate(['usit/email-extraction-list']);
          } else if (response.status === 'Exist') {
            this.dataToBeSentToSnackBar.message = 'New password cannot be the same as the old password.';
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(
              this.dataToBeSentToSnackBar
            );
          } else {
            this.dataToBeSentToSnackBar.message = response.message;
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(
              this.dataToBeSentToSnackBar
            );
          }
          this.checkExistingDetails()
        },
        error: (err: any) => {
          this.dataToBeSentToSnackBar.message = err.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
      });
    }
  }

  onForgotPassword() {
    this.forgotPassword = true;
    this.buttonText = '';
    const emailControl = this.emailForm.get('email');
    this.emailForm.patchValue({
      email: emailControl?.value
    });
  }

  requestOtp() {
    if (this.emailForm.get('email')?.valid) {
      const reqOtpObj = {
        email: this.emailForm.get('email')?.value,
      }
      this.OpenReqServ.requestOtp(reqOtpObj).subscribe({
        next: (reponse: any) => {
          this.otpSent = true;
          this.showOtpField = true;
          this.otpId = reponse.data.id;
          this.dataToBeSentToSnackBar.message = "OTP requested successfully";
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          this.dataToBeSentToSnackBar.message = err.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
      })
    }
  }

  validateOtp() {
    if (this.emailForm.get('otp')?.valid && this.emailForm.get('otp')?.value.length === 6) {
      const otp = this.emailForm.get('otp')?.value;
      this.OpenReqServ.validateOtp(this.otpId, otp).subscribe({
        next: (response: any) => {
          if (response.status == 'success') {
            this.dataToBeSentToSnackBar.message = "OTP validated successfully";
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
            this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
            this.forgotPassword = false;
            this.otpSent = false;
            this.otpValidated = true;
            this.buttonText = '';
            this.emailForm.patchValue({
              password: '',
              conformpassword: '',
            });
            this.emailForm.get('password')!.clearValidators();
            this.emailForm.get('conformpassword')!.clearValidators();

            this.emailForm.get('password')!.updateValueAndValidity();
            this.emailForm.get('conformpassword')!.updateValueAndValidity();
          } else {
            this.dataToBeSentToSnackBar.message = response.message;
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
          }
        },
        error: (err: any) => {
          this.dataToBeSentToSnackBar.message = err.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
      });
    }
  }

  saveChangedPassword() {
    this.emailForm.updateValueAndValidity();
    this.emailForm.markAllAsTouched();

    if (this.emailForm.invalid) {
      return;
    }

    const savePasswordObj = {
      email: this.emailForm.get('email')!.value,
      password: this.emailForm.get('password')!.value,
      conformpassword: this.emailForm.get('conformpassword')!.value,
      userid: this.userid,
    }
    this.OpenReqServ.updateConfiguredEmail(savePasswordObj).subscribe({
      next: (response: any) => {
        if (response.status == 'Success') {
          this.dataToBeSentToSnackBar.message = "Password Updated successfully";
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
          this.router.navigate(['usit/email-extraction-list']);
          this.showOldPasswordField = true;
          this.otpSent = false;
          this.forgotPassword = false;
          this.otpValidated = false;
          this.buttonText = 'Update';
          this.emailForm.get('oldpassword')!.clearValidators();
          this.emailForm.get('password')!.clearValidators();
          this.emailForm.get('conformpassword')!.clearValidators();

          this.emailForm.get('oldpassword')!.updateValueAndValidity();
          this.emailForm.get('password')!.updateValueAndValidity();
          this.emailForm.get('conformpassword')!.updateValueAndValidity();
        } else {
          this.dataToBeSentToSnackBar.message = response.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
      },
      error: (err: any) => {
        this.dataToBeSentToSnackBar.message = err.message;
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      }
    });
    this.checkExistingDetails();
  }

  addEmail() {
    const actionData = {
      title: 'Add Email Configuration',
      emailData: null,
      actionName: 'add-email-configuration',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = actionData;
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).pipe(
      take(1)
    ).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          dialogConfig.width = '80vw';
        } else if (result.breakpoints[Breakpoints.Small]) {
          dialogConfig.width = '70vw';
        } else if (result.breakpoints[Breakpoints.Medium]) {
          dialogConfig.width = '50vw';
        } else if (result.breakpoints[Breakpoints.Large]) {
          dialogConfig.width = '35vw';
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          dialogConfig.width = '25vw';
        }
      }

      const dialogRef = this.dialogServ.openDialogWithComponent(AddEmailConfigurationComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        if (dialogRef.componentInstance.submitted) {
          this.checkExistingDetails();
        }
      });
    });

  }

  editEmail(email: any) {
    const actionData = {
      title: 'Update Email Configuration',
      emailData: email,
      actionName: 'edit-email-configuration',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '25vw';
    dialogConfig.disableClose = false;
    dialogConfig.data = actionData;
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).pipe(
      take(1)
    ).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          dialogConfig.width = '80vw';
        } else if (result.breakpoints[Breakpoints.Small]) {
          dialogConfig.width = '70vw';
        } else if (result.breakpoints[Breakpoints.Medium]) {
          dialogConfig.width = '50vw';
        } else if (result.breakpoints[Breakpoints.Large]) {
          dialogConfig.width = '35vw';
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          dialogConfig.width = '25vw';
        }
      }

      const dialogRef = this.dialogServ.openDialogWithComponent(AddEmailConfigurationComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        if (dialogRef.componentInstance.submitted) {
          this.checkExistingDetails();
        }
      })
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
        const configEmail = this.emailForm.get('email');
        configEmail!.setValue('');
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

  stopExtraction(element : string){
    this.openServ.stopTheExtraction(element).subscribe({
      next: (response: any) => {
        // alert(JSON.stringify(response.status));
        if (response.status === 'success') {
          console.log('stop extraction');
          window.location.reload(); // Reload the entire page
        } else {
          console.log('stop not calling');
         
        }
      },
      error: (err: any) => {
        console.error('Error occurred while calling the status:', err);
      }
    });
  }

  extractEmails(element: any) {
    const extractEmail = {
      userid: this.userid,
      id: element.id,
      email : element.email
    }
   this.statusCallMethod(element.email);
    return this.openServ.extractEmails(extractEmail).subscribe({
      next: (response: any) => {
        // alert(JSON.stringify(response));
        if (response.status === 'Success') {
          this.dataToBeSentToSnackBar.message = response.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
          // window.location.reload(); // Reload the entire page
          // this.router.navigate(['usit/email-extraction-list']);
          this.checkExistingDetails();
        }  else if (response.status === 'failed') {
          this.dataToBeSentToSnackBar.message = 'Oops! It seems there are no new emails at the moment';
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
        } else if (response.status === 'Invalid-credentials') {
          this.dataToBeSentToSnackBar.message = response.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
        } else if (response.status === 'Invalid-Domain') {
          this.dataToBeSentToSnackBar.message = response.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
        } else {
          this.dataToBeSentToSnackBar.message = response.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
        }
      },
      error: (err: any) => {
        this.dataToBeSentToSnackBar.message = err.message;
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(
          this.dataToBeSentToSnackBar
        );
      },
    });
   
  }
  statusCallMethod(element: string): void {
    this.openServ.callTheStatus(element).subscribe({
      next: (response: any) => {
        if (response.response === 'success') {
          console.log('It is calling');
        } else {
          console.log('Not calling');
        }
      },
      error: (err: any) => {
        console.error('Error occurred while calling the status:', err);
      }
    });
  }
  
}