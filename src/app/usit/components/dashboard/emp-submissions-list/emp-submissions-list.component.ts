import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from 'src/app/usit/services/dashboard.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-emp-submissions-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule
  ],
  templateUrl: './emp-submissions-list.component.html',
  styleUrls: ['./emp-submissions-list.component.scss']
})

export class EmpSubmissionsListComponent {
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Dos',
    'submissionId',
    'Consultant',
    'Requirement',
    'ImplementationPartner',
    'EndClient',
    'Vendor',
    'ProjectLocation',
    'Status',
    // 'SubStatus',
  ];
  data = inject(MAT_DIALOG_DATA);
  dashboardServ = inject(DashboardService);
  pageSize:number = 50;
  page: number = 1;
  sortField = 'Dos';
  sortOrder = 'asc';
  totalItems = 0;
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = true;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  itemsPerPage = 50;


  ngOnInit(): void {
    this.getAllData(); 
  }

  getAllData(pagIdx = 1) {
    const pagObj = {
      pageNumber: pagIdx,
      pageSize: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      userid: this.data.id,
      duration: this.data.duration
    }
    this.dashboardServ.getEmployeeDashboardSubmissionPopup(pagObj).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.data.content;
        this.totalItems = response.data.totalElements;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
      },
      error: (err: any) => {
        console.error('Error fetching consultant data:', err);
      }
    });
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  onSort(event: Sort) {
    if (event.active == 'SerialNum')
      this.sortField = 'postedon'
    else
      this.sortField = event.active;
    this.sortOrder = event.direction;

    if (event.direction != '') {
      this.getAllData();
    }
  }

}
