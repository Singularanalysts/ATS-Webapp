import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { OpenreqService } from '../../services/openreq.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { CompanyService } from '../../services/company.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { EmailBodyComponent } from './email-body/email-body.component';
import { DialogService } from 'src/app/services/dialog.service';
import { AddEmailExtractionComponent } from './add-email-extraction/add-email-extraction.component';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { Subject, takeUntil } from 'rxjs';
import { Observable } from 'rxjs';
import { MatSortModule, Sort } from '@angular/material/sort';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';

@Component({
  selector: 'app-email-extraction',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
  templateUrl: './email-extraction.component.html',
  styleUrls: ['./email-extraction.component.scss']
})
export class EmailExtractionComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Subject',
    'Sender',
    'Date',
    'Body',
    'Action'
  ];
  // pagination code  
  
  private destroyed$ = new Subject<void>();
  private service = inject(OpenreqService);
  // paginator
  length = 50;
  pageIndex = 0;
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [50, 75, 100];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  totalItems: number = 0;
  field = 'empty';
  private router = inject(Router);
  userid!: any;

  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  private snackBarServ = inject(SnackBarService);
  entity: any;

  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.getAll();
  }
  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  private dialogServ = inject(DialogService);
  protected privilegeServ = inject(PrivilegesService);
  
  readAll(pagIdx = 1) {

    this.service.fetch(pagIdx, this.itemsPerPage, this.field).subscribe(
      (response: any) => {
        this.dataSource.data = response.data.content;
        //console.log(response.data.content)
        this.totalItems = response.data.totalElements;
        // for serial-num {
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      }
    )
  }

  getAll(pagIdx = 1) {
    const pagObj = {
      pageNumber: pagIdx,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field,
    }
    this.service.emailEXtractionByPaginationSortandFilter(pagObj)
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

      return this.service.emailEXtractionByPaginationSortandFilter(pagObj).subscribe(
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

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  onFilter(event: any){
    this.dataSource.filter = event.target.value;
  }


  applyFilter1(event : any) {
    const keyword = event.target.value;
    this.field = keyword;
    if (keyword != '') {
      return this.service.fetch(1, this.itemsPerPage, keyword).subscribe(
        ((response: any) => {
          this.dataSource.data  = response.data.content;
           // for serial-num {}
           this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
          this.totalItems = response.data.totalElements;

        })
      );
    }
    if (keyword == '') {
      this.field = 'empty';
    }
    return  this.readAll(this.currentPageIndex + 1);
  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAll(event.pageIndex + 1);
    }
    return;
  }
  addEmail() {
    const actionData = {
      title: 'Extract Email',
      emailData: null,
      actionName: 'add-email',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-email';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddEmailExtractionComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
          this.readAll(this.currentPageIndex + 1);
      }
    })
  }

  goToReqInfo(element: any) {
    const actionData = {
      title: "Mail Body",
      data : element
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'req-info';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(EmailBodyComponent, dialogConfig);
  }
  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  
}
delete(element: any) {
  console.log(element);
  
  const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
    title: 'Confirmation',
    message: 'Are you sure you want to delete?',
    confirmText: 'Yes',
    cancelText: 'No',
    actionData: element,
  };
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = 'fit-content';
  dialogConfig.height = 'auto';
  dialogConfig.disableClose = false;
  dialogConfig.panelClass = 'delete-email';
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

        this.service
          .deleteSender(element.id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (response: any) => {
              if (response.status == 'success') {
                this.readAll(this.currentPageIndex + 1);
                dataToBeSentToSnackBar.message =
                  'Email Deleted successfully';
              } else {
                dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                dataToBeSentToSnackBar.message = response.message;
              }
              this.snackBarServ.openSnackBarFromComponent(
                dataToBeSentToSnackBar
              );
            },
            error: (err: { message: string; }) => {
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

}