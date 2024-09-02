import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { DialogService } from 'src/app/services/dialog.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { SnackBarService, ISnackBarData } from 'src/app/services/snack-bar.service';
import { Project } from '../models/project.model';
import { AddProjectComponent } from './add-project/add-project.component';
import { ProjectService } from '../services/project.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';

@Component({
  selector: 'app-project-list',
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
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }]
})
export class ProjectListComponent implements OnInit {
  private projectServ = inject(ProjectService);
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'projectId',
    'projectName',
    'description',
    'status',
    'Action',
  ];
  hasAcces!: any;
  entity: any[] = [];
  submitted = false;
  showAlert = false;
  flag!: string;
  searchstring!: any;
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum !: any;
  totalItems: any;
  ser: number = 1;
  userid!: any;
  field = "empty";
  currentPageIndex = 0;
  pageEvent!: PageEvent;
  pageSize = 50;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageSizeOptions = [5, 10, 25];
  private dialogServ = inject(DialogService);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);
  private snackBarServ = inject(SnackBarService);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  sortField = 'updateddate';
  sortOrder = 'desc';

  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.userid = localStorage.getItem('userid');
    this.getAll();
  }

  getAll(pagIdx = 1) {
    const pagObj = {
      pageNumber: pagIdx,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field,
      access: this.hasAcces,
      userid: this.userid
    }
    return this.projectServ.getAllProjectsWithPaginationAndSorting(pagObj).pipe(takeUntil(this.destroyed$)).subscribe(
      {
        next: (response: any) => {
          this.entity = response.data.content;
          this.dataSource.data = response.data.content;
          this.totalItems = response.data.totalElements;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = i + 1;
          });
        },
        error: (err: any) => {
          this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
          this.dataTobeSentToSnackBarService.message = err.message;
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        }
      }
    );
  }

  addProject() {
    const actionData = {
      title: 'Add Project',
      ProjectData: null,
      actionName: 'add-project',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '25vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-project';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddProjectComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll();
      }
    })
  }

  editProject(project: Project) {
    const actionData = {
      title: 'Update Project',
      ProjectData: project,
      actionName: 'edit-project',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '25vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'edit-project';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddProjectComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll();
      }
    })
  }

  deleteProject(project: Project) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: project,
      actionName: 'delete-Project'
    };
    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog, { delete: true, edit: false, add: false });
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe({
      next: () => {
        if (dialogRef.componentInstance.allowAction) {
          // call delete api
          this.projectServ.deleteProject(project.pid).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response: any) => {
              if (response.status == 'success') {
                this.getAll();
                this.dataTobeSentToSnackBarService.message =
                  'Project Deleted successfully';
              } else {
                this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
                this.dataTobeSentToSnackBarService.message = 'Record Deletion failed';
              }
              this.snackBarServ.openSnackBarFromComponent(
                this.dataTobeSentToSnackBarService
              );
            },
            error: (err: any) => {
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

  private getDialogConfigData(dataToBeSentToDailog: Partial<IConfirmDialogData>, action: { delete: boolean; edit: boolean; add: boolean, updateSatus?: boolean }) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = action.edit || action.add ? '40vw' : action.delete ? 'fit-content' : "400px";
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = dataToBeSentToDailog.actionName;
    dialogConfig.data = dataToBeSentToDailog;
    return dialogConfig;
  }

  applyFilter(event: any) {
    const keyword = event.target.value;
    this.field = keyword;
    if (keyword != '') {
      const pagObj = {
        pageNumber: 1,
        pageSize: this.itemsPerPage,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        keyword: this.field,
        access: this.hasAcces,
        userid: this.userid
      }
      return this.projectServ.getAllProjectsWithPaginationAndSorting(pagObj).subscribe({
        next: (response: any) => {
          this.entity = response.data.content;
          this.dataSource.data = response.data.content;
          this.totalItems = response.data.totalElements;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = i + 1;
          });
        },
        error: (err: any) => {
          this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
          this.dataTobeSentToSnackBarService.message = err.message;
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        }
      }
      );
    }
    if (keyword == '') {
      this.field = 'empty';
    }
    return this.getAll(this.currentPageIndex + 1);
  }

  onSort(event: any) {
    if (event.active == 'SerialNum')
      this.sortField = 'postedon'
    else
      this.sortField = event.active;
    this.sortOrder = event.direction;

    if (event.direction != '') {
      this.getAll();
    }
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAll()
    }
    return;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  ngOnDestroy(): void {
    this.destroyed$.next(undefined);
    this.destroyed$.complete()
  }

  goToUserInfo(id: number) {
    this.router.navigate(['usit/user-info', id])
  }

  openTasks(projectId: string, pid: string | number): void {
    this.projectServ.setPid(pid);
    this.router.navigate([`/task-management/projects/${projectId}/tasks`]);
  }
}
