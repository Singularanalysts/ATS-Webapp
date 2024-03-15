import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { Subject, takeUntil } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewService } from 'src/app/usit/services/interview.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { AddTaskComponent } from './add-task/add-task.component';
import { TaskService } from '../services/task.service';
import { TaskUpdateComponent } from './task-update/task-update.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { Task } from 'src/app/usit/models/task';
import { AssignedUserComponent } from './assigned-user/assigned-user.component';


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
  displayedColumns: string[] = ['SerialNum', 'ticketid', 'taskname', 'description', 'targetdate', 'status','update','Actions'];
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'ticketid',
    'taskname',
    'description',
    'targetdate',
    'status',
    'update',
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
  private interviewServ = inject(InterviewService);
  private dialogServ = inject(DialogService);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);
  private snackBarServ = inject(SnackBarService);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };


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
        error: (err) => 
        console.log(err)
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
  editTask(emp: Task){
    const dataToBeSentToDailog = {
      title: 'Update Task',
      taskData: emp,
      actionName: 'edit-task',
    };
    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog,{delete: false, edit: true, add: false});
    const dialogRef =  this.dialogServ.openDialogWithComponent(AddTaskComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
        this.getAll();
    }})
  }
  addTask() {
    const actionData = {
      title: 'Add Task',
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

  deleteTask(id: number) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: id,
      actionName: 'delete-task'
    };
    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog, { delete: true, edit: false, add: false });
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe({
      next: (resp) => {
        if (dialogRef.componentInstance.allowAction) {
          // call delete api
          this.service.deleteTask(id).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response: any) => {
              if (response.status == 'success') {
                this.getAll();
                this.dataTobeSentToSnackBarService.message =
                  'Task Deleted successfully';
              } else {
                this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
                this.dataTobeSentToSnackBarService.message = 'Record Deletion failed';
              }
              this.snackBarServ.openSnackBarFromComponent(
                this.dataTobeSentToSnackBarService
              );
            },
            error: (err) => {
              this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
              this.dataTobeSentToSnackBarService.message = err.message;
              this.snackBarServ.openSnackBarFromComponent(
                this.dataTobeSentToSnackBarService
              );
            },
          });
        }
      },
    });
  }

  private getDialogConfigData(dataToBeSentToDailog: Partial<IConfirmDialogData>, action: { delete: boolean; edit: boolean; add: boolean, updateSatus?: boolean }) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = action.edit || action.add ? '62dvw' : action.delete ? 'fit-content' : "400px";
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = dataToBeSentToDailog.actionName;
    dialogConfig.data = dataToBeSentToDailog;
    return dialogConfig;
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


  // applyFilter(event: any) {
  //   const keyword = event.target.value;
  //   if (keyword != '') {
  //     return this.interviewServ.getPaginationlist(this.flag, this.hasAcces, this.userid, 1, this.itemsPerPage, keyword).subscribe(
  //       ((response: any) => {
  //         this.entity = response.data.content;
  //         this.dataSource.data = response.data.content;
  //         // for serial-num {}
  //         this.dataSource.data.map((x: any, i) => {
  //           x.serialNum = this.generateSerialNumber(i);
  //         });
  //         this.totalItems = response.data.totalElements;
  //       })
  //     );
  //   }
  //   return this.getAll()
  // }
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
  popup(id: number,tid:string){
    const actionData = {
      title: tid,
      id:id,
      Actionname:'task-details'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    // dialogConfig.panelClass = 'add-interview';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AssignedUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll();
      }
    })
  }
}


