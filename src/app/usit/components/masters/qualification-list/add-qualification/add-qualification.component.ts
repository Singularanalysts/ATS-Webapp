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
import { QualificationService } from 'src/app/usit/services/qualification.service';

@Component({
  selector: 'app-add-qualification',
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
  templateUrl: './add-qualification.component.html',
  styleUrls: ['./add-qualification.component.scss']
})
export class AddQualificationComponent {

  qualificationForm!: FormGroup;
  protected isFormSubmitted: boolean = false;
  allowAction = false;
  qualificationName: any;
  private qualifictionServ = inject(QualificationService);
  private snackBarServ = inject(SnackBarService);
  private formBuilder = inject(FormBuilder);
  

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddQualificationComponent>
  ) {}

  ngOnInit(): void {
    if(this.data.actionName === "update-qualification"){
      this.qualificationName = this.data.qualificationData.name;
      this.initializeQualificationForm(this.data.qualificationData);
    }else{
      this.initializeQualificationForm(this.data.qualificationData);
    }
  }

  private initializeQualificationForm(data : any) {
    this.qualificationForm = this.formBuilder.group({
      name: [data ? data.name : '', Validators.required],
      id: [data ? data.id : ''],
    });
  }

  get controls() {
    return this.qualificationForm.controls;
  }

  onSubmit(){
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
    if (this.qualificationForm.invalid) {
      this.displayFormErrors();
      return;
    }
    const userId = localStorage.getItem('userid');
    const addObj = {
      name: this.qualificationForm.get('name')!.value,
      id : this.qualificationForm.get('id')!.value,
    };
    const updateObj = {
      ...this.data.qualificationData,
      name: this.qualificationForm.get('name')!.value,
      id : this.qualificationForm.get('id')!.value,
    };
    const saveObj = this.data.actionName === "update-qualification" ? updateObj : addObj;

    this.qualifictionServ.addOrUpdateQualification(saveObj, this.data.actionName).subscribe(
      {
      next:(data: any) => {

      if (data.status == 'success') {
        dataToBeSentToSnackBar.message =  this.data.actionName === 'add-qualification' ?
        'Qualification added successfully!' :' Qualification updated successfully!';
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        this.dialogRef.close();
      } else {
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure']
        dataToBeSentToSnackBar.message =  'Qualification Already Exists!'
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      }

    }, error: (err : any) =>{
      dataToBeSentToSnackBar.panelClass = ['custom-snack-failure']
      dataToBeSentToSnackBar.message =  err.message
      this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
    }
  });
  }

  displayFormErrors() {
    Object.keys(this.qualificationForm.controls).forEach((field) => {
      const control = this.qualificationForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }


  onAction(type: string) {
    this.dialogRef.close();
  }
}
