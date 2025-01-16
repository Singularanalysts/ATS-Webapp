import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogConfig } from '@angular/material/dialog';
import { AddReceiptComponent } from './add-receipt/add-receipt.component';
import { DialogService } from 'src/app/services/dialog.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReceiptService } from '../services/receipt.service';
import { Subject, takeUntil } from 'rxjs';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { ChangeDetectorRef } from '@angular/core';
import { MatPaginator,MatPaginatorIntl,MatPaginatorModule,PageEvent,} from '@angular/material/paginator';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';

@Component({
  selector: 'app-receipt-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule

  ],
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }]
  
})
export class ReceiptListComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();
  private snackBarServ = inject(SnackBarService);
  private receiptService = inject(ReceiptService);
  private router = inject(Router);
  private dialogServ = inject(DialogService);
  private cdRef = inject(ChangeDetectorRef); // Inject ChangeDetectorRef

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'createddate',
    'invoiceNumber',
    'vendor',
    'consultantname',
    'payment_date',
    'amount_received',
    'payment_mode',
    // 'Action',    
  ];

  datarr: any;
  totalItems: number = 0;
  page: number = 1;
  itemsPerPage = 50;
  field = 'empty';
  // paginator
  pageIndex = 0;
  length = 50;
  pageSize = 50;
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;

  // Sorting
  sortField = 'updateddate';
  sortOrder = 'desc';

  ngOnInit(): void {
    this.getAllPayments();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Sort event
   * @param event
   */
  onSort(event: Sort) {
    this.sortField = event.active === 'SerialNum' ? 'updateddate' : event.active;
    this.sortOrder = event.direction;

    if (event.direction !== '') {
      this.getAllPayments();
    }
  }

  addReceipt() {
    const actionData = {
      title: 'Add Receipt',
      receiptData: null,
      actionName: 'add-receipt',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-receipt';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(AddReceiptComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAllPayments(); // Reload data after adding
      }
    });
  }

  editRequirement(receipt: any) {
    const actionData = {
      title: 'Update Receipt',
      receiptData: receipt,
      actionName: 'edit-receipt',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.panelClass = 'edit-receipt';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(AddReceiptComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAllPayments(); // Reload data after editing
      }
    });
  }



  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  getAllPayments(currentPageIndex = 1) {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    const pagObj = {
      pageNumber: currentPageIndex,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field,
    };

    return this.receiptService
      .getAllPayments(pagObj)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.datarr = response.data.content;
          this.dataSource.data = response.data.content;
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

  generateSerialNumber(index: number): number {
    const serialNumber = this.currentPageIndex * this.itemsPerPage + index + 1;
    return serialNumber;
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
      keyword: this.field
    
    }
    return this.receiptService
      .getAllPayments(
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
  return this.getAllPayments(this.currentPageIndex + 1);
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
    this.getAllPayments(event.pageIndex + 1);
  }
}



  getAllVendorByType(type: string, pageIndex = 0) {
    
    const page = pageIndex ? pageIndex : this.page

    const pagObj = {
      pageNumber: page,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field
    
    }
    this.receiptService.getAllPayments(pagObj).subscribe(
      (response: any) => {
        this.dataSource.data = response.data.content
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
        this.totalItems = response.data.totalElements;
      })
  }



}
