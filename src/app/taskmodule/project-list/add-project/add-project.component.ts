import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { SnackBarService, ISnackBarData } from 'src/app/services/snack-bar.service';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TaskService } from '../../services/task.service';

interface DropdownItem {
  item_id: number;
  item_text: string;
}

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule,
    MatRippleModule,
    NgMultiSelectDropDownModule
  ],
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit, OnDestroy {
  projectObj = new Project();
  projectForm: any = FormGroup;
  submitted = false;
  private projectServ = inject(ProjectService);
  private snackBarServ = inject(SnackBarService);
  private formBuilder = inject(FormBuilder);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddProjectComponent>);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  dropdownList!: DropdownItem[];
  selectedItems!: DropdownItem[];
  dropdownSettings!: IDropdownSettings;
  pid: string | null = null;
  employeeData: any;
  private taskServ = inject(TaskService);
  departmentOptions: string[] = [
    'Administration',
    'Recruiting',
    'Software',
    'Bench Sales',
    'Sourcing',
    'Dom Recruiting',
    'Accounts',
    'Guest',
    'HR Team'
  ];
  filteredDepartmentOptions!: Observable<string[]>;

  ngOnInit(): void {
    this.initProjectForm(new Project());
    if (this.data.actionName === "edit-project") {
      this.bindFormControlValueOnEdit();
    }
    this.optionsMethod('department');
    this.projectForm.get('department').valueChanges.subscribe((department: any) => {
      if (department) {
        this.getEmployee(department);
      }
    });
  }

  get assignedToControl(): FormControl {
    const control = this.projectForm.get('assignedto');
    if (control instanceof FormControl) {
      return control;
    } else {
      throw new Error('Form control is not of type FormControl');
    }
  }

  private bindFormControlValueOnEdit() {
    // snackbar
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    this.initProjectForm(new Project());
    // api call
    this.projectServ.getProjectById(this.data.ProjectData.pid).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.projectObj = response.data;
          //init form and  update control values on edit
          this.initProjectForm(this.projectObj);
        }
      }, error: (err: any) => {
        dataToBeSentToSnackBar.message = err.message;
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      }
    });
  }

  /**
   * initializes Project Form
   */
  private initProjectForm(projectData: Project) {
    this.projectForm = this.formBuilder.group({
      projectName: [projectData ? projectData.projectName : '', [Validators.required]],
      description: [projectData ? projectData.description : '', [Validators.required]],
      department: [projectData ? projectData.department : '', Validators.required],
      assignedto: [projectData ? projectData.assignedto : [], Validators.required],
      addedBy: [projectData && projectData.addedBy ? projectData.addedBy : localStorage.getItem('userid')],
      updatedby: [this.data.actionName === "edit-project" ? localStorage.getItem('userid') : null]
    });
    if (this.data.actionName === 'edit-project') {
      this.projectForm.addControl(
        'id',
        this.formBuilder.control(
          projectData ? projectData.projectId : ''
        )
      );
      this.projectForm.addControl(
        'status',
        this.formBuilder.control(
          projectData ? projectData.status : '', Validators.required
        )
      );
    }
  }

  private optionsMethod(type: string) {
    this.filteredDepartmentOptions =
      this.projectForm.controls.department.valueChanges.pipe(
        startWith(''),
        map((value: any) =>
          this._filterOptions(value || '', this.departmentOptions)
        )
      );
  }

  private _filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  getEmployee(department: string) {
    this.taskServ.getUsersByDepartment(department).subscribe(
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

  /**
   * Submit
   */
  protected isFormSubmitted: boolean = false;
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

    if (this.projectForm.invalid) {
      this.isFormSubmitted = false;
      this.displayFormErrors();
      return;
    }
    else {
      this.isFormSubmitted = true
    }
    const saveReqObj = this.getSaveData();
    this.projectServ
      .addORUpdateProject(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-project'
                ? 'Project added successfully'
                : 'Project updated successfully';
            this.dialogRef.close();
          } else {
            this.isFormSubmitted = false;
            dataToBeSentToSnackBar.message =resp.message;
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err) => {
          this.isFormSubmitted = false;
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-project'
              ? 'Project addition is failed'
              : 'Project updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  trimSpacesFromFormValues() {
    Object.keys(this.projectForm.controls).forEach((controlName: string) => {
      const control = this.projectForm.get(controlName);
      if (control.value && typeof control.value === 'string') {
        control.setValue(control.value.trim());
      }
    });
  }

  getSaveData() {
    this.trimSpacesFromFormValues();
    if (this.data.actionName === "edit-project") {
      [this.projectForm.value].forEach((formVal, idx) => {
        this.projectObj.projectId = this.data.ProjectData.projectId;
        this.projectObj.projectName = formVal.projectName;
        this.projectObj.description = formVal.description;
        this.projectObj.assignedto = formVal.assignedto;
        this.projectObj.status = formVal.status;
        this.projectObj.department = formVal.department;
        this.projectObj.addedBy = formVal.addedBy;;
        this.projectObj.updatedBy = localStorage.getItem('userid');
      })
      return this.projectObj
    }
    return this.projectForm.value;
  }

  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.projectForm.controls).forEach((field) => {
      const control = this.projectForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Cancel
   */
  onCancel() {
    this.dialogRef.close();
  }

  /** clean up subscriptions */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}