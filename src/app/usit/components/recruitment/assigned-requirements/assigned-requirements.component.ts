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
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from 'src/app/material.module';
import { MatDialogConfig } from '@angular/material/dialog';
import { RequirementReportComponent } from '../../reports/employee-reports/requirement-report/requirement-report.component';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { AssignedCountComponent } from '../assigned-count/assigned-count.component';
import { ServedCountComponent } from '../served-count/served-count.component';

@Component({
  selector: 'app-assigned-requirements',
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
  templateUrl: './assigned-requirements.component.html',
  styleUrls: ['./assigned-requirements.component.scss']
})
export class AssignedRequirementsComponent {
  RequirementReport!: FormGroup;
  private dialogServ = inject(DialogService);
    protected privilegeServ = inject(PrivilegesService);

  private router = inject(Router);

  private service = inject(OpenreqService);
  private destroyed$ = new Subject<void>();
  constructor(private fb: FormBuilder) {
    this.RequirementReport = this.fb.group({
      startDate: [null,[Validators.required]],  
      endDate: [null,[Validators.required]]
    });
  }
  // onSubmit() {
  //   const fromDate = this.RequirementReport.value.startDate;
  //   const toDate = this.RequirementReport.value.endDate;
  
  //   if (!fromDate || !toDate) {
  //     this.RequirementReport.markAllAsTouched();
  //     console.error("Both start and end dates are required");
  //     return;
  //   }
  
  //   this.getAssignedRequirements(fromDate, toDate);
  // }
  onSubmit() {
    const fromDate = this.RequirementReport.value.startDate;
    const toDate = this.RequirementReport.value.endDate;
  
    if (!fromDate || !toDate) {
      this.RequirementReport.markAllAsTouched();
      console.error("Both start and end dates are required");
      return;
    }
  
    const formattedFromDate = this.formatDate(fromDate);
    const formattedToDate = this.formatDate(toDate);
  
    this.getAssignedRequirements(formattedFromDate, formattedToDate);
  }
  
  servedcount(element:any){
     const fromDate = this.RequirementReport.value.startDate;
  const toDate = this.RequirementReport.value.endDate;
    const actionData = {
              title: 'Assigned Requirements Served Count Report',
              userid: element.userid,
              fromDate: fromDate ? this.formatDate(fromDate) : null,
    toDate: toDate ? this.formatDate(toDate) : null,
              actionName: 'requirement-report'
            };     
              const dialogConfig = new MatDialogConfig();
                dialogConfig.width = '70vw';
                dialogConfig.disableClose = false;
                dialogConfig.panelClass = 'add-interview';
                dialogConfig.data = actionData; 
              
                const dialogRef = this.dialogServ.openDialogWithComponent(ServedCountComponent, dialogConfig);
              
                dialogRef.afterClosed().subscribe((result: { success: any }) => {
                  if (result?.success) {  
                  }
                });
  }

formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

  
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'ExecutiveName',
    'RequirementCount',
     'ServedCount'
  ];


  // ngOnInit(): void {
  //   this.getAssignedRequirements(null, null);
  // }

ngOnInit(): void {
  const state: any = history.state;
console.log('statee',state)
  if (state?.preservedState) {
    // Restore state if coming back
    const { startDate, endDate, tableData } = state.preservedState;

    this.RequirementReport.patchValue({
      startDate,
      endDate,
    });
         
    this.dataSource.data = tableData;

    const formattedFromDate = this.formatDate(startDate);
    const formattedToDate = this.formatDate(endDate);
    console.log('formattedToDate',formattedFromDate,formattedToDate)
    this.getAssignedRequirements(formattedFromDate, formattedToDate);

  } else {
    // On initial load, send nulls
    this.getAssignedRequirements(null, null);
  }
}


  getAssignedRequirements(fromDate: string | null, toDate: string | null) {
   
const cid =localStorage.getItem('companyid')
    const payload = { fromDate, toDate ,cid};


    this.service.assignedrequirements(payload)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        if (response && response.data) {
          this.dataSource.data = response.data.map((item: any, index: number) => ({
            serialNum: index + 1,
            pseudoname: item.pseudoname,
            requirementsCount: item.requirementsCount,
            served_count: item.served_count,

            userid:item.userid
          }));
        }
      });
  }
  exportExcel(): void {
    // Map data to exclude the 'userid' field
    const exportData = this.dataSource.data.map(item => ({
      SerialNum: item.serialNum,
      ExecutiveName: item.pseudoname,
      RequirementCount: item.requirementsCount,
      ServedCount:item.served_count
    }));

    // Generate a worksheet from the mapped data
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    // Create a new workbook and add the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AssignedRequirements');

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, 'AssignedRequirements.xlsx');
  }

  reset(){
    this.RequirementReport.reset();
    this.getAssignedRequirements(null, null); 
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  
 
  // requirementreportdata(element: any) {
  //   const fromDate = this.RequirementReport.value.startDate ? this.formatDate(this.RequirementReport.value.startDate) : null;
  //   const toDate = this.RequirementReport.value.endDate ? this.formatDate(this.RequirementReport.value.endDate) : null;
  
  //   const actionData = {
  //     title: 'Requirement Report',
  //     userid: element.userid,
  //     pseudoname: element.pseudoname,
  //     fromDate: fromDate,
  //     toDate: toDate,
  //     actionName: 'requirement-report'
  //   };
  
  //   this.router.navigate(['/usit/requirement-reportdata'], { state: { data: actionData } });
  // }

requirementreportdata(element: any) {
  const fromDate = this.RequirementReport.value.startDate;
  const toDate = this.RequirementReport.value.endDate;

  const actionData = {
    title: 'Requirement Report',
    userid: element.userid,
    pseudoname: element.pseudoname,
    fromDate: fromDate ? this.formatDate(fromDate) : null,
    toDate: toDate ? this.formatDate(toDate) : null,
    actionName: 'requirement-report'
  };

  this.router.navigate(['/usit/requirement-reportdata'], {
    state: {
      data: actionData,
      preservedState: {
        startDate: fromDate,
        endDate: toDate,
        tableData: this.dataSource.data
      }
    }
  });
}

  
  refreshForm(){
    this.RequirementReport.reset();
   this.getAssignedRequirements(null, null); 

  }
  goback(){
    this.router.navigate(['/usit/rec-requirements']);
  }
  }
  
