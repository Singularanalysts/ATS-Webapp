import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PermissionsService } from 'src/app/services/permissions.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { UserManagementService } from 'src/app/services/user-management.service';
import { Employee } from 'src/app/usit/models/employee';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;
  isFormSubmitted = false;
  isOTPSent = false;
  showPasswordFields = false;
  id: any;
  requestOtp = true;
  validateOtp = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBarServ: SnackBarService,
    private permissionServ: PermissionsService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.emailValidator, Validators.maxLength(50)]],
      otp: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')]],
      confirmPassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')]]
    });
  }

  sendOTP() {
    if (this.form.controls['email'].invalid) {
      return;
    }
    const emailValue = this.form.get('email')!.value;
    localStorage.setItem('email', emailValue);
    const emailObject = {
      email: emailValue
    };
    this.permissionServ.sendOtp(emailObject).subscribe((response: any) => {
      if (response.status == "success") {
        this.id = response.data.id;
        this.showErrorNotification(response.message, 'success');
        this.form.get('email')!.disable();
        this.requestOtp = false;
        this.isOTPSent = true;
      } else {
        this.showErrorNotification(response.message);
        this.isOTPSent = false;
      }
    });
  }

  validateOTP() {
    if (this.form.controls['otp'].invalid) {
      return;
    }
    const otpValue = this.form.get('otp')!.value;
    this.permissionServ.validateOtp(this.id, otpValue).subscribe((response: any) => {
      if (response.status == "success") {
        this.showErrorNotification(response.message, 'success');
        this.form.get('otp')!.disable();
        this.validateOtp = false; 
        this.showPasswordFields = true;
      }
    });
  }

  changePassword() {
    if (this.form.invalid) {
      this.isFormSubmitted = false;
      this.form.markAllAsTouched();
      return;
    }
    const password = this.form.get('password')!.value;
    const confirmPassword = this.form.get('confirmPassword')!.value;
    if (password != null && confirmPassword != null) {
      if (password != confirmPassword) {
        const message= "New Password & Confirm New Password are not same!";
        this.showErrorNotification(message, 'failure');
        return;
      }
    }
    const passwordObject = {
      email: this.form.get('email')!.value,
      newPassword: this.form.get('password')!.value
    };
    this.permissionServ.changePassword(passwordObject).subscribe((response: any) => {
      if (response.status == "success") {
        this.showErrorNotification(response.message, 'success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    });
  }

  showErrorNotification(message: string, errorType = 'failure'): void {
    const dataToBeSentToSnackBar = {
      message: message,
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: [`custom-snack-${errorType}`],
    };
    this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
  }

  // email validator
  emailValidator(control: AbstractControl) {
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const email = control.value.toLowerCase();

    if (!emailRegex.test(email)) {
      control.setErrors({ pattern: true })
      return { pattern: true };
    }

    return null;
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }
}
