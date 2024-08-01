import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { OpenreqService } from '../../services/openreq.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

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
    MatIconModule
  ],
  templateUrl: './email-configuration.component.html',
  styleUrls: ['./email-configuration.component.scss']
})
export class EmailConfigurationComponent {
  emailForm!: FormGroup;
  private OpenReqServ = inject(OpenreqService);
  userid!: string | null;
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

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.userid = localStorage.getItem('userid');
    this.emailForm = this.fb.group({
      email: [''],
      oldpassword: [''],
      password: [''],
      otp: [''],
      conformpassword: ['']
    });
    this.checkExistingDetails();
  }

  checkExistingDetails() {
    if (this.userid) {
      this.OpenReqServ.getConfiguredEmailById(this.userid).subscribe({
        next: (response: any) => {
          if (response && response.status == "Sucess") {
            this.buttonText = 'Update';
            this.showOldPasswordField = true;
            this.otpSent = false;
            this.emailForm.get('oldpassword')!.clearValidators();
            this.emailForm.get('password')!.clearValidators();
            this.emailForm.get('conformpassword')!.clearValidators();

            this.emailForm.get('oldpassword')!.updateValueAndValidity();
            this.emailForm.get('password')!.updateValueAndValidity();
            this.emailForm.get('conformpassword')!.updateValueAndValidity();
            this.emailForm.patchValue({
              email: response.data.email,
              oldpassword: '',
              password: '',
              conformpassword: '',
            });
          } else {
            this.buttonText = 'Save';
            this.showOldPasswordField = false;
            this.emailForm.get('oldpassword')?.setValidators(null);
          }
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  validateOldPassword(event: any) {
    const oldPasswordObj = {
      userid: this.userid,
      oldpassword: event.target.value
    }
    this.OpenReqServ.validateOldPassword(oldPasswordObj).subscribe({
      next: (response: any) => {
        if (response.status == 'Sucess') {
          this.dataToBeSentToSnackBar.message = "Old password validated Successfully";
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
        } else if (response.status == 'Mismatch') {
          this.dataToBeSentToSnackBar.message = "The old password you entered is incorrect. Please try again.";
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          const oldPassword = this.emailForm.get('oldpassword');
          oldPassword!.setValue('');
        } else {
          this.dataToBeSentToSnackBar.message = response.message;
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
    if (this.buttonText === 'Save') {
      this.emailForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.emailForm.get('password')?.setValidators([Validators.required]);

      this.emailForm.get('email')?.updateValueAndValidity();
      this.emailForm.get('password')?.updateValueAndValidity();
    }

    if (this.buttonText === 'Update') {
      this.emailForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.emailForm.get('oldpassword')?.setValidators([Validators.required]);
      this.emailForm.get('password')?.setValidators([Validators.required]);
      this.emailForm.get('conformpassword')?.setValidators([Validators.required]);

      this.emailForm.get('email')?.updateValueAndValidity();
      this.emailForm.get('oldpassword')?.updateValueAndValidity();
      this.emailForm.get('password')?.updateValueAndValidity();
      this.emailForm.get('conformpassword')?.updateValueAndValidity();
    }

    this.emailForm.markAllAsTouched();
    this.emailForm.updateValueAndValidity();
    const formValues = this.emailForm.value;
    formValues.userid = this.userid;
    if (this.emailForm.invalid) {
      return;
    }
    if (this.buttonText === 'Save') {
      this.OpenReqServ.saveConfiguredEmail(formValues).subscribe({
        next: (response: any) => {
          if (response.status === 'Sucess') {
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
      this.OpenReqServ.updateConfiguredEmail(formValues).subscribe({
        next: (response: any) => {
          if (response.status === 'Sucess') {
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
    this.emailForm.get('email')?.setValidators([Validators.required, Validators.email]);
    this.emailForm.get('password')?.setValidators([Validators.required]);
    this.emailForm.get('conformpassword')?.setValidators([Validators.required]);

    this.emailForm.get('email')?.updateValueAndValidity();
    this.emailForm.get('password')?.updateValueAndValidity();
    this.emailForm.get('conformpassword')?.updateValueAndValidity();
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
        if (response.status == 'Sucess') {
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
}