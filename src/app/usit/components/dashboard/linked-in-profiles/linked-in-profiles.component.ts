import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, of, startWith, Subject, takeUntil } from 'rxjs';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { OpenreqService } from 'src/app/usit/services/openreq.service';

@Component({
  selector: 'app-linked-in-profiles',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    SearchPipe,
    MatCardModule,
    NgxMatIntlTelInputComponent,
    NgxGpAutocompleteModule,
    MatRadioModule,
  ],
  templateUrl: './linked-in-profiles.component.html',
  styleUrls: ['./linked-in-profiles.component.scss'],
})
export class LinkedInProfilesComponent {
  LinkedInProfile!: FormGroup;
  protected isFormSubmitted: boolean = false;
  private service = inject(OpenreqService);
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<LinkedInProfilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.LinkedInProfile = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
        
        ],
      ],

      category: ['', [Validators.required]],
      location: ['', [Validators.required]],
      search_string: ['', [Validators.required]],
    });
  }
  onCancel() {
    this.dialogRef.close();
  }
  onSubmit(): void {
    if (this.LinkedInProfile.invalid) {
      this.LinkedInProfile.markAllAsTouched();
      console.log('updateee', this.LinkedInProfile.value);

      return;
    }

    this.isFormSubmitted = true;
    this.service.ScrapeLinkedInprofile(this.LinkedInProfile.value).subscribe({
      next: (response: any) => {
        console.log('Ratings Saved:', response);
        this.dialogRef.close({ success: true });
      },
      error: (error: any) => {
        console.error('Error saving ratings:', error);
        this.isFormSubmitted = false;
      },
    });
  }
}
