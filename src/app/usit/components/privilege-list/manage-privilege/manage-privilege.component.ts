import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-manage-privilege',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,],
  templateUrl: './manage-privilege.component.html',
  styleUrls: ['./manage-privilege.component.scss']
})
export class ManagePrivilegeComponent implements OnInit{
  form: any = FormGroup;
  message!: string;
  submitted = false;
  alloAction = false;
  // snackbar
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
 // services
 private snackBarServ = inject(SnackBarService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef= inject(MatDialogRef<ManagePrivilegeComponent>);
  private privilegeServ = inject(PrivilegesService);
  private formBuilder  = inject(FormBuilder);

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        type: ['', [Validators.required, Validators.maxLength(50)]],
        name: ['', [Validators.required, Validators.maxLength(50)]],
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.displayFormErrors()
      return;
    }
    console.log("form-val", JSON.stringify(this.form.value))
    this.privilegeServ.registerprevilage(this.form.value)
      .subscribe((data: any) => {
        //console.log(data.status)
        if (data.status == 'Success') {
          this.dataToBeSentToSnackBar.message =  this.data.actionName === 'add-privilege' ?
          'Previlege added successfully!' : 'Previlege updated successfully!';
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        this.dialogRef.close()
        }
        else {
          this.dataToBeSentToSnackBar.message =  data.message;
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
      });

  }

  displayFormErrors() {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }
  onAction(type: string) {
    this.dialogRef.close();
  }

}
