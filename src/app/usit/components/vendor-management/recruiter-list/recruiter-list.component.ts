import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  ViewChild,
  inject,
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
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { DialogService } from 'src/app/services/dialog.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { Recruiter } from 'src/app/usit/models/recruiter';
import { RecruiterService } from 'src/app/usit/services/recruiter.service';
import { AddRecruiterComponent } from './add-recruiter/add-recruiter.component';

@Component({
  selector: 'app-recruiter-list',
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
  ],
  templateUrl: './recruiter-list.component.html',
  styleUrls: ['./recruiter-list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class RecruiterListComponent implements OnInit {
  dataTableColumns: string[] = [
    'SerialNum',
    'Company',
    'RecruiterName',
    'PhoneNumber',
    'Email',
    'AddedBy',
    'AddedOn',
    'LastUpdated',
    // 'Status',
    'Action',
    'Approve/Reject',
  ];

  dataSource = new MatTableDataSource<any>([]);

  length = 50;
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [50, 75, 100];
  hidePageSize = true;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private recruiterServ = inject(RecruiterService);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);

  hasAcces!: any;
  loginId!: any;
  department!: any;
  assignToPage: any;
  datarr: any[] = [];
  recrData: Recruiter[] = [];
  entity: any[] = [];
  totalItems: any;
  selectedRecruiterType: string | null = null;
  isRejected: boolean = false;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();

  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum!: any;
  field = 'empty';
  companyType: string = '';

  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.loginId = localStorage.getItem('userid');
    this.department = localStorage.getItem('department');
    this.AssignedPageNum = localStorage.getItem('rnum');
    this.getAllRecruiters();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  /**
   * get all recruiter data
   * @returns recruiter data
   */
  getAllRecruiters(pageNumber = 1) {
    return this.recruiterServ
      .getAllRecruitersPagination(
        this.hasAcces,
        this.loginId,
        pageNumber,
        this.pageSize,
        this.field
      )
      .subscribe((response: any) => {
        this.datarr = response.data.content;
        this.dataSource.data = response.data.content;
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
        this.totalItems = response.data.totalElements;
      });
  }
  gty(page: any) {
    this.assignToPage = page;
    return this.recruiterServ
      .getAllRecruitersPagination(
        this.hasAcces,
        this.loginId,
        page,
        this.itemsPerPage,
        this.field
      )
      .subscribe((response: any) => {
        this.datarr = response.data.content;
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = i + 1;
        });
        this.totalItems = response.data.totalElements;
      });
  }

  /**
   * on filter
   * @param event
   */
  onFilter(event: any) {
    this.dataSource.filter = event.target.value;
  }

  applyFilter(event: any) {
    const keyword = event.target.value;
    this.field = keyword;
    if (keyword != '') {
      return this.recruiterServ
        .getAllRecruitersPagination(
          this.hasAcces,
          this.loginId,
          1,
          this.pageSize,
          keyword
        )
        .subscribe((response: any) => {
          this.datarr = response.data.content;
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
    return this.getAllRecruiters(this.currentPageIndex + 1);
  }

  /**
   * Sort
   * @param event
   */
  onSort(event: Sort) {
    const sortDirection = event.direction;
    const activeSortHeader = event.active;

    if (sortDirection === '' || !activeSortHeader) {
      return;
    }

    const isAsc = sortDirection === 'asc';
    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      const serialNumA = (a.serialNum || '').toString();
      const serialNumB = (b.serialNum || '').toString();
      switch (activeSortHeader) {
        case 'SerialNum':
          return (isAsc ? 1 : -1) * serialNumA.localeCompare(serialNumB);
        case 'Company':
          return (
            (isAsc ? 1 : -1) * (a.company || '').localeCompare(b.company || '')
          );
        case 'RecruiterName':
          return (
            (isAsc ? 1 : -1) *
            (a.recruiter || '').localeCompare(b.recruiter || '')
          );
        case 'PhoneNumber':
          return (
            (isAsc ? 1 : -1) *
            (a.usnumber || '').localeCompare(b.usnumber || '')
          );
        case 'Email':
          return (
            (isAsc ? 1 : -1) * (a.email || '').localeCompare(b.email || '')
          );
        case 'AddedBy':
          return (
            (isAsc ? 1 : -1) *
            (a.pseudoname || '').localeCompare(b.pseudoname || '')
          );
        case 'AddedOn':
          return (
            (isAsc ? 1 : -1) *
            (a.createddate || '').localeCompare(b.createddate || '')
          );
        case 'LastUpdated':
          return (
            (isAsc ? 1 : -1) *
            (a.updateddate || '').localeCompare(b.updateddate || '')
          );
        // case 'Status':
        //   return (
        //     (isAsc ? 1 : -1) * (a.status || '').localeCompare(b.status || '')
        //   );
        case 'Approve/Reject':
          return (
            (isAsc ? 1 : -1) *
            (a.rec_stat || '').localeCompare(b.rec_stat || '')
          );
        default:
          return 0;
      }
    });
  }

  // uploadRecruiterExcel() {
  //   const actionData = {
  //     title: 'Upload Recruiter',
  //     vendorData: null,
  //     actionName: 'upload-recruiter',
  //   };
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = '65vw';
  //   // dialogConfig.height = "100vh";
  //   dialogConfig.disableClose = false;
  //   dialogConfig.panelClass = 'upload-recruiter';
  //   dialogConfig.data = actionData;

  //   this.dialogServ.openDialogWithComponent(UploadRecuiterExcelComponent, dialogConfig);
  // }

  /**
   * add
   * @param recruiter
   */
  addRecruiter() {
    const actionData = {
      title: 'Add Recruiter',
      recruiterData: null,
      actionName: 'add-recruiter',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    //dialogConfig.height = "100vh";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-recruiter';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddRecruiterComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAllRecruiters(this.currentPageIndex + 1);
      }
    });
  }
  /**
   * edit
   * @param recruiter
   */
  editRecruiter(recruiter: any) {
    const actionData = {
      title: 'Update Recruiter',
      recruiterData: recruiter,
      actionName: 'edit-recruiter',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    //dialogConfig.height = '100vh';
    dialogConfig.panelClass = 'edit-recruiter';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddRecruiterComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAllRecruiters(this.currentPageIndex + 1);
      }
    });
  }

  /**
   * delete
   * @param recruiter
   */
  deleteRecruiter(recruiter: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: recruiter,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'delete-recruiter';
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );

    // call delete api after  clicked 'Yes' on dialog click
    dialogRef.afterClosed().subscribe({
      next: () => {
        if (dialogRef.componentInstance.allowAction) {
          const dataToBeSentToSnackBar: ISnackBarData = {
            message: 'Status updated successfully!',
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-success'],
          };

          this.recruiterServ
            .deleteEntity(recruiter.id)
            .subscribe((response: any) => {
              if (response.status == 'success') {
                this.getAllRecruiters(this.currentPageIndex + 1);
                dataToBeSentToSnackBar.message =
                  'Recruiter Deleted successfully';
              } else {
                dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                dataToBeSentToSnackBar.message = 'Record Deletion failed';
              }
              this.snackBarServ.openSnackBarFromComponent(
                dataToBeSentToSnackBar
              );
            });
        }
      },
    });
  }

  /**
   * on status update
   * @param recruiter
   */
  onStatusUpdate(recruiter: any) {
    const dataToBeSentToDailog = {
      title: 'Status Update',
      updateText:
        recruiter.status !== 'Active' ? 'activating' : 'in-activating',
      type: 'Recruiter',
      buttonText: 'Update',
      actionData: recruiter,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'update-recruiter-status';
    dialogConfig.data = dataToBeSentToDailog;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      StatusComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe({
      next: () => {
        if (dialogRef.componentInstance.submitted) {
          const dataToBeSentToSnackBar: ISnackBarData = {
            message: 'Status updated successfully!',
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-success'],
          };
          recruiter.remarks = dialogRef.componentInstance.remarks;
          this.recruiterServ
            .changeStatus2(recruiter.id, recruiter.status, recruiter.remarks)
            .subscribe((response: any) => {
              if (response.status == 'Success') {
                this.gty(this.page);
                dataToBeSentToSnackBar.message = 'Status updated successfully';
              } else {
                dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                dataToBeSentToSnackBar.message = 'Status update failed';
              }
              this.snackBarServ.openSnackBarFromComponent(
                dataToBeSentToSnackBar
              );
            });
        }
      },
    });
  }

  // approve initiate reject

  onApproveOrRejectRecruiter(recruiter: any, rejectRecruiter = false) {
    if (recruiter.rec_stat !== 'Approved') {
      const dataToBeSentToSnackBar: ISnackBarData = {
        message: 'Status updated successfully!',
        duration: 1500,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        direction: 'above',
        panelClass: ['custom-snack-success'],
      };
      if (this.department == recruiter.ctype) {
        // alertify.error("Your not Authorized to approve the Vendor");
        dataToBeSentToSnackBar.message =
          'You are not Authorized to approve the Recruiter';
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        return;
      }
      let dataToBeSentToDailogForReject,
        dataToBeSentToDailogForStatus = {};
      if (recruiter.rec_stat === 'Initiated' && !rejectRecruiter) {
        dataToBeSentToDailogForStatus = {
          title: 'Approve Recruiter',
          message: 'Are you sure you want to Approve the Recruiter ?',
          confirmText: 'Yes',
          cancelText: 'No',
          actionData: recruiter,
        };
      } else {
        dataToBeSentToDailogForReject = {
          title: 'Reject Recruiter',
          updateText: 'rejecting',
          type: 'Recruiter',
          buttonText: 'Update',
          actionData: recruiter,
        };
      }

      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = 'fit-content';
      dialogConfig.height = 'auto';
      dialogConfig.disableClose = false;
      dialogConfig.panelClass = `${
        recruiter.rec_stat == 'Initiated' && !rejectRecruiter
          ? 'approve'
          : 'reject'
      }-recruiter`;
      const isApprove =
        recruiter.rec_stat == 'Initiated' && !rejectRecruiter
          ? dataToBeSentToDailogForStatus
          : dataToBeSentToDailogForReject;
      dialogConfig.data = isApprove;
      const dialogRef = this.dialogServ.openDialogWithComponent(
        recruiter.rec_stat == 'Initiated' && !rejectRecruiter
          ? ConfirmComponent
          : StatusComponent,
        dialogConfig
      );

      const statReqObj = {
        action:
          recruiter.rec_stat === 'Initiated' && !rejectRecruiter
            ? 'Approved'
            : 'Reject',
        id: recruiter.id,
        userid: this.loginId,
       // remarks: dialogRef.componentInstance.remarks,
      };
      dialogRef.afterClosed().subscribe(() => {
        if (dialogRef.componentInstance.allowAction) {
          this.recruiterServ
            .approveORRejectRecruiter(
              {...statReqObj, remarks: dialogRef.componentInstance.remarks},
              statReqObj.action as 'Approved' | 'Reject'
            )
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
              next: (response: any) => {
                if (response.status == 'success') {
                  // dataToBeSentToSnackBar.message = `Recruiter ${response.data} successfully`;
                  const message = response.message.includes('Change')
                    ? 'Recruiter Approved sucssessfully'
                    : response.message;
                  dataToBeSentToSnackBar.message = message;
                  dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
                } else {
                  //  alertify.success("Recruiter " + response.data + " successfully");
                  dataToBeSentToSnackBar.message = 'Status update failed';
                  dataToBeSentToSnackBar.panelClass = ['custom-snack-failed'];
                }
                this.snackBarServ.openSnackBarFromComponent(
                  dataToBeSentToSnackBar
                );
                this.getAllRecruiters(this.currentPageIndex + 1);
              },
              error: (err) => {
                dataToBeSentToSnackBar.message = err.message;
                dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                this.snackBarServ.openSnackBarFromComponent(
                  dataToBeSentToSnackBar
                );
              },
            });
        }
      });

      // after closing popup
    }
    return;
  }

  getRecruiterRowClass(row: any) {
    const recruitertype = row.recruitertype;
    if (recruitertype === 'Recruiter') {
      return 'technical-recruiter';
    } else if (recruitertype === 'Bench Sales') {
      return 'bench-sales-recruiter';
    } else if (recruitertype === 'Both') {
      return 'both-recruiters';
    } else {
      return '';
    }
  }

  filterRecruiters(recruiterType: string | null): void {
    if (recruiterType) {
      const filteredData = this.datarr.filter(
        (recruiter) => recruiter.recruitertype === recruiterType
      );
      this.dataSource.data = filteredData;
    } else {
      this.dataSource.data = this.datarr;
    }
  }
  /**
   *
   * @param index
   * @returns serial number
   */
  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }
  /**
   * handle page event - pagination
   * @param event
   */
  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      const currentPageIndex = event.pageIndex;
      this.currentPageIndex = currentPageIndex;
      if(this.companyType) {
        this.getAllVendorByType(this.companyType, event.pageIndex + 1)
        return
      }
      this.getAllRecruiters(event.pageIndex + 1);
    }
    return;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  getAllVendorByType(type: string, pageIndex = 0) {
    this.companyType = type;
    const page = pageIndex ?  pageIndex : this.page;
    this.recruiterServ.getAllVendorByType( this.hasAcces,this.loginId, page,this.pageSize, type, this.field).subscribe(
      (response: any) => {
        this.dataSource.data = response.data.content
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
        this.totalItems = response.data.totalElements;
      })
  }

  goToUserInfo(id: number){
    this.router.navigate(['usit/user-info',id])
  }
}
