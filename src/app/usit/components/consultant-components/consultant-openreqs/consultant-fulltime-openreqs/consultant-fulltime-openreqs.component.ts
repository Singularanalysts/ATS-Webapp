
import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { AddResumeComponent } from '../add-resume/add-resume.component';
import { JobDescriptionComponent } from '../../../openreqs/job-description/job-description.component';
import { RecruInfoComponent } from '../../../openreqs/recru-info/recru-info.component';
import { AddFulltimeResumeComponent } from '../add-fulltime-resume/add-fulltime-resume.component';


@Component({
  selector: 'app-consultant-fulltime-openreqs',
  templateUrl: './consultant-fulltime-openreqs.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatSortModule,
    MatTabsModule
  ],
  styleUrls: ['./consultant-fulltime-openreqs.component.scss']
})
export class ConsultantFulltimeOpenreqsComponent {

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'postedon',
    'job_title',
    'category_skill',
    'employment_type',
    'job_location',
    'Action'
  ];
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum!: any;
  totalItems: any;
  field = 'empty';
  currentPageIndex = 0;
  pageEvent!: PageEvent;
  pageSize = 50;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  selectedFile: File | null = null;
  pageSizeOptions = [50, 75, 100];
  isCompanyExist: any;
  source = 'all';
  private router = inject(Router);
  private openServ = inject(OpenreqService);
  userid!: any;
  dialog: any;
  private dialogServ = inject(DialogService);
  @ViewChild(MatSort) sort!: MatSort;
  private snackBarServ = inject(SnackBarService);
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };

  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.getAllData();
  }

  onSelectionChange(event: MatSelectChange) {
    this.source = event.value; 
  }

  openVendorPopup(vendor: string): void {
    this.dialog.open({
      data: { vendor: vendor },
    });
  }

  goToReqInfo(element: any) {
    const actionData = {
      title: `${element.vendor}`,
      id: element.vendor,
      isExist: element.isexist,
      actionName: 'req-info',
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'req-info';
    dialogConfig.data = actionData;
    this.dialogServ.openDialogWithComponent(RecruInfoComponent, dialogConfig);
  }

  getAllData(pagIdx = 1) {
    const pagObj = {
      pageNumber: pagIdx,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      userid: this.userid,
      keyword: this.field
    }
    this.openServ.getConsultantOpenReqsFulltimeByPaginationSortandFilter(pagObj).subscribe((response: any) => {

        this.dataSource.data = response.data.content;
        this.totalItems = response.data.totalElements;
      
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
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
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      userid: this.userid,
      keyword: this.field
    }
    if (keyword != '') {
      return this.openServ
        .getConsultantOpenReqsFulltimeByPaginationSortandFilter(pagObj).subscribe((response: any) => {

          this.dataSource.data = response.data.content;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);  });
          this.totalItems = response.data.totalElements;
        });
    }
    if (keyword == '') {
      this.field = 'empty';
    }
    return this.getAllData(this.currentPageIndex + 1);
  }

  sortField = 'postedon';
  sortOrder = 'desc';
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

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAllData(event.pageIndex + 1);
    }
    return;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  goToJobDescription(element: any) {
    const actionData = {
      title: `${element.job_title}`,
      id: element.id,
      actionName: 'job-description',
      jobType: 'fulltime',
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  private getDialogConfigData(dataToBeSentToDailog: Partial<IConfirmDialogData>, action: { delete: boolean; edit: boolean; add: boolean, updateSatus?: boolean }) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = action.edit || action.add ? '450px' : action.delete ? 'fit-content' : '400px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = dataToBeSentToDailog.actionName;
    dialogConfig.data = dataToBeSentToDailog;
    return dialogConfig;
  }

  apply(data: any) {
    const applyObj = {
      ...data,
      applied_by: this.userid,
      fulltimejobid: data.id,
      // jobid: data.jobid
    }
    // console.log(applyObj);
    const dataToBeSentToDailog = {
      title: 'Add resume',
      empployeeData: applyObj,
      actionName: 'add-fulltime-resume',
    };
    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog, { delete: false, edit: false, add: true });
    const dialogRef = this.dialogServ.openDialogWithComponent(AddFulltimeResumeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {

      if (dialogRef.componentInstance.allowAction) {
        this.getAllData();
      }
    })

  }

}
