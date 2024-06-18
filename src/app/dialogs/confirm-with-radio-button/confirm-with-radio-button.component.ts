import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IConfirmRadioDialogData } from '../models/confirm-dialog-with-radio-data';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-with-radio-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, MatRadioModule, FormsModule],
  templateUrl: './confirm-with-radio-button.component.html',
  styleUrls: ['./confirm-with-radio-button.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfirmWithRadioButtonComponent {

  private dialog = inject(MatDialog);
  allowAction: boolean = false;
  selectedOption!: string;
  constructor(@Inject(MAT_DIALOG_DATA) protected data: IConfirmRadioDialogData,
    public dialogRef: MatDialogRef<ConfirmWithRadioButtonComponent>) {

  }

  onAction(action: string) {

    if (action === "SAFE_CLOSE") {
      this.dialogRef.close()
    }

    if (action === "NO") {
      this.dialogRef.close()
    }

    if (action === "YES") {
      // call delete apis
      this.allowAction = true;
      this.dialogRef.close(this.selectedOption)
    }
    else {
      this.dialogRef.close();
    }

  }

}
