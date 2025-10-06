import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IConfirmRadioDialogData } from '../models/confirm-dialog-with-radio-data';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-confirm-with-radio-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, MatRadioModule, FormsModule,    MatFormFieldModule,    MatInputModule,    MatAutocompleteModule,
      ReactiveFormsModule,
  
  
  ],
  templateUrl: './confirm-with-radio-button.component.html',
  styleUrls: ['./confirm-with-radio-button.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfirmWithRadioButtonComponent {
  private dialog = inject(MatDialog);
  allowAction: boolean = false;
  selectedOption!: string;
  remarks: string = ''; // new field for remarks

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: IConfirmRadioDialogData,
    public dialogRef: MatDialogRef<ConfirmWithRadioButtonComponent>
  ) {}
remarksError:any
onAction(action: string) {
  if (action === 'SAFE_CLOSE' || action === 'NO') {
    this.dialogRef.close();
    return;
  }

  if (action === 'YES') {
    this.allowAction = true;

    if (this.selectedOption === 'Blacklisted') {
      const trimmedRemarks = (this.remarks || '').trim();

      // validate whitespace-only case
      if (!trimmedRemarks) {
        this.remarks = '';             // clear any spaces
        const textArea = document.querySelector(
          'textarea[matinput]'
        ) as HTMLTextAreaElement | null;
        if (textArea) textArea.focus(); // force touched state
        return;                         // stop dialog close
      }

      // close dialog and send trimmed remarks
      this.dialogRef.close({
        option: this.selectedOption,
        remarks: trimmedRemarks,
      });
    } else {
      this.dialogRef.close(this.selectedOption);
    }
  }
}


}

