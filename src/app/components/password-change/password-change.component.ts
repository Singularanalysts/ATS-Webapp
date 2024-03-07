import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/services/user-management.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
    ],
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit{
  form: any = FormGroup;
  currentpassword!: string;
  newpassword!: string;
  confirmpassword!: string;
  message!: string;
  fail!: string;
  submitted = false;
  username = localStorage.getItem('userName');
  designation = localStorage.getItem('designation');
  constructor(private formBuilder: FormBuilder, private service: UserManagementService,
    ) { }
  get f() { return this.form.controls; }
  ngOnInit(): void {
    const addedby = localStorage.getItem('userid');
    this.form = this.formBuilder.group(
      {
        password: ['', Validators.required],
        userid: localStorage.getItem('userid'),
        newPassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')]],
        renewpassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')]],
      });
  }
  private snackBarServ = inject(SnackBarService);
  onSubmit() {

    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };


    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.newpassword != null && this.confirmpassword != null) {
      if (this.newpassword != this.confirmpassword) {
        this.fail = "New Password & Confirm Password are not same !";
        this.message = "";
        return;
      }
    }
    //console.log(JSON.stringify(this.form.value, null, 2));
    this.service.resetpassword(this.form.value)
      .subscribe((data: any) => {
        //console.log(data)
        if (data.status == 'samepassword') {
          // const message = 'New Password and Old Password Both are same';
          // this.showErroNotification(message, 'failure');
          // this.fail = " Your New Password and Old Password Both are same, please enter different password"
          //this.form.reset(); Kiran123$
          this.submitted = false;
          dataToBeSentToSnackBar.message =  'New Password and Old Password Both are same';
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);


        }
        else if (data.status == 'fail') {
          // const message = 'Old Password is Incorrect';
          // this.showErroNotification(message, 'failure');
          // this.fail = " Old Password is Incorrect";

          dataToBeSentToSnackBar.message =  'Old Password is Incorrect';
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);


          this.submitted = false;
        }
        else if (data.status == 'success') {
          const message = data.message;
          // this.showErroNotification(message, 'success');
          // this.message = data.message;

          dataToBeSentToSnackBar.message =  message;
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);


          this.fail = "";
          this.submitted = false;
          this.form.reset();
        }
        else {
          const message = 'Sorry Server not available now';
          // this.showErroNotification(message, 'failure');
          dataToBeSentToSnackBar.message =  message;
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        }
      });
  }
  showErroNotification(message: string, arg1: string) {
    throw new Error('Method not implemented.');
  }
 
}
