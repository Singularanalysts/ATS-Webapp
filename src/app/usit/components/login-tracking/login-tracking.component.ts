import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-login-tracking',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-tracking.component.html',
  styleUrls: ['./login-tracking.component.scss']
})
export class LoginTrackingComponent {
  totalItems: number = 0;
  length = 50;
  pageIndex = 0;

  pageSize = 25; 
  currentPageIndex = 0;
  pageSizeOptions = [25, 50, 75, 100];
  pageEvent!: PageEvent;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  sortField = 'systemIp';
  sortOrder = 'ASC';
  field = "empty";
  private dialogServ = inject(DialogService);
  private service = inject(OpenreqService);
  private destroyed$ = new Subject<void>();
  constructor(public dialogRef: MatDialogRef<LoginTrackingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    console.log('datadatesss', data)
  }
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'systemIp',
    'networkIp',
    'loginTime',
    'status',
    'remarks',


  ];
  ngOnInit() {
    this.loginTracking()
  }
 applyFilter(event: any) {
  const keyword = event.target.value.trim().toLowerCase();
  this.field = keyword;
  this.currentPage = 1;
  this.loginTracking(); 
}
onSort(event: Sort) {
  this.sortField = event.active;
  this.sortOrder = event.direction.toUpperCase(); // 'asc' | 'desc' → 'ASC' | 'DESC'
  this.currentPage = 1;
  this.loginTracking(); // Fetch sorted data
}

  currentPage: number = 1; // Start from page 1
  totalPages: number = 0;
  loginTracking() {


    const payload = {
      pageSize: this.pageSize,
      sortField: this.sortField || 'serialNum',
      sortOrder: this.sortOrder || 'ASC',
      keyword: this.field || 'empty', 
      pageNumber: this.currentPage
    };

    this.service.loginTracking(payload)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        if (response && response.data) {
          this.length = response.data.totalElements || response.data.length; // Update total items if API provides it
          this.totalPages = Math.ceil(this.length / this.pageSize); // Calculate total pages
          this.dataSource.data = response.data.content.map((item: any, index: number) => ({
            serialNum: index + 1 + (this.currentPage - 1) * this.pageSize,
            systemIp: item.systemIp,
            networkIp: item.networkIp,
            loginTime: item.loginTime,
            status: item.status,
            remarks: item.remarks,




          }));
        }
      });


  }
  goToPage(page: number) {
    this.currentPage = page;
    this.loginTracking();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loginTracking();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loginTracking();
    }
  }
  getPageNumbers(): any[] {
    const visiblePages = 4;
    const pageNumbers: any[] = [];

    if (this.totalPages <= 6) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    pageNumbers.push(1);

    let start = Math.max(2, this.currentPage - Math.floor(visiblePages / 2));
    let end = Math.min(this.totalPages - 1, start + visiblePages - 1);

    if (end === this.totalPages - 1) {
      start = Math.max(2, this.totalPages - visiblePages);
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (end < this.totalPages - 1) {
      pageNumbers.push("...");
    }

    pageNumbers.push(this.totalPages);

    return pageNumbers;
  }

 getStatusClass(status: string): string {
  if (status === 'Success') {
    return 'status-completed';
  } else if (status === 'Failed') {
    return 'status-inprogress';
  }
  return '';
}


  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  onCancel() {
    this.dialogRef.close();

  }
}
