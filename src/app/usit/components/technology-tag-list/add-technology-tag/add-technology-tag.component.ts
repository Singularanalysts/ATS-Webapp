import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  inject,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { TechnologyTagService } from 'src/app/usit/services/technology-tag.service';

@Component({
  selector: 'app-add-technology-tag',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-technology-tag.component.html',
  styleUrls: ['./add-technology-tag.component.scss']
})
export class AddTechnologyTagComponent {

  technologyForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private techTagServ = inject(TechnologyTagService);
  private snackBarServ = inject(SnackBarService);
  protected isFormSubmitted: boolean = false;
  allowAction = false;
  userid!: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddTechnologyTagComponent>
  ) { }

  ngOnInit(): void {

    this.userid = localStorage.getItem('userid');
    if (this.data.actionName === "update-technology") {
      this.initializeTechnologyForm(this.data.technologyData);
    } else {
      this.initializeTechnologyForm(this.data.technologyData);
    }
  }

  private initializeTechnologyForm(data: any) {
    this.technologyForm = this.formBuilder.group({
      technologyarea: [data ? data.technologyarea : '', Validators.required],
      listofkeyword: [data ? data.listofkeyword : '', Validators.required],
      functionalSkills: [data ? data.functionalSkills : '', Validators.required],
      comments: [data ? data.comments : ''],
      id: [data ? data.id : ''],
      addedby: [this.data.actionName === "update-technology" ? data?.addedby : localStorage.getItem('userid')],
      updatedby: [this.data.actionName === "update-technology" ? localStorage.getItem('userid') : '0'],
    });
  }

  get controls() {
    return this.technologyForm.controls;
  }

  onSubmit() {
    this.isFormSubmitted = true;
    this.allowAction = true;
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    if (this.technologyForm.invalid) {
      this.isFormSubmitted = false
      this.displayFormErrors();
      return;
    }
    else {
      this.isFormSubmitted = true
    }
    //const userId = localStorage.getItem('userid');
    const addObj = {
      technologyarea: this.technologyForm.get('technologyarea')!.value.trim(),
      listofkeyword: this.technologyForm.get('listofkeyword')!.value,
      functionalSkills: this.technologyForm.get('functionalSkills')!.value,

      comments: this.technologyForm.get('comments')!.value,
      id: this.technologyForm.get('id')!.value,
      addedby: localStorage.getItem('userid'),
      
    };
    const updateObj = {
      ...this.data.technologyData,
      technologyarea: this.technologyForm.get('technologyarea')!.value.trim(),
      listofkeyword: this.technologyForm.get('listofkeyword')!.value,
      functionalSkills: this.technologyForm.get('functionalSkills')!.value,
      comments: this.technologyForm.get('comments')!.value,
      id: this.technologyForm.get('id')!.value,
      updatedby: localStorage.getItem('userid')

    };
    const saveObj = this.data.actionName === "update-technology" ? updateObj : addObj;

    this.techTagServ.addOrUpdateTechnology(saveObj, this.data.actionName).subscribe(
      {
        next: (data: any) => {

          if (data.status == 'success') {
            dataToBeSentToSnackBar.message = this.data.actionName === 'add-technology' ?
              'Technology added successfully!' : ' Technology updated successfully!';
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
            this.dialogRef.close();
          } else {
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure']
            dataToBeSentToSnackBar.message = 'Technology Already Exists!'
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          }

        }, error: (err: any) => {
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure']
          dataToBeSentToSnackBar.message = err.message
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        }
      });
  }

  displayFormErrors() {
    Object.keys(this.technologyForm.controls).forEach((field) => {
      const control = this.technologyForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  onAction(type: string) {
    this.dialogRef.close();
  }
  duplicateTechErrorMessage: string = '';

  DuplicateTechnologyCheck() {
    const techControl = this.technologyForm.get('technologyarea');
    const technologyarea = techControl?.value?.trim();
  
    if (!technologyarea) {
      this.displayFormErrors();
      return;
    }
  
    this.techTagServ.DuplicateCheckTechnology(technologyarea).subscribe({
      next: (res: any) => {


        if (res?.status === 'success' && res?.data === true) {
          this.duplicateTechErrorMessage = '';
          techControl?.setErrors(null);
          techControl?.updateValueAndValidity();
          
        } else if (res?.status === 'failed' && res?.data === false) {
          this.duplicateTechErrorMessage = res.message || 'Technology already exists';
          techControl?.setErrors({ duplicate: true });
          techControl?.markAsTouched();        

        }
      },
      error: (err) => {
        console.log('ERROR RESPONSE:', err);
  
        const backend = err?.error;
  
        if (backend?.message) {
          this.duplicateTechErrorMessage = backend.message;
          techControl?.setErrors({ duplicate: true }); 
        } else {
          this.duplicateTechErrorMessage = 'Something went wrong. Please try again.';
          techControl?.setErrors({ duplicate: true });
        }
      }
    });
  }
  
  
  
  
  
}
