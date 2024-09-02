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
import { SubtaskService } from '../../services/subtask.service';

interface DropdownItem {
  item_id: number;
  item_text: string;
}

@Component({
  selector: 'app-add-sub-task',
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
  templateUrl: './add-sub-task.component.html',
  styleUrls: ['./add-sub-task.component.scss']
})
export class AddSubTaskComponent {
  // Services
  private formBuilder = inject(FormBuilder);
  private snackBarServ = inject(SnackBarService);
  private taskServ = inject(TaskService);
  private subtaskServ = inject(SubtaskService);
  private datePipe = inject(DatePipe);

  // Data
  deptOptions = DEPARTMENT;
  subTaskForm!: FormGroup;
  isFormSubmitted = false;
  submitted = false;
  isAllOptionsSelected = false;
  entity: any;
  dropdownList!: DropdownItem[];
  selectedItems!: DropdownItem[];
  dropdownSettings!: IDropdownSettings;
  taskid!: string | number;
  employeeData: any;
  statusType = [
    'To Do',
    'In Progress',
    'On Hold',
    'In Review',
    'Backlogs',
    'Completed',
  ];

  // Subscription management
  private destroyed$ = new Subject<void>();
  projectId: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddSubTaskComponent>
  ) { }

  ngOnInit(): void {
   this.projectId = this.data.projectId;
    this.taskid = this.data.taskid;
    this.getEmployee();
    this.initializeTaskForm(null);
    if (this.data.actionName === 'edit-sub-task') {
      this.initializeTaskForm(null);
      this.subtaskServ.getsubTaskById(this.data.subtaskData.subTaskId).subscribe(
        (response: any) => {
          if (response && response.data) {
            this.initializeTaskForm(response.data)
          }
        }
      )
    }
  }

  get assignedToControl(): FormControl {
    const control = this.subTaskForm.get('assignedto');
    if (control instanceof FormControl) {
      return control;
    } else {
      throw new Error('Form control is not of type FormControl');
    }
  }

  private initializeTaskForm(subtaskData: any) {
    this.subTaskForm = this.formBuilder.group({
      taskid: [this.taskid],
      subTaskId: [subtaskData ? subtaskData.subTaskId : ''],
      targetDate: [subtaskData ? subtaskData.targetDate : '', Validators.required],
      subTaskName: [subtaskData ? subtaskData.subTaskName : '', Validators.required],
      subTaskDescription: [subtaskData ? subtaskData.subTaskDescription : '', Validators.required],
      department: [subtaskData ? subtaskData.department : 'Software'],
      assignedto: [subtaskData ? subtaskData.assignedto : [], Validators.required],
      addedby: [subtaskData ? subtaskData.addedby : localStorage.getItem('userid')],
      status: [subtaskData ? subtaskData.status : 'To Do'],
      updatedby: [this.data.actionName === "edit-sub-task" ? localStorage.getItem('userid') : null]
    });
  }

  get controls() {
    return this.subTaskForm.controls;
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
    const TargetDate = this.subTaskForm.get('targetDate');
    const targetDateForm = this.datePipe.transform(TargetDate!.value, 'yyyy-MM-dd');
    TargetDate!.setValue(targetDateForm);
    if (this.subTaskForm.invalid) {
      this.subTaskForm.markAllAsTouched();
      this.isFormSubmitted = false;
      return;
    }
    else{
      this.isFormSubmitted = true
    }
    const saveReqObj = this.getSaveData();
    this.subtaskServ
      .addORUpdateSubTask(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-sub-task'
                ? 'Sub Task added successfully'
                : 'Sub Task updated successfully';
            this.dialogRef.close();
          } else {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-sub-task'
                ? 'Sub Task addition is failed'
                : 'Sub Task updation is failed';
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
    const formValue = this.subTaskForm.value;
    const transformedData = {
      task: {
        taskid: formValue.taskid
      },
      subTaskId: formValue.subTaskId,
      targetDate: formValue.targetDate,
      subTaskName: formValue.subTaskName,
      subTaskDescription: formValue.subTaskDescription,
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