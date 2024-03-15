import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogConfig } from '@angular/material/dialog';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { DialogService } from 'src/app/services/dialog.service';
import { ISnackBarData } from 'src/app/services/snack-bar.service';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

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
export class InvoiceListComponent {

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'InvoiceDate',
    'DueDate',
    'BillToVendor',
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
      if(dialogRef.componentInstance.submitted){
        //  this.getAll(this.currentPageIndex + 1);
      }
    })
  }

  editRequirement(invoice: any){
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
      if(dialogRef.componentInstance.submitted){
        // this.getAllData(this.currentPageIndex + 1);
      }
    })
  }

  deleteInvoice(invoice: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: invoice,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = 'fit-content';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'delete-invoice';
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

          // this.invoiceServ.deleteEntity(invoice.id).pipe(takeUntil(this.destroyed$))
          // .subscribe({next:(response: any) => {
          //   if (response.status == 'success') {
          //     this.getAllData(this.currentPageIndex + 1);
          //     dataToBeSentToSnackBar.message = 'Invoice Deleted successfully';
          //   } else {
          //     dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          //     dataToBeSentToSnackBar.message = 'Record Deletion failed';
          //   }
          //   this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          // }, error: err => {
          //   dataToBeSentToSnackBar.message = err.message;
          //   dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          //   this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          // }});
        }
      },
    });
  }

  applyFilter(event: any){

  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }
}
