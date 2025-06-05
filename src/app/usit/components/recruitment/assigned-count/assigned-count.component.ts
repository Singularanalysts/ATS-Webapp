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
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import {  MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { Router } from '@angular/router';
import { SubmissionReportComponent } from '../submission-report/submission-report.component';
import { DialogService } from 'src/app/services/dialog.service';
@Component({
  selector: 'app-assigned-count',
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
  templateUrl: './assigned-count.component.html',
  styleUrls: ['./assigned-count.component.scss']
})
export class AssignedCountComponent {
 totalItems: number = 0;
  length = 50;
  pageIndex = 0;
  pageSize = 25; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [25,50, 75, 100];
  pageEvent!: PageEvent;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
    private dialogServ = inject(DialogService);
  
  hidePageSize = false;
      protected privilegeServ = inject(PrivilegesService);
    private destroyed$ = new Subject<void>();
    data: any = {}; // Store received data
pseudoname:any
    constructor(private router: Router) {
      console.log('Received Data from Routing:', history.state.data);
      if (history.state.data) {
        this.data = history.state.data;
        this.pseudoname=history.state.data.pseudoname
        console.log(this.pseudoname,'pseudonammeee');
        
      }
    }
  
    ngOnInit(): void {
      if (!this.data || !this.data.userid) {
        console.warn('No valid data received');
        return;
      }
  
      // Call your API with the received data
      this.getrequirementdata();
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
      private service = inject(OpenreqService);

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
      exportExcel(): void {
        const exportData = this.dataSource.data.map(item => ({
          'S.No': item.serialNum,
          'Requirement Number': item.reqnumber,
          'Employee Type': item.employmenttype,
          'Job Title': item.jobtitle,
          'Location': item.location,
          'Posted On': item.postedon,
          'Status': item.status
        }));
    
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'RequirementsReport');
    
        XLSX.writeFile(workbook, 'RequirementsReport.xlsx');
      }
      goToPage(page: number) {
        this.currentPage = page;
        this.getrequirementdata();
      }
      
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.getrequirementdata();
        }
      }
      
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.getrequirementdata();
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
      
     
    ngOnDestroy() {
      this.destroyed$.next();
      this.destroyed$.complete();
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
   goback() {
  const preservedState = history.state?.preservedState;
  this.router.navigate(['/usit/assigned-requirements'], {
    state: { preservedState }
  });
}

}
