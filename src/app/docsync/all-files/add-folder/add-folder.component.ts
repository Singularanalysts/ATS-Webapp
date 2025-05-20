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
  record?: any;
  filepath: string;
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
  extension: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.initFolderForm(this.data.folderData);
    if (this.data.actionName === "rename-folder") {
      this.initFolderForm(this.data.record);
    }
    if (this.data.actionName === "rename-file") {
      this.initFolderForm(this.data.record)
    }
  }

  private initFolderForm(folderData: any) {
    let name = '';
    this.extension = '';

    if (folderData) {
      if (folderData.item_type === 'file') {
        const nameParts = folderData.name.split('.');
        this.extension = nameParts.length > 1 ? nameParts.pop()! : '';
        name = nameParts.join('.');
      } else {
        name = folderData.name || '';
      }
    }
    this.folderForm = this.formBuilder.group({
      name: [name, [Validators.required]],
      userid: [folderData && folderData.createdBy ? folderData.createdBy : localStorage.getItem('userid')],
      updatedBy: [this.data.actionName === "rename-folder" || this.data.actionName === "rename-file" ? localStorage.getItem('userid') : null],
      extension: [this.data.actionName === "rename-file" ? this.extension: null]
    });

    if (this.data.actionName === "rename-folder" || this.data.actionName ==="rename-file") {
      this.folderForm.addControl('recordid', this.formBuilder.control(folderData ? folderData.item_id : ''));
      this.folderForm.addControl('itemtype', this.formBuilder.control(folderData ? folderData.item_type : ''));
    }
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
          if (resp.status == 'Success') {
            if (this.data.actionName === 'add-folder') {
              this.dataToBeSentToSnackBar.message = 'Folder added successfully';
            }  else if (this.data.actionName === 'rename-file') {
              this.dataToBeSentToSnackBar.message = 'File Name renamed successfully';
            } else {
              this.dataToBeSentToSnackBar.message = 'Folder Name updated successfully'; 
            }
            // this.dataToBeSentToSnackBar.message =
            //   this.data.actionName === 'add-folder'
            //     ? 'Folder Name saved successfully'
            //     : 'Folder Name updated successfully';
              this.dialogRef.close();
          } else {
            this.isFormSubmitted = false;
            this.dataToBeSentToSnackBar.message =resp.message;
          }
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          this.isFormSubmitted = false;
          if (this.data.actionName === 'add-folder') {
            this.dataToBeSentToSnackBar.message = 'Folder Name addition failed';
          }  else if (this.data.actionName === 'rename-file') {
            this.dataToBeSentToSnackBar.message = 'File Name updation failed';
          } else {
            this.dataToBeSentToSnackBar.message = 'Folder Name updation failed'; 
          }
          // this.dataToBeSentToSnackBar.message =
          //   this.data.actionName === 'add-folder'
          //     ? 'Folder Name addition is failed'
          //     : 'Folder Name updation is failed';
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
    if (this.data.actionName === "rename-folder" || this.data.actionName === "rename-file") {
      console.log(this.folderForm.value);
      this.folderObj = {
        recordid: this.folderForm.value.recordid,
        itemtype: this.folderForm.value.itemtype,
        userid: this.folderForm.value.userid,
        name: this.folderForm.value.name,
        updatedBy : localStorage.getItem('userid')
      };
    } else {
      this.folderObj = {
        ...this.folderForm.value,
        filepath: this.data.filepath
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
