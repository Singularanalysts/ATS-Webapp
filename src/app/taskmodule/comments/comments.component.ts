import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SubtaskService } from '../services/subtask.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {
  
  comments: any;
  newComment: string = '';
  private subtaskServ = inject(SubtaskService);
  private taskServ = inject(TaskService);
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  private snackBarServ = inject(SnackBarService);
  userName!: string | null;
  ticketid: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<CommentsComponent>
  ) { }

  ngOnInit() {
    this.ticketid = this.data.ticketid || this.data.taskData.ticketid;
    const taskId = this.data.taskData?.taskid;
    const subtaskId = this.data.subtaskData?.subTaskId;
    if(this.data.actionName === 'add-sub-task-comments') {
      this.subtaskServ.subtaskComments(subtaskId).subscribe({
        next: (response: any) => {
          this.comments = response.data;
        },
        error: (err: any) => {
          this.dataToBeSentToSnackBar.message = err.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
      })
    } else {
      this.taskServ.taskComments(taskId).subscribe({
        next: (response: any) => {
          this.comments = response.data;
        },
        error: (err: any) => {
          this.dataToBeSentToSnackBar.message = err.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
      })

    }
  }

  getUserInitials(fullname: string) {
    const nameParts = fullname.split(' ');
    let initials = '';
    if (nameParts.length > 1) {
      initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
    } else {
      initials = nameParts[0].charAt(0) + (nameParts[0].charAt(1) || '');
    }
    return initials.toUpperCase();
  }

  addComment(): void {
    if (this.newComment.trim()) {
      // Check if actionName equals 'add-task-comments'
      if (this.data.actionName === 'add-task-comments') {
        const taskCommentData = {
          comments: this.newComment,
          taskid: this.data.taskData?.taskid,
          status: this.data.taskData?.status,
          ticketid: this.ticketid,
          updatedby: localStorage.getItem('userid')
        };
        this.taskServ.addComments(taskCommentData).subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
              this.dataToBeSentToSnackBar.message = 'Comments added successfully';
              this.dialogRef.close();
            } else {
              this.dataToBeSentToSnackBar.message = response.message;
            }
            this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
          },
          error: (err: any) => {
            this.dataToBeSentToSnackBar.message = err.message;
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
          }
        });
      } else {
        const subtaskCommentData = {
          comments: this.newComment,
          subTaskId: this.data.subtaskData?.subTaskId,
          status: this.data.subtaskData?.status,
          ticketid: this.ticketid,
          updatedby: localStorage.getItem('userid')
        };
        this.subtaskServ.addSubtaskComments(subtaskCommentData).subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
              this.dataToBeSentToSnackBar.message = 'Comments added successfully';
              this.dialogRef.close();
            } else {
              this.dataToBeSentToSnackBar.message = response.message;
            }
            this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
          },
          error: (err: any) => {
            this.dataToBeSentToSnackBar.message = err.message;
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
          }
        });
      }
      
      // Reset the new comment input field
      this.newComment = '';
    }
  }
  
  onClose() {
    this.dialogRef.close();
  }
}
