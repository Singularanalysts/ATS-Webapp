import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import {  MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-requirementreport',
  standalone:true,
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
  templateUrl: './requirementreport.component.html',
  styleUrls: ['./requirementreport.component.scss']
})
export class RequirementreportComponent {
  totalItems: number = 0;
  length = 50;
  pageIndex = 0;
  pageSize = 25; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [25,50, 75, 100];
  pageEvent!: PageEvent;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  hidePageSize = false;
    private destroyed$ = new Subject<void>();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<RequirementreportComponent>,
) {
    console.log('Received Data:', data);
  }
    private service = inject(OpenreqService);
    ngOnInit(){
      this.getrequirementdata()
    }
      dataSource = new MatTableDataSource<any>([]);
      dataTableColumns: string[] = [
        'SerialNum',
        'RequirementNumber',
        'EmployeeType',
        'JobTitle',
        'Location',
        'PostedOn',
        'Status'
    
      ];
      currentPage: number = 1; // Start from page 1
      totalPages: number = 0;
      
      getrequirementdata() {
        if (!this.data?.userid) {
          console.error("User ID is missing");
          return;
        }
      
        const payload = {
          userId: this.data.userid,
          fromDate: this.data.fromDate || null, // Send fromDate if available, else null
          toDate: this.data.toDate || null, // Send toDate if available, else null
          pageSize: this.pageSize, // Number of items per page
          pageNumber: this.currentPage // Page number (1-based index)
        };
      
        this.service.Requirementsreport(payload)
          .pipe(takeUntil(this.destroyed$))
          .subscribe((response: any) => {
            if (response && response.data) {
              this.length = response.data.totalElements || response.data.length; // Update total items if API provides it
              this.totalPages = Math.ceil(this.length / this.pageSize); // Calculate total pages
      
              this.dataSource.data = response.data.content.map((item: any, index: number) => ({
                serialNum: index + 1 + ((this.currentPage - 1) * this.pageSize), // Maintain serial number across pages
                reqnumber: item.reqnumber,
                employmenttype: item.employmenttype,
                jobtitle: item.jobtitle,
                location: item.location,
                postedon: item.postedon,
                status: item.status
              }));
            }
          });
      }
      
      // Go to specific page
      goToPage(page: number) {
        this.currentPage = page;
        this.getrequirementdata();
      }
      
      // Next Page
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.getrequirementdata();
        }
      }
      
      // Previous Page
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.getrequirementdata();
        }
      }
      
      // Generate array of page numbers
      getPageNumbers(): any[] {
        const visiblePages = 4; // Range of 4 in the middle
        const pageNumbers: any[] = [];
      
        if (this.totalPages <= 6) {
          return Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
      
        pageNumbers.push(1); // Always show first page
      
        let start = Math.max(2, this.currentPage - Math.floor(visiblePages / 2));
        let end = Math.min(this.totalPages - 1, start + visiblePages - 1);
      
        if (end === this.totalPages - 1) {
          start = Math.max(2, this.totalPages - visiblePages);
        }
      
        for (let i = start; i <= end; i++) {
          pageNumbers.push(i);
        }
      
        if (end < this.totalPages - 1) {
          pageNumbers.push("..."); // Show ellipsis if there are more pages
        }
      
        pageNumbers.push(this.totalPages); // Always show last page
      
        return pageNumbers;
      }
      
     
    ngOnDestroy() {
      this.destroyed$.next();
      this.destroyed$.complete();
    }
    onCancel(){
      this.dialogRef.close();

    }
    getStatusClass(status: string): string {
      switch (status?.toLowerCase()) {
        case 'active':
          return 'status-active';
        case 'inactive':
          return 'status-inactive';
        case 'on hold':
          return 'status-onhold';
        default:
          return '';
      }
    }
    
}
