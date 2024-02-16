import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginatorModule
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, Validators } from '@angular/forms';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { DEPARTMENT } from 'src/app/constants/department';
import { TaskService } from '../services/task.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { AssignedUserComponent } from '../task-list/assigned-user/assigned-user.component';

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
  private dialogServ = inject(DialogService);
  taskReport!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private privilegeServ = inject(PrivilegesService);
  private taskService = inject(TaskService);
  tableColumns: string[] = [
    '#',
    'TicketId',
    'TaskName',
    'Date',
    'TargetDate',
    'Status',
    'Description',
    'UserName',
  ];
  dataArr: any[] = [];
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
      this.dataArr = response.data;

    })
  }
  reset() {
    this.taskReport.reset();
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }
  popup(id: number, tid: string) {
    const actionData = {
      title: tid,
      id: id,
      Actionname: 'task-details'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    // dialogConfig.panelClass = 'add-interview';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AssignedUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        // this.getAll();
      }
    })
  }


}

export class TaskReport {
  startDate: any;
  targetDate: any;
  department: any;
}
