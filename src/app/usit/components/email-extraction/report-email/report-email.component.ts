import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-report-email',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule
  ],
  templateUrl: './report-email.component.html',
  styleUrls: ['./report-email.component.scss']
})
export class ReportEmailComponent {
  totalItems: number = 0;
  length = 50;
  pageIndex = 0;
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [50, 75, 100];
  pageEvent!: PageEvent;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  hidePageSize = false;

  private service = inject(OpenreqService);
  private destroyed$ = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  onFilter(event: any) {
    this.dataSource.filter = event.target.value;
  }

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Email',
    'Status',
    'TotalSaved',
    'ExtractedBy',
    'LastStarted',
    'LastCompleted'
  ];

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  ngOnInit() {
    this.getreportemail();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getreportemail() {
    const userId = localStorage.getItem('userid');

    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    this.service.getreportemail(userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        if (response && response.data) {
          this.dataSource.data = response.data.map((item: any, index: number) => ({
            serialNum: index + 1,
            email: item.email,
            status: item.status,
            totalSaved: item.totalSaved,
            extrcatedBy: item.extrcatedBy,
            lastStarted: item.lastStarted,
            lastCompleted: item.lastCompleted
          }));
        }
      });
  }

  onSort(event: Sort) {
    const sortDirection = event.direction;
    const activeSortHeader = event.active;

    if (sortDirection === '') {
      this.dataSource.data = [...this.dataSource.data];
      return;
    }

    const isAsc = sortDirection === 'asc';

    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      switch (activeSortHeader) {
        case 'SerialNum':
          return (isAsc ? 1 : -1) * (a.serialNum - b.serialNum);
        case 'Email':
          return (isAsc ? 1 : -1) * (a.email || '').localeCompare(b.email || '');
        case 'Status':
          return (isAsc ? 1 : -1) * (a.status || '').localeCompare(b.status || '');
        case 'TotalSaved':
          return (isAsc ? 1 : -1) * ((a.totalSaved || 0) - (b.totalSaved || 0));
        case 'ExtractedBy':
          return (isAsc ? 1 : -1) * (a.extrcatedBy || '').localeCompare(b.extrcatedBy || '');
        case 'LastStarted':
          return (isAsc ? 1 : -1) * ((new Date(a.lastStarted)).getTime() - (new Date(b.lastStarted)).getTime());
        case 'LastCompleted':
          return (isAsc ? 1 : -1) * ((new Date(a.lastCompleted)).getTime() - (new Date(b.lastCompleted)).getTime());
        default:
          return 0;
      }
    });
  }


}
