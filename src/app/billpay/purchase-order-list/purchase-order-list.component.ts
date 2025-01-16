import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent, } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AddPurchaseOrderComponent } from './add-purchase-order/add-purchase-order.component';
import { PurchaseOrderService } from 'src/app/usit/services/purchase-order.service';
import { Subject, takeUntil } from 'rxjs';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { RequirementInfoComponent } from 'src/app/usit/components/recruitment/requirement-list/requirement-info/requirement-info.component';
import { PurchaseOrderInfoComponent } from './purchase-order-info/purchase-order-info.component';

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
  styleUrls: ['./purchase-order-list.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }]
})
export class PurchaseOrderListComponent implements OnInit {

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'POTYPE',
    'Consultant',
    'Vendor',
    'Client',
    'Implpartner',
    'ProjectStartDate',
    'ProjectEndDate',
    'Duration',
    'BillingCycle',
    'NetTerm',
    'PayRate',
    'PayToconsultant',

    // 'AccountPersonName',
    // 'AccountPersonEmail',
    // 'AccountPersonContactNumber',
    // 'Status',
    'Action',
  ];
  private dialogServ = inject(DialogService);
  private router = inject(Router);
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
  private purchaseOrderServ = inject(PurchaseOrderService);
  private destroyed$ = new Subject<void>();
  private snackBarServ = inject(SnackBarService);
  sortField = 'updateddate';
  sortOrder = 'desc';




  ngOnInit(): void {
    this.getAllPurchaseOrders();
  }




  getAllPurchaseOrders(currentPageIndex = 1) {
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

    return this.purchaseOrderServ
      .getAllPos(pagObj)
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
    const serialNumber = this.currentPageIndex * this.itemsPerPage + index + 1;
    return serialNumber;
  }


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
      if (dialogRef.componentInstance.submitted) {
        //this.currentPageIndex + 1
        this.getAllPurchaseOrders();
      }
    })
  }

  editPurchaseOrder(purchaseorder: any) {
    const actionData = {
      title: 'Update Purchase Order',
      purchaseOrderData: purchaseorder,
      actionName: 'edit-purchase-order',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.panelClass = 'edit-purchase-order';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddPurchaseOrderComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        // this.getAllData(this.currentPageIndex + 1);
        this.getAllPurchaseOrders();
      }
    })
  }


  deletePO(po: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: po,
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
          this.purchaseOrderServ.deletePo(po.poid).pipe(takeUntil(this.destroyed$)).subscribe
            ({
              next: (resp: any) => {
                if (resp.status == 'success') {
                  dataToBeSentToSnackBar.message =
                    'PO Deleted successfully';
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                  // call get api after deleting a role
                  this.getAllPurchaseOrders();
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
      this.getAllPurchaseOrders(event.pageIndex + 1);
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
      this.getAllPurchaseOrders();
    }
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

    return this.purchaseOrderServ
      .getAllPos(pagObj)
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

    goToReqInfo(element: any){
      // alert(JSON.stringify(element))
      const actionData = {
        
        title: `${element.vendorname}`,
        info: element,
        actionName: 'po-info',
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '62dvw';
      dialogConfig.disableClose = false;
      dialogConfig.panelClass = 'po-info';
      dialogConfig.data = actionData;
  
     this.dialogServ.openDialogWithComponent(
        PurchaseOrderInfoComponent,
        dialogConfig
      );
    }



}
