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
import { CompanyService } from 'src/app/usit/services/company.service';

@Component({
  selector: 'app-add-company',
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
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent {

  companyForm!: FormGroup;
  showValidationError = false;
  private formBuilder = inject(FormBuilder);
  private companyServ = inject(CompanyService);
  private snackBarServ = inject(SnackBarService);
  protected isFormSubmitted: boolean = false;
  allowAction = false;
  companyObj: any;
  entity: any;
  message!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddCompanyComponent>
  ) {}

  ngOnInit(): void {
    if(this.data.actionName === "update-company"){
      this.initializeCompanyForm(this.data.companyData);
      this.companyServ.getCompanyById(this.data.companyData.companyid).subscribe({
        next: (response: any) => {
          if (response && response.data) {
            this.companyObj = response.data;
            this.initializeCompanyForm(this.companyObj);
          }
        }
      });
    }else{
      this.initializeCompanyForm(this.data.companyData);
    }
  }

  private initializeCompanyForm(data : any) {
    this.companyForm = this.formBuilder.group({
      companyid: [data ? data.companyid : ''],
      companyname: [data ? data.companyname : '', Validators.required],
      description: [data ? data.description : ''],
      domain: [data ? data.domain : '', Validators.required],
      code: [data ? data.code : '', Validators.required],
      addedby: [data ? data.addedby : localStorage.getItem('userid')],
      updatedby: [this.data.actionName === "update-company" ? localStorage.getItem('userid') : '0'],
    });
  }

  get controls() {
    return this.companyForm.controls;
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
    if (this.companyForm.invalid) {
      this.displayFormErrors();
      return;
    }

    const saveObj = this.getSaveData();
    this.companyServ.addOrUpdateCompany(saveObj, this.data.actionName).subscribe(
      {
      next:(data: any) => {

      if (data.status == 'success') {
        dataToBeSentToSnackBar.message =  this.data.actionName === 'add-company' ?
        'Company added successfully!' :' Company updated successfully!';
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        this.dialogRef.close();
      } else {
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure']
        dataToBeSentToSnackBar.message =  'Company Already Exists!'
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      }

    }, error: (err : any) =>{
      dataToBeSentToSnackBar.panelClass = ['custom-snack-failure']
      dataToBeSentToSnackBar.message =  err.message
      this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
    }
  });
  }
  getSaveData() {
    const codeControl = this.companyForm.get('code');
    if (codeControl && codeControl.value) {
      const companyCode = codeControl.value.toUpperCase();
      codeControl.setValue(companyCode);
    }
    if (this.data.actionName === 'update-company') {
      return { ...this.entity, ...this.companyForm.value }
    }
    return this.companyForm.value;
  }

  displayFormErrors() {
    Object.keys(this.companyForm.controls).forEach((field) => {
      const control = this.companyForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };

  emailDuplicate(fieldName: string, event: any) {
    const value = event.target.value;
    this.companyServ.duplicateCheck(fieldName, value).subscribe((response: any) => {
      if (response.status == 'success') {
        this.message = '';
      } else if (response.status == 'fail') {
        const duplicateValue = this.companyForm.get(fieldName);
        duplicateValue!.setValue('');
        this.dataToBeSentToSnackBar.message = 'Record already available with given value';
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      } else {
        this.dataToBeSentToSnackBar.message = 'Internal Server Error';
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      }
    });
  }

  onAction(type: string) {
    this.dialogRef.close();
  }

}
