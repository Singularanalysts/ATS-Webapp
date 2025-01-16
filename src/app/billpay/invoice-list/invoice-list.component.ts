import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogConfig } from '@angular/material/dialog';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { DialogService } from 'src/app/services/dialog.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, take, takeUntil } from 'rxjs';
import { PageEvent, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { ComposemailComponent } from './composemail/composemail.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AddReceiptComponent } from '../receipt-list/add-receipt/add-receipt.component';
import { InvoiceService } from '../services/invoice.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { Sort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }]
})
export class InvoiceListComponent implements OnInit {
  private snackBarServ = inject(SnackBarService);
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'invoicenumber',
    'InvoiceDate',
    'DueDate',
    'Consultant',
    'NetTerm',
    'NoOfHours',
    'Rate',
    'InvoiceValue',
    'Status',
    'Invoice',
    'Mail',
    'Payment',
    'Action'
  ];
  private router = inject(Router);
  private dialogServ = inject(DialogService);
  private invServ = inject(InvoiceService);
  private destroyed$ = new Subject<void>();

  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum !: any;
  totalItems: any;
  ser: number = 1;
  userid!: any;
  field = "empty";
  currentPageIndex = 0;
  pageEvent!: PageEvent;
  pageSize = 50;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageSizeOptions = [5, 10, 25];
  private breakpointObserver = inject(BreakpointObserver);
  sortField = 'updateddate';
  sortOrder = 'desc';

  ngOnInit(): void {
    this.getAllInvoices();
  }
  getAllInvoices(currentPageIndex = 1) {
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

    return this.invServ
      .getAllInvoice(pagObj)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {

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
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  addInvoice() {
    const actionData = {
      title: 'Add Invoice',
      invoiceData: null,
      actionName: 'add-invoice',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-invoice';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(AddInvoiceComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance) {
        this.getAllInvoices();
        //  this.getAll(this.currentPageIndex + 1);
      }
    })
  }

  editInvoice(invoice: any) {
    const actionData = {
      title: 'Update Invoice',
      invoiceData: invoice,
      actionName: 'edit-invoice',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.panelClass = 'edit-invoice';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddInvoiceComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAllInvoices();
        // this.getAllData(this.currentPageIndex + 1);
      }
    })
  }

  download(invoice: any) {
    this.invServ
      .downloadInvoice(invoice.invoiceId)
      .subscribe(blob => {
        // if (items[1] == 'pdf' || items[1] == 'PDF') {
        var fileURL: any = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = fileURL;
        a.target = '_blank';
        // Don't set download attribute
        //a.download = filename;
        a.click();
        // }
        // else {
        //   saveAs(blob, filename)
        // }

      })
  }

  deleteInvoice(invoice: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: invoice,
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "delete-visa";
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(ConfirmComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: () => {
        if (dialogRef.componentInstance.allowAction) {
          const dataToBeSentToSnackBar: ISnackBarData = {
            message: '',
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-success'],
          };
          this.invServ.deleteInvoice(invoice.invoiceId).pipe(takeUntil(this.destroyed$)).subscribe
            ({
              next: (resp: any) => {
                if (resp.status == 'success') {
                  dataToBeSentToSnackBar.message =resp.message
                   
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                  // call get api after deleting a role
                  this.getAllInvoices();
                } else {
                  dataToBeSentToSnackBar.message = resp.message;
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                }
              }, error: (err) => console.log(`PO delete error: ${err}`)
            });
        }
      }
    })
  }

  applyFilter(event: any) {
    const keyword = event.target.value;
    this.field = keyword;
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    const pagObj = {
      pageNumber: 1,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field,
    };

    return this.invServ
      .getAllInvoice(pagObj)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {

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

  sendEmail(invoice: any) {
    const actionData = {
      title: 'Email',
      invoiceData: invoice,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = actionData;

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).pipe(
      take(1)
    ).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          dialogConfig.width = '90vw';
        } else if (result.breakpoints[Breakpoints.Small]) {
          dialogConfig.width = '70vw';
        } else if (result.breakpoints[Breakpoints.Medium]) {
          dialogConfig.width = '50vw';
        } else if (result.breakpoints[Breakpoints.Large]) {
          dialogConfig.width = '40vw';
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          dialogConfig.width = '30vw';
        }
      }

      const dialogRef = this.dialogServ.openDialogWithComponent(ComposemailComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        if (dialogRef.componentInstance.submitted) {
          // this.getAll();
        }
      });
    });
  }

  pay(invoice: any) {
    const actionData = {
      title: 'Add Payment',
      receiptData: invoice,
      actionName: 'add-Payment',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-receipt';
    dialogConfig.data = actionData;

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).pipe(
      take(1)
    ).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          dialogConfig.width = '80vw';
        } else if (result.breakpoints[Breakpoints.Small]) {
          dialogConfig.width = '70vw';
        } else if (result.breakpoints[Breakpoints.Medium]) {
          dialogConfig.width = '60vw';
        } else if (result.breakpoints[Breakpoints.Large]) {
          dialogConfig.width = '50vw';
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          dialogConfig.width = '40vw';
        }
      }

      const dialogRef = this.dialogServ.openDialogWithComponent(AddReceiptComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        if (dialogRef.componentInstance) {
          this.getAllInvoices();
        }
      });
    });


  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
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
      this.getAllInvoices(event.pageIndex + 1);
    }
  }


  /**
    * Sort event
    * @param event
    */
  onSort(event: Sort) {
    this.sortField = event.active === 'SerialNum' ? 'updateddate' : event.active;
    this.sortOrder = event.direction;

    if (event.direction !== '') {
      this.getAllInvoices();
    }
  }


  
  

}
