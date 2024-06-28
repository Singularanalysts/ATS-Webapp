import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, map, startWith, tap } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { SkillsInfoComponent } from 'src/app/usit/components/profile/skills-info/skills-info.component';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { FileManagementService } from 'src/app/usit/services/file-management.service';

@Component({
  selector: 'app-register-consultant',
  templateUrl: './register-consultant.component.html',
  styleUrls: ['./register-consultant.component.scss']
})
export class RegisterConsultantComponent implements OnInit {
  hidePassword = true;
  hideConPassword = true;
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private snackBarServ = inject(SnackBarService);
  private permissionServ = inject(PermissionsService);
  private consultantServ = inject(ConsultantService);
  private fileService = inject(FileManagementService);

  form: any = FormGroup;
  protected isFormSubmitted = false;
  id: any;
  clock: string = '';
  interval!: any;
  timeLeft: number = 0;
  searchTechOptions$!: Observable<any>;
  technologyOptions!: any;
  isTechnologyDataAvailable: boolean = false;
  uploadedfiles: string[] = [];
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  resumeUploaded: boolean = false;
  private dialog= inject(MatDialog);
  otpValidate: boolean = false;
  showOtp: boolean = false;
  isOtpValidated: boolean = false;
  QualArr: any = [];
  visadata: any = [];
  emailReadOnly: boolean = false;

  ngOnInit(): void {
    this.gettech();
    this.getvisa();
    this.getQualification();
    this.initializeLoginForm();
  }

  private initializeLoginForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.emailValidator, Validators.maxLength(50)]],
      otp: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      contactnumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')]],
      confirmpassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')]],
      currentlocation: ['', Validators.required],
      position: ['', Validators.required],
      experience: ['', Validators.required],
      technology: ['', Validators.required],
      skills: ['', Validators.required],
      qualification: ['', Validators.required],
      visa: ['', Validators.required]
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
        this.id = response.data.id;
        this.showErrorNotification(response.message, 'success');
        this.showOtp = true;
        this.emailReadOnly = true;
      } else {
        this.showErrorNotification(response.message);
        this.showOtp = false;
        this.emailReadOnly = false;
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
        this.otpValidate = true;
        this.isOtpValidated = true;
        this.showOtp = false;
        this.showErrorNotification(response.message, 'success');
      } else {
        this.showErrorNotification(response.message, 'failure');
        this.otpValidate = false;
        this.isOtpValidated = false;
        this.showOtp = false;
        this.form.get('otp').reset();
      }
    });
  }

  
  get loginFrom() {
    return this.form.controls;
  }


  regObj = {}
  userLogin() {
    this.isFormSubmitted = true;
    this.form.get('technology').setValue(this.techid);
    if (!this.resumeUploaded) {
      this.resumeUploaded = false;
      this.form.markAllAsTouched();
    } else if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      this.permissionServ.consultantRegistration(this.form.value).subscribe(
        (response: any) => {
          if (response.status === "success") {
            this.showErrorNotification(response.message, 'success');
            this.onFileSubmit(response.data);
            this.router.navigate(['/login']);
          }
        }
      );
    }
    
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
        control.setErrors({ pattern: true })
        return { pattern: true };
      }

      return null;
    };
  }

  confirmPasswordValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.root.get('password');
    
    const confirmPassword = control.value;
  
    return password && confirmPassword && password.value !== confirmPassword
      ? { confirmPasswordMismatch: true }
      : null;
  };

  gettech() {
    this.searchTechOptions$ = this.consultantServ.getregtech().pipe(map((x: any) => x.data), tap(resp => {
      if (resp && resp.length) {
        this.getTechOptionsForAutoComplete(resp);
      }
    }));
  }

  getTechOptionsForAutoComplete(data: any) {
    this.technologyOptions = data;
    this.searchTechOptions$ =
      this.form.controls.technology.valueChanges.pipe(
        startWith(''),
        map((value: any) =>
          this._filterOptions(value, this.technologyOptions)
        )
      );
  }

  techid!: any;
  private _filterOptions(value: any, options: any[]): any[] {
    const filterValue = (value ? value.toString() : '').toLowerCase();
    const filteredTechnologies = options.filter((option: any) =>
      option.technologyarea.toLowerCase().includes(filterValue)
    );
    if (filteredTechnologies.length === 1) {
      this.techid = filteredTechnologies[0].id;
    }
    return filteredTechnologies;
  }

  flg = true;
  resumeError: boolean = false;
  resumeFileNameLength: boolean = false;

  @ViewChild('resume')
  resume: any = ElementRef;
  resumeupload!: any;
  uploadResume(event: any) {
    this.resumeError = false;
    this.resumeFileNameLength = false;
    this.resumeupload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    const fileExtension = file.name.split('.').pop().toLowerCase();

    // if (fileExtension === 'doc') {
    //   this.flg = false;
    //   this.resume.nativeElement.value = '';
    //   this.dataToBeSentToSnackBar.message = 'DOC files are not allowed. Please upload a PDF or DOCX file.';
    //   this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
    //   this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
    //   this.resumeupload = null;
    //   return;
    // }
    var items = file.name.split(".");
    const str = items[0];
    if (str.length > 20) {
      this.resumeFileNameLength = true;
    }
    if (fileSizeInKB > 2048) {
      this.flg = false;
      this.resumeError = true;
    }
    else {
      this.resumeError = false;
      const resumeData = new FormData();
      resumeData.append('resume', file, file.name);
      this.fileService.parseResume(resumeData).subscribe({
        next: (response: any) => {
          this.form.get('skills')!.setValue(response.body.data);
          this.dialog.open(SkillsInfoComponent, { width: '500px'});
        },
        error: (error: any) => {
          console.error('Error parsing resume', error);
        }
      });      
      this.flg = true;
      this.resumeUploaded = true;
    }
  }

  onFileSubmit(id: number) {
    const formData = new FormData();

    if (this.resumeupload != null) {
      formData.append('resume', this.resumeupload, this.resumeupload.name);
    }

    this.fileService
      .ConUploadFile(formData, id)
      .subscribe((response: any) => {
        if (response.status === 200) {
        } else {
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.dataToBeSentToSnackBar.message = 'File upload failed';
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
        }
      });
  }

  getQualification() {
    this.consultantServ.getQualification().subscribe((response: any) => {
      this.QualArr = response.data;
    });
  }

  getvisa() {
    this.consultantServ.getvisa().subscribe((response: any) => {
      this.visadata = response.data;
    });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
