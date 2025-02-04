import { CUSTOM_ELEMENTS_SCHEMA,  Inject, inject } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { IConfirmDialogData } from '../models/confirm-dialog-data';
@Component({
  selector: 'app-emails-delete-confirm',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './emails-delete-confirm.component.html',
  styleUrls: ['./emails-delete-confirm.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmailsDeleteConfirmComponent {
  private dialog = inject(MatDialog);
  allowAction: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) protected data: IConfirmDialogData,
  public dialogRef: MatDialogRef<EmailsDeleteConfirmComponent>){

  }

  onAction(action: string){
    // if(["SAFE_CLOSE", "NO"].includes(action)){
    //   this.dialog.closeAll();
    // }
    if(action === "SAFE_CLOSE"){
      this.dialogRef.close()
    }

    if(action === "NO"){
      this.dialogRef.close()
    }

    if(action === "YES"){
      // call delete apis
      this.allowAction = true;
      this.dialogRef.close()
    }

  }
}
