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
  selector: 'app-register-consultant',
  templateUrl: './register-consultant.component.html',
  styleUrls: ['./register-consultant.component.scss']
})
export class RegisterConsultantComponent implements OnInit {
  hidePassword = true;
  private userManagementServ = inject(UserManagementService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private snackBarServ = inject(SnackBarService);
  private permissionServ = inject(PermissionsService);

  form: any = FormGroup;
  protected isFormSubmitted = false;
  requestOtp = true;
  isOTPSent = false;
  showPasswordFields = false;
  id: any;
  validateOtp = true;
  details = false;
  clock: string = '';
  interval!: any;
  timeLeft: number = 0;

  ngOnInit(): void {
    this.initializeLoginForm();
  }

  private initializeLoginForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.emailValidator, Validators.maxLength(50)]],
      otp: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      personalcontactnumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')]],
      confirmpassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')]],
    }, { validator: this.confirmPasswordValidator });

    this.form.get('password').valueChanges.subscribe(() => {
      this.form.get('confirmPassword').updateValueAndValidity();
    });
  }
  
  emailValidator(control: AbstractControl) {
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const email = control.value.toLowerCase();

    if (!emailRegex.test(email)) {
      control.setErrors({ pattern: true })
      return { pattern: true };
    }

    return null;
  }

  emailObject = { };
  sendOTP() {
    if (this.form.controls['email'].invalid) {
      return;
    }
    const emailValue = this.form.get('email')!.value;
    localStorage.setItem('email', emailValue);
     this.emailObject = {
      email: emailValue
    };
    this.permissionServ.consultantSendOtp(emailValue).subscribe((response: any) => {
      if (response.status == "success") {
        console.log(response);
        
        this.id = response.data.id;
        this.showErrorNotification(response.message, 'success');
        // this.onTimeout();
        this.form.get('email')!.disable();
        this.requestOtp = false;
        this.isOTPSent = true;
      } else {
        this.showErrorNotification(response.message);
        this.isOTPSent = false;
        this.requestOtp = true;
        this.form.get('email')!.enable();
      }
    });
  }

  validateOTP() {
    if (this.form.controls['otp'].invalid) {
      return;
    }
    const otpValue = this.form.get('otp')!.value;
    this.permissionServ.consultantValidateOtp(this.id, otpValue).subscribe((response: any) => {
      if (response.status == "success") {
        this.showErrorNotification(response.message, 'success');
        this.form.get('otp')!.disable();
        this.validateOtp = false; 
        this.showPasswordFields = true;
        this.details = true;
      } else {
        this.showErrorNotification(response.message, 'failure');
        this.form.get('otp')!.value = '';
        this.form.get('otp')!.clearValidators;
        this.form.get('otp')!.updateValueAndValidity;
        this.validateOtp = true;
        this.isOTPSent = false;
        this.requestOtp = true;
        this.form.get('email')!.enable();
      }
    });
  }

  
  get loginFrom() {
    return this.form.controls;
  }


  regObj = {}
  userLogin() {
    console.log(this.form.value);
    this.regObj = { ...this.emailObject, ...this.form.value}
    this.permissionServ.consultantRegistration(this.regObj).subscribe(
      (response: any) => {
        if(response.status = "success") {
          this.showErrorNotification(response.message, 'success');
          this.router.navigate(['/login']);
        }
      }
    )
  }
  
  private showErrorNotification(message: string, errorType = 'failure'): void {
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

  onlyNumberKey(evt: any) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
      return false;
    return true;
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

  confirmPasswordValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.root.get('password');
    console.log(control);
    
    const confirmPassword = control.value;
  
    return password && confirmPassword && password.value !== confirmPassword
      ? { confirmPasswordMismatch: true }
      : null;
  };
}
