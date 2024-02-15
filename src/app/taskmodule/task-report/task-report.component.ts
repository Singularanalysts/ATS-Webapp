import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, Validators } from '@angular/forms';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { ReportsService } from 'src/app/usit/services/reports.service';
import { utils, writeFile } from 'xlsx';
import { DialogService } from 'src/app/services/dialog.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { DEPARTMENT } from 'src/app/constants/department';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-report',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './task-report.component.html',
  styleUrls: ['./task-report.component.scss']
})
export class TaskReportComponent implements OnInit {

  taskReport!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private privilegeServ = inject(PrivilegesService);
  private taskService = inject(TaskService);
  tableColumns: string[] = [
    '#',
    'Date',
    'TicketId',
    'TaskName',
    'TargetDate',
    'Status',
    'Description',
    'UserName',
  ];
  showReport: boolean = false;
  submitted: boolean = false;
  vo = new TaskReport();
  deptOptions = DEPARTMENT;

  ngOnInit(): void {
    this.taskReport = this.formBuilder.group({
      startDate: ['', Validators.required],
      targetDate: ['', Validators.required],
      department: ['', Validators.required],
    });

    // Subscribe to form value changes
    // this.taskReport.valueChanges.subscribe(() => {
    //   this.updateDisplayedColumns();
    // });
  }

  onSubmit() {

    const shoWresult = this.privilegeServ.hasPrivilege('US_M1EXCELIMP')
    this.submitted = true;
    if (this.taskReport.invalid) {
      this.showReport = false;
      return;
    }
    //consultant_report
    if (shoWresult) {
      this.showReport = true;
    } else {
      this.showReport = false;
    }

    this.vo.startDate = this.taskReport.get('startDate')?.value;
    this.vo.targetDate = this.taskReport.get('targetDate')?.value;
    this.vo.department = this.taskReport.get('department')?.value;
    
    this.taskService.task_report(this.taskReport.value).subscribe((response: any) => {
      console.log(response);
    })

    
    // console.log(JSON.stringify(this.vo) + "   ==  " + JSON.stringify(this.employeeReport.value))
    // this.taskReportservice.consultant_report(this.taskReport.value)
    //   .subscribe((data: any) => {
    //     this.c_data = data.data;
    //     //  console.log(JSON.stringify(this.c_data))
    //     this.subTotal = this.c_data.reduce((a, b) => a + b.submission, 0);
    //     this.intTotal = this.c_data.reduce((a, b) => a + b.interview, 0);
    //     this.scheduleTotal = this.c_data.reduce((a, b) => a + b.schedule, 0);
    //     this.holdTotal = this.c_data.reduce((a, b) => a + b.onhold, 0);
    //     this.closedTotal = this.c_data.reduce((a, b) => a + b.closed, 0);
    //     this.rejectTotal = this.c_data.reduce((a, b) => a + b.rejected, 0);
    //     this.onboardedCnt = this.c_data.reduce((a, b) => a + b.onboarded, 0);
    //     this.selectTotal = this.c_data.reduce((a, b) => a + b.selected, 0);
    //     this.backoutCnt = this.c_data.reduce((a, b) => a + b.backout, 0);
    //     this.consultantTotal = this.c_data.reduce((a, b) => a + b.consultant, 0); // 
    //     this.reqsTotal = this.c_data.reduce((a, b) => a + b.req_count, 0);
    //   });
  }

 

  reset() {
    this.taskReport.reset();
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

}

export class  TaskReport {
  startDate: any;
  targetDate: any;
  department: any;
}
