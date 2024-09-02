import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  Inject,
  inject} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TaskService } from '../../services/task.service';
import { DEPARTMENT } from 'src/app/constants/department';

interface DropdownItem {
  item_id: number;
  item_text: string;
}

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatChipsModule,
    NgMultiSelectDropDownModule,
    MatCheckboxModule
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  deptOptions = DEPARTMENT;
  taskForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private snackBarServ = inject(SnackBarService);
  private taskServ = inject(TaskService);
  protected isFormSubmitted: boolean = false;
  submitted = false;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  isAllOptionsSelected = false;
  entity: any;
  private datePipe = inject(DatePipe);
  dropdownList!: DropdownItem[];
  selectedItems!: DropdownItem[];
  dropdownSettings!: IDropdownSettings;
  pid: string | null = null;
  employeeData: any;
  statusType = [
    'To Do',
    'In Progress',
    'On Hold',
    'In Review',
    'Backlogs',
    'Completed',
  ]
  projectId: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddTaskComponent>
  ) { }

  ngOnInit(): void {
    this.projectId = this.data.projectId;
    this.pid = this.data.pid;
    this.getEmployee();
    this.initializeTaskForm(null);
    if (this.data.actionName === 'edit-task') {
      this.initializeTaskForm(null);
      this.taskServ.getTaskById(this.data.taskData.taskid).subscribe(
        (response: any) => {
          if (response && response.data) {
            this.initializeTaskForm(response.data)
          }
        }
      )
    }
  }

  get assignedToControl(): FormControl {
    const control = this.taskForm.get('assignedto');
    if (control instanceof FormControl) {
      return control;
    } else {
      throw new Error('Form control is not of type FormControl');
    }
  }
  

  private initializeTaskForm(taskData: any) {
    this.taskForm = this.formBuilder.group({
      pid: [this.pid, Validators.required],
      taskid: [taskData ? taskData.taskid : ''],
      targetdate: [taskData ? taskData.targetdate : '', Validators.required],
      taskname: [taskData ? taskData.taskname : '', Validators.required],
      description: [taskData ? taskData.description : '', Validators.required],
      department: [taskData ? taskData.department : 'Software'],
      assignedto: [taskData ? taskData.assignedto : [], Validators.required],
      addedby: [taskData ? taskData.addedby : localStorage.getItem('userid')],
      status: [taskData ? taskData.status : 'To Do'],
      updatedby: [this.data.actionName === "edit-task" ? localStorage.getItem('userid') : null]
    });

  }

  get controls() {
    return this.taskForm.controls;
  }

  getEmployee() {
    this.taskServ.getUsersByProject(this.projectId).subscribe(
      (response: any) => {
        this.employeeData = response.data;
        this.dropdownSettings = {
          idField: 'userid',
          textField: 'fullname',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 3,
          allowSearchFilter: true
        };
      }
    )
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
    const TargetDate = this.taskForm.get('targetdate');
    const targetDateForm = this.datePipe.transform(TargetDate!.value, 'yyyy-MM-dd');
    TargetDate!.setValue(targetDateForm);
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.isFormSubmitted = false;
      return;
    }
    else{
      this.isFormSubmitted = true
    }
    const saveReqObj = this.getSaveData();
    this.taskServ
      .addORUpdateTask(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-task'
                ? 'Task added successfully'
                : 'Task updated successfully';
            this.dialogRef.close();
          } else {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-task'
                ? 'Task addition is failed'
                : 'Task updation is failed';
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          dataToBeSentToSnackBar.message = err.message;
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  onCancel() {
    this.dialogRef.close();
  }
 
  getSaveData() { 
    const formValue = this.taskForm.value;
    const transformedData = {
      project: {
        pid: formValue.pid
      },
      targetdate: formValue.targetdate,
      taskid: formValue.taskid,
      taskname: formValue.taskname,
      description: formValue.description,
      department: formValue.department,
      assignedto: formValue.assignedto,
      addedby: formValue.addedby,
      status: formValue.status,
      updatedby: formValue.updatedby
    };
  
    return transformedData;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}