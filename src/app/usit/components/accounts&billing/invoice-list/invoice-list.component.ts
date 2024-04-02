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
import { PurchaseOrderService } from 'src/app/usit/services/purchase-order.service';
import { Subject, takeUntil } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ComposemailComponent } from './composemail/composemail.component';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
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
    'Action',
  ];
  private router = inject(Router);
  private dialogServ = inject(DialogService);
  private purchaseOrderServ = inject(PurchaseOrderService);
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


  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.purchaseOrderServ.getAllIvoice()
      .pipe(takeUntil(this.destroyed$)).subscribe(
        (response: any) => {
          // this.entity = response.data.content;
          this.dataSource.data = response.data;
          console.log(response.data)
          this.totalItems = response.data.totalElements;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
        }
      )
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
      if (dialogRef.componentInstance.submitted) {
        this.getAll();
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
        this.getAll();
        // this.getAllData(this.currentPageIndex + 1);
      }
    })
  }

  download(invoice: any) {
    this.purchaseOrderServ
      .downloadInvoice(invoice.invoiceid)
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

  //   deleteInvoice(invoice: any) {
  //     const dataToBeSentToDailog : Partial<IConfirmDialogData> = {
  //       title: 'Confirmation',
  //       message: 'Are you sure you want to delete?',
  //       confirmText: 'Yes',
  //       cancelText: 'No',
  //       actionData: invoice,

  //     }
  //     );
  // }
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
          this.purchaseOrderServ.deleteInvoice(invoice.invoiceid).pipe(takeUntil(this.destroyed$)).subscribe
            ({
              next: (resp: any) => {
                if (resp.status == 'success') {
                  dataToBeSentToSnackBar.message =
                    'Invoice Deleted successfully';
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                  // call get api after deleting a role
                  this.getAll();
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
  applyFilter(event: any){

  }

  sendEmail(invoice: any){
    const actionData = {
      title: 'Update Invoice',
      invoiceData: invoice,
      actionName: 'edit-invoice',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.panelClass = 'edit-invoice';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(ComposemailComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll();
        // this.getAllData(this.currentPageIndex + 1);
      }
    })
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }
}
