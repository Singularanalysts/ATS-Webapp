import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
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
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { UserManagementService } from 'src/app/services/user-management.service';
import { Role } from 'src/app/usit/models/role';
import { EmployeeManagementService } from 'src/app/usit/services/employee-management.service';
import { RoleManagementService } from 'src/app/usit/services/role-management.service';
import {MatSelectModule} from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';


@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddRoleComponent {
  addRoleForm: any = FormGroup;
  private formBuilder = inject(FormBuilder);
  private roleManagementServ = inject(RoleManagementService);
  private snackBarServ = inject(SnackBarService);
  tech!: Role;
  private router = inject(Router);
  showValidationError = false;
  protected isFormSubmitted: boolean = false;
  roleDescription = ''
   companyId!:any
  roleName = ''
  roleid = ''
  selectedOptions =''
  alloAction = false;
  isCompanyToDisplay: boolean = false;
  companyOptions: any[] = [];
  private empManagementServ = inject(EmployeeManagementService);
private destroyed$ = new Subject<void>();
// options: string[] = ['Narvee', 'singular', 'probpm', 'hcl'];
options: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddRoleComponent>
  ) {}

  ngOnInit(): void {
    this.checkCompany(localStorage.getItem('companyid'));
    this.companyId=this.data.companyId
    this.getCompanies();
    if(this.data.actionName === "update-role"){
      this.roleName = this.data.roleData.rolename;
      this.roleid = this.data.roleData.roleid;
      this.roleDescription = this.data.roleData.description;
      this.selectedOptions = this.data.roleData.selectedOptions;
      this.initializeRoleForm(this.data.roleData);
    }else{
      this.initializeRoleForm(this.data.roleData);
    }
  }

  private initializeRoleForm(data : any) {
    this.addRoleForm = this.formBuilder.group({
      rolename: [data ? data.rolename : '', Validators.required],
      //roleId: ['', Validators.required],
      description: [data ? data.description : ''],
      roleid: [data ? data.roleid : ''],
      // companyid: [data? data.company: '', Validators.required],
      // companyid: [data? data.company: '', 
      //   this.isCompanyToDisplay ? [Validators.required] : []],
      selectedOptions: [[], this.isCompanyToDisplay ? [Validators.required]: []],
    });
  }

  get roleForm() {
    return this.addRoleForm.controls;
  }
  onSubmit() {
    this.isFormSubmitted = true;
    this.alloAction = true;
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    if (this.addRoleForm.invalid) {
      this.displayFormErrors();
      return;
    }
    const userId = localStorage.getItem('userid');
    const selectedOptions = this.addRoleForm.get('selectedOptions')?.value;
    const addObj = {
      addedby: userId,
      updatedby: userId,
      rolename: this.addRoleForm.get('rolename').value,
      description: this.addRoleForm.get('description').value,
      selectedOptions: selectedOptions,
    };
    const updateObj = {
      ...this.data.roleData,
      rolename: this.addRoleForm.get('rolename').value,
      updatedby: userId,
      description: this.addRoleForm.get('description').value,
      selectedOptions: selectedOptions,
      companyid: localStorage.getItem('companyid')
    };
    const saveObj = this.data.actionName === "update-role" ? updateObj : addObj;

    this.roleManagementServ.addOrUpdateRole(saveObj, this.data.actionName,localStorage.getItem('companyid')).subscribe(
      {
      next:(data: any) => {

      if (data.status == 'success') {
        dataToBeSentToSnackBar.message =  this.data.actionName === 'add-role' ?
        'Role added successfully!' :' Role updated successfully!';
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        this.dialogRef.close();
      } else {
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure']
        dataToBeSentToSnackBar.message =  'Role Already Exists!'
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      }

    }, error: err =>{
      dataToBeSentToSnackBar.panelClass = ['custom-snack-failure']
      dataToBeSentToSnackBar.message =  err.message
      this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
    }
  });
  }

  displayFormErrors() {
    Object.keys(this.addRoleForm.controls).forEach((field) => {
      const control = this.addRoleForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  onAction(type: string) {
    this.dialogRef.close();
  }

  dataTobeSentToSnackBarService: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };

  checkCompany(companyid:any){

    this.empManagementServ
    .getValidDateCompanyGiven(companyid)
    .pipe(takeUntil(this.destroyed$))
    .subscribe({
      next: (response: any) => {
        this.isCompanyToDisplay = response.data;
      },
      error: (err) => {
        this.dataTobeSentToSnackBarService.message = err.message;
        this.dataTobeSentToSnackBarService.panelClass = [
          'custom-snack-failure',
        ];
        this.snackBarServ.openSnackBarFromComponent(
          this.dataTobeSentToSnackBarService
        );
      },
    });
  
  }
  
  getCompanies() {
    this.empManagementServ
      .getCompaniesDropdown()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.companyOptions = response.data;
          this.options= response.data;
          console.log(this.companyOptions,'roleoptionss');
          
        },
        error: (err) => {
          this.dataTobeSentToSnackBarService.message = err.message;
          this.dataTobeSentToSnackBarService.panelClass = [
            'custom-snack-failure',
          ];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
      });
  }

}
