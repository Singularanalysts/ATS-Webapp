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
  private filesControl = new FormControl<File[]>([],FileUploadValidators.filesLimit(6));
  
  constructor(
    public dialogRef: MatDialogRef<UploadDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initUploadFilesForm(this.data.folderData);
    if (this.data.actionName === "edit-folder") {
      this.bindFormControlValueOnEdit();
    }
  }

  private initUploadFilesForm(folderData: any) {
    this.uploadFilesForm = this.formBuilder.group({
      files: this.filesControl,
      userid: [folderData && folderData.userid ? folderData.userid : localStorage.getItem('userid')],
      updatedBy: [this.data.actionName === "edit-folder" ? localStorage.getItem('userid') : null]
    });

    if (this.data.actionName === 'edit-folder') {
      this.uploadFilesForm.addControl('id', this.formBuilder.control(folderData ? folderData.id : ''));
    }
  }

  private bindFormControlValueOnEdit() {
    // Implement API call to fetch data if needed
    // Example:
    // this.openReqServ.getFolderById(this.data.folderData.id).subscribe({
    //   next: (response) => {
    //     this.initFolderForm(response.data);
    //   },
    //   error: (err) => {
    //     // Handle error
    //   }
    // });
  }

  onSubmit() {
    this.submitted = true;
    if (this.uploadFilesForm.invalid) {
      this.uploadFilesForm.markAllAsTouched();
      this.isFormSubmitted = false;
      return;
    }
    this.isFormSubmitted = true;
    const saveReqObj = this.getSaveData();

    this.allFilesServ
      .addORUpdateFolderOrFileName(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'sucess') {
            this.dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-folder'
                ? 'Folder Name saved successfully'
                : 'Folder Name updated successfully';
              this.dialogRef.close();
          } else {
            this.isFormSubmitted = false;
            this.dataToBeSentToSnackBar.message =resp.message;
          }
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          this.isFormSubmitted = false;
          this.dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-folder'
              ? 'Folder Name addition is failed'
              : 'Folder Name updation is failed';
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        },
      });
  }

  getSaveData() {
    this.trimSpacesFromFormValues();

    if (!this.folderObj) {
      this.folderObj = {};
    }

    // Fill folderObj based on actionName
    if (this.data.actionName === "edit-folder") {
      this.folderObj.name = this.uploadFilesForm.value.name;
      this.folderObj.userid = this.uploadFilesForm.value.userid;
      this.folderObj.filepath = this.uploadFilesForm.value.filepath;
      this.folderObj.updatedBy = localStorage.getItem('userid');
    } else {
      // Add additional field if actionName is not "edit-folder"
      this.folderObj = {
        ...this.uploadFilesForm.value,
        filepath: '' // Add the field and its value here
      };
    }

    return this.folderObj;
  }

  trimSpacesFromFormValues() {
    Object.keys(this.uploadFilesForm.controls).forEach((controlName: string) => {
      const control = this.uploadFilesForm.get(controlName);
      if (control!.value && typeof control!.value === 'string') {
        control!.setValue(control!.value.trim());
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
