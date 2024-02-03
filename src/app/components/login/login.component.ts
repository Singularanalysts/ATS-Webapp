import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hidePassword = true;
  private userManagementServ = inject(UserManagementService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private snackBarServ = inject(SnackBarService);
  private permissionServ = inject(PermissionsService);

  form: any = FormGroup;
  protected isFormSubmitted = false;
  ngOnInit(): void {
    this.initializeLoginForm();
  }

  private initializeLoginForm() {
    this.form = this.formBuilder.group({
      email: [
       '', // remove later  saikiran@narveetech.com
        [
          Validators.required,
          Validators.email,
          this.emailValidator,
          Validators.maxLength(50),
        ],
      ],
      password: [
        '',//Kiran@123$
        [
          Validators.required,
          Validators.maxLength(12),
          // this.passwordValidator(),
        ],
      ],
    });
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

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;

      const hasUppercase = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialCharacter = /[!@#$%^&*]/.test(value);

      if (!hasUppercase || !hasNumber || !hasSpecialCharacter) {
        //return { pattern: true };
        control.setErrors({ pattern: true })
        return { pattern: true };
      }

      return null;
    };
  }

  // get all controls
  get loginFrom() {
    return this.form.controls;
  }
  userLogin() {
    // if form is valid, call login api
    this.isFormSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const userObj: Partial<Employee> = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
    };
    this.userManagementServ.login(userObj).subscribe({
     next: (result: any) => {
      //console.log("result", result)
        if (result.status == 'success') {
          const loggedInUserData = result.data;
         // console.log(result.data);

          this.permissionServ.login(loggedInUserData).subscribe((data) => {
             this.router.navigate(['usit/dashboard']);
            const message = 'You have logged in successfully!';
            this.showErroNotification(message, 'success');
          });
        } else if (result.status == 'locked') {
          const message =
            'Your Account has been locked, Please contact with admin';
          this.showErroNotification(message);
        } else if (result.status == 'inactive') {
          const message = 'Account In Active';
          this.showErroNotification(message);
        }else{
          //const message = result.includes('Unauthorized') ? 'Invalid Credentials, Please try with valid credentials' : result;
          this.showErroNotification(result);
        }
      },
      error: err => {
        if (err.status == 401) {
          const message = 'Invalid Credentials, Please try with valid credentials';
          this.showErroNotification(message);
        } else {
          const message = 'Failed to connect Server';
          this.showErroNotification(message);
        }
      }
  });

  }

  private showErroNotification(message: string, errorType = 'failure'): void {
    let dataToBeSentToSnackBar: ISnackBarData = {
      message: message,
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: [`custom-snack-${errorType}`],
    };
    this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
  }
}
