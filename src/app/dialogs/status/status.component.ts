import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IStatusData } from '../models/status-model.data';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatIconModule, MatInputModule],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  protected statusForm!: FormGroup;
  protected showValidationError = false;
  remarks = '';
  submitted = false;
  allowAction = false;
  constructor(@Inject(MAT_DIALOG_DATA) protected data: IStatusData,
  public dialogRef: MatDialogRef<StatusComponent>){

  }
  ngOnInit(): void {

    this.statusForm  = this.formBuilder.group(
      {
        reasonForStatusUpdate: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(250)]]
      }
    )
    this.remarks = this.data.actionData.remarks;
  }

  onAction(action: string){

    if(action === "SAFE_CLOSE"){
      this.dialogRef.close();
    }
    else if(action === "UPDATE"){
      if (this.statusForm.invalid) {
        this.displayFormErrors();
        return;
      }
      if(this.statusForm.valid){
        this.submitted =true;
        this.allowAction = true;


       // this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        this.dialogRef.close();
      } else {
        this.showValidationError = true;
      }

    }
    return

  }

  displayFormErrors() {
    Object.keys(this.statusForm.controls).forEach((field) => {
      const control = this.statusForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }
}
