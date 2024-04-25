import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { OpenreqService } from '../../services/openreq.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { RecruInfoComponent } from './recru-info/recru-info.component';
import { MatDialog } from '@angular/material/dialog';
import { RequirementInfoComponent } from '../recruitment/requirement-list/requirement-info/requirement-info.component';
import { DialogService } from 'src/app/services/dialog.service';
import { JobDescriptionComponent } from './job-description/job-description.component';
@Component({
  selector: 'app-openreqs',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule

  ],
  templateUrl: './openreqs.component.html',
  styleUrls: ['./openreqs.component.scss']
})
export class OpenreqsComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'posted_on',
    'job_title',
    'category_skill',
    'employment_type',
    'job_location',
    'vendor',
    'JobDescription',
    'source',
    // 'end_client',
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
  isCompanyExist: any;
  source = 'all';

  private router = inject(Router);
  private service = inject(OpenreqService);
  userid!: any;
  dialog: any;
  private dialogServ = inject(DialogService);
  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.getAllreqsData();
  }
  empTag(id: number) {
    this.service.openReqsEmpTagging(id, this.userid).subscribe(
      (response: any) => {

      })
  }


  onSelectionChange(event: MatSelectChange) {
    // console.log('Selected value:', event.value);
    this.source = event.value;
    ///console.log(this.source);
    this.getAllreqsData()
  }
  openVendorPopup(vendor: string): void {
    this.dialog.open({
      data: { vendor: vendor }
    });
  }

  goToReqInfo(element: any) {

    const actionData = {
      title: `${element.vendor}`,
      id: element.vendor,
      actionName: 'req-info',

    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'req-info';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      RecruInfoComponent,
      dialogConfig
    );
  }
  getAllreqsData() {
    if (this.source && this.source !== 'empty') {
      this.getAllData(1); // Call API with source
    } else {
      this.getAllData(1); // Call API without source
    }
  }

  getAllData(pagIdx = 1) {
    this.service.getopenReqWithPaginationAndSource(pagIdx, this.itemsPerPage, this.field, this.source).subscribe(
      (response: any) => {
        this.dataSource.data = response.data.content;
        // this.isCompanyExist = response.data.content[0].isexist;
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

  applyFilter(event: any) {
    const keyword = event.target.value;
    this.field = keyword;
    if (keyword != '') {
      return this.service.getopenReqWithPaginationAndSource(1, this.itemsPerPage, keyword, this.source).subscribe(
        ((response: any) => {
          this.dataSource.data = response.data.content;
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
    return this.getAllData(this.currentPageIndex + 1);
  }

  onSort(event: any) {

  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAllData(event.pageIndex + 1)
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
        backgroundColor = 'rgba(185	,245	,210)';
        break;
      default:
        backgroundColor = '';
        break;
    }

    return { 'background-color': backgroundColor };
  }

  goToJobDescription(element: any) {
    console.log(element);
    
    const actionData = {
      title: `${element.job_title}`,
      id: element.id,
      actionName: 'job-description',
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'job-description';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      JobDescriptionComponent,
      dialogConfig
    );
  }

}