import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormGroup, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TechsupportService } from '../../services/techsupport.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { AddTechSupportComponent } from './add-tech-support/add-tech-support.component';
import { Techsupport } from '../../models/TechSupport';

@Component({
  selector: 'app-tech-support-list',
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
    RouterModule,
    FormsModule,


  ],

  templateUrl: './tech-support-list.component.html',
  styleUrls: ['./tech-support-list.component.scss']
})

export class TechSupportListComponent {
  flag: any;
  consultant: any;
  onSort(event: Sort) {
    const sortDirection = event.direction;
    const activeSortHeader = event.active;

    if (sortDirection === '' || !activeSortHeader) {
      return;
    }

    const isAsc = sortDirection === 'asc';
    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      switch (activeSortHeader) {
        case 'SerialNum':
          return (
            (isAsc ? 1 : -1) *
            (a.serialNum || '').localeCompare(b.serialNum || '')
          );
        case 'Name':
          return (
            (isAsc ? 1 : -1) *
            (a.name || '').localeCompare(b.name || '')
          );
        case 'Experience':
          return (
            (isAsc ? 1 : -1) *
            (a.experience || '').localeCompare(b.experience || '')
          );
        case 'Email':
          return (
            (isAsc ? 1 : -1) *
            (a.email || '').localeCompare(b.email || '')
          );

        case 'Technology':
          return (
            (isAsc ? 1 : -1) *
            (a.technology || '').localeCompare(b.technology || '')
          );
        default:
          return 0;
      }
    });
  }

  onStatusUpdate(_t44: any) {
    throw new Error('Method not implemented.');
  }
  goToUserInfo(arg0: any) {
    throw new Error('Method not implemented.');
  }
  onFilter(event: any) {
    this.dataSource.filter = event.target.value;
  }

  findClosestTr(element: HTMLElement | null): HTMLElement | null {
    while (element && element.tagName !== 'TR') {
      element = element.parentElement;
    }
    return element;
  }

  dataTableColumns: string[] = [
    'SerialNum',
    'Name',
    'Experience',
    'Technology',
    'Skills',
    'Email',
    'ContactNumber',
    'Action',
  ];

  dataSource = new MatTableDataSource([]);
  protected privilegeServ = inject(PrivilegesService);
  tech: Techsupport[] = [];
  techent = new Techsupport();
  message: any;
  showAlert = false;
  registerForm: any = FormGroup;
  submitted = false;
  query!: any;
  hasAcces!: any;
  private snackBarServ = inject(SnackBarService);
  private dialogServ = inject(DialogService);

  // pagination code
  page: number = 1;
  count: number = 0;
  tableSize: number = 50;
  tableSizes: any = [3, 6, 9, 12];


  constructor(private service: TechsupportService, private router: Router) { }
  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.getlist();

  }
  getlist() {
    this.service.getTechSupportList().subscribe(
      (response: any) => {
        if (response.data) {
          this.dataSource.data = response.data;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = i + 1;
          });
        }
      }

    )
  }
  search() {
    this.submitted = true;
    if (this.query == '') {
      this.getlist();
    }
    else {
      this.tech = this.tech.filter((res: Techsupport) => {
        return res.name.toLowerCase().match(this.query.toLowerCase()) || res.email.toLowerCase().match(this.query.toLowerCase())

          || res.mobile.match(this.query)
          || res.skills.toLowerCase().match(this.query.toLowerCase());
      })
    }
  }



  edit(consultant: any) {
    const actionData = {
      title: 'Update Tech-Support',
      consultantData: consultant,
      actionName: 'edit-tech-support',
      flag: this.flag,


    };
    //console.log(consultant);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'edit-tech-support';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddTechSupportComponent,
      dialogConfig

    );

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getlist();
      }
    });
  }





  addTechnology() {
    const actionData = {
      title: 'Add Tech-Support',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'add-tech-support'
    };


    const dialogConfig = this.getDialogConfigData(actionData, { delete: false, edit: false, add: true });
    const dialogRef = this.dialogServ.openDialogWithComponent(AddTechSupportComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getlist()
      }
    })

  }

  private getDialogConfigData(dataToBeSentToDailog: Partial<IConfirmDialogData>, action: { delete: boolean; edit: boolean; add: boolean, updateSatus?: boolean }) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = action.edit || action.add ? '62dvw' : action.delete ? 'fit-content' : "400px";
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = dataToBeSentToDailog.actionName;
    dialogConfig.data = dataToBeSentToDailog;
    return dialogConfig;
  }

  updatestatus() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.service.changeTechSupportStatus(this.techent).subscribe(
      (response: any) => {
        // alertify.success("Status Updated successfully");
        this.getlist();
      })
  }



  onTableDataChange(event: any) {
    this.page = event;
    this.getlist();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getlist();
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');

  }
  private destroyed$ = new Subject<void>();
  deleteEntity(id: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: id,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = 'fit-content';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'delete-requirement';
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );

    // call delete api after  clicked 'Yes' on dialog click

    dialogRef.afterClosed().subscribe({
      next: (resp) => {
        if (dialogRef.componentInstance.allowAction) {
          const dataToBeSentToSnackBar: ISnackBarData = {
            message: '',
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-success'],
          };

          this.service.deleteTechsupport(id.id).pipe(takeUntil(this.destroyed$))
            .subscribe({
              next: (response: any) => {
                if (response.status == 'success') {
                  this.getlist();
                  dataToBeSentToSnackBar.message = 'Requirement Deleted successfully';
                } else {
                  dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                  dataToBeSentToSnackBar.message = 'Record Deletion failed';
                }
                this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
              }, error: err => {
                dataToBeSentToSnackBar.message = err.message;
                dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
              }
            });
        }
      },
    });
  }
  totalItems = 0;
  pageSize = 50;
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = true;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * this.pageSize + index + 1;
    return serialNumber;
  }
  getAllData(pageIndex = 1) {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };

    return this.service
      .getTechSupportList()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.consultant = response.data.content;
          this.dataSource.data = response.data.content;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
          this.totalItems = response.data.totalElements;
          //  this.length = response.data.totalElements;
        },
        error: (err: any) => {
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          dataToBeSentToSnackBar.message = err.message;
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAllData(event.pageIndex + 1);
    }
    return;
  }
}
