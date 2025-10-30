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
import { UploadVmsExcelComponent } from '../recruiter-list/upload-vms-excel/upload-vms-excel.component';
import { ConfirmWithRadioButtonComponent } from 'src/app/dialogs/confirm-with-radio-button/confirm-with-radio-button.component';
import { IConfirmRadioDialogData } from 'src/app/dialogs/models/confirm-dialog-with-radio-data';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { AddViewEmployeeDataComponent } from '../add-view-employee-data/add-view-employee-data.component';
@Component({
  selector: 'app-view-employee-data',
  templateUrl: './view-employee-data.component.html',
  styleUrls: ['./view-employee-data.component.scss'],
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
    MatTabsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})

export class ViewEmployeeDataComponent {
  dataTableColumns: string[] = [
    'SerialNum',
    'fiscalYear',
    'employeeName',
    'taxId',
    'industryCode',
    'petitionerCity',
    'petitionerState',
    'petitionerZipCode',
    'newEmploymentApproval',
    'newEmploymentDenial',
    'continuationApproval',
    'continuationDenial',
    'changewithSameEmployerApproval',
    'changewithSameEmployerDenial',
    'newConcurrentApproval',
    'newConcurrentDenial',
    'changeofEmployerApproval',
    'changeofEmployerDenial',
    'amendedApproval',
    'amendedDenial'
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
  role!: any;
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
  // tabs = ['All', 'USA', 'UAE'];
  tabs = ['USA'];
  status = 'all';
  pageIndices: { [key: string]: number } = { all: 0, usa: 0, uae: 0 };
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAllData(1, 'all'); // Pass companyName for filtering

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getAllData(pageNumber = 1, status: string = 'all') {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    const pagObj = {
      pageNumber: pageNumber,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field,

    }
  
    return this.vendorServ
      .geth1bemployeedata(
        pagObj
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
   * apply filter
   * @param event
   */
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
      }
      return this.vendorServ
        .geth1bemployeedata(
          pagObj
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
    return this.getAllData(this.currentPageIndex + 1, this.status);
  }

  /**
   * Sort
   * @param event
   */
  sortField = 'updateddate';
  sortOrder = 'desc';
  onSort(event: Sort) {
    if (event.active == 'SerialNum')
      this.sortField = 'updateddate'
    else
      this.sortField = event.active;

    this.sortOrder = event.direction;

    if (event.direction != '') {
      this.getAllData();
    }
  }


  /**
   * add
   */
  // addVendor() {
  //   const actionData = {
  //     title: 'Add H1B Employee Data Hub',
  //     vendorData: null,
  //     actionName: 'add-vendor',
  //   };
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = '62dvw';
  //   dialogConfig.disableClose = false;
  //   dialogConfig.panelClass = 'add-vendor';
  //   dialogConfig.data = actionData;
  //   const dialogRef = this.dialogServ.openDialogWithComponent(
  //     AddViewEmployeeDataComponent,
  //     dialogConfig
  //   );

  //   dialogRef.afterClosed().subscribe(() => {
  //     if (dialogRef.componentInstance.submitted) {
  //       this.getAllData(this.currentPageIndex + 1, this.status);
  //     }
  //   });
  // }

  /**
   * edit
   * @param endor
   */
  // editVendor(vendor: any) {
  //   const actionData = {
  //     title: 'Update H1B Employee Data Hub',
  //     vendorData: vendor,
  //     actionName: 'edit-vendor',
  //   };
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = '65vw';
  //   dialogConfig.panelClass = 'edit-vendor';
  //   dialogConfig.data = actionData;
  //   const dialogRef = this.dialogServ.openDialogWithComponent(
  //     AddViewEmployeeDataComponent,
  //     dialogConfig
  //   );

  //   dialogRef.afterClosed().subscribe(() => {
  //     if (dialogRef.componentInstance.submitted) {
  //       this.getAllData(this.currentPageIndex + 1, this.status);
  //     }
  //   });
  // }

  /**
   * delete
   * @param vendor
   */
  // deleteVendor(vendor: any) {
  //   const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
  //     title: 'Confirmation',
  //     message: 'Are you sure you want to delete?',
  //     confirmText: 'Yes',
  //     cancelText: 'No',
  //     actionData: vendor,
  //   };
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = 'fit-content';
  //   dialogConfig.height = 'auto';
  //   dialogConfig.disableClose = false;
  //   dialogConfig.panelClass = 'delete-vendor';
  //   dialogConfig.data = dataToBeSentToDailog;
  //   const dialogRef = this.dialogServ.openDialogWithComponent(
  //     ConfirmComponent,
  //     dialogConfig
  //   );

  //   // call delete api after  clicked 'Yes' on dialog click
  //   dialogRef.afterClosed().subscribe({
  //     next: (resp) => {
  //       if (dialogRef.componentInstance.allowAction) {
  //         const dataToBeSentToSnackBar: ISnackBarData = {
  //           message: '',
  //           duration: 1500,
  //           verticalPosition: 'top',
  //           horizontalPosition: 'center',
  //           direction: 'above',
  //           panelClass: ['custom-snack-success'],
  //         };

  //         this.vendorServ
  //           .deleteEntity(vendor.id)
  //           .pipe(takeUntil(this.destroyed$))
  //           .subscribe({
  //             next: (response: any) => {
  //               if (response.status == 'success') {
  //                 this.getAllData(this.currentPageIndex + 1, this.status);
  //                 dataToBeSentToSnackBar.message =
  //                   'Vendor Deleted successfully';
  //               } else {
  //                 dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
  //                 dataToBeSentToSnackBar.message = response.message;
  //               }
  //               this.snackBarServ.openSnackBarFromComponent(
  //                 dataToBeSentToSnackBar
  //               );
  //             },
  //             error: (err) => {
  //               dataToBeSentToSnackBar.message = err.message;
  //               dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
  //               this.snackBarServ.openSnackBarFromComponent(
  //                 dataToBeSentToSnackBar
  //               );
  //             },
  //           });
  //       }
  //     },
  //   });
  // }

  /**
   * on status update
   * @param vendor
   */
  // onStatusUpdate(vendor: any) {
  //   const dataToBeSentToDailog = {
  //     title: 'Status Update',
  //     updateText: vendor.status !== 'Active' ? 'activating' : 'in-activating',
  //     type: 'Vendor',
  //     buttonText: 'Update',
  //     actionData: vendor,
  //   };
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = '400px';
  //   dialogConfig.height = 'auto';
  //   dialogConfig.disableClose = false;
  //   dialogConfig.panelClass = 'update-vendor-status';
  //   dialogConfig.data = dataToBeSentToDailog;

  //   const dialogRef = this.dialogServ.openDialogWithComponent(
  //     StatusComponent,
  //     dialogConfig
  //   );

  //   dialogRef.afterClosed().subscribe({
  //     next: (resp) => {
  //       if (dialogRef.componentInstance.submitted) {
  //         const dataToBeSentToSnackBar: ISnackBarData = {
  //           message: 'Status updated successfully!',
  //           duration: 1500,
  //           verticalPosition: 'top',
  //           horizontalPosition: 'center',
  //           direction: 'above',
  //           panelClass: ['custom-snack-success'],
  //         };
  //         vendor.remarks = dialogRef.componentInstance.remarks;
  //         this.vendorServ
  //           .changeStatus2(vendor.id, vendor.status, vendor.remarks)
  //           .pipe(takeUntil(this.destroyed$))
  //           .subscribe({
  //             next: (response: any) => {
  //               if (response.status == 'Success') {
  //                 this.getAllData(this.currentPageIndex + 1, this.status);
  //                 dataToBeSentToSnackBar.message =
  //                   'Status updated successfully';
  //               } else {
  //                 dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
  //                 dataToBeSentToSnackBar.message = 'Status update failed';
  //               }
  //               this.snackBarServ.openSnackBarFromComponent(
  //                 dataToBeSentToSnackBar
  //               );
  //             },
  //             error: (err) => {
  //               dataToBeSentToSnackBar.message = err.message;
  //               dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
  //               this.snackBarServ.openSnackBarFromComponent(
  //                 dataToBeSentToSnackBar
  //               );
  //             },
  //           });
  //       }
  //     },
  //   });
  // }

  // onApproveOrRejectVMS(vendor: any, rejectVendor = false) {
  //   this.isRejected = rejectVendor;
  //   if (vendor.vms_stat !== 'Approved') {
  //     const dataToBeSentToSnackBar: ISnackBarData = {
  //       message: 'Status updated successfully!',
  //       duration: 1500,
  //       verticalPosition: 'top',
  //       horizontalPosition: 'center',
  //       direction: 'above',
  //       panelClass: ['custom-snack-success'],
  //     };
  //     if (this.department == vendor.ctype) {
  //       dataToBeSentToSnackBar.message =
  //         'You are not Authorized to approve the Vendor';
  //       dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
  //       this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
  //       return;
  //     }
  //     let dataToBeSentToDailogForReject,
  //       dataToBeSentToDailogForStatus = {};
  //     if (vendor.vms_stat === 'Initiated' && !rejectVendor) {
  //       dataToBeSentToDailogForStatus = {
  //         title: 'Approve Vendor',
  //         message: 'Are you sure you want to Approve the Vendor?',
  //         confirmText: 'Yes',
  //         cancelText: 'No',
  //         actionData: vendor,
  //       };
  //     } else {
  //       dataToBeSentToDailogForReject = {
  //         title: 'Reject Vendor',
  //         updateText: 'rejecting',
  //         type: 'Vendor',
  //         buttonText: 'Update',
  //         actionData: vendor,
  //       };
  //     }

  //     const dialogConfig = new MatDialogConfig();
  //     dialogConfig.width = 'fit-content';
  //     dialogConfig.height = 'auto';
  //     dialogConfig.disableClose = false;
  //     dialogConfig.panelClass = `${vendor.vms_stat == 'Initiated' && !rejectVendor ? 'approve' : 'reject'
  //       }-vendor`;
  //     const isApprove =
  //       vendor.vms_stat == 'Initiated' && !rejectVendor
  //         ? dataToBeSentToDailogForStatus
  //         : dataToBeSentToDailogForReject;
  //     dialogConfig.data = isApprove;
  //     const dialogRef = this.dialogServ.openDialogWithComponent(
  //       vendor.vms_stat == 'Initiated' && !rejectVendor
  //         ? ConfirmComponent
  //         : StatusComponent,
  //       dialogConfig
  //     );

  //     const statReqObj = {
  //       action:
  //         vendor.vms_stat === 'Initiated' && !rejectVendor
  //           ? 'Approved'
  //           : 'Reject',
  //       id: vendor.id,
  //       userid: this.loginId,
  //     };
  //     dialogRef.afterClosed().subscribe(() => {
  //       if (dialogRef.componentInstance.allowAction) {
  //         this.vendorServ
  //           .approveORRejectVendor(
  //             { ...statReqObj, remarks: dialogRef.componentInstance.remarks },
  //             statReqObj.action as 'Approved' | 'Reject'
  //           )
  //           .pipe(takeUntil(this.destroyed$))
  //           .subscribe({
  //             next: (response: any) => {
  //               if (response.status == 'success') {
  //                 const message = response.message.includes('Change')
  //                   ? 'Vendor Approved sucssessfully'
  //                   : response.message;
  //                 dataToBeSentToSnackBar.message = message;
  //                 dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
  //               } else {
  //                 dataToBeSentToSnackBar.message = 'Status update failed';
  //                 dataToBeSentToSnackBar.panelClass = ['custom-snack-failed'];
  //               }
  //               this.snackBarServ.openSnackBarFromComponent(
  //                 dataToBeSentToSnackBar
  //               );

  //               this.getAllData(this.currentPageIndex + 1, this.status);
  //             },
  //             error: (err) => {
  //               dataToBeSentToSnackBar.message = err.message;
  //               dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
  //               this.snackBarServ.openSnackBarFromComponent(
  //                 dataToBeSentToSnackBar
  //               );
  //             },
  //           });
  //       }
  //     });
  //   }
  //   return;
  // }

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
        this.getAllVendorByType(this.companyType, event.pageIndex + 1);
        return;
      }
      this.getAllData(event.pageIndex + 1, this.status);
    }
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
    this.vendorServ.getAllVendorByType(this.role, this.loginId, page, this.pageSize, type, this.field).subscribe(
      (response: any) => {
        this.dataSource.data = response.data.content
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
        this.totalItems = response.data.totalElements;
      })
  }

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  const userId = Number(localStorage.getItem('userid'));

  const snackData: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success']
  };

  this.vendorServ.employeeh1bimport(formData, userId).subscribe({
    next: (response: any) => {
      snackData.message = response?.message || 'File imported successfully!';
      snackData.panelClass = ['custom-snack-success'];
      this.snackBarServ.openSnackBarFromComponent(snackData);

      // Clear file input
      event.target.value = '';

      // ✅ Refresh table automatically
      this.getAllData();
    },
    error: (err) => {
      snackData.message = err?.error?.message || 'File upload failed. Please try again.';
      snackData.panelClass = ['custom-snack-failure'];
      this.snackBarServ.openSnackBarFromComponent(snackData);

      // Clear file input
      event.target.value = '';
    }
  });
}

  // uploadVmsExcelData() {
  //   const actionData = {
  //     title: 'VMS Data Upload',
  //     vendorData: null,
  //     userId: this.loginId,
  //     actionName: 'upload-vendor-and-recruiter',
  //   };
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = '85vw';
  //   dialogConfig.height = '80vh';
  //   dialogConfig.disableClose = false;
  //   dialogConfig.panelClass = 'upload-recruiter';
  //   dialogConfig.data = actionData;
  //   this.dialogServ.openDialogWithComponent(UploadVmsExcelComponent, dialogConfig);
  // }

  // moveVendorToCpvOrFpv(vendor: any) {
  //   // Define available options
  //   let message = 'Are you sure you want to move Vendor to CPV/FPV/Blacklisted ?';
  //   let radioButtons = ['Current Primary Vendor', 'Future Primary Vendor', 'Blacklisted'];

  //   // If the vendor status is "Initiated", only show the "Blacklisted" option and update the message
  //   if (vendor.vms_stat === 'Initiated') {
  //     message = 'Are you sure you want to move Vendor to Blacklisted?';
  //     radioButtons = ['Blacklisted']; // Remove CPV & FPV options
  //   }

  //   const dataToBeSentToDailog: Partial<IConfirmRadioDialogData> = {
  //     title: 'Confirmation',
  //     message: message,
  //     radioButtons: radioButtons,  // Use the dynamically adjusted options
  //     confirmText: 'Yes',
  //     cancelText: 'No',
  //     actionData: vendor,
  //   };


  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = 'fit-content';
  //   dialogConfig.height = 'auto';
  //   dialogConfig.disableClose = false;
  //   dialogConfig.data = dataToBeSentToDailog;
  //   const dialogRef = this.dialogServ.openDialogWithComponent(
  //     ConfirmWithRadioButtonComponent,
  //     dialogConfig
  //   );
  //   dialogRef.afterClosed().subscribe({
  //     next: (result: any) => {
  //       if (dialogRef.componentInstance.allowAction && result) {
  //         const selectedOption = result.option || result;  // either object or string
  //         const remarks = result.remarks || ''; // optional field

  //         if (selectedOption === 'Blacklisted') {
  //           this.vendorServ
  //             .moveToBlacklistedOrBack(
  //               selectedOption,
  //               vendor.id,
  //               this.loginId,
  //               remarks // <-- pass remarks here
  //             )
  //             .subscribe((resp: any) => {
  //               if (resp.status === 'success') {
  //                 this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
  //                 this.dataToBeSentToSnackBar.message = resp.message;
  //               } else {
  //                 this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
  //                 this.dataToBeSentToSnackBar.message = resp.message;
  //               }
  //               this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
  //               this.getAllData(this.currentPageIndex + 1);
  //             });
  //         } else {
  //           this.vendorServ
  //             .moveToCPVOrFPV(
  //               selectedOption,
  //               vendor.id,
  //               this.loginId
  //             )
  //             .subscribe((resp: any) => {
  //               if (resp.status === 'success') {
  //                 this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
  //                 this.dataToBeSentToSnackBar.message = resp.message;
  //               } else {
  //                 this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
  //                 this.dataToBeSentToSnackBar.message = resp.message;
  //               }
  //               this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
  //               this.getAllData(this.currentPageIndex + 1);
  //             });
  //         }
  //       }
  //     },
  //   });

  // }

  // onTabChanged(event: MatTabChangeEvent) {
  //   this.status = event.tab.textLabel.toLowerCase();
  //   this.currentPageIndex = this.pageIndices[this.status];
  //   // this.paginator!.pageIndex! = this.currentPageIndex;
  //   // console.log(this.paginator.pageIndex)
  //   this.getAllData(this.currentPageIndex + 1, this.status);
  // }
}
