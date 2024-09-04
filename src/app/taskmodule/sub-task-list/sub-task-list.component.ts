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
import { DialogService } from 'src/app/services/dialog.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { Subject, takeUntil } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PrivilegesService } from 'src/app/services/privileges.service';
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
} from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { AddSubTaskComponent } from './add-sub-task/add-sub-task.component';
import { SubtaskService } from '../services/subtask.service';
import { TaskDescriptionComponent } from '../task-list/task-description/task-description.component';
import { CommentsComponent } from '../comments/comments.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-sub-task-list',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    MatTooltipModule,
    RouterModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    MatMenuModule
  ],
  templateUrl: './sub-task-list.component.html',
  styleUrls: ['./sub-task-list.component.scss']
})
export class SubTaskListComponent implements OnInit {
  // Services
  private subtaskServ = inject(SubtaskService);
  private dialogServ = inject(DialogService);
  protected privilegeServ = inject(PrivilegesService);
  private snackBarServ = inject(SnackBarService);
  private route = inject(ActivatedRoute);
  private breakpointObserver = inject(BreakpointObserver);

  // To clear subscriptions
  private destroyed$ = new Subject<void>();

  // Data and State
  dataSource: any;
  hasAcces!: any;
  entity: any[] = [];
  submitted = false;
  showAlert = false;
  flag!: string;
  userid!: any;

  // SnackBar Data
  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };

  // Task-related properties
  ticketId: any;
  taskid!: string | number;
  todo: any[] = [];
  inProgress: any[] = [];
  inReview: any[] = [];
  onHold: any[] = [];
  backlog: any[] = [];
  completed: any[] = [];

  // User and Project
  showUserList = false;
  projectId!: any;
  taskId!: string | number;

  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.userid = localStorage.getItem('userid');
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.ticketId = params['ticketId'];
    });
    this.getAll();
  }

  getAll() {
    return this.subtaskServ.getsubTaskByTicketId(this.ticketId).subscribe(
      {
        next: (response: any) => {
          this.entity = response.data.subtasks;
          const subtasks = response.data.subtasks;
          this.taskid = response.data.taskId;
          this.entity = subtasks;

          this.todo = [];
          this.inProgress = [];
          this.inReview = [];
          this.onHold = [];
          this.backlog = [];
          this.completed = [];

          subtasks.forEach((subtask: any) => {
            subtask.targetdate = subtask.targetdate || 'N/A';
            subtask.remaining = subtask.assignedto.slice(4);

            switch (subtask.status) {
              case 'To Do':
                this.todo.push(subtask);
                break;
              case 'In Progress':
                this.inProgress.push(subtask);
                break;
              case 'In Review':
                this.inReview.push(subtask);
                break;
              case 'On Hold':
                this.onHold.push(subtask);
                break;
              case 'Backlog':
                this.backlog.push(subtask);
                break;
              case 'Completed':
                this.completed.push(subtask);
                break;
              default:
                console.warn(`Unknown status: ${subtask.status}`);
            }
          });

          this.todo.forEach((subtask, i) => subtask.serialNum = i + 1);
          this.inProgress.forEach((subtask, i) => subtask.serialNum = i + 1);
          this.inReview.forEach((subtask, i) => subtask.serialNum = i + 1);
          this.onHold.forEach((subtask, i) => subtask.serialNum = i + 1);
          this.backlog.forEach((subtask, i) => subtask.serialNum = i + 1);
          this.completed.forEach((subtask, i) => subtask.serialNum = i + 1);
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

  getInitials(fullname: string): string {
    const nameParts = fullname.split(' ');

    let initials = '';

    if (nameParts.length > 1) {
      initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
    } else {
      initials = nameParts[0].charAt(0) + (nameParts[0].charAt(1) || '');
    }

    return initials.toUpperCase();
  }

  addSubTask() {
    const actionData = {
      title: 'Add Sub Task',
      subtaskData: null,
      ticketId: this.ticketId,
      taskid: this.taskid,
      projectId: this.projectId,
      actionName: 'add-sub-task',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw';
    dialogConfig.disableClose = false;
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddSubTaskComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll();
      }
    });
  }

  editSubTask(subtask: Task) {
    const actionData = {
      title: 'Update Sub Task',
      subtaskData: subtask,
      ticketId: this.ticketId,
      taskid: this.taskid,
      projectId: this.projectId,
      actionName: 'edit-sub-task',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw';
    dialogConfig.disableClose = false;
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddSubTaskComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll();
      }
    });
  }

  deleteSubTask(id: number) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: id,
      actionName: 'delete-sub-task'
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
          this.subtaskServ.deleteSubTask(id).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response: any) => {
              if (response.status == 'success') {
                this.getAll();
                this.dataTobeSentToSnackBarService.message =
                  'Sub Task Deleted successfully';
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

  openDescriptionDialog(data: any) {
    const actionData = {
      subtaskData: data
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
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          dialogConfig.width = '90vw';
        } else if (result.breakpoints[Breakpoints.Small]) {
          dialogConfig.width = '70vw';
        } else if (result.breakpoints[Breakpoints.Medium]) {
          dialogConfig.width = '50vw';
        } else if (result.breakpoints[Breakpoints.Large]) {
          dialogConfig.width = '40vw';
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          dialogConfig.width = '30vw';
        }
      }

      const dialogRef = this.dialogServ.openDialogWithComponent(TaskDescriptionComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        if (dialogRef.componentInstance.submitted) {
          this.getAll();
        }
      });
    });
  }

  openCommentsDialog(data: any) {
    const actionData = {
      subtaskData: data
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
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          dialogConfig.width = '90vw';
        } else if (result.breakpoints[Breakpoints.Small]) {
          dialogConfig.width = '70vw';
        } else if (result.breakpoints[Breakpoints.Medium]) {
          dialogConfig.width = '50vw';
        } else if (result.breakpoints[Breakpoints.Large]) {
          dialogConfig.width = '40vw';
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          dialogConfig.width = '30vw';
        }
      }

      const dialogRef = this.dialogServ.openDialogWithComponent(CommentsComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        if (dialogRef.componentInstance.submitted) {
          this.getAll();
        }
      });
    });
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
          this.saveSubTaskChanges(movedTask.subTaskId, newStatus);
        }

        else if (movedTask.status === 'On Hold' && newStatus === 'In Progress') {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this.saveSubTaskChanges(movedTask.subTaskId, newStatus);
        }
        else if (this.canMoveForward(movedTask.status, newStatus)) {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this.saveSubTaskChanges(movedTask.subTaskId, newStatus);
        }
        else if (movedTask.status === 'In Progress' && formattedTargetDate && formattedTargetDate < formattedCurrentDate) {
          this.saveSubTaskChanges(movedTask.subTaskId, 'Backlog');
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

  saveSubTaskChanges(subTaskId: string, newStatus: string) {
    this.subtaskServ.updateSubTaskStatus(subTaskId, newStatus, this.userid).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.dataTobeSentToSnackBarService.message = 'Sub Task Status Updated successfully';
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
    });
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
}
