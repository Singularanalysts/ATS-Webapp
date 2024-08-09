import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { DashboardService } from 'src/app/usit/services/dashboard.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { JobDescriptionComponent } from '../../openreqs/job-description/job-description.component';
import { DialogService } from 'src/app/services/dialog.service';
import { PageEvent } from '@angular/material/paginator';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-emp-applied-jobs-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule
  ],
  templateUrl: './emp-applied-jobs-list.component.html',
  styleUrls: ['./emp-applied-jobs-list.component.scss']
})
export class EmpAppliedJobsListComponent {
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'postedon',
    'job_title',
    'category_skill',
    'employment_type',
    'job_location',
  ];
  data = inject(MAT_DIALOG_DATA);
  dashboardServ = inject(DashboardService);
  private dialogServ = inject(DialogService);
  sortField = 'Postedon';
  sortOrder = 'asc';
  page: number = 1;
  AssignedPageNum!: any;
  totalItems: any;
  field = 'empty';
  currentPageIndex = 0;
  pageEvent!: PageEvent;
  pageSize = 50;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageSizeOptions = [50, 75, 100];
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  private snackBarServ = inject(SnackBarService);

  ngOnInit(): void {
    this.getAllData(); 
  }

  getAllData(pagIdx = 1) {
    const pagObj = {
      pageNumber: pagIdx,
      pageSize: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      userid: this.data.id,
      duration: this.data.duration
    }
    this.dashboardServ.getEmployeeDashboardApPopup(pagObj).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.data.content;
        this.totalItems = response.data.totalElements;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
      },
      error: (err: any) => {
        this.dataToBeSentToSnackBar.message = err.message;
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      }
    });
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  applyFilter(event: any) {
    const keyword = event.target.value;
    this.field = keyword;
    const pagObj = {
      pageNumber: 1,
      pageSize: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      // applied_by: this.userid,
      keyword: this.field
    }
    if (keyword != '') {
      return this.dashboardServ
        .getEmployeeDashboardApPopup(
          pagObj
        )
        .subscribe((response: any) => {
          this.dataSource.data = response.data.content;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
          this.totalItems = response.data.totalElements;
        });
    }
    if (keyword == '') {
      this.field = 'empty';
    }
    return this.getAllData(this.currentPageIndex + 1);
  }

  onSort(event: Sort) {
    if (event.active == 'SerialNum')
      this.sortField = 'postedon'
    else
      this.sortField = event.active;
    this.sortOrder = event.direction;

    if (event.direction != '') {
      this.getAllData();
    }
  }

  goToJobDescription(element: any) {
    const actionData = {
      title: `${element.job_title}`,
      id: element.id,
      actionName: 'job-description',
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'job-description';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      JobDescriptionComponent,
      dialogConfig
    );
  }

}
