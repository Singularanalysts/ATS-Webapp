import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TaskService } from '../../services/task.service';
import { Subject, takeUntil } from 'rxjs';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-task-update',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatDatepickerModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './task-update.component.html',
  styleUrls: ['./task-update.component.scss']
})
export class TaskUpdateComponent implements OnInit {
  displayedColumns: string[] = [ 'ticketid', 'taskname', 'description', 'targetdate','fromdate','todate', 'status'];
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'ticketid',
    'taskname',
    'description',
    'targetdate',
    'fromdate',
    'todate',
    'status',
  ];

  form!: FormGroup;
  protected isFormSubmitted: boolean = false;
  private formBuilder = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  private taskService = inject(TaskService);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  selectOptionObj = {
    noticeType: STATUS,
  };
  private snackBarServ = inject(SnackBarService);
  submitted = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<TaskUpdateComponent>
  ) { }
  userid !: any;
  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.getTrack();
    this.form = this.formBuilder.group({
      fromdate: ['', [Validators.required]],
      todate: ['', [Validators.required]],
      description: ['', [Validators.required]],
    //  duration: ['', Validators.required],
      // ttime: ['', Validators.required],
      status: ['', Validators.required],
      taskid: this.data.taskid,
      updatedby : this.userid
    });
  }

  onSubmit() {
    this.submitted = true;
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    const fromdate = this.form.get('fromdate');
    const fromdateForm = this.datePipe.transform(fromdate!.value, 'yyyy-MM-dd');
    fromdate!.setValue(fromdateForm);

    const todate = this.form.get('todate');
    const todateForm = this.datePipe.transform(todate!.value, 'yyyy-MM-dd');
    todate!.setValue(todateForm);

    if (this.form.invalid) {
      this.displayFormErrors();
      this.form.markAllAsTouched();
      this.isFormSubmitted = false;
      return;
    }
    else {
      this.isFormSubmitted = true
    }
    // this.taskService.updateTask(this.form.value).

    this.taskService
      .updateTask(this.form.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message = 'Task added successfully';
            this.dialogRef.close();
          } else {
            dataToBeSentToSnackBar.message = resp.message ? resp.message : 'Error Exists';
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          dataToBeSentToSnackBar.message = 'Task Entry is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });


  }
  getTrack() {
    this.taskService.trackByUser(this.userid).subscribe(
      ((response: any) => {
        this.dataSource.data= response.data;
        // console.log(JSON.stringify(response.data) + " ===");
      })
    );
  }
  displayFormErrors() {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

}

export const STATUS = ['Started', 'Pending', 'Dependency', 'Assigned New Task', 'Completed'] as const;
