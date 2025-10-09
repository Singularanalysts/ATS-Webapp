import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { RecruInfoComponent } from '../../openreqs/recru-info/recru-info.component';
import { JobDescriptionComponent } from '../../openreqs/job-description/job-description.component';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { AddResumeComponent } from './add-resume/add-resume.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-consultant-openreqs',
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
    MatTabsModule,
FormsModule,
MatInputModule
  ],
  templateUrl: './consultant-openreqs.component.html',
  styleUrls: ['./consultant-openreqs.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }]
})
export class ConsultantOpenreqsComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'postedon',
    'job_title',
    'category_skill',
    'employment_type',
    'job_location',
    'Action',
    'Comment'
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
    const saved = localStorage.getItem('appliedJobs');
    if (saved) {
      this.appliedJobs = new Set(JSON.parse(saved));
    }
  }

  onSelectionChange(event: MatSelectChange) {
    this.source = event.value;
    this.getAllData();
  }

  openVendorPopup(vendor: string): void {
    this.dialog.open({
      data: { vendor: vendor },
    });
  }
   @ViewChild('commentDialog') commentDialog!: TemplateRef<any>;
    dialogRef!: MatDialogRef<any>;
showReason = false;
  remarks: string = '';
    selectedJob: any; // make sure you pass job data into dialog
    constructor( private matdialog:MatDialog){}
    
 openCommentDialog(element: any): void {
    this.selectedJob = element; // store row data
    this.dialogRef = this.matdialog.open(this.commentDialog, {
      width: '600px',
      data: { jobTitle: element?.job_title }
    });
  }

handleDialogResponse(status: boolean): void {
  const userId = localStorage.getItem('userid');
  const payload: any = {
    applied_by: userId,
    jobid: this.selectedJob?.id,
    status: status
  };

  if (!status) {
    // user clicked "No" → show remarks field instead of calling API
    this.showReason = true;
    return;
  } else {
    // user clicked "Yes" → normal API flow
    this.resetRemarks();
    this.submitApplication(payload);
  }
}
  private saveAppliedJobs(): void {
    localStorage.setItem('appliedJobs', JSON.stringify(Array.from(this.appliedJobs)));
  }
submitRemarks(): void {
  const trimmedRemarks = (this.remarks || '').trim();

  if (!trimmedRemarks) {
    this.remarks = '';
    const textArea = document.querySelector(
      'textarea[matinput]'
    ) as HTMLTextAreaElement | null;
    if (textArea) textArea.focus();
    return;
  }

  const userId = localStorage.getItem('userid');
  const payload: any = {
    applied_by: userId,
    jobid: this.selectedJob?.id,
    status: false,
    remarks: trimmedRemarks,
  };

  this.submitApplication(payload);
}

private submitApplication(payload: any): void {
  this.openServ.ContractJobApplicationStatus(payload).subscribe({
    next: (resp: any) => {
      const dataToBeSentToSnackBar: ISnackBarData = {
        message:
          resp.message ||
          (resp.status === 'success'
            ? 'Application processed successfully'
            : 'Submission failed'),
        duration: 2500,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        direction: 'above',
        panelClass:
          resp.status === 'success'
            ? ['custom-snack-success']
            : ['custom-snack-failure'],
      };

      this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      this.resetRemarks();
      this.dialogRef.close();
      this.getAllData();
    },
    error: () => {
      this.snackBarServ.openSnackBarFromComponent({
        message: 'Something went wrong. Please try again.',
        duration: 2500,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        direction: 'above',
        panelClass: ['custom-snack-failure'],
      });
      this.resetRemarks();
      this.dialogRef.close();
    },
  });
}

resetRemarks(): void {
  this.remarks = '';
  this.showReason = false;
}

  closeDialog(): void {
  this.showReason = false;  // hide remarks field
  this.remarks = '';        // clear text
  this.dialogRef.close();
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
    this.openServ
      .getConsultantOpenReqsByPaginationSortandFilter(
        pagObj
      )
      .subscribe((response: any) => {
        this.dataSource.data = response.data.content;
        this.totalItems = response.data.totalElements;
        // for serial-num {}
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
        .getConsultantOpenReqsByPaginationSortandFilter(
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
      jobid: data.id
    }
    // console.log(applyObj);0000000000000000000
    const dataToBeSentToDailog = {
      title: 'Add resume',
      empployeeData: applyObj,
      actionName: 'add-resume',
    };
    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog, { delete: false, edit: false, add: true });
    const dialogRef = this.dialogServ.openDialogWithComponent(AddResumeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {


      if (dialogRef.componentInstance.allowAction) {
        this.getAllData();
      }
    })
  }
    appliedJobs: Set<number> = new Set(); // store job IDs the user applied for

   openJob(url: string, jobId: number): void {
    if (url) {
      window.open(url, '_blank');
    }

    // Mark job as applied locally
    this.appliedJobs.add(jobId);
    this.saveAppliedJobs();
  }

}