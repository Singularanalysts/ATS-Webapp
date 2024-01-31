import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { DialogService } from 'src/app/services/dialog.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { IStatusData } from 'src/app/dialogs/models/status-model.data';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { Employee } from '../../models/employee';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { MatDialogConfig } from '@angular/material/dialog';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { CustomSnackbarComponent } from 'src/app/components/custom-snackbar/custom-snackbar.component';
import { Subject, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { PrivilegesService } from 'src/app/services/privileges.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
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
    MatTooltipModule,
    MatRippleModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmployeeListComponent implements OnInit, AfterViewInit, OnDestroy{


  dataTableColumns: string[] = [
    'SerialNum',
    'Name',
    'Email',
    'PersonalOrCompanyNumber',
    'Designation',
    'Department',
    'Status',
    'Action',
  ];
  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource([]);

  // paginator
  length = 50;
  pageSize = 50;
  pageIndex = 0;
  pageSizeOptions = [50, 75, 100];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // snack bar data
  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  // datalog-config data

  // services
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private empManagementServ = inject(EmployeeManagementService);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);
  // for subscrition clean up
  private destroyed$ = new Subject<void>();
  ngOnInit(): void {
    this.getAllEmployees();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * get all employee data
   * @returns employee data
   */
  getAllEmployees() {
    return this.empManagementServ.getAllEmployees().pipe(takeUntil(this.destroyed$)).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.dataSource.data = response.data;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = i + 1;
          });
        }
      },
      error: (err) => {
        this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
        this.dataTobeSentToSnackBarService.message = err.message;
        this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
      },
    });
  }

  onSort(event: Sort) {
    const sortDirection = event.direction ;
    const activeSortHeader = event.active;

    if (sortDirection === '') {
       this.dataSource.data = this.dataSource.data;
      return;
    }

    const isAsc = sortDirection === 'asc';
    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      switch (activeSortHeader) {
        case 'Name':
          return (
            (isAsc ? 1 : -1) *
            (a.fullname || '').localeCompare(b.fullname || '')
          );
        case 'Email':
          return (
            (isAsc ? 1 : -1) * (a.email || '').localeCompare(b.email || '')
          );
        case 'PersonalOrCompanyNumber':
          return (
            (isAsc ? 1 : -1) *
            (
              a.personalcontactnumber?.internationalNumber ||
              '' ||
              ''
            ).localeCompare(
              b.personalcontactnumber?.internationalNumber || '' || ''
            )
          );
        case 'Designation':
          return (
            (isAsc ? 1 : -1) *
            (a.designation || '').localeCompare(b.designation || '')
          );
        case 'Department':
          return (
            (isAsc ? 1 : -1) *
            (a.department || '').localeCompare(b.department || '')
          );
        case 'Status':
          return (
            (isAsc ? 1 : -1) * (a.status || '').localeCompare(b.status || '')
          );
        default:
          return 0;
      }
    });
  }

  onFilter(event: any) {
    this.dataSource.filter = event.target.value;
  }

  addEmployee() {
    const dataToBeSentToDailog = {
      title: 'Add Employee',
      empployeeData: null,
      actionName: 'add-employee',
    };
    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog,{delete: false, edit: false, add: true});
    const dialogRef =  this.dialogServ.openDialogWithComponent(AddEmployeeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
        this.getAllEmployees()
    }})
  }

  editEmployee(emp: Employee) {
    const dataToBeSentToDailog = {
      title: 'Update Employee',
      employeeData: emp,
      actionName: 'edit-employee',
    };
    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog,{delete: false, edit: true, add: false});
    const dialogRef =  this.dialogServ.openDialogWithComponent(AddEmployeeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
        this.getAllEmployees()
    }})
  }

  deleteEmployee(emp: Employee) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: emp,
      actionName: 'delete-employee'
    };

    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog,{delete: true, edit: false, add: false});
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );
    // call delete api after  clicked 'Yes' on dialog click

    dialogRef.afterClosed().subscribe({
      next: (resp) => {
        if (dialogRef.componentInstance.allowAction) {
          // call delete api
          this.empManagementServ.deleteEmployeeById(emp.userid).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response: any) => {
              if (response.status == 'success') {
                this.getAllEmployees();
                this.dataTobeSentToSnackBarService.message =
                  'Employee Deleted successfully';
              } else {
                this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
                this.dataTobeSentToSnackBarService.message = 'Record Deletion failed';
              }
              this.snackBarServ.openSnackBarFromComponent(
                this.dataTobeSentToSnackBarService
              );
            },
            error: (err) => {
              this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
              this.dataTobeSentToSnackBarService.message = err.message;
              this.snackBarServ.openSnackBarFromComponent(
                this.dataTobeSentToSnackBarService
              );
            },
          });
        }
      },
    });
  }

  private getDialogConfigData(dataToBeSentToDailog: Partial<IConfirmDialogData>, action: {delete: boolean; edit: boolean; add: boolean, updateSatus?: boolean}) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = action.edit ||  action.add  ?  '62dvw' : action.delete ? 'fit-content' : "400px";
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = dataToBeSentToDailog.actionName;
    dialogConfig.data = dataToBeSentToDailog;
    return dialogConfig;
  }

  // status update
  onStatusUpdate(emp: Employee) {
    const dataToBeSentToDailog = {
      title: 'Status Update',
      updateText: emp.status !== 'Active' ? 'activating' : 'in-activating',
      type: 'Employee',
      buttonText: 'Update',
      actionData: emp,
      actionName: 'update-employee-status'
    };
    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog, {delete: false, edit: false, add: false, updateSatus: true});
    const dialogRef = this.dialogServ.openDialogWithComponent(
      StatusComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe({
      next: (resp) => {
        if (dialogRef.componentInstance.submitted) {
          emp.remarks = dialogRef.componentInstance.remarks;
          this.callChangeEmpStatusAPI(emp);
        }
      },
    });
  }

  private callChangeEmpStatusAPI(emp: Employee) {
    this.empManagementServ.changeEmployeeStatus(emp).pipe(takeUntil(this.destroyed$)).subscribe({
      next: (response: any) => {
        if (response.status == 'success') {
          this.getAllEmployees();
          this.dataTobeSentToSnackBarService.message = 'Status updated successfully';
        } else {
          this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
          this.dataTobeSentToSnackBarService.message = 'Status update failed';
        }
        this.dataTobeSentToSnackBarService.duration = 1500;
        this.snackBarServ.openSnackBarFromComponent(
          this.dataTobeSentToSnackBarService
        );
      },
      error: (err) => {
        this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
        this.dataTobeSentToSnackBarService.message = err.message;
        this.snackBarServ.openSnackBarFromComponent(
          this.dataTobeSentToSnackBarService
        );
      },
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  goToUserInfo(id: number){

    this.router.navigate(['usit/user-info',id])
  }
  /** clean up subscriptions */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }
}


