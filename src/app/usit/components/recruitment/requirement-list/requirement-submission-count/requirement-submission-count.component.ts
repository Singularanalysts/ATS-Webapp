import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequirementService } from 'src/app/usit/services/requirement.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileManagementService } from 'src/app/usit/services/file-management.service';
import * as saveAs from 'file-saver';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-requirement-submission-count',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './requirement-submission-count.component.html',
  styleUrls: ['./requirement-submission-count.component.scss']
})
export class RequirementSubmissionCountComponent implements OnInit {

  dataSource = new MatTableDataSource<any>([]);
  private requirementServ = inject(RequirementService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<RequirementSubmissionCountComponent>);
  dataTableColumns: string[] = ['SerialNum', 'createddate', 'subno', 'Consultant', 'pseudoname', 'status', 'substatus', 'resume'];
  // paginator
  totalItems = 0;
  pageSize = 50;
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = true;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  message: any;
  field = 'empty';
  userid: any;
  page: number = 1;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  sortField!: "updateddate";
  sortOrder!: "asc";
  private fileService = inject(FileManagementService);

  ngOnInit(): void {
    this.getReqSubmissionPopupRecords();
  }
    private destroyed$ = new Subject<void>();
    length = 50;

getReqSubmissionPopupRecords() {
  const pagObj = {
    pageNumber: this.currentPage,   // dynamic page number
    pageSize: this.pageSize,
    sortField: "updateddate",
    sortOrder: "asc",
    keyword: this.field,
    reqid: this.data.subCountData.requirementid,
  };

  this.requirementServ.getReqSubmisiionPopupRecords(pagObj)
    .pipe(takeUntil(this.destroyed$))
    .subscribe({
      next: (resp: any) => {
        if (resp?.status === 'Success' && resp?.data) {

          // ✅ Add pagination handling like getservedcount()
          this.length = resp.data.totalElements || resp.data.length || 0;
          this.totalPages = Math.ceil(this.length / this.pageSize);

          // ✅ Assign data to table
          this.dataSource.data = resp.data.content;

          // ✅ Add serial number across pages
          this.dataSource.data.forEach((x: any, i: number) => {
            x.serialNum = i + 1 + (this.currentPage - 1) * this.pageSize;
          });
        }
      },
      error: (err: any) => {
        console.error("Error fetching submission popup records:", err);
      }
    });
}


  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  onSort(event: any) {

  }

  downloadfile(id: number, filename: string, flg: string) {
    var items = filename.split(".");
    this.fileService
      .downloadconresume(id, flg)
      .subscribe(blob => {
        if (items[items.length - 1] == 'pdf' || items[items.length - 1] == 'PDF') {
          var fileURL: any = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = fileURL;
          a.target = '_blank';
          a.click();
        }
        else {
          saveAs(blob, filename)
        }
      }
      );

  }
  currentPage: number = 1; // Start from page 1
      totalPages: number = 0;
  goToPage(page: number) {
        this.currentPage = page;
        this.getReqSubmissionPopupRecords();
      }
      
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.getReqSubmissionPopupRecords();
        }
      }
      
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.getReqSubmissionPopupRecords();
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
      
}
