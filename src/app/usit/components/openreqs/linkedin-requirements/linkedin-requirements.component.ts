import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { OpenreqService } from 'src/app/usit/services/openreq.service';


@Component({
  selector: 'app-linkedin-requirements',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './linkedin-requirements.component.html',
  styleUrls: ['./linkedin-requirements.component.scss']
})

export class LinkedinRequirementsComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'posted_on',
    'job_title',
    'category_skill',
    'employment_type',
    'job_location',
    'vendor',
    'end_client',
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
  source = 'linkedin';
  private router = inject(Router);
  private service = inject(OpenreqService);
userid!:any;
  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.getAllData();
  }
  empTag(id:number){
    this.service.openReqsEmpTagging(id, this.userid).subscribe(
      (response: any) => {

      })
  }
  getAllData(pagIdx = 1) {
    this.service.getopenReqWithPaginationAndSource(pagIdx, this.itemsPerPage, this.field, this.source).subscribe(
      (response: any) => {
        this.dataSource.data = response.data.content;
        this.isCompanyExist = response.data.content[0].isexist;
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

  applyFilter(event : any) {
    const keyword = event.target.value;
    if (keyword != '') {
      return this.service.getopenReqWithPaginationAndSource(1, this.itemsPerPage, keyword, this.source).subscribe(
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
    return  this.getAllData(this.currentPageIndex + 1);
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
        backgroundColor = 'rgba(40, 160, 76, 0.945)';
        break;
      default:
        backgroundColor = '';
        break;
    }
    
    return { 'background-color': backgroundColor };
  }
}
