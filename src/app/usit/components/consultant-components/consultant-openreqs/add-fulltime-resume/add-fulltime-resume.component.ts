import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // For reactive forms
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'; // For dialog components
import { MatIconModule } from '@angular/material/icon'; // For mat-icon and mat-icon-button
import { MatFormFieldModule } from '@angular/material/form-field'; // For mat-form-field
import { MatInputModule } from '@angular/material/input'; // For matInput
import { MatButtonModule } from '@angular/material/button'; // For mat-raised-button
import { MatCardModule } from '@angular/material/card'; // For mat-card
import { CommonModule } from '@angular/common'; // For *ngIf directive
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { OpenreqService } from 'src/app/usit/services/openreq.service';


@Component({
  standalone: true,
  selector: 'app-add-fulltime-resume',
  templateUrl: './add-fulltime-resume.component.html',
  styleUrls: ['./add-fulltime-resume.component.scss'],
  imports: [MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule
  ]
})
export class AddFulltimeResumeComponent {

  employeeForm: FormGroup;
  resumeUpload: File | null = null;
  resumeError = false;
  resumeFileNameLength = false;
  allowAction: boolean = false;
  private openServ = inject(OpenreqService);
  private snackBarServ = inject(SnackBarService);
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  dialogRef = inject(MatDialogRef<AddFulltimeResumeComponent>);
  protected isFormSubmitted: boolean = false;
  data = inject(MAT_DIALOG_DATA);

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      resumeUploadFile: [null, Validators.required]
    });
  }

  uploadResume(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Set conditions for file name length and file size (1 MB limit)
      this.resumeFileNameLength = file.name.length > 20;
      this.resumeError = file.size > 1 * 1024 * 1024; // 1 MB size limit

      // Check conditions: only accept files that meet the size and name length requirements
      if (!this.resumeError && !this.resumeFileNameLength) {
        this.resumeUpload = file;
      } else {
        this.resumeUpload = null;
        // Optionally, you could add a message here to let the user know the file size is too large
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {

    if (this.resumeUpload) {
      // Step 1: Create a FormData object
      const formData = new FormData();

      // Step 2: Append the resume (file) to the FormData object
      formData.append('resumeFile', this.resumeUpload, this.resumeUpload.name);

      // Step 3: Append the fields as a JSON object string
      const appliedDTOJson = {
        id: this.data.empployeeData.id,
        applied_by: this.data.empployeeData.applied_by,
        jobid: this.data.empployeeData.jobid
      };

      // Convert the object to a JSON string
      formData.append('appliedDTO', JSON.stringify(appliedDTOJson));
      this.openServ.applyJobs(formData).subscribe({
        next: (response: any) => {
          console.log(response.status);
          if (response.status === 'success') {
            this.dataToBeSentToSnackBar.message = 'You have successfully applied to the job';
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
            this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
            this.dialogRef.close();

            // Set allowAction to true after successful application
            this.allowAction = true;


          } else {
            this.dataToBeSentToSnackBar.message = 'You have Already applied for this job';
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
          }

        },
        error: (err: any) => {
          this.dataToBeSentToSnackBar.message = err?.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
      })
    } else {
      // If resume is not uploaded, show an error or a message
      this.dataToBeSentToSnackBar.message = 'Please upload your resume before applying';
      this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
      this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
    }
  }


}
