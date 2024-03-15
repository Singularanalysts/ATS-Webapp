import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { AddEmailExtractionComponent } from './add-email-extraction/add-email-extraction.component';
import { EmailBodyComponent } from './email-body/email-body.component';

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
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum !: any;
  totalItems: any;
  field = "empty";
  currentPageIndex = 0;
  pageEvent!: PageEvent;
  pageSize = 50;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageSizeOptions = [50, 75, 100];

  private router = inject(Router);
  private dialogServ = inject(DialogService);
  // private service = inject(OpenreqService);

userid!:any;
  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    // this.getAllData();
  }
  // empTag(id:number){
  //   this.service.openReqsEmpTagging(id, this.userid).subscribe(
  //     (response: any) => {

  //     })
  // }
  // getAllData(pagIdx = 1) {
  //   this.service.getopenReqWithPaginationAndSource(pagIdx, this.itemsPerPage, this.field, this.source).subscribe(
  //     (response: any) => {
  //       this.dataSource.data = response.data.content;
  //       this.isCompanyExist = response.data.content[0].isexist;
  //       this.totalItems = response.data.totalElements;
  //       // for serial-num {}
  //       this.dataSource.data.map((x: any, i) => {
  //         x.serialNum = this.generateSerialNumber(i);
  //       });
  //     }
  //   )
  // }

  // generateSerialNumber(index: number): number {
  //   const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
  //   const serialNumber = (pagIdx - 1) * 50 + index + 1;
  //   return serialNumber;
  // }

  // applyFilter(event : any) {
  //   const keyword = event.target.value;
  //   if (keyword != '') {
  //     return this.service.getopenReqWithPaginationAndSource(1, this.itemsPerPage, keyword, this.source).subscribe(
  //       ((response: any) => {
  //         this.dataSource.data  = response.data.content;
  //          // for serial-num {}
  //          this.dataSource.data.map((x: any, i) => {
  //           x.serialNum = this.generateSerialNumber(i);
  //         });
  //         this.totalItems = response.data.totalElements;

  //       })
  //     );
  //   }
  //   if (keyword == '') {
  //     this.field = 'empty';
  //   }
  //   return  this.getAllData(this.currentPageIndex + 1);
  // }

  addEmail() {
    const actionData = {
      title: 'Add Email',
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
      if(dialogRef.componentInstance.submitted){
        //  this.getAll(this.currentPageIndex + 1);
      }
    })
  }

  goToReqInfo(element: any){
    const actionData = {
      title: `${element.reqnumber}`,
      id: element.requirementid,
      actionName: 'req-info',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'req-info';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(EmailBodyComponent,dialogConfig);
  }

  onSort(event: any) {

  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      // this.getAllData(event.pageIndex + 1)
    }
    return;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  getRowStyles(row: any): any {
    const companyStatus = row.isexist;
    let backgroundColor = '';

    switch (companyStatus) {
      case '1':
        backgroundColor = 'rgba(40, 160, 76, 0.945)';
        break;
      default:
        backgroundColor = '';
        break;
    }
    
    return { 'background-color': backgroundColor };
  }
}
