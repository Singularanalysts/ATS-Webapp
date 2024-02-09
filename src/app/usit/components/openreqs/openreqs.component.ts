import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-openreqs',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule
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

  private router = inject(Router);
  private consultantServ = inject(ConsultantService);

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData(pagIdx = 1) {
    this.consultantServ.getopenReqWithPagination(pagIdx, this.itemsPerPage, this.field).subscribe(
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

  applyFilter(event : any) {
    const keyword = event.target.value;
    if (keyword != '') {
      return this.consultantServ.getopenReqWithPagination(1, this.itemsPerPage, keyword).subscribe(
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
}
