import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, inject } from '@angular/core';
import {
  FormControl, FormGroup, FormsModule,
  ReactiveFormsModule, FormBuilder,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import {
  Validators
} from 'ngx-editor';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { CommonModule } from '@angular/common';

import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { TechnologyTagService } from 'src/app/usit/services/technology-tag.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = (control.value || '').trim().length > 0;
    return isValid ? null : { required: true };
  };
}
@Component({
  selector: 'app-skills-report',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule,
    NgxGpAutocompleteModule,
    MatRadioModule,
    CommonModule,
  ],
  templateUrl: './skills-report.component.html',
  styleUrls: ['./skills-report.component.scss']
})
export class SkillsReportComponent {
  isFormSubmitted = false; 
  skillform: FormGroup
  private techTagServ = inject(TechnologyTagService)
  allowAction!: boolean;
  private snackBarServ = inject(SnackBarService);

  constructor(
    public dialogRef: MatDialogRef<SkillsReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    const addedBy=localStorage.getItem('userid')
  this.skillform = this.formBuilder.group({
  skills: ['', [Validators.required, Validators.minLength(3), noWhitespaceValidator()]],
  addedBy:[addedBy]
});

    
    
    
  }


  submitdata() {
    console.log('Form Value:', this.skillform.value);
    console.log('Form Valid:', this.skillform.valid);
    console.log('Errors:', this.skillform.get('skills')?.errors);
  
    if (this.skillform.invalid) {
      this.skillform.markAllAsTouched();
      console.log('fail');
      return;
    }
  
    console.log('success');
    this.isFormSubmitted = true;
  
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
  
    this.techTagServ.AddSkills(this.skillform.value).subscribe({
      next: (res: any) => {
        if (res.status === 'Success') {
          dataToBeSentToSnackBar.message = this.data.actionName === 'add-te  chnology' 
            ? 'Technology added successfully!' 
            : 'Technology updated successfully!';
            
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          this.dialogRef.close();
        } else {
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          dataToBeSentToSnackBar.message = 'Technology Already Exists!';
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        }
      },
      error: (err: any) => {
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        dataToBeSentToSnackBar.message = err.message || 'Something went wrong!';
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      }
    });
  }
  
  
  
  
  onCancel() {
    this.dialogRef.close();
  }
}
