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
import { RequirementreportComponent } from '../requirementreport/requirementreport.component';
import { Router } from '@angular/router';

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

  private router = inject(Router);

  private service = inject(OpenreqService);
  private destroyed$ = new Subject<void>();
  constructor(private fb: FormBuilder) {
    this.RequirementReport = this.fb.group({
      startDate: [null,[Validators.required]],  
      endDate: [null,[Validators.required]]
    });
  }
  onSubmit() {
    const fromDate = this.RequirementReport.value.startDate;
    const toDate = this.RequirementReport.value.endDate;
  
    if (!fromDate || !toDate) {
      this.RequirementReport.markAllAsTouched();
      console.error("Both start and end dates are required");
      return;
    }
  
    this.getAssignedRequirements(fromDate, toDate);
  }
  
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'ExecutiveName',
    'RequirementCount',

  ];


  ngOnInit(): void {
    this.getAssignedRequirements(null, null);
  }


  getAssignedRequirements(fromDate: string | null, toDate: string | null) {
   

    const payload = { fromDate, toDate };


    this.service.assignedrequirements(payload)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        if (response && response.data) {
          this.dataSource.data = response.data.map((item: any, index: number) => ({
            serialNum: index + 1,
            pseudoname: item.pseudoname,
            requirementsCount: item.requirementsCount,
            userid:item.userid
          }));
        }
      });
  }
  reset(){
    this.RequirementReport.reset();
    this.getAssignedRequirements(null, null); 
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  requirementreportdata(element: any) {
    const fromDate = this.RequirementReport.value.startDate || null;
    const toDate = this.RequirementReport.value.endDate || null;
  
    const actionData = {
      title: 'Requirement Report',
      userid: element.userid,
      fromDate: fromDate, 
      toDate: toDate,
      actionName: 'requirement-report'
    };
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-interview';
    dialogConfig.data = actionData; 
  
    const dialogRef = this.dialogServ.openDialogWithComponent(RequirementreportComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe((result: { success: any }) => {
      if (result?.success) {  
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
  
