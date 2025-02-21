import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { AllFilesService } from '../../services/all-files.service';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { FileUploadValidators } from '@iplab/ngx-file-upload';

@Component({
  selector: 'app-upload-documents',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FileUploadModule
  ],
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent {
 
  uploadFilesForm!: FormGroup;
  isFormSubmitted: boolean = false;
  submitted = false;
  folderObj: any = {};
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  private snackBarServ = inject(SnackBarService);
  private allFilesServ = inject(AllFilesService);
  private destroyed$ = new Subject<void>();
  private formBuilder= inject(FormBuilder);
  public animation: boolean = false;
  public multiple: boolean = true;
  private filesControl = new FormControl<File[]>([]);
  formData: FormData = new FormData();
  userid!: string | null;
  
  constructor(
    public dialogRef: MatDialogRef<UploadDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.userid = localStorage.getItem('userid');
    this.initUploadFilesForm(null);
  }

  private initUploadFilesForm(folderData: any) {
    this.uploadFilesForm = this.formBuilder.group({
      files: this.filesControl,
      userid: [folderData && folderData.userid ? folderData.userid : localStorage.getItem('userid')],
    });
  }


  onSubmit() {
    this.submitted = true;
    if (this.uploadFilesForm.invalid) {
      this.uploadFilesForm.markAllAsTouched();
      this.isFormSubmitted = false;
      return;
    }
    this.isFormSubmitted = true;
    const formValues = this.uploadFilesForm.value;
      this.formData = new FormData();

      const files = formValues.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          this.formData.append(`files`, files[i]);
        }
      } else {
        console.warn('No attachments found.');
      }

    this.allFilesServ
      .uploadFiles(this.data.parentId, this.userid, this.formData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            this.dataToBeSentToSnackBar.message = 'Files Uploaded successfully';
            this.dialogRef.close();
          } else {
            this.isFormSubmitted = false;
            this.dataToBeSentToSnackBar.message =resp.message;
          }
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          this.isFormSubmitted = false;
          this.dataToBeSentToSnackBar.message = 'Files Upload failed';
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        },
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
