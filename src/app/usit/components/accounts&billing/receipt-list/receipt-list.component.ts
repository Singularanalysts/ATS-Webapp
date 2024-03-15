import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogConfig } from '@angular/material/dialog';
import { AddReceiptComponent } from './add-receipt/add-receipt.component';
import { DialogService } from 'src/app/services/dialog.service';
import { ISnackBarData } from 'src/app/services/snack-bar.service';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';

@Component({
  selector: 'app-receipt-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss']
})
export class ReceiptListComponent {

  private router = inject(Router);
  private dialogServ = inject(DialogService);

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
      if(dialogRef.componentInstance.submitted){
        //  this.getAll(this.currentPageIndex + 1);
      }
    })
  }

  editRequirement(receipt: any){
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
      if(dialogRef.componentInstance.submitted){
        // this.getAllData(this.currentPageIndex + 1);
      }
    })
  }

  applyFilter(event: any){

  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

}
