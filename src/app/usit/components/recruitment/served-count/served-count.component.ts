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
import { DialogService } from 'src/app/services/dialog.service';
@Component({
  selector: 'app-served-count',
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
  templateUrl: './served-count.component.html',
  styleUrls: ['./served-count.component.scss']
})
export class ServedCountComponent {
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
    private service = inject(OpenreqService);
    private destroyed$ = new Subject<void>();
    constructor(public dialogRef: MatDialogRef<ServedCountComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,){}
    dataSource = new MatTableDataSource<any>([]);
    dataTableColumns: string[] = [
      'SerialNum',
      'ConsultantName',
        'JobTitle',
        'EndClient',
        'ImplementaionPartner',
        'PseudoName',
        'RequirementNumber',
        'SubmissionNumber',
        'SubStatus',
        'SubmissionRate',
        'Status',

    ];
ngOnInit(){
  this.getservedcount()
}
currentPage: number = 1; // Start from page 1
      totalPages: number = 0;
    getservedcount() {
 
      
  const payload = {
    userId: this.data?.userid, 
      pageSize: this.pageSize, 
      pageNumber: this.currentPage 
  };

  this.service.servedcount(payload)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((response: any) => {
                  if (response && response.data) {
              this.length = response.data.totalElements || response.data.length; // Update total items if API provides it
              this.totalPages = Math.ceil(this.length / this.pageSize); // Calculate total pages
      this.dataSource.data = response.data.content.map((item: any, index: number) => ({
        serialNum: index + 1 + (this.currentPage - 1) * this.pageSize,
        consultantName: item.consultantname,
              jobTitle:item.jobtitle,
              endClient:item.endclient,
              implPartner:item.implpartner,
              projectLocation:item.projectlocation,
              pseudoName:item.pseudoname,
              reqNumber:item.reqnumber,
              subno:item.subno,
              subStatus:item.status,
              submissionRate:item.submissionrate,
              status:item.substatus,


          
            }));
          }
    });


    }
     goToPage(page: number) {
        this.currentPage = page;
        this.getservedcount();
      }
      
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.getservedcount();
        }
      }
      
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.getservedcount();
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
     
    ngOnDestroy() {
      this.destroyed$.next();
      this.destroyed$.complete();
    }
    onCancel(){
      this.dialogRef.close();

    }
}
