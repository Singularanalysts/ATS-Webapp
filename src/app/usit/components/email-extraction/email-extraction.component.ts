import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { OpenreqService } from '../../services/openreq.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { CompanyService } from '../../services/company.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { EmailBodyComponent } from './email-body/email-body.component';
import { DialogService } from 'src/app/services/dialog.service';
import { AddEmailExtractionComponent } from './add-email-extraction/add-email-extraction.component';


@Component({
  selector: 'app-email-extraction',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule
  ],
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
  ];
  // pagination code  
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

  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.readAll();
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

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  onFilter(event: any){
    this.dataSource.filter = event.target.value;
  }

  onSort(event: any) {

  }

  applyFilter(event : any) {
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
      this.readAll(event.pageIndex + 1)
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

}
