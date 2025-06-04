import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { utils, writeFile } from 'xlsx';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { MatSort, Sort } from '@angular/material/sort';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { FormBuilder } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
@Component({
  selector: 'app-scrape-activity',
   standalone: true,
    imports: [
      CommonModule,
      MatIconModule,
      MatButtonModule,
      MatTooltipModule,
      MatTableModule,
      MatPaginatorModule,
      MatSelectModule, 
      ReactiveFormsModule,MatSortModule
    ],
  templateUrl: './scrape-activity.component.html',
  styleUrls: ['./scrape-activity.component.scss']
})
export class ScrapeActivityComponent {
  length = 50;
  pageIndex = 0;
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [50, 75, 100];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  totalItems: number = 0;
keyword = 'empty';
sortField = '';
sortOrder = '';

    private consultantServ = inject(ConsultantService);

 dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'portalName',
    'NumberOfRequirements',
    'BatchInterval',
    'startTime',
    'endTime',
    'duration',
    'status',
   
  ];
  myForm:any
   @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
 
    this.getScrapDetails();
}
  onFilter(event: any) {
  this.keyword = event.target.value.trim();
  this.pageIndex = 0; 
  this.getScrapDetails();
}

  onSort(event: Sort) {
  this.sortField = event.active;
  this.sortOrder = event.direction || 'asc';
  this.getScrapDetails();
}

  
  handlePageEvent(e: PageEvent) {
  this.pageIndex = e.pageIndex;
  this.pageSize = e.pageSize;
  this.getScrapDetails();
}

getScrapDetails() {
  const payload = {
    pageNumber: this.pageIndex + 1,
    pageSize: this.pageSize,
    sortField: this.sortField || 'status',
    sortOrder: this.sortOrder || 'asc',
    keyword: this.keyword
  };

  this.consultantServ.getScrapDetails(payload).subscribe((response: any) => {
    this.dataSource.data = response.data.content 
    this.dataSource.data.map((x: any, i: number) => {
      x.serialNum = i + 1 + this.pageIndex * this.pageSize;
    });
    this.totalItems = response.data.totalElements 
  });
}
getStatusClass(status: string): string {
  if (status === 'Completed') {
    return 'status-completed';
  } else if (status === 'inprogress') {
    return 'status-inprogress';
  }
  return '';
}


}
