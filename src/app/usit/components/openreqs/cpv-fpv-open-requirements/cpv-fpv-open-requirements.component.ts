import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { JobDescriptionComponent } from '../job-description/job-description.component';
import { RecruInfoComponent } from '../recru-info/recru-info.component';
import { MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-cpv-fpv-open-requirements',
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
    MatDialogModule,
    MatSortModule
  ],
  templateUrl: './cpv-fpv-open-requirements.component.html',
  styleUrls: ['./cpv-fpv-open-requirements.component.scss']
})
export class CpvFpvOpenRequirementsComponent implements OnInit {
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
  private router = inject(Router);
  private openreqServ = inject(OpenreqService);
  private dialogServ = inject(DialogService);
  private route= inject(ActivatedRoute);
  userid!: any;
  dialog: any;
  vendorType!: any;
  sortField = 'postedon';
  sortOrder = 'desc';
  title!: string;

  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    if(this.route.snapshot.routeConfig!.path == 'cpv-portal-requirements'){
      this.vendorType = 'Current Primary Vendor';
      this.title = 'CPV Portal Requirements';
    } else {
      this.vendorType = 'Future Primary Vendor';
      this.title = 'FPV Portal Requirements';
    }
    this.getAllData();
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
      isExist: element.isexist,
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
  
  getAllData(pagIdx = 1) {
    const pagObj = {
      pageNumber: pagIdx,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      vendorType: this.vendorType,
      keyword: this.field
    }
    this.openreqServ.getCpvFpvOpenRequirements(pagObj).subscribe(
      (response: any) => {
        this.dataSource.data = response.data.content;
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
    if (keyword != '') {
      const pagObj = {
        pageNumber: 1,
        pageSize: this.itemsPerPage,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        keyword: keyword,
        vendorType: this.vendorType,
      }

      return this.openreqServ.getCpvFpvOpenRequirements(pagObj).subscribe(
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
    return  this.getAllData(this.currentPageIndex + 1)
  }

  onSort(event: Sort) {
    if (event.active == 'SerialNum')
      this.sortField = 'updateddate'
    else
      this.sortField = event.active;
      this.sortOrder = event.direction;
    
    if (event.direction != ''){
    this.getAllData();
    }
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