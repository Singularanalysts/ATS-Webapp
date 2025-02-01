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
import { Observable } from 'rxjs';
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
  loggedInUserData: any;
  otpFormVisible = false;
  userType! : string;
  otpId! : number;
  private userManagementServ = inject(UserManagementService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private snackBarServ = inject(SnackBarService);
  private permissionServ = inject(PermissionsService);

  form: any = FormGroup;
  otpForm: any = FormGroup;
  protected isFormSubmitted = false;
  department!: string | null;
  ngOnInit(): void {
    this.initializeLoginForm();
    this.initializeOtpForm();
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
          Validators.maxLength(25),
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

  get loginFrom() {
    return this.form.controls;
  }

  userLogin(userType: any) {
    // if form is valid, call login api
    this.isFormSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const userObj: Partial<Employee> = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      loginAs: userType
    };
    this.userType = userType;
    let loginObservable: Observable<any>;
    if (userType === 'Employee') {
      loginObservable = this.userManagementServ.login(userObj);
      loginObservable.subscribe({
        next: (result: any) => {
          if (result.status == 'success') {
            // this.loggedInUserData = result.data;
       
            this.otpId = result.data;
  
            // this.department = result.data.department;
            this.otpFormVisible = true;
            const message = "OTP has been sent to your email ID: " + userObj.email;
            this.showErroNotification(message, 'success');
            // alert("success");
  
            // this.permissionServ.login(this.loggedInUserData).subscribe((data) => {
            //   this.router.navigate(['usit/dashboard']);
            //   const message = 'You have logged in successfully!';
            //   this.showErroNotification(message, 'success');
            // });
  
          }
          if (result.status == 'fail') {
            // const message = "You're Account locked due to InActive for More Than 4 days";
            this.showErroNotification(result.message);
          }
  
          if (result.status == 'locked') {
            const message = "You're Account locked due to InActive for More Than 4 days";
            this.showErroNotification(message);
          }
  
  
        },
        error: err => {
          if (err.status == 401) {
            const message = 'Invalid Credentials, Please try with valid credentials';
            this.showErroNotification(message);
          }
          else if (err.error.status == 'locked') {
            const message = err.error.message;
            this.showErroNotification(message);
          } else if (err.error.status == 'inactive') {
            const message = err.error.message;
            this.showErroNotification(message);
          }
          // else {
          //   //const message = result.includes('Unauthorized') ? 'Invalid Credentials, Please try with valid credentials' : result;
          //   this.showErroNotification(result);
          // }
          else {
            const message = 'Failed to connect Server';
            this.showErroNotification(message);
          }
        }
      });
    } else if (userType === 'Consultant') {
      loginObservable = this.userManagementServ.conLogin(userObj);
      loginObservable.subscribe({
        next: (result: any) => {
          if (result.status == 'success') {
            this.loggedInUserData = result.data;
       
            // this.otpId = result.data;
  
            this.department = result.data.department;
            // this.otpFormVisible = true;
            // alert("success");
  
            this.permissionServ.login(this.loggedInUserData).subscribe((data) => {
              this.router.navigate(['usit/dashboard']);
              const message = 'You have logged in successfully!';
              this.showErroNotification(message, 'success');
            });
  
          }
          if (result.status == 'fail') {
            // const message = "You're Account locked due to InActive for More Than 4 days";
            this.showErroNotification(result.message);
          }
  
          if (result.status == 'locked') {
            const message = "You're Account locked due to InActive for More Than 4 days";
            this.showErroNotification(message);
          }
  
  
        },
        error: err => {
          if (err.status == 401) {
            const message = 'Invalid Credentials, Please try with valid credentials';
            this.showErroNotification(message);
          }
          else if (err.error.status == 'locked') {
            const message = err.error.message;
            this.showErroNotification(message);
          } else if (err.error.status == 'inactive') {
            const message = err.error.message;
            this.showErroNotification(message);
          }
          // else {
          //   //const message = result.includes('Unauthorized') ? 'Invalid Credentials, Please try with valid credentials' : result;
          //   this.showErroNotification(result);
          // }
          else {
            const message = 'Failed to connect Server';
            this.showErroNotification(message);
          }
        }
      });
    } else {
      console.error('Invalid user type');
      return;
    }


  }
  resendOtp() {
     this.isFormSubmitted = false;  // Reset validation state
    const userObj = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      loginAs: this.userType
    };
    this.userManagementServ.login(userObj).subscribe({
      next: (result: any) => {
        if (result.status === 'success') {
          this.otpId = result.data;
          this.showErroNotification("OTP has been resent to your email", "success");
        }
      },
      error: (err) => this.showErroNotification("Failed to resend OTP", "error")
    });
  }
  
  verifyPassword() {
    if(this.otpForm.valid){
      let loginObservable : Observable<any>;
      const userObj = {
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
        loginAs: this.userType,
        otpId : this.otpId,
        otp : this.otpForm.value.otp
      };
      loginObservable = this.userManagementServ.loginWithData(userObj);
      this.userManagementServ.otpVerification(userObj).subscribe(
        (response) => {
          if (response.status === 'success') {
    
           loginObservable.subscribe({
            next: (result: any) => {
              if (result.status == 'success') {
                this.loggedInUserData = result.data;
                this.department = result.data.department;
                this.permissionServ.login(this.loggedInUserData).subscribe((data) => {
                  this.router.navigate(['usit/dashboard']);
                  const message = 'You have logged in successfully!';
                  this.showErroNotification(message, 'success');
                });
              }
              if (result.status == 'fail') {
                // const message = "You're Account locked due to InActive for More Than 4 days";
                this.showErroNotification(result.message);
              }
              if (result.status == 'locked') {
                const message = "You're Account locked due to InActive for More Than 4 days";
                this.showErroNotification(message);
              }
            },
            error: err => {
              if (err.status == 401) {
                const message = 'Invalid Credentials, Please try with valid credentials';
                this.showErroNotification(message);
              }
              else if (err.error.status == 'locked') {
                const message = err.error.message;
                this.showErroNotification(message);
              } else if (err.error.status == 'inactive') {
                const message = err.error.message;
                this.showErroNotification(message);
              }
              // else {
              //   //const message = result.includes('Unauthorized') ? 'Invalid Credentials, Please try with valid credentials' : result;
              //   this.showErroNotification(result);
              // }
              else {
                const message = 'Failed to connect Server';
                this.showErroNotification(message);
              }
            }
          });

          } else {
              this.showErroNotification(response.message);
          }
        },
        (error) => {
          // Handle HTTP errors or server errors
          console.error('An error occurred during OTP verification:', error);
        }
      );
    }else{
      console.log("not verified");
    }
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

  private initializeOtpForm() {
    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

}
