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
import { DialogService } from 'src/app/services/dialog.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { Recruiter } from 'src/app/usit/models/recruiter';
import { VendorService } from 'src/app/usit/services/vendor.service';
import { AddKnownVendorContactsComponent } from './add-known-vendor-contacts/add-known-vendor-contacts.component';

@Component({
  selector: 'app-known-vendor-contacts',
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
  templateUrl: './known-vendor-contacts.component.html',
  styleUrls: ['./known-vendor-contacts.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }]
})
export class KnownVendorContactsComponent implements OnInit {
  dataTableColumns: string[] = [
    'SerialNum',
    'EmployeName',
    'Company',
    'Client',
    'Email',
    'contactNumber',
    // 'AddedBy',
    // 'UpdatedBy',
    'Action',
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
  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.loginId = localStorage.getItem('userid');
    this.department = localStorage.getItem('department');
    this.getAll();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  

  getAll(pagIdx = 1) {
    const pagObj = {
      pageNumber: pagIdx,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field,
    }
    this.vendorServ.getAllKnownVendorContacts(pagObj)
      .pipe(takeUntil(this.destroyed$)).subscribe(
        (response: any) => {
          this.entity = response.data.content;
          this.dataSource.data = response.data.content;
          this.totalItems = response.data.totalElements;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
        }
      )
  }

  applyFilter(event: any) {
    const keyword = event.target.value;
    if (keyword != '') {
      const pagObj = {
        pageNumber: 1,
        pageSize: this.itemsPerPage,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        keyword: keyword,
      }

      return this.vendorServ.getAllKnownVendorContacts(pagObj).subscribe(
        ((response: any) => {
          this.entity = response.data.content;
          this.dataSource.data  = response.data.content;
           // for serial-num {}
           this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
          this.totalItems = response.data.totalElements;
        })
      );
    }
    return  this.getAll(this.currentPageIndex + 1)
  }

  sortField = 'updateddate';
  sortOrder = 'desc';
  onSort(event: Sort) {
    if (event.active == 'SerialNum')
      this.sortField = 'updateddate'
    else
      this.sortField = event.active;
      this.sortOrder = event.direction;
    
    if (event.direction != ''){
    this.getAll();
    }
  }
  
  /**
   * add
   */
  addKnownVendorContact() {
    const actionData = {
      title: 'Add Known Vendor Contact',
      KnownVendorContactData: null,
      actionName: 'add-known-vendor-contact',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-known-vendor-contact';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddKnownVendorContactsComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll(this.currentPageIndex + 1);
      }
    });
  }
  /**
   * edit
   * @param endor
   */
  editKnownVendorContact(vendor: any) {
    const actionData = {
      title: 'Update Known Vendor Contact',
      KnownVendorContactData: vendor,
      actionName: 'edit-known-vendor-contact',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.panelClass = 'edit-known-vendor-contact';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddKnownVendorContactsComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll(this.currentPageIndex + 1);
      }
    });
  }
  /**
   * delete
   * @param vendor
   */
  deleteKnownVendorContact(vendor: any) {
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
    dialogConfig.panelClass = 'delete-known-vendor-contact';
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
            .deleteKnownVendorContact(vendor.id)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
              next: (response: any) => {
                if (response.status == 'success') {
                  this.getAll(this.currentPageIndex + 1);
                  dataToBeSentToSnackBar.message =
                    'Known Vendor Contact Deleted successfully';
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
   * handle page event - pagination
   * @param endor
   */
  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      const currentPageIndex = event.pageIndex;
      this.currentPageIndex = currentPageIndex;
      this.getAll(event.pageIndex + 1);
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

}

