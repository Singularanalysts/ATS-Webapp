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
import { VendorService } from 'src/app/usit/services/vendor.service';
// import { AddVendorComponent } from './add-vendor/add-vendor.component';
// import { VendorCompanyRecInfoComponent } from './vendor-company-rec-info/vendor-company-rec-info.component';
import { UploadVmsExcelComponent } from '../recruiter-list/upload-vms-excel/upload-vms-excel.component';
import { AddVendorComponent } from '../vendor-list/add-vendor/add-vendor.component';
import { AddCurrentPrimaryVendorComponent } from './add-current-primary-vendor/add-current-primary-vendor.component';
import { ConfirmWithRadioButtonComponent } from 'src/app/dialogs/confirm-with-radio-button/confirm-with-radio-button.component';
import { IConfirmRadioDialogData } from 'src/app/dialogs/models/confirm-dialog-with-radio-data';
import { VendorCompanyRecInfoComponent } from '../vendor-list/vendor-company-rec-info/vendor-company-rec-info.component';


@Component({
  selector: 'app-current-primary-vendor-list',
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
  templateUrl: './current-primary-vendor-list.component.html',
  styleUrls: ['./current-primary-vendor-list.component.scss']
})
export class CurrentPrimaryVendorListComponent implements OnInit {
  dataTableColumns: string[] = [
    'SerialNum',
    'Company',
    'HeadQuarter',
    //'Fed-Id',
    'VendorType',
    'TierType',
    'AddedBy',
    'AddedOn',
    'LastUpdated',
    // 'Status',
    'Action',
    'ApproveOrReject',
  ];
  dataSource = new MatTableDataSource<any>([]);
  // paginator
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cdr = inject(PaginatorIntlService);
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private vendorServ = inject(VendorService);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);

  hasAcces!: any;
  loginId!: any;
  department!: any;
  assignToPage: any;
  datarr: any[] = [];
  recrData: Recruiter[] = [];
  entity: any[] = [];
  totalItems: number = 0;
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  // AssignedPageNum!: any;
  field = 'empty';
  isRejected: boolean = false;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  companyType: string = '';
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };

  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.loginId = localStorage.getItem('userid');
    this.department = localStorage.getItem('department');
    // this.AssignedPageNum = localStorage.getItem('vnum');
    //this.getall();
    // if (this.AssignedPageNum == null) {
    //   this.getAllData();
    // } else {
    //   this.gty(this.AssignedPageNum);
    //   this.page = this.AssignedPageNum;
    // }
    this.getAllData();

    // this.getAllVendors();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }
  getAllData(currentPageIndex = 1) {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    return this.vendorServ
      .getAllCurrentOrFuturePrimaryVendorByPagination(
        'Current Primary Vendor',
        currentPageIndex,
        this.pageSize,
        this.field,
        this.sortField,
        this.sortOrder
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.datarr = response.data.content;
          this.dataSource.data = response.data.content;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
          this.totalItems = response.data.totalElements;
        },
        error: (err) => {
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          dataToBeSentToSnackBar.message = err.message;
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  /**
   * get all vendor data
   * @returns vendor data
   */
  getAllVendors() {
    return this.vendorServ
      .getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          if (response.data) {
            // this.dataSource.data = response.data;
          }
        },
        error: (err) => {
          const dataToBeSentToSnackBar: ISnackBarData = {
            message: '',
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-failure'],
          };
          dataToBeSentToSnackBar.message = err.message;
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  /**
   * on filter
   * @param event
   */
  onFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();
  }
  applyFilter(event: any) {
    const keyword = event.target.value;
    this.field = keyword;
    if (keyword != '') {
      return this.vendorServ
        .getAllCurrentOrFuturePrimaryVendorByPagination(
          'Current Primary Vendor',
          1,
          this.pageSize,
          keyword,
          this.sortField,
          this.sortOrder
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
    return this.getAllData(this.currentPageIndex + 1);
  }

  /**
   * Sort
   * @param event
   */
  sortField = 'updateddate';
  sortOrder = 'desc';
  onSort(event: Sort) {
    //console.log(event);
    //this.sortField = event.active;
    if (event.active == 'SerialNum')
      this.sortField = 'updateddate'
    else
      this.sortField = event.active;
    
      this.sortOrder = event.direction;
    
    if (event.direction != ''){
    ///this.sortOrder = event.direction;
    this.getAllData();
    }
  }
  /**uplload
   *
   */
  uploadVendor() { }

  /**
   * go to company-info
   */
  goToCompanyRecInfo(element: any) {
    const actionData = {
      title: `${element.company} Recruiter's`,
      id: element.id,
      actionName: 'vendor-rec-company-info',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'vendor-rec-company-info';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      VendorCompanyRecInfoComponent,
      dialogConfig
    );
  }

  /**
   * add
   */
  addVendor() {
    const actionData = {
      title: 'Add Current Primary Vendor  ',
      vendorData: null,
      actionName: 'add-current-primary-vendor',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-current-primary-vendor';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddCurrentPrimaryVendorComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAllData(this.currentPageIndex + 1);
      }
    });
  }
  /**
   * edit
   * @param endor
   */
  editVendor(vendor: any) {
    const actionData = {
      title: 'Update Current Primary Vendor',
      vendorData: vendor,
      actionName: 'edit-current-primary-vendor',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.panelClass = 'edit-current-primary-vendor';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddCurrentPrimaryVendorComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAllData(this.currentPageIndex + 1);
      }
    });
  }
  /**
   * delete
   * @param vendor
   */
  deleteVendor(vendor: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: vendor,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = 'fit-content';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'delete-vendor';
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

          this.vendorServ
            .deleteEntity(vendor.id)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
              next: (response: any) => {
                if (response.status == 'success') {
                  this.getAllData(this.currentPageIndex + 1);
                  dataToBeSentToSnackBar.message =
                    'Vendor Deleted successfully';
                } else {
                  dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                  dataToBeSentToSnackBar.message = response.message;
                }
                this.snackBarServ.openSnackBarFromComponent(
                  dataToBeSentToSnackBar
                );
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
      },
    });
  }
  /**
   * on status update
   * @param vendor
   */
  onStatusUpdate(vendor: any) {
    const dataToBeSentToDailog = {
      title: 'Status Update',
      updateText: vendor.status !== 'Active' ? 'activating' : 'in-activating',
      type: 'Vendor',
      buttonText: 'Update',
      actionData: vendor,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'update-vendor-status';
    dialogConfig.data = dataToBeSentToDailog;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      StatusComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe({
      next: (resp) => {
        if (dialogRef.componentInstance.submitted) {
          const dataToBeSentToSnackBar: ISnackBarData = {
            message: 'Status updated successfully!',
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-success'],
          };
          vendor.remarks = dialogRef.componentInstance.remarks;
          this.vendorServ
            .changeStatus2(vendor.id, vendor.status, vendor.remarks)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
              next: (response: any) => {
                if (response.status == 'Success') {
                  // this.gty(this.page);
                  this.getAllData(this.currentPageIndex + 1);
                  dataToBeSentToSnackBar.message =
                    'Status updated successfully';
                } else {
                  dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                  dataToBeSentToSnackBar.message = 'Status update failed';
                }
                this.snackBarServ.openSnackBarFromComponent(
                  dataToBeSentToSnackBar
                );
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
      },
    });
  }

  // approve initiate reject
  //public action(id: number, ctype: string, action: string) {
  onApproveOrRejectVMS(vendor: any, rejectVendor = false) {
    this.isRejected = rejectVendor;
    if (vendor.vms_stat !== 'Approved') {
      const dataToBeSentToSnackBar: ISnackBarData = {
        message: 'Status updated successfully!',
        duration: 1500,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        direction: 'above',
        panelClass: ['custom-snack-success'],
      };
      if (this.department == vendor.ctype) {
        // alertify.error("Your not Authorized to approve the Vendor");
        dataToBeSentToSnackBar.message =
          'You are not Authorized to approve the Vendor';
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        return;
      }
      let dataToBeSentToDailogForReject,
        dataToBeSentToDailogForStatus = {};
      if (vendor.vms_stat === 'Initiated' && !rejectVendor) {
        dataToBeSentToDailogForStatus = {
          title: 'Approve Vendor',
          message: 'Are you sure you want to Approve the Vendor?',
          confirmText: 'Yes',
          cancelText: 'No',
          actionData: vendor,
        };
      } else {
        dataToBeSentToDailogForReject = {
          title: 'Reject Vendor',
          updateText: 'rejecting',
          type: 'Vendor',
          buttonText: 'Update',
          actionData: vendor,
        };
      }

      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = 'fit-content';
      dialogConfig.height = 'auto';
      dialogConfig.disableClose = false;
      dialogConfig.panelClass = `${vendor.vms_stat == 'Initiated' && !rejectVendor ? 'approve' : 'reject'
        }-vendor`;
      const isApprove =
        vendor.vms_stat == 'Initiated' && !rejectVendor
          ? dataToBeSentToDailogForStatus
          : dataToBeSentToDailogForReject;
      dialogConfig.data = isApprove;
      const dialogRef = this.dialogServ.openDialogWithComponent(
        vendor.vms_stat == 'Initiated' && !rejectVendor
          ? ConfirmComponent
          : StatusComponent,
        dialogConfig
      );

      const statReqObj = {
        action:
          vendor.vms_stat === 'Initiated' && !rejectVendor
            ? 'Approved'
            : 'Reject',
        id: vendor.id,
        userid: this.loginId,
        // remarks: dialogRef.componentInstance.remarks
      };
      dialogRef.afterClosed().subscribe(() => {
        if (dialogRef.componentInstance.allowAction) {
          this.vendorServ
            .approveORRejectVendor(
              { ...statReqObj, remarks: dialogRef.componentInstance.remarks },
              statReqObj.action as 'Approved' | 'Reject'
            )
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
              next: (response: any) => {
                if (response.status == 'success') {
                  const message = response.message.includes('Change')
                    ? 'Vendor Approved sucssessfully'
                    : response.message;
                  dataToBeSentToSnackBar.message = message;
                  dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
                } else {
                  dataToBeSentToSnackBar.message = 'Status update failed';
                  dataToBeSentToSnackBar.panelClass = ['custom-snack-failed'];
                }
                this.snackBarServ.openSnackBarFromComponent(
                  dataToBeSentToSnackBar
                );

                // this.gty(this.page);
                this.getAllData(this.currentPageIndex + 1);
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

  /**
   * handle page event - pagination
   * @param endor
   */
  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      const currentPageIndex = event.pageIndex;
      this.currentPageIndex = currentPageIndex;
      if (this.companyType) {
        this.getAllVendorByType(this.companyType, event.pageIndex + 1)
        return
      }
      this.getAllData(event.pageIndex + 1);
    }
    return;
  }

  getVendorRowClass(row: any) {
    const companytype = row.companytype;
    if (companytype === 'Recruiting') {
      return 'recruiting-companies';
    } else if (companytype === 'Bench Sales') {
      return 'bench-sales-recruiter';
    } else if (companytype === 'Both') {
      return 'both';
    } else {
      return '';
    }
  }

  filterVendors(vendorType: string | null): void {
    if (vendorType) {
      const filteredData = this.datarr.filter(
        (vendor) => vendor.companytype === vendorType
      );
      this.dataSource.data = filteredData;
    } else {
      this.dataSource.data = this.datarr;
    }
  }
  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }
  /** clean up subscriptions */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  getAllVendorByType(type: string, pageIndex = 0) {
    this.companyType = type;
    const page = pageIndex ? pageIndex : this.page;
    this.vendorServ.getAllVendorByType(this.hasAcces, this.loginId, page, this.pageSize, type, this.field).subscribe(
      (response: any) => {
        this.dataSource.data = response.data.content
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
        this.totalItems = response.data.totalElements;
      })
  }

  goToUserInfo(id: any) {
    this.router.navigate(['usit/user-info', 'vendor', id])
  }

  uploadVmsExcelData() {
    const actionData = {
      title: 'VMS Data Upload',
      vendorData: null,
      userId: this.loginId,
      actionName: 'upload-vendor-and-recruiter',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '85vw';
    dialogConfig.height = '80vh';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'upload-recruiter';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(UploadVmsExcelComponent, dialogConfig);
  }

  moveVendorToVendorOrFpv(vendor: any) {
    const dataToBeSentToDailog: Partial<IConfirmRadioDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to move Vendor to Vendor/FPV ?',
      radioButtons: ['Future Primary Vendor', 'Primary Vendor', 'Implementation Partner', 'Client', 'Tier'],
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: vendor,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = 'fit-content';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmWithRadioButtonComponent,
      dialogConfig
    );
    // call moveToSales api after  clicked 'Yes' on dialog click

    dialogRef.afterClosed().subscribe({
      next: (selectedOption: string) => {
        if (dialogRef.componentInstance.allowAction) {
          this.vendorServ
            .moveToCPVOrFPV(
              selectedOption,
              vendor.id,
              this.loginId
            )
            .subscribe((resp: any) => {
              if (resp.status == 'success') {
                this.dataToBeSentToSnackBar.panelClass = [
                  'custom-snack-success',
                ];
                this.dataToBeSentToSnackBar.message = resp.message ;

              } else {
                this.dataToBeSentToSnackBar.panelClass = [
                  'custom-snack-failure',
                ];
                this.dataToBeSentToSnackBar.message = resp.message;
              }
              this.snackBarServ.openSnackBarFromComponent(
                this.dataToBeSentToSnackBar
              );
              this.getAllData(this.currentPageIndex + 1);
            });
        }
      },
    });

  }
}
