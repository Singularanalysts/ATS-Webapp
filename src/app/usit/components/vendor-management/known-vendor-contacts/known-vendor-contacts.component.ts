import { CommonModule } from '@angular/common';
import {
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
import { BooleanInput } from '@angular/cdk/coercion';

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
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class KnownVendorContactsComponent implements OnInit {
  dataTableColumns: string[] = [
    'SerialNum',
    'EmployeName',
    'Company',
    'Client',
    'Email',
    'contactNumber',
    'Action',
  ];
  dataSource = new MatTableDataSource<any>([]);

  // Pagination
  pageSize = 50;
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];
  totalItems = 0;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Services
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private vendorServ = inject(VendorService);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);

  private destroyed$ = new Subject<void>();

  hasAcces!: any;
  loginId!: any;
  department!: any;
  entity: any[] = [];

  // Sorting defaults
  sortField = 'updateddate';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Filter
  field: string = 'empty';
showFirstLastButtons: BooleanInput;

  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.loginId = localStorage.getItem('userid');
    this.department = localStorage.getItem('department');
    this.getAll();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /**
   * Fetch All Known Vendor Contacts (with pagination + sorting)
   */
  getAll(pagIdx = 1) {
    const pagObj = {
      pageNumber: pagIdx,
      pageSize: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field,
    };

    console.log(' resssss Payload:', pagObj);

    this.vendorServ
      .getAllKnownVendorContacts(pagObj)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        if (response?.data?.content) {
          this.entity = response.data.content;
          this.dataSource.data = response.data.content.map((x: any, i: number) => ({
            ...x,
            serialNum: this.generateSerialNumber(i),
          }));
          this.totalItems = response.data.totalElements;
        }
      });
  }

  /**
   * Apply Search Filter
   */
  applyFilter(event: any) {
    const keyword = event.target.value.trim();
    this.field = keyword !== '' ? keyword : 'empty';
    this.getAll(1);
  }

  /**
   * Handle Sorting (ASC / DESC)
   */
  onSort(event: Sort) {
    this.sortField = event.active === 'SerialNum' ? 'updateddate' : event.active;
    this.sortOrder = (event.direction as 'asc' | 'desc') || 'asc';

    console.log('Sort Event:', this.sortField, this.sortOrder);

    // Refresh current page
    this.getAll(this.currentPageIndex + 1);
  }

  /**
   * Add New Known Vendor Contact
   */
  addKnownVendorContact() {
    const actionData = {
      title: 'Add Known Vendor Contact',
      KnownVendorContactData: null,
      actionName: 'add-known-vendor-contact',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-known-vendor-contact';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddKnownVendorContactsComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance?.submitted) {
        this.getAll(this.currentPageIndex + 1);
      }
    });
  }

  /**
   * Edit Known Vendor Contact
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
      if (dialogRef.componentInstance?.submitted) {
        this.getAll(this.currentPageIndex + 1);
      }
    });
  }

  /**
   * Delete Known Vendor Contact
   */
  deleteKnownVendorContact(vendor: any) {
    const dataToBeSentToDialog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure  want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: vendor,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = 'fit-content';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'delete-known-vendor-contact';
    dialogConfig.data = dataToBeSentToDialog;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance?.allowAction) {
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
              if (response.status === 'success') {
                dataToBeSentToSnackBar.message =
                  'Known Vendor Contact deleted successfully';
                this.getAll(this.currentPageIndex + 1);
              } else {
                dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                dataToBeSentToSnackBar.message = response.message;
              }
              this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
            },
            error: (err) => {
              dataToBeSentToSnackBar.message = err.message;
              dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
              this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
            },
          });
      }
    });
  }

  /**
   * Handle Page Event (pagination)
   */
  handlePageEvent(event: PageEvent) {
    if (event) {
      this.currentPageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.getAll(event.pageIndex + 1);
    }
  }

  /**
   * Generate serial number for each row
   */
  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    return (pagIdx - 1) * this.pageSize + index + 1;
  }

  /**
   * Navigate to Dashboard
   */
  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
