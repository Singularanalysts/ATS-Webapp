import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
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
import { DialogService } from 'src/app/services/dialog.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { Subject, takeUntil } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AddPurchaseOrderComponent } from './add-purchase-order/add-purchase-order.component';

@Component({
  selector: 'app-purchase-order-list',
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
    RouterModule
  ],
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss']
})
export class PurchaseOrderListComponent {

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Vendor',
    'Consultant',
    'Client',
    'ProjectStartDate',
    'ProjectEndDate',
    'Duration',
    'BillingCycle',
    'NetTerm',
    'PayRate',
    'RecruiterName',
    'RecruiterEmail',
    'RecruiterContactNumber',
    'AccountPersonName',
    'AccountPersonEmail',
    'AccountPersonContactNumber',
    'Status',
    'Action',
  ];
  private dialogServ = inject(DialogService);
  private router = inject(Router);

  

  addPurchaseOrder() {
    const actionData = {
      title: 'Add Purchase Order',
      interviewData: null,
      actionName: 'add-purchase-order',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-purchase-order';
    dialogConfig.data = actionData;


    const dialogRef = this.dialogServ.openDialogWithComponent(AddPurchaseOrderComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
        //  this.getAll(this.currentPageIndex + 1);
      }
    })
  }

  editPurchaseOrder(purchaseorder: any){
    const actionData = {
      title: 'Update Purchase Order',
      purchaseOrderData: purchaseorder,
      actionName: 'edit-purchase-order',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.panelClass = 'edit-purchase-order';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddPurchaseOrderComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
        // this.getAllData(this.currentPageIndex + 1);
      }
    })
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }
}
