import { CommonModule } from '@angular/common';
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
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { RequirementService } from 'src/app/usit/services/requirement.service';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, Subject, debounceTime, distinctUntilChanged, map, of, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Requirements } from 'src/app/usit/models/requirements';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { AddVendorComponent } from '../../../vendor-management/vendor-list/add-vendor/add-vendor.component';
import { DialogService } from 'src/app/services/dialog.service';
import { AddRecruiterComponent } from '../../../vendor-management/recruiter-list/add-recruiter/add-recruiter.component';
import { AddTechnologyTagComponent } from '../../../technology-tag-list/add-technology-tag/add-technology-tag.component';

@Component({
  selector: 'app-add-requirement',
  standalone: true,
  imports: [

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatAutocompleteModule,
    NgxGpAutocompleteModule,
    MatRadioModule,
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
  ],
  templateUrl: './add-requirement.component.html',
  styleUrls: ['./add-requirement.component.scss'],
})
export class AddRequirementComponent {
  requirementObj = new Requirements()
  requirementForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private requirementServ = inject(RequirementService);
  private snackBarServ = inject(SnackBarService);
  private router = inject(Router);
  protected isFormSubmitted: boolean = false;
  allowAction = false;
  reqnumber!: any;
  maxnumber!: number;
  currentDate = new Date();
  todayDate = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
  reqNumberDate = formatDate(this.currentDate, 'yyMM', 'en-US');
  vendordata: any = [];
  searchObs$!: Observable<any>;
  techSearchObs$!: Observable<any>;
  options = {
    componentRestrictions: { country: ['IN', 'US'] },
  };
  vendorCompanyArr: any[] = [];
  techArr: any = [];
  companySearchData: any[] = [];
  techSearchData: any[] = [];
  autoskills!: string;
  employeedata: any = [];
  dropdownSettings: IDropdownSettings = {};
  employees: any[] = [];
  @ViewChild('employeeInput') employeeInput!: ElementRef<HTMLInputElement>;
  filteredEmployees!: Observable<any[]>;
  allEmployees: any;
  selectedEmployees = new Set<string>();
  employeeSearchData: any[] = [];
  empArr: any = []
  empSearchObs$!: Observable<any>;
  submitted = false;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  selectOptionObj = {

    statusType: STATUS_TYPE,
  };
  selectAllChecked = false;
  flag!: string;

  filteredData: any;
  selectData: any = [];
  rawData: any = [];
  isAllOptionsSelected = false;
  entity: any;
  isRadSelected: any;
  searchTechOptions$!: Observable<any>;
  technologyOptions!: any;
  isTechnologyDataAvailable: boolean = false;
  searchCompanyOptions$!: Observable<any>;
  companyOptions: any = [];
  isCompanyDataAvailable: boolean = false;
  private dialogServ = inject(DialogService);

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddRequirementComponent>
  ) { }

  ngOnInit(): void {
    this.getTech();
    //this.getEmployee();
    this.getFlag(this.data.flag.toLocaleLowerCase());
    // this.requirementServ.getVendorCompanies('Recruiting').subscribe(
    //   (response: any) => {
    //     this.vendorCompanyArr = response.data;
    //   }
    // );
    this.searchCompanyOptions$ = this.requirementServ.getVendorCompanies('Recruiting').pipe(
      map((response: any) => response.data),
      tap(resp => {
        if (resp && resp.length) {
          console.log(resp);
          this.getCompanyOptionsForAutoComplete(resp);
        }
      })
    );
    if (this.data.actionName === "edit-requirement") {
      this.initializeRequirementForm(new Requirements());
      this.requirementServ.getEntity(this.data.requirementData.requirementid).subscribe(
        (response: any) => {
          this.entity = response.data;
          this.recruiterList({ id: response.data.vendorimpl });
          this.requirementObj = response.data;
          // this.getEmployee();
          this.getAssignedEmployee();

          this.initializeRequirementForm(response.data);

        }
      )
      //this.getAssignedEmployee();

      //this.prepopulateSelectedEmployees();
    } else {
      this.getEmployee();
      this.requirementServ.getReqNumber(this.flag).subscribe(
        (response: any) => {
          if (response.data == null) {
            this.reqnumber = 101;
            this.maxnumber = 101;
          }
          else {
            this.maxnumber = parseInt(response.data) + 1;
            this.reqnumber = parseInt(response.data) + 1;
          }
          this.reqnumber = "NVT" + this.reqNumberDate + ("00000" + this.reqnumber).slice(-5);
          this.requirementForm.get('reqnumber')?.setValue(this.reqnumber);
          this.requirementForm.get('postedon')?.setValue(this.todayDate);
        })
      this.initializeRequirementForm(null);
    }
  }

  getCompanyOptionsForAutoComplete(data: any) {
    this.companyOptions = data;
    // console.log(data);

    this.searchCompanyOptions$ = this.requirementForm.controls['vendorimpl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterCompanyOptions(value, this.companyOptions))
    );
  }

  companyid: any;
  private _filterCompanyOptions(value: any, options: any[]): any[] {
    // console.log(options);

    const filterValue = (value ? value.toString() : '').toLowerCase();
    const filteredOptions = options.filter(option =>
      option.company.toLowerCase().includes(filterValue)
    );
    // if (filteredOptions.length === 1) {
    //   this.companyid =filteredOptions[0].vmsid;
    // }
    // this.isConsultantDataAvailable = filteredOptions.length === 0;
    return filteredOptions;
  }

  private getAssignedEmployee() {
    this.requirementServ.getAssignedRecruiter(this.data.requirementData.requirementid).subscribe(
      (response: any) => {
        this.employeedata = response.data; // saveed selected items from assign rec field
        this.employeedata.map((x: any) => x.selected = true);
        this.getEmployee();
        // this.prepopulateSelectedEmployees();
      }
    );
  }

  getFlag(type: string) {
    if (type === 'recruiting') {
      this.flag = 'Recruiting';
    } else {
      this.flag = 'Domrecruiting';
    }
  }

  private initializeRequirementForm(requirementData: any) {
    this.requirementForm = this.formBuilder.group({
      reqnumber: [requirementData ? requirementData.reqnumber : '', Validators.required],
      postedon: [requirementData ? requirementData.postedon : '', Validators.required],
      location: [requirementData ? requirementData.location : '', Validators.required],
      // vendor: [requirementData ? requirementData.vendor : '', Validators.required],
      client: [requirementData ? requirementData.client : '',],
      jobexperience: [requirementData ? requirementData.jobexperience : '',],
      employmenttype: [requirementData ? requirementData.employmenttype : '', Validators.required],
      jobtitle: [requirementData ? requirementData.jobtitle : '', Validators.required],
      jobskills: [requirementData ? requirementData.jobskills : ''],
      jobdescription: [requirementData ? requirementData.jobdescription : '', Validators.required],
      duration: [requirementData ? requirementData.duration : '', Validators.required],
      technology: [requirementData ? requirementData.technology : '', Validators.required],
      empid: [requirementData ? requirementData.empid : '', Validators.required],
      recruiter: [requirementData ? requirementData.recruiter : '', [Validators.required]],
      pocphonenumber: [requirementData ? requirementData.pocphonenumber : ''],
      pocemail: [requirementData ? requirementData.pocemail : ''],
      pocposition: [requirementData ? requirementData.pocposition : ''],
      salary: [requirementData ? requirementData.salary : ''],
      users: localStorage.getItem('userid'),
      vendorimpl: [requirementData ? requirementData.vendorimpl : '', [Validators.required]],
      // requirementflg: this.data.flag.toLocaleLowerCase(),
      flag: this.data.flag,
      maxnumber: [requirementData ? requirementData.maxnumber : ''],
      dommaxnumber: [requirementData ? requirementData.dommaxnumber : ''],
      // requirementid: [this.requirementForm.requirementid],
      requirementid: [requirementData ? requirementData.requirementid : '']
    });
    if (this.data.actionName === 'edit-requirement') {
      this.requirementForm.addControl('status', this.formBuilder.control(requirementData ? requirementData.status : ''));
    }

    this.requirementForm.get('status')?.valueChanges.subscribe((res: any) => {
      if (res == 'Active' && requirementData.status == 'InActive') {
        this.requirementForm.get('postedon')?.setValue(this.todayDate);
      }
    })

    if (this.data.actionName === "edit-requirement" && requirementData) {
      this.requirementServ.getVendorById(requirementData.vendorimpl).subscribe(
        (vendor: any) => {
          if (vendor && vendor.data) {
            this.requirementForm.get('vendorimpl')!.setValue(vendor.data.company);
          }
        },
        (error: any) => {
          console.error('Error fetching consultant details:', error);
        }
      );
      this.requirementServ.gettechDropDown(requirementData.technology).subscribe(
        (technology: any) => {
          if (technology && technology.data) {
            this.techid = technology.data[0].id;
            this.requirementForm.get('technology')!.setValue(technology.data[0].technologyarea);
          }
        },
        (error: any) => {
          console.error('Error fetching consultant details:', error);
        }
      );
    }

  }

  getTech() {
    this.searchTechOptions$ = this.requirementServ.gettechDropDown(0).pipe(map((x: any) => x.data), tap(resp => {
      if (resp && resp.length) {
        this.getTechOptionsForAutoComplete(resp);
      }
    }));
  }

  getTechOptionsForAutoComplete(data: any) {
    this.technologyOptions = data;
    this.searchTechOptions$ =
      this.requirementForm.controls['technology'].valueChanges.pipe(
        startWith(''),
        map((value: any) =>
          this._filterOptions(value, this.technologyOptions)
        )
      );
  }
  techid!: any;
  private _filterOptions(value: any, options: any[]): any[] {
    const filterValue = (value ? value.toString() : '').toLowerCase();
    const filteredTechnologies = options.filter((option: any) =>
      option.technologyarea.toLowerCase().includes(filterValue)
    );
    // this.isTechnologyDataAvailable = filteredTechnologies.length === 0;
    // if (filteredTechnologies.length > 1) {
    //   this.techid = filteredTechnologies[0].id;
    //   console.log(this.techid);
    // }
    return filteredTechnologies;
  }


  get controls() {
    return this.requirementForm.controls;
  }

  getEmployee() {
    this.requirementServ.getEmployee().subscribe(
      (response: any) => {
        this.empArr = response.data;
        this.empArr.map((x: any) => x.selected = false);
        this.prepopulateSelectedEmployees();
      }
    )
  }

  recruiterArr: any[] = [];
  recruiterList(option: any) {
    console.log(option);


    const newVal = option.id;
    this.companyid = option.id;
    console.log(newVal);

    this.requirementServ.getRecruiterOfTheVendor(newVal, 'Recruiter').subscribe(
      (response: any) => {
        this.recruiterArr = response.data;
        console.log(response.data)
        // this.requirementForm.get("pocphonenumber")!.patchValue('');
        // this.requirementForm.get("pocemail")!.patchValue('');
        // this.requirementForm.get("recruiter")!.patchValue(response.data[0].recruiter);
        // this.requirementForm.get("pocposition")!.patchValue('');
      }
    );
  }

  techSkills(option: any) {
    const newVal = option.id;
    this.techid = option.id;
    console.log(newVal);

    if (newVal == '') {
      this.autoskills = '';
    }
    this.requirementServ.getSkillData(newVal).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.autoskills = response.data;
          this.requirementForm.get('jobskills')!.setValue(this.autoskills);
        } else {
          console.error('Invalid response structure:', response);
        }
      },
      (error) => {
        console.error('Error fetching skill data:', error);
      }
    )
  }


  // toggleSelection(employee: any) {
  //   const mapToApiFormat = (emp: any) => ({
  //     userid: emp.userid,
  //     fullname: emp.fullname,
  //   });

  //     employee.selected = !employee.selected;

  //   if (employee.selected) {

  //     this.selectData.push(employee);
  //   }
  //   // else {
  //   //   const i = this.selectData.findIndex((value: any) => value.fullname === employee.fullname);
  //   //   this.selectData.splice(i, 1);
  //   // }
  //   this.isAllOptionsSelected = !this.empArr.some((x: any) => x.selected === false)
  //   const mappedData = this.selectData.map(mapToApiFormat);
  //   this.requirementForm.get('empid')!.setValue(mappedData);
  // };

  toggleSelection(employee: any) {
    // Mapping function to convert employee object to API format
    const mapToApiFormat = (emp: any) => ({
      userid: emp.userid,
      fullname: emp.fullname,
    });

    // Toggle the selected status of the employee
    employee.selected = !employee.selected;

    if (employee.selected) {
      // If employee is selected, add to selectData array
      this.selectData.push(employee);
    } else {
      // If employee is deselected, find index and remove from selectData array
      const index = this.selectData.findIndex((emp: any) => emp.userid === employee.userid);
      if (index !== -1) {
        this.selectData.splice(index, 1);
      }
    }

    // Update the isAllOptionsSelected flag based on selection status of all employees
    this.isAllOptionsSelected = !this.empArr.some((x: any) => !x.selected);

    // Map the selected employee data to API format and update empid form control
    const mappedData = this.selectData.map(mapToApiFormat);
    this.requirementForm.get('empid')!.setValue(mappedData);
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
    if (this.employeedata.length) {
      this.requirementForm.get('empid')?.setErrors(null);
    }

    if (this.requirementForm.invalid) {
      this.isFormSubmitted = false
      this.displayFormErrors();
      this.isRadSelected = true;
      this.requirementForm.markAllAsTouched();
      return;
    }
    else {
      this.isFormSubmitted = true
    }
    this.requirementForm.get('technology')!.setValue(this.techid);
    this.requirementForm.get('vendorimpl')!.setValue(this.companyid);
    this.selectData.forEach(function (obj: any) {
      delete obj.selected
      delete obj.pseudoname
    });

    this.requirementForm.get('empid')!.setValue(this.selectData);
    const saveReqObj = this.getSaveData();

     this.requirementServ
       .addORUpdateRequirement(saveReqObj, this.data.actionName)
       .pipe(takeUntil(this.destroyed$))
       .subscribe({
         next: (resp: any) => {
           if (resp.status == 'success') {
             dataToBeSentToSnackBar.message =
               this.data.actionName === 'add-requirement'
                 ? 'Requirement added successfully'
                 : 'Requirement updated successfully';
             this.dialogRef.close();
           } else {
             dataToBeSentToSnackBar.message = resp.message ? resp.message : 'Requirement already Exists';
             dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
           }
           this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
         },
         error: (err: any) => {
           dataToBeSentToSnackBar.message =
             this.data.actionName === 'add-requirement'
               ? 'Requirement addition is failed'
               : 'Requirement updation is failed';
           dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
           this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
         },
       });
  }

  onCancel() {
    this.dialogRef.close();
  }

  handleAddressChange(address: any) {
    this.requirementForm.controls['location'].setValue(address.formatted_address);
  }

  goToVendorList() {
    this.dialogRef.close();
    this.router.navigate(['/usit/vendors']);
  }

  goToTechnologyList() {
    this.dialogRef.close();
    this.router.navigate(['/usit/technology-tag']);
  }

  pocPosition!: string;
  selectedItems: ConstactInfo[] = [];
  recruiterContact(event: any) {
    const newVal = event.value;

    this.recruiterArr.forEach(item => {
      if (newVal === item.id) {
        this.selectedItems.push(item);
      }
    });

    this.selectedItems.forEach(item => {
      this.requirementForm.get("pocphonenumber")!.patchValue(item.usnumber);
      this.requirementForm.get("pocemail")!.patchValue(item.email);
      if (item.pocposition == 'Bench Sales')
        this.pocPosition = "Sales Recruiter"
      else if (item.pocposition == 'Recruiter')
        this.pocPosition = "Recruiter"
      else
        this.pocPosition = "US IT Staffing & Recruitment "
      this.requirementForm.get("pocposition")!.patchValue(this.pocPosition);
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our employee
    if (value) {
      this.employees.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.controls['empid']!.setValue(null);
  }

  remove(employee: any): void {

    const index = this.selectData.indexOf(employee);
    if (index >= 0) {
      this.selectData.splice(index, 1);
    }
    this.empArr.find((y: any) => y.userid === employee.userid).selected = false;
    // this.toggleSelection(employee);
    this.controls['empid'].updateValueAndValidity();

    const mapToApiFormat = (emp: any) => ({
      userid: emp.userid,
      fullname: emp.fullname,
    });
    const mappedData = this.selectData.map(mapToApiFormat);
    this.requirementForm.get('empid')!.setValue(mappedData);
  }

  prepopulateSelectedEmployees() {
    // Clear the existing employees array
    this.selectData = [];
    this.selectData = this.employeedata;
    this.requirementForm.get('empid')?.patchValue(this.selectData);

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
    this.empSearchObs$ = this.requirementForm.get('empid')!.valueChanges.pipe(
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

  goToRecruiterList() {
    this.dialogRef.close();
    this.router.navigate(['/usit/recruiters']);
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
    if (this.data.actionName === 'edit-requirement') {

      return { ...this.entity, ...this.requirementForm.value }
    }
    return this.requirementForm.value;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onRadioChange(event: MatRadioChange) {
    this.isRadSelected = event.value
  }

  addVendor() {
    const actionData = {
      title: 'Add Vendor',
      vendorData: null,
      actionName: 'add-vendor',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-vendor';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddVendorComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        // this.getAllData(this.currentPageIndex + 1);
      }
    });
  }

  addRecruiter() {
    const actionData = {
      title: 'Add Recruiter',
      recruiterData: null,
      actionName: 'add-recruiter',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-recruiter';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddRecruiterComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        // this.getAllRecruiters(this.currentPageIndex + 1);
      }
    });

}

addTechnology() {
  const dataToBeSentToDailog = {
    title: 'Add Technology',
    buttonCancelText: 'Cancel',
    buttonSubmitText: 'Submit',
    actionData: null,
    actionName: 'add-technology'
  };
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '40vw';
  dialogConfig.data = dataToBeSentToDailog;
  const dialogRef = this.dialogServ.openDialogWithComponent(AddTechnologyTagComponent, dialogConfig)
  dialogRef.afterClosed().subscribe(() => {
    if (dialogRef.componentInstance.allowAction) {
      this.getTech()
    }
  })
}
}

export const STATUS_TYPE = ['Active', 'on hold', 'closed', 'InActive'] as const;

class ConstactInfo {
  company!: string;
  email!: string;
  usnumber!: string;
  id!: string;
  recruiter!: string;
  pocposition!: string;
}
