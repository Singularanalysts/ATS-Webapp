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
import { VisaService } from 'src/app/usit/services/visa.service';

@Component({
  selector: 'app-add-visa',
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
  templateUrl: './add-visa.component.html',
  styleUrls: ['./add-visa.component.scss']
})
export class AddVisaComponent {

  visaForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private visaServ = inject(VisaService);
  private snackBarServ = inject(SnackBarService);
  protected isFormSubmitted: boolean = false;
  allowAction = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddVisaComponent>
  ) {}

  ngOnInit(): void {
    if(this.data.actionName === "update-visa"){
      this.initializeVisaForm(this.data.visaData);
    }else{
      this.initializeVisaForm(this.data.visaData);
    }
  }

  private initializeVisaForm(data : any) {
    this.visaForm = this.formBuilder.group({
      vid : [data ? data.vid : ''],
      visastatus: [data ? data.visastatus : '', Validators.required],
      description: [data ? data.description : ''],
    });
  }

  get controls() {
    return this.visaForm.controls;
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
    if (this.visaForm.invalid) {
      this.displayFormErrors();
      return;
    }
    const userId = localStorage.getItem('userid');
    const addObj = {
      addedby: userId,
      updatedby: userId,
      vid : this.visaForm.get('vid')!.value,
      visastatus: this.visaForm.get('visastatus')!.value,
      description: this.visaForm.get('description')!.value
    };
    const updateObj = {
      ...this.data.visaData,
      visastatus: this.visaForm.get('visastatus')!.value,
      updatedby: userId,
      description: this.visaForm.get('description')!.value
    };
    const saveObj = this.data.actionName === "update-visa" ? updateObj : addObj;

    this.visaServ.addOrUpdateVisa(saveObj, this.data.actionName).subscribe(
      {
      next:(data: any) => {
      if (data.status == 'success') {
        dataToBeSentToSnackBar.message =  this.data.actionName === 'add-visa' ?
        'Visa added successfully!' :' Visa updated successfully!';
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        this.dialogRef.close();
      } else {
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure']
        dataToBeSentToSnackBar.message =  'Visa Already Exists!'
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
    Object.keys(this.visaForm.controls).forEach((field) => {
      const control = this.visaForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  onAction(type: string) {
    this.dialogRef.close();
  }

}
