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
  selector: 'app-submission-report',
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
  templateUrl: './submission-report.component.html',
  styleUrls: ['./submission-report.component.scss']
})
export class SubmissionReportComponent {
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
    constructor(public dialogRef: MatDialogRef<SubmissionReportComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,){}
    dataSource = new MatTableDataSource<any>([]);
    dataTableColumns: string[] = [
      'SerialNum',
      'company',
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
  this.getrequirementdata()
}

    getrequirementdata() {
      if (!this.data?.reqnumber) {
        console.error("Requirement Number is missing");
        return;
      }
    
      this.service.submissiondata(this.data.reqnumber)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((response: any) => {
          if (response && response.data) {
            this.dataSource.data = response.data.map((item: any, index: number) => ({
              serialNum: index + 1,
              company: item.company,
              consultantName: item.consultantName,
              jobTitle:item.jobTitle,
              endClient:item.endClient,
              implPartner:item.implPartner,
              projectLocation:item.projectLocation,
              pseudoName:item.pseudoName,
              reqNumber:item.reqNumber,
              subno:item.subno,
              subStatus:item.subStatus,
              submissionRate:item.submissionRate,
              status:item.status,


            }));
          }
        });
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
