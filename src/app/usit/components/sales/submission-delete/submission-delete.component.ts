import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-submission-delete',
   standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule,FormsModule,
 MatFormFieldModule, MatAutocompleteModule,
     MatInputModule,
     MatIconModule,
     MatButtonModule,
    ],
  templateUrl: './submission-delete.component.html',
  styleUrls: ['./submission-delete.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class SubmissionDeleteComponent {
 private dialog = inject(MatDialog);
  allowAction: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) protected data: IConfirmDialogData,
  public dialogRef: MatDialogRef<SubmissionDeleteComponent>){

  }
  public remarks: string = '';
public showError: boolean = false;

onAction(action: string){
  if(action === "SAFE_CLOSE" || action === "NO"){
    this.dialogRef.close();
  }

  if(action === "YES"){
    if (!this.remarks || this.remarks.trim() === '') {
      this.showError = true;
      return; // ⛔ Don't proceed if empty
    }

    this.allowAction = true;
    this.dialogRef.close(this.remarks); // ✅ Send remarks back
    this.showError = false;
    console.log(this.remarks, 'remarkssss');
  }
  
}
}
