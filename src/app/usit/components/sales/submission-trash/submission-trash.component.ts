import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import {
   OnDestroy, OnInit, ViewChild,
  
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { SubmissionService } from 'src/app/usit/services/submission.service';

import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';

@Component({
  selector: 'app-submission-trash',
  standalone: true,
  imports: [MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatTooltipModule],
  templateUrl: './submission-trash.component.html',
  styleUrls: ['./submission-trash.component.scss'],
    providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
  
})
export class SubmissionTrashComponent {
      protected privilegeServ = inject(PrivilegesService);
      private destroyed$ = new Subject<void>();
      private  activatedRoute= inject(ActivatedRoute);
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      private router = inject(Router);

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Dos',
    'Id',
    'Consultant',
    'Position',
    'Vendor',
    'ImplementationPartner',
    'EndClient',
    'SubRate',
    'ProjectLocation',
    'DeletedBy',
    'Status',
    'SubStatus',
   'Remarks'
  ];
  applyFilter(event: any) {
    const keyword = event.target.value;
    this.field=keyword;
    if (keyword != '') {
      return this.submissionServ.getdeletesubmissiontrash(this.flag, this.hasAcces, this.userid, 1, this.itemsPerPage, keyword,
        this.sortField,
        this.sortOrder,localStorage.getItem('companyid')).subscribe(
        ((response: any) => {
          this.entity = response.data.content;
          this.totalItems = response.data.totalElements;
          this.dataSource.data = response.data.content;
          // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
        })
      );
    }
    if(keyword==''){
      this.field = 'empty';
    }
    return this.getdeletesubmission(this.currentPageIndex + 1);
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
    this.getdeletesubmission();
    }
  }
    private submissionServ = inject(SubmissionService);
    flag!: any;
    subFlag!:any;
    hasAcces!: any;
    userid: any;
    entity: any;
    totalItems = 0;
    field = 'empty';
    pageSize = 50;
    currentPageIndex = 0;
    pageSizeOptions = [5, 10, 25];
    ngOnInit(): void {
      this.userid = localStorage.getItem('userid');
      this.getFlag()
      this.hasAcces = localStorage.getItem('role');
      this.userid = localStorage.getItem('userid');
      this.getdeletesubmission();
    }
  getFlag(){
    const routeData = this.activatedRoute.snapshot.data;
    console.log(routeData);
    
    if (routeData['isSalesSubmission']) {
      this.flag = "Sales";
      this.subFlag = 'sales-submissionsTrash';
    }else if (routeData['isRecSubmission']) { // recruiting consutlant
      this.flag = "Recruiting";
      this.subFlag = 'Recruitment-submissionsTrash';
    } else {
      this.flag = "Domrecruiting";
      this.subFlag = 'Dom-submissionTrash';
    }
  }
  getRowStyles(row: any): any {
    const subStatus = row.substatus;
    let backgroundColor = '';
    let color = '';

    switch (subStatus) {
      case 'Schedule':
        backgroundColor = 'rgb(185, 245, 210)';
        color = 'black';
        break;
      case 'Rejected':
        backgroundColor = '';
        color = 'rgba(177, 19, 19, 0.945)';
        break;
      default:
        backgroundColor = '';
        color = '';
        break;
    }
  }
  pageEvent!: PageEvent;
  itemsPerPage = 50;
  showFirstLastButtons = true;
  filterForm!: FormGroup;

  getdeletesubmission(pageIndex = 1 ) {
    this.submissionServ.getdeletesubmissiontrash(this.flag, this.hasAcces, this.userid, pageIndex, this.pageSize, this.field,
      this.sortField,
      this.sortOrder,localStorage.getItem('companyid')).subscribe(
      (response: any) => {
        this.entity = response.data.content;
        this.dataSource.data =  response.data.content;
        this.totalItems = response.data.totalElements;
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      }
    )
  }
  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getdeletesubmission(event.pageIndex + 1)
    }
    return;
  }
  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }
}
