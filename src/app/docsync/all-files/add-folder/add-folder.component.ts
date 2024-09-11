import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { takeUntil } from 'rxjs/operators';
import { AllFilesService } from '../../services/all-files.service';
import { Subject } from 'rxjs';

interface DialogData {
  title: string;
  actionName: string;
  folderData?: any;
}

@Component({
  selector: 'app-add-folder',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ],
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.scss']
})
export class AddFolderComponent implements OnInit {
  folderForm!: FormGroup;
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

  constructor(
    public dialogRef: MatDialogRef<AddFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFolderForm(this.data.folderData);
    if (this.data.actionName === "edit-folder") {
      this.bindFormControlValueOnEdit();
    }
  }

  private initFolderForm(folderData: any) {
    this.folderForm = this.formBuilder.group({
      name: [folderData ? folderData.name : '', [Validators.required]],
      userid: [folderData && folderData.userid ? folderData.userid : localStorage.getItem('userid')],
      updatedBy: [this.data.actionName === "edit-folder" ? localStorage.getItem('userid') : null]
    });

    if (this.data.actionName === 'edit-folder') {
      this.folderForm.addControl('id', this.formBuilder.control(folderData ? folderData.id : ''));
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
    if (this.folderForm.invalid) {
      this.folderForm.markAllAsTouched();
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
      this.folderObj.name = this.folderForm.value.name;
      this.folderObj.userid = this.folderForm.value.userid;
      this.folderObj.filepath = this.folderForm.value.filepath;
      this.folderObj.updatedBy = localStorage.getItem('userid');
    } else {
      // Add additional field if actionName is not "edit-folder"
      this.folderObj = {
        ...this.folderForm.value,
        filepath: '' // Add the field and its value here
      };
    }

    return this.folderObj;
  }

  trimSpacesFromFormValues() {
    Object.keys(this.folderForm.controls).forEach((controlName: string) => {
      const control = this.folderForm.get(controlName);
      if (control!.value && typeof control!.value === 'string') {
        control!.setValue(control!.value.trim());
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
