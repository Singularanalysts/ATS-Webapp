import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  Inject,
  inject,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
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
import { RequirementService } from 'src/app/usit/services/requirement.service';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, Subject, debounceTime, distinctUntilChanged,  of, switchMap, takeUntil } from 'rxjs';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TaskService } from '../../services/task.service';
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
    NgxGpAutocompleteModule,
    MatSelectModule,
    MatChipsModule,
    NgMultiSelectDropDownModule,
    MatCheckboxModule
  ],
  providers: [
    {
      provide: Loader,
      useValue: new Loader({
        apiKey: 'AIzaSyCT0z0QHwdq202psuLbL99GGd-QZMTm278',
        libraries: ['places'],
      }),
    },
    DatePipe
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  requirementForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private snackBarServ = inject(SnackBarService);
  private service = inject(TaskService);
   protected isFormSubmitted: boolean = false;
  employeedata: any = [];
  dropdownSettings: IDropdownSettings = {};
  employees: any[] = [];
  @ViewChild('employeeInput') employeeInput!: ElementRef<HTMLInputElement>;
  employeeSearchData: any[] = [];
  empArr: any = []
  empSearchObs$!: Observable<any>;
  submitted = false;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  selectData: any = [];
  isAllOptionsSelected = false;
  entity: any;
  private datePipe = inject(DatePipe);
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddTaskComponent>
  ) { }

  ngOnInit(): void {
    this.getEmployee();
    this.initializeRequirementForm(null);
  }

  private initializeRequirementForm(requirementData: any) {
    this.requirementForm = this.formBuilder.group({
      targetdate: [requirementData ? requirementData.targetdate : '', Validators.required],
      taskname: [requirementData ? requirementData.taskname : '', Validators.required],
      description: [requirementData ? requirementData.description : '', Validators.required],
      assignedto: [requirementData ? requirementData.assignedto : '', Validators.required],
      addedby: localStorage.getItem('userid'),
    });
  
  }
  get controls() {
    return this.requirementForm.controls;
  }

  getEmployee() {
    this.service.getEmployee().subscribe(
      (response: any) => {
        this.empArr = response.data;
        this.empArr.map((x: any) => x.selected = false);
        this.prepopulateSelectedEmployees();
      }
    )
  }
  toggleSelection(employee: any) {
    const mapToApiFormat = (emp: any) => ({
      userid: emp.userid,
      fullname: emp.fullname,
    });

    employee.selected = !employee.selected;

    if (employee.selected) {

      this.selectData.push(employee);
    }
    this.isAllOptionsSelected = !this.empArr.some((x: any) => x.selected === false)
    const mappedData = this.selectData.map(mapToApiFormat);
    this.requirementForm.get('assignedto')!.setValue(mappedData);
  };

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
    if (this.employeedata.length) {
      this.requirementForm.get('assignedto')?.setErrors(null);
    }
    const TargetDate = this.requirementForm.get('targetdate');
    const targetDateForm = this.datePipe.transform(TargetDate!.value, 'yyyy-MM-dd');
    TargetDate!.setValue(targetDateForm);
    if (this.requirementForm.invalid) {
      this.displayFormErrors();
      this.requirementForm.markAllAsTouched();
      this.isFormSubmitted = false;
      return;
    }
    else{
      this.isFormSubmitted = true
    }
    this.selectData.forEach(function (obj: any) {
      delete obj.selected
      delete obj.pseudoname
    });
    this.requirementForm.get('assignedto')!.setValue(this.selectData);
    const saveReqObj = this.getSaveData();
    this.service
      .createTask(saveReqObj)
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

  onCancel() {
    this.dialogRef.close();
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our employee
    if (value) {
      this.employees.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.controls['assignedto']!.setValue(null);
  }

  remove(employee: any): void {
    const index = this.selectData.indexOf(employee);
    if (index >= 0) {
      this.selectData.splice(index, 1);
    }
    this.empArr.find((y: any) => y.userid === employee.userid).selected = false;
    // this.toggleSelection(employee);
    this.controls['assignedto'].updateValueAndValidity();
    const mapToApiFormat = (emp: any) => ({
      userid: emp.userid,
      fullname: emp.fullname,
    });
    const mappedData = this.selectData.map(mapToApiFormat);
    this.requirementForm.get('assignedto')!.setValue(mappedData);
  }

  prepopulateSelectedEmployees() {
    // Clear the existing employees array
    this.selectData = [];
    this.selectData = this.employeedata;
    this.requirementForm.get('assignedto')?.patchValue(this.selectData);
    if (this.empArr.length && this.employeedata.length) {
      this.employeedata.forEach((x: any, listId: number) => {
        this.empArr.find((y: any) => y.userid === x.userid).selected = true;
      })
    }
    this.isAllOptionsSelected = this.empArr.every((x: any) => x.selected === true)
  }

  optionClicked(event: any, employee: any): void {
    event.stopPropagation();
    this.toggleSelection(employee);
  }

  onSelectAll(event: MatCheckboxChange) {
    this.isAllOptionsSelected = event.checked;
    this.empArr.map(
      (x: any) => x.selected = event.checked
    )
    if (event.checked) {
      this.selectData = this.empArr;
    }
    else {
      this.selectData = []
    }
    //  this.requirementForm.get('empid')?.setValue(this.selectData);
  }

  empAutoCompleteSearch() {
    this.empSearchObs$ = this.requirementForm.get('assignedto')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: any) => {
        if (typeof term === 'string') {
          return this.getEmpFilteredValue(term);
        }
        else {
          return this.getAllEmpOptions();
        }
      }
      ),
    );
  }

  getAllEmpOptions(): Observable<any> {
    if (this.empArr) {
      this.employeeSearchData = this.empArr;
      return of(this.employeeSearchData);
    }
    return of([]);
  }

  getEmpFilteredValue(term: string): Observable<any> {
    if (term && this.empArr) {
      const sampleArr = this.empArr.filter((val: any) => val.fullname.toLowerCase().includes(term.trim().toLowerCase()) == true)
      this.employeeSearchData = sampleArr;
      return of(this.employeeSearchData);
    }
    return of([])
  }
  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.requirementForm.controls).forEach((field) => {
      const control = this.requirementForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  getSaveData() {
    return this.requirementForm.value;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}