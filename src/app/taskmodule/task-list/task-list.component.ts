import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { Subject, takeUntil } from 'rxjs';
import {  MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewService } from 'src/app/usit/services/interview.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { AddTaskComponent } from './add-task/add-task.component';
import { TaskService } from '../services/task.service';
import { TaskUpdateComponent } from './task-update/task-update.component';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  private service = inject(TaskService);
  displayedColumns: string[] = ['SerialNum', 'ticketid', 'taskname', 'description', 'targetdate', 'status', 'Actions'];
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'ticketid',
    'taskname',
    'description',
    'targetdate',
    'status',
    'Action',
  ];
  hasAcces!: any;
  entity: any[] = [];
  submitted = false;
  showAlert = false;
  flag!: string;
  searchstring!: any;
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum !: any;
  totalItems: any;
  ser: number = 1;
  userid!: any;
  field = "empty";
  currentPageIndex = 0;
  pageEvent!: PageEvent;
  pageSize = 50;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageSizeOptions = [5, 10, 25];
  // services
  private activatedRoute = inject(ActivatedRoute);
  private interviewServ = inject(InterviewService);
  private dialogServ = inject(DialogService);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);
  private snackBarServ = inject(SnackBarService);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  

  
  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.userid = localStorage.getItem('userid');
    this.getAll();
  }

  getAll() {
    return this.service.getAllTasks().pipe(takeUntil(this.destroyed$)).subscribe(
      {
        next: (response: any) => {
          this.entity = response.data;
          this.dataSource.data = response.data;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = i + 1;
          });
        },
        error: (err) => console.log(err)
      }
    );
    /*this.userid = localStorage.getItem('userid');
    this.interviewServ.getPaginationlist(this.flag, this.hasAcces, this.userid, pagIdx, this.itemsPerPage, this.field)
    .pipe(takeUntil(this.destroyed$)).subscribe(

      (response: any) => {
        this.entity = response.data.content;
        this.dataSource.data = response.data.content;
        this.totalItems = response.data.totalElements;
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      }
    )
    */
  }

  addInterview() {
    const actionData = {
      title: 'Add Task',
      // interviewData: null,
      // actionName: 'add-interview',
      // flag: this.flag,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    // dialogConfig.panelClass = 'add-interview';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddTaskComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll();
      }
    })
  }

  updateTask(element: any) {
    const actionData = {
      title: 'Update Task',
      // interviewData: null,
      // actionName: 'add-interview',
      // flag: this.flag,
      taskid: element.taskid
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    // dialogConfig.panelClass = 'add-interview';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(TaskUpdateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll();
      }
    })
  }


  applyFilter(event: any) {
    const keyword = event.target.value;
    if (keyword != '') {
      return this.interviewServ.getPaginationlist(this.flag, this.hasAcces, this.userid, 1, this.itemsPerPage, keyword).subscribe(
        ((response: any) => {
          this.entity = response.data.content;
          this.dataSource.data = response.data.content;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
          this.totalItems = response.data.totalElements;
        })
      );
    }
    return this.getAll()
  }
  onSort(event: any) {
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  getRowStyles(row: any): any {
    const intStatus = row.interview_status;
    let backgroundColor = '';
    let color = '';
    switch (intStatus) {
      case 'OnBoarded':
        backgroundColor = 'rgba(40, 160, 76, 0.945)';
        color = 'white';
        break;
      case 'Selected':
        backgroundColor = 'rgba(243, 208, 9, 0.945)';
        color = '';
        break;
      case 'Hold':
        backgroundColor = 'rgba(243, 208, 9, 0.945)';
        color = '';
        break;
      case 'Rejected':
        backgroundColor = '';
        color = 'rgba(177, 19, 19, 0.945)';
        break;
      default:
        backgroundColor = '';
        color = '';
        break;
    }
    return { 'background-color': backgroundColor, 'color': color };
  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAll()
    }
    return;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  ngOnDestroy(): void {
    this.destroyed$.next(undefined);
    this.destroyed$.complete()
  }

  goToUserInfo(id: number) {
    this.router.navigate(['usit/user-info', id])
  }
}
