import { CommonModule } from '@angular/common';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { IStatusData } from 'src/app/dialogs/models/status-model.data';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { DialogService } from 'src/app/services/dialog.service';
import { UserManagementService } from 'src/app/services/user-management.service';
import { Role } from '../../models/role';
import { AddRoleComponent } from './add-role/add-role.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { RoleManagementService } from '../../services/role-management.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ManagePrivilegeComponent } from '../privilege-list/manage-privilege/manage-privilege.component';
import { PrivilegesService } from 'src/app/services/privileges.service';
@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
,
standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatTooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RolesListComponent implements OnInit , AfterViewInit{
  private roleManagementServ = inject(RoleManagementService);
  form: any = FormGroup;
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  protected privilegeServ = inject(PrivilegesService);
  private router = inject(Router);
  displayedColumns: string[] = ['RoleName', 'Actions'];
  dataSource = new MatTableDataSource([]);

  @ViewChild(MatSort) sort!: MatSort;
  roleList: Role[]= [];
  ngOnInit(): void {
    this.getAllRoles()
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  private getAllRoles() {
    return this.roleManagementServ.getAllRoles().subscribe(
      {
        next:(response: any) => {
          this.roleList = response.data;
          this.dataSource.data = response.data;
        },
        error: (err)=> console.log(err)
      }
    );
  }
  // add
  addRole(){
    const actionData = {
      title: 'Add New Role',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'add-role'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "add-role";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddRoleComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.alloAction){
        this.getAllRoles();
      }
    })
  }
  // search
  onFilter(event: any){
    this.dataSource.filter = event.target.value
  }
  // sort
  onSort(event: any){
    const sortDirection = event.direction;
    const activeSortHeader = event.active;

    if (sortDirection === '' || !activeSortHeader) {
      return;
    }

    const isAsc = sortDirection === 'asc';
    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      switch (activeSortHeader) {
        case 'RoleName':
          return (
            (isAsc ? 1 : -1) *
            (a.rolename || '').localeCompare(b.rolename || '')
          );
        default:
          return 0;
      }
    });
  }

  // edit
  editRole(role: Role){
    const actionData = {
      title: 'Update Role',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'update-role',
      roleData: role
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "update-role";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddRoleComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.alloAction){
        this.getAllRoles();
      }

    })
  }
  // delete
  deleteRole(role: Role){
    const dataToBeSentToDailog : Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: role,
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "update-role";
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(ConfirmComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: () =>{
        if (dialogRef.componentInstance.allowAction) {
          const dataToBeSentToSnackBar: ISnackBarData = {
            message: 'Role updated successfully!',
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-success'],
          };
          this.roleManagementServ.deleteRole(role.roleid).subscribe
            ({
              next: (resp: any) => {
                if (resp.status == 'success') {
                  dataToBeSentToSnackBar.message =
                    'Role Deleted successfully';
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                  // call get api after deleting a role
                  this.getAllRoles();
                } else {
                  dataToBeSentToSnackBar.message = resp.message;
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                }

              }, error: (err) => console.log(`role delete error: ${err}`)
            });
        }
      }
    })
  }
  // status update: NOT USED
  _onStatusUpdate(role: Role){
    const dataToBeSentToDailog : IStatusData = {
      title: 'Status Update',
      updateText: role.status !== 'Active' ? 'activating' : 'in-activating',
      type: role.rolename,
      buttonText: 'Update',
      actionData: role
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.panelClass = "update-role-status";
    dialogConfig.data = dataToBeSentToDailog;
    this.dialogServ.openDialogWithComponent(StatusComponent, dialogConfig)
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }
  // add
  addPrivilege(){
    const actionData = {
      title: 'Add Privilege',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'add-privilege'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "add-privilege";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(ManagePrivilegeComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(() => {
    //   if(dialogRef.componentInstance.alloAction){
    //     this.getAllRoles();
    //   }
    // })
  }

  /**
   * Go to privelges screen
   */

  goToPrivilegeScreen(role: Role){
this.router.navigate(['/usit/privileges', role.roleid])
  }

  }

  export interface IRoleData {
    roleid: number;
    rolename: string;
    status: string;
  }
