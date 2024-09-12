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
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { Subject, take, takeUntil } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { AddTaskComponent } from './add-task/add-task.component';
import { TaskService } from '../services/task.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { Task } from 'src/app/usit/models/task';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { TaskDescriptionComponent } from './task-description/task-description.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommentsComponent } from '../comments/comments.component';

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
    MatTooltipModule,
    RouterModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    MatMenuModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  private taskServ = inject(TaskService);
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
  private dialogServ = inject(DialogService);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);
  private snackBarServ = inject(SnackBarService);
  private route = inject(ActivatedRoute);
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
  sortField = 'status';
  sortOrder = 'desc';
  projectId: any;
  pid!: string | number;
  todo: any[] = [];
  inProgress: any[] = [];
  inReview: any[] = [];
  onHold: any[] = [];
  backlog: any[] = [];
  completed: any[] = [];
  showUserList = false;
  private breakpointObserver = inject(BreakpointObserver);

  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.userid = localStorage.getItem('userid');
    this.getAll();
  }

  getAll(pagIdx = 1) {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
      const taskObj = {
        pageNumber: pagIdx,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        keyword: this.field,
        projectid: this.projectId
      }

      return this.taskServ.getAllTasksOfProject(taskObj).pipe(takeUntil(this.destroyed$)).subscribe(
        {
          next: (response: any) => {
            this.entity = response.data.tasks;
            this.dataSource.data = response.data.tasks;
            const tasks = response.data.tasks;
            this.pid = response.data.pid;
            this.entity = tasks;
            this.dataSource.data = tasks;

            this.todo = [];
            this.inProgress = [];
            this.inReview = [];
            this.onHold = [];
            this.backlog = [];
            this.completed = [];

            tasks.forEach((task: any) => {
              task.targetdate = task.targetdate || 'N/A';
              task.remaining = task.assignUsers.slice(4);

              switch (task.status) {
                case 'To Do':
                  this.todo.push(task);
                  break;
                case 'In Progress':
                  this.inProgress.push(task);
                  break;
                case 'In Review':
                  this.inReview.push(task);
                  break;
                case 'On Hold':
                  this.onHold.push(task);
                  break;
                case 'Backlog':
                  this.backlog.push(task);
                  break;
                case 'Completed':
                  this.completed.push(task);
                  break;
                default:
                  console.warn(`Unknown status: ${task.status}`);
              }
            });

            this.todo.forEach((task, i) => task.serialNum = i + 1);
            this.inProgress.forEach((task, i) => task.serialNum = i + 1);
            this.inReview.forEach((task, i) => task.serialNum = i + 1);
            this.onHold.forEach((task, i) => task.serialNum = i + 1);
            this.backlog.forEach((task, i) => task.serialNum = i + 1);
            this.completed.forEach((task, i) => task.serialNum = i + 1);
            this.dataSource.data.map((x: any, i) => {
              x.serialNum = i + 1;
            });
          },
          error: (err: any) => {
            this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
            this.dataTobeSentToSnackBarService.message = err.message;
            this.snackBarServ.openSnackBarFromComponent(
              this.dataTobeSentToSnackBarService
            );
          }
        }
      );
    });

  }

  getInitials(fullName: string): string {
    const nameParts = fullName.split(' ');

    let initials = '';

    if (nameParts.length > 1) {
      initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
    } else {
      initials = nameParts[0].charAt(0) + (nameParts[0].charAt(1) || '');
    }

    return initials.toUpperCase();
  }

  addTask() {
    const actionData = {
      title: 'Add Task',
      taskData: null,
      projectId: this.projectId,
      pid: this.pid,
      actionName: 'add-task',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = actionData;
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).pipe(
      take(1)
    ).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        dialogConfig.width = '80vw';
      } else if (result.breakpoints[Breakpoints.Small]) {
        dialogConfig.width = '70vw';
      } else if (result.breakpoints[Breakpoints.Medium]) {
        dialogConfig.width = '50vw';
      } else if (result.breakpoints[Breakpoints.Large]) {
        dialogConfig.width = '40vw';
      } else if (result.breakpoints[Breakpoints.XLarge]) {
        dialogConfig.width = '30vw';
      }

      const dialogRef = this.dialogServ.openDialogWithComponent(AddTaskComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        if (dialogRef.componentInstance.submitted) {
          this.getAll();
        }
      });
    });

  }

  editTask(task: Task) {
    const actionData = {
      title: 'Update Task',
      taskData: task,
      projectId: this.projectId,
      pid: this.pid,
      actionName: 'edit-task',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = actionData;

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).pipe(
      take(1)
    ).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        dialogConfig.width = '80vw';
      } else if (result.breakpoints[Breakpoints.Small]) {
        dialogConfig.width = '70vw';
      } else if (result.breakpoints[Breakpoints.Medium]) {
        dialogConfig.width = '50vw';
      } else if (result.breakpoints[Breakpoints.Large]) {
        dialogConfig.width = '40vw';
      } else if (result.breakpoints[Breakpoints.XLarge]) {
        dialogConfig.width = '30vw';
      }

      const dialogRef = this.dialogServ.openDialogWithComponent(AddTaskComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        if (dialogRef.componentInstance.submitted) {
          this.getAll();
        }
      });
    });
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
          this.taskServ.deleteTask(id).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response: any) => {
              if (response.status == 'success') {
                this.getAll();
                this.dataTobeSentToSnackBarService.message =
                  'Task Deleted successfully';
              } else {
                this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
                this.dataTobeSentToSnackBarService.message = response.message;
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

  openDescriptionDialog(data: any) {
    const actionData = {
      taskData: data
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = actionData;

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).pipe(
      take(1)
    ).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        dialogConfig.width = '80vw';
      } else if (result.breakpoints[Breakpoints.Small]) {
        dialogConfig.width = '70vw';
      } else if (result.breakpoints[Breakpoints.Medium]) {
        dialogConfig.width = '60vw';
      } else if (result.breakpoints[Breakpoints.Large]) {
        dialogConfig.width = '50vw';
      } else if (result.breakpoints[Breakpoints.XLarge]) {
        dialogConfig.width = '40vw';
      }

      const dialogRef = this.dialogServ.openDialogWithComponent(TaskDescriptionComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        if (dialogRef.componentInstance.submitted) {
          this.getAll();
        }
      });
    });

  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAll()
    }
    return;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(undefined);
    this.destroyed$.complete()
  }

  drop(event: CdkDragDrop<any[]>) {
    const previousContainer = event.previousContainer;
    const currentContainer = event.container;
  
    const statusMapping = {
      todo: 'To Do',
      inProgress: 'In Progress',
      onHold: 'On Hold',
      backlog: 'Backlog',
      inReview: 'In Review',
      completed: 'Completed',
    } as const;
  
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedTask = previousContainer.data[event.previousIndex];
      const newStatusKey = this.getListStatus(currentContainer.data) as keyof typeof statusMapping;
      const newStatus = statusMapping[newStatusKey];

      const currentDate = new Date();
      const formattedCurrentDate = this.formatDate(currentDate);
  
      if (movedTask) {
        const targetDateStr = movedTask.targetDate;
        let formattedTargetDate: string | null = null;

        if (targetDateStr && targetDateStr !== 'N/A') {
          formattedTargetDate = targetDateStr;

          const dateParts = formattedTargetDate!.split('-');
          if (dateParts.length === 3) {
            const [year, month, day] = dateParts.map(Number);
            if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            } else {
              formattedTargetDate = null;
            }
          } else {
            formattedTargetDate = null;
          }
        }

        if (newStatus === 'Backlog' && formattedTargetDate && formattedTargetDate < formattedCurrentDate) {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this.saveTaskChanges(movedTask.taskid, newStatus);
        }
        else if (movedTask.status === 'On Hold' && newStatus === 'In Progress') {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this.saveTaskChanges(movedTask.taskid, newStatus);
        } else if (
          movedTask.status === 'In Progress' &&
          new Date(movedTask.targetdate) < currentDate
        ) {
          this.saveTaskChanges(movedTask.taskid, 'Backlog');
        } else if (this.canMoveForward(movedTask.status, newStatus)) {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this.saveTaskChanges(movedTask.taskid, newStatus);
        }
      }
    }
  }

  isPastDue(targetDate: string): boolean {
    const todayFormatted = this.formatDate(new Date());
    return targetDate < todayFormatted;
  }
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  canMoveForward(currentStatus: string, newStatus: string): boolean {
    const statusOrder = [
      'Backlog',
      'To Do',
      'In Review',
      'In Progress',
      'On Hold',
      'Completed',
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const newIndex = statusOrder.indexOf(newStatus);
  
    return newIndex > currentIndex;
  }

  saveTaskChanges(taskId: string, newStatus: string) {
    this.taskServ.updateTaskStatus(taskId, newStatus, this.userid).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.dataTobeSentToSnackBarService.message = 'Task Status Updated successfully';
          this.getAll();
        } else {
          this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
          this.dataTobeSentToSnackBarService.message = response.message;
        }
        this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
      },
      error: (error: any) => {
        this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
        this.dataTobeSentToSnackBarService.message = error.message;
        this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
      }
    }
    );
  }

  getListStatus(list: any[]): string {
    if (list === this.todo) return 'todo';
    if (list === this.inProgress) return 'inProgress';
    if (list === this.inReview) return 'inReview';
    if (list === this.onHold) return 'onHold';
    if (list === this.backlog) return 'backlog';
    if (list === this.completed) return 'completed';
    return '';
  }

  toggleUserList() {
    this.showUserList = !this.showUserList;
  }

  openSubTasks(card: any): void {
    const projectId = this.projectId;
    const ticketId = card.ticketid;
    this.router.navigate([`/task-management/projects/${projectId}/tasks/${ticketId}/subtasks`]);
  }
  
  openCommentsDialog(data: any) {
    const actionData = {
      actionName: 'add-task-comments',
      taskData: data
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = actionData;
  
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).pipe(
      take(1)
    ).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        dialogConfig.width = '80vw';
      } else if (result.breakpoints[Breakpoints.Small]) {
        dialogConfig.width = '70vw';
      } else if (result.breakpoints[Breakpoints.Medium]) {
        dialogConfig.width = '60vw';
      } else if (result.breakpoints[Breakpoints.Large]) {
        dialogConfig.width = '50vw';
      } else if (result.breakpoints[Breakpoints.XLarge]) {
        dialogConfig.width = '40vw';
      }
  
      const dialogRef = this.dialogServ.openDialogWithComponent(CommentsComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        if (dialogRef.componentInstance.submitted) {
          this.getAll();
        }
      });
    });
  }
  

  applyFilter(event: any) {
    const keyword = event.target.value;
    if (keyword != '') {
      const taskObj = {
        pageNumber: 1,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        keyword: keyword,
        projectid: this.projectId
      }
      return this.taskServ.getAllTasksOfProject(taskObj).pipe(takeUntil(this.destroyed$)).subscribe(
        {
          next: (response: any) => {
            this.entity = response.data.tasks;
            this.dataSource.data = response.data.tasks;
            const tasks = response.data.tasks;
            this.pid = response.data.pid;
            this.entity = tasks;
            this.dataSource.data = tasks;

            this.todo = [];
            this.inProgress = [];
            this.inReview = [];
            this.onHold = [];
            this.backlog = [];
            this.completed = [];

            tasks.forEach((task: any) => {
              task.targetdate = task.targetdate || 'N/A';
              task.remaining = task.assignUsers.slice(4);

              switch (task.status) {
                case 'To Do':
                  this.todo.push(task);
                  break;
                case 'In Progress':
                  this.inProgress.push(task);
                  break;
                case 'In Review':
                  this.inReview.push(task);
                  break;
                case 'On Hold':
                  this.onHold.push(task);
                  break;
                case 'Backlog':
                  this.backlog.push(task);
                  break;
                case 'Completed':
                  this.completed.push(task);
                  break;
                default:
                  console.warn(`Unknown status: ${task.status}`);
              }
            });

            this.todo.forEach((task, i) => task.serialNum = i + 1);
            this.inProgress.forEach((task, i) => task.serialNum = i + 1);
            this.inReview.forEach((task, i) => task.serialNum = i + 1);
            this.onHold.forEach((task, i) => task.serialNum = i + 1);
            this.backlog.forEach((task, i) => task.serialNum = i + 1);
            this.completed.forEach((task, i) => task.serialNum = i + 1);
            this.dataSource.data.map((x: any, i) => {
              x.serialNum = i + 1;
            });
          },
          error: (err: any) => {
            this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
            this.dataTobeSentToSnackBarService.message = err.message;
            this.snackBarServ.openSnackBarFromComponent(
              this.dataTobeSentToSnackBarService
            );
          }
        }
      );
    }
    return this.getAll();
  }
}