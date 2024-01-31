import { CommonModule } from '@angular/common';
import {
  Component, OnDestroy, OnInit, ViewChild,
  inject
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { DialogService } from 'src/app/services/dialog.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { SubmissionService } from 'src/app/usit/services/submission.service';
import { AddSubmissionComponent } from './add-submission/add-submission.component';

@Component({
  selector: 'app-submission-list',
  standalone: true,
  imports: [MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatTooltipModule],
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class SubmissionListComponent implements OnInit, OnDestroy{

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Dos',
    'Id',
    'Consultant',
    'Requirement',
    'ImplementationPartner',
    'EndClient',
    'Vendor',
    'SubRate',
    'ProjectLocation',
    'SubmittedBy',
    'SubStatus',
    'Action',
  ];
  entity: any;
  hasAcces!: any;
  message: any;
  showAlert = false;
  submitted = false;
  flag!: any;
  searchstring!: any;
  ttitle!: string;
  ttitle1!: string;
  tclass!: string;
  dept!: any;
  consultant_track: any[] = [];
  field = 'empty';
  totalItems = 0;
  pageSize = 50;
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = true;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  itemsPerPage = 50;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private submissionServ = inject(SubmissionService);
  private  activatedRoute= inject(ActivatedRoute);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);

  // to clear subscriptions
  private destroyed$ = new Subject<void>();

  userid: any;
  page: number = 1;

  ngOnInit(): void {

    this.userid = localStorage.getItem('userid');
    const routeData = this.activatedRoute.snapshot.data;
    // if (routeData['isSalesSubmission']) { // sales submission
    //   this.flag = "sales";
    // }
    // else if (routeData['isRecSubmission']) { // recruiting submission
    //   this.flag = "Recruiting";
    // }

    // else{
    //   this.flag = "DomRecruiting";
    // }
    this.getFlag()
    this.hasAcces = localStorage.getItem('role');
    this.userid = localStorage.getItem('userid');
    this.getAllData();


  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getFlag(){
    const routeData = this.activatedRoute.snapshot.data;
    if (routeData['isSalesSubmission']) {
      this.flag = "Sales";
    }else if (routeData['isRecSubmission']) { // recruiting consutlant
      this.flag = "Recruiting";
    } else {
      this.flag = "Domrecruiting";
    }
  }

  getAllData(pageIndex = 1 ) {
    this.submissionServ.getsubmissiondataPagination(this.flag, this.hasAcces, this.userid, pageIndex, this.pageSize, this.field).subscribe(
      (response: any) => {
        this.entity = response.data.content;
        this.dataSource.data =  response.data.content;
        this.totalItems = response.data.totalElements;
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      }
    )
  }

  onFilter(event: any) {

  }
  applyFilter(event: any) {
    const keyword = event.target.value;
    this.field=keyword;
    if (keyword != '') {
      return this.submissionServ.getsubmissiondataPagination(this.flag, this.hasAcces, this.userid, 1, this.itemsPerPage, keyword).subscribe(
        ((response: any) => {
          this.entity = response.data.content;
          this.totalItems = response.data.totalElements;
          this.dataSource.data = response.data.content;
          // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
        })
      );
    }
    if(keyword==''){
      this.field = 'empty';
    }
    return this.getAllData(this.currentPageIndex + 1);
  }

  onSort(event: any) {

  }

  goToSubmissionInfo(element: any, flag: any) {

  }

  goToSubmissionDrillDownReport(element: any, flag: any) {

  }

  addSubmission() {
    const actionData = {
      title: 'Add Submission',
      submissionData: null,
      actionName: 'add-submission',
      flag: this.flag,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-submission';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(AddSubmissionComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
        this.getAllData(this.currentPageIndex + 1);
      }
    })
  }

  editSubmission(submission: any) {
    const actionData = {
      title: 'Update Submission',
      submissionData: submission,
      actionName: 'edit-submission',
      flag: this.flag,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.panelClass = 'edit-submission';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddSubmissionComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
        this.getAllData(this.currentPageIndex + 1);
      }
    })
  }

  deleteSubmission(submission: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: submission,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = 'fit-content';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'delete-submission';
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

          this.submissionServ.deletesubmission(submission.submissionid).pipe(takeUntil(this.destroyed$))
          .subscribe({next:(response: any) => {
            if (response.status == 'Success') {
              this.getAllData();
              dataToBeSentToSnackBar.message = 'Submission Deleted successfully';
            } else {
              dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
              dataToBeSentToSnackBar.message = 'Record Deletion failed';
            }
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          }, error: (err: any) => {
            dataToBeSentToSnackBar.message = err.message;
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          }});
        }
      },
    });
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
      this.getAllData(event.pageIndex + 1)
    }
    return;
  }

  getRowStyles(row: any): any {
    const subStatus = row.substatus;
    let backgroundColor = '';
    let color = '';

    switch (subStatus) {
      case 'Schedule':
        backgroundColor = 'rgba(40, 160, 76, 0.945)';
        color = 'white';
        break;
      case 'Rejected':
        backgroundColor = '';
        color = 'rgba(177, 19, 19, 0.945)';
        break;
      default:
        backgroundColor = '';
        color = '';
        break;
    }

    return { 'background-color': backgroundColor, 'color': color };
  }

  getAllData2(pageIndex = 1) {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };

    return this.submissionServ.getsubmissiondataPagination(
        this.flag,
        this.hasAcces,
        this.userid,
        pageIndex,
        this.pageSize,
        this.field
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
        //  this.consultant = response.data.content;
          this.entity = response.data.content;
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

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  ngOnDestroy(): void {
      this.destroyed$.next(undefined);
      this.destroyed$.complete()
  }

  goToUserInfo(id: number){
    this.router.navigate(['usit/user-info',id])
  }
}
