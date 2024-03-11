import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/services/user-management.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule ,Routes} from '@angular/router';

import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
@Component({
  selector: 'app-userprofile',
  standalone:true,
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
  imports:[CommonModule,ReactiveFormsModule,MatButtonModule,MatInputModule,MatFormFieldModule,RouterModule,MatTabsModule,MatIconModule]
})
export class PasswordChangeComponent implements OnInit {
  form: any = FormGroup;
  currentpassword!: string;
  newpassword!: string;
  confirmpassword!: string;
  message!: string;
  fail!: string;
  submitted = false;
  username = localStorage.getItem('userName');
  designation = localStorage.getItem('designation');
  password: string = '';
  passwordTouched: boolean = false;
  touchedReenter: boolean = false;
  constructor(private formBuilder: FormBuilder, private service: UserManagementService) { }
  get f() { return this.form.controls; }
  showNewPasswordError = false;
  ngOnInit(): void {
    const addedby = localStorage.getItem('userid');
    this.form = this.formBuilder.group(
      {
        password: ['', Validators.required],    
        userid: localStorage.getItem('userid'),
        newpassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')]],
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
        const message= "New Password & Confirm Password are not the same!";
        dataToBeSentToSnackBar.message = message;
      //  this.showErroNotification(message,'fail',);
      dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        return;
      }
    }

    this.service.resetpassword(this.form.value)
      .subscribe((data: any) => {
        if (data.status == 'samepassword') {
          this.submitted = false;
          dataToBeSentToSnackBar.message=  'New Password and Old Password Both are the same';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          this.submitted = false;
        }
        else if (data.status == 'fail') {
          dataToBeSentToSnackBar.message =  'Old Password is Incorrect';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          this.submitted = false;
        } 
        else if (data.status == 'success') {
          const message = data.message;
          this.showErroNotification(message,'success',);
        
          this.message = data.message;
          dataToBeSentToSnackBar.message =  message;
           this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
           this.fail = "";
           this.submitted = false;
           this.form.reset();
        } 
        else {
          const message = 'Sorry, the server is not available now';
          dataToBeSentToSnackBar.message =  message;
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        }
      });
  }

  openSnackBar(dataToBeSentToSnackBar: ISnackBarData) {
    throw new Error('Method not implemented.');
  }

  showErroNotification(message: string, arg1: string) {
    throw new Error('Method not implemented.');
  }
}
