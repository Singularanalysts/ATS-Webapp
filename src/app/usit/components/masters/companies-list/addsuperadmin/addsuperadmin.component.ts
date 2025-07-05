import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Observable, startWith, map, takeUntil, Subject } from 'rxjs';
import { EmployeeManagementService } from 'src/app/usit/services/employee-management.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { DialogService } from 'src/app/services/dialog.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { MatDialogConfig } from '@angular/material/dialog';
import { FileManagementService } from 'src/app/usit/services/file-management.service';
import { Employee } from 'src/app/usit/models/employee';
import { HttpClient } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-addsuperadmin',
  templateUrl: './addsuperadmin.component.html',
  styleUrls: ['./addsuperadmin.component.scss'],

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
      NgxMatIntlTelInputComponent,
      MatTableModule,
      MatCheckboxModule
    ],
    providers: [DatePipe],
  
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AddsuperadminComponent {

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
  roleOptions: any[] = [];
  companyOptions: any[] = [];
  managerOptions: any[] = [];
  teamLeadOptions: any[] = [];
  filteredDepartmentOptions!: Observable<string[]>;
  filteredRoleOptions!: Observable<any[]>;
  filteredManagerOptions!: Observable<any[]>;
  filteredTeamLeadOptions!: Observable<any[]>;
  employeeForm: any = FormGroup;
  submitted = false;
  rolearr: any = [];
  companyarr: any = [];
  message!: string;
  managerflg = false;
  teamleadflg = false;
  managerarr: any = [];
  tlarr: any = [];
  uploadedfiles: string[] = []
  uploadedFileNames: string[] = [];
  displayedColumns: string[] = ['date', 'document_name', 'delete'];
  allDocumentsData: any = [];
  empObj = new Employee();
  tech: any;
  filesArr!: any;
  id!: number;
  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  // services
  private empManagementServ = inject(EmployeeManagementService);
  private snackBarServ = inject(SnackBarService);
  private formBuilder = inject(FormBuilder);
  private dialogServ = inject(DialogService);
  private datePipe = inject(DatePipe);
  private http = inject(HttpClient);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddsuperadminComponent>);
  private fileServ = inject(FileManagementService);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  protected isFormSubmitted: boolean = false;
  showOtherDetails: boolean = false;

  isCompanyToDisplay: boolean = false;

  ngOnInit(): void {
  
    this.checkCompany(localStorage.getItem('companyid'));
    this.getCompanies();
    this.getRoles();
    this.getManager();
    if (this.data.actionName === 'edit-employee') {
      this.initilizeAddEmployeeForm('');
      this.empManagementServ.getEmployeeById(this.data.employeeData.userid).subscribe(
        (response: any) => {
          if (response && response.data) {
            this.empObj = response.data;
            this.filesArr = response.data.edoc;
            const managerId = response.data.manager;
            this.getTeamLead(managerId);
            this.initilizeAddEmployeeForm(this.empObj);
            this.validateControls();
            const roleId = response.data.role.roleid;
            if ( roleId == 5 || roleId == 6 ) {
              this.managerflg = true;
              this.teamleadflg = false;
            } else if (roleId == 7 || roleId == 8) {
              this.managerflg = true;
              this.teamleadflg = true;
            } else {
              this.managerflg = false;
              this.teamleadflg = false;
            }
            this.toggleOtherDetails(false);
          }
        })
    } else {
    //     if(this.isCompanyToDisplay){
    //     this.initilizeAddEmployeeFormValidation(null);
    //      this.validateControls();
    //   this.toggleOtherDetails(false);
    //     }
    //     else{
    //   this.initilizeAddEmployeeForm(null);
    //   this.validateControls();
    //   this.toggleOtherDetails(false);
    // }
    this.initilizeAddEmployeeForm(null);
      this.validateControls();
      this.toggleOtherDetails(false);
    }
    this.optionsMethod('department');
  }

  private initilizeAddEmployeeForm(employeeData: any) {
    this.employeeForm = this.formBuilder.group({
        fullname: [
            employeeData ? employeeData.fullname : '',
            [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ],
        ],
        pseudoname: [employeeData ? employeeData.pseudoname : '', Validators.required],
        email: [
            employeeData ? employeeData.email : '',
            [
                Validators.required,
                Validators.email,
                Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
            ],
        ],
        personalcontactnumber: [employeeData ? employeeData.personalcontactnumber : '', [Validators.required]],
        companycontactnumber: [employeeData && employeeData.companycontactnumber ? employeeData.companycontactnumber : ''],
        designation: [employeeData ? employeeData.designation : ''],
        department: [employeeData ? employeeData.department : '', ],
        joiningdate: [employeeData ? employeeData.joiningdate : '', Validators.required],
        relievingdate: [employeeData ? employeeData.relievingdate : '', [this.relievingDateValidator]],
        personalemail: [
            employeeData ? employeeData.personalemail : '',
            [
                Validators.required,
                Validators.email,
                Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
            ],
        ],
        manager: [employeeData ? employeeData.manager : ''],
        aadharno: [
            employeeData ? employeeData.aadharno : ''
        ],
        panno: [
            employeeData ? employeeData.panno : ''
        ],
        bankname: [employeeData ? employeeData.bankname : ''],
        accno: [employeeData ? employeeData.accno : ''],
        ifsc: [
            employeeData ? employeeData.ifsc : ''
        ],
        branch: [employeeData ? employeeData.branch : ''],
        teamlead: [employeeData ? employeeData.teamlead : ''],
        role: this.formBuilder.group({
          roleid: new FormControl(employeeData ? employeeData.role.roleid : 1, [Validators.required]), // Set default value to 1
      }),
        banterno: [employeeData ? employeeData.banterno : ''],
        added: [localStorage.getItem('userid')],
        cid: [this.data.cmpId, this.isCompanyToDisplay ? [Validators.required] : []], // Set companyid dynamically
    });

    this.employeeForm.get('companycontactnumber').valueChanges.subscribe((value: string | any[]) => {
        if (value) {
            const banterNumber = value.slice(-10);
            this.employeeForm.get('banterno').setValue(banterNumber);
        }
    });
}

  // private initilizeAddEmployeeFormValidation(employeeData: any) {
  //   this.employeeForm = this.formBuilder.group({
  //     fullname: [
  //       employeeData ? employeeData.fullname : '',
  //       [
  //         Validators.required,
  //         Validators.minLength(5),
  //         Validators.maxLength(100),
  //       ],
  //     ],
  //     pseudoname: [employeeData ? employeeData.pseudoname : ''],
  //     email: [
  //       employeeData ? employeeData.email : '',
  //       [
  //         Validators.required,
  //         Validators.email,
  //         Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
  //       ],
  //     ],
  //     personalcontactnumber: [employeeData ? employeeData.personalcontactnumber : '', [Validators.required]],
  //     companycontactnumber: [employeeData && employeeData.companycontactnumber ? employeeData.companycontactnumber : ''],
  //     designation: [employeeData ? employeeData.designation : ''],
  //     department: [employeeData ? employeeData.department : '', Validators.required],
  //     joiningdate: [employeeData ? employeeData.joiningdate : '', Validators.required],
  //     relievingdate: [employeeData ? employeeData.relievingdate : '', [this.relievingDateValidator]],
  //     personalemail: [
  //       employeeData ? employeeData.personalemail : '',
  //       [
  //         Validators.required,
  //         Validators.email,
  //         Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
  //       ],
  //     ],
  //     manager: [employeeData ? employeeData.manager : ''],
  //     aadharno: [
  //       employeeData ? employeeData.aadharno : ''
  //     ],

  //     panno: [
  //       employeeData ? employeeData.panno : ''
  //     ],
  //     bankname: [employeeData ? employeeData.bankname : ''],
  //     accno: [employeeData ? employeeData.accno : ''],
  //     ifsc: [
  //       employeeData ? employeeData.ifsc : ''
  //     ],
  //     branch: [employeeData ? employeeData.branch : ''],
  //     teamlead: [employeeData ? employeeData.teamlead : ''],
  //     role: this.formBuilder.group({
  //       roleid: new FormControl(employeeData ? employeeData.role.roleid : '', [
  //         Validators.required
  //       ]),
  //     }),
  //     banterno: [employeeData ? employeeData.banterno : ''],

  //     companyid: [employeeData ? employeeData.companyid : ''],
  //   });

  // this.employeeForm.get('companycontactnumber').valueChanges.subscribe((value: string | any[]) => {
  //   if (value) {
  //     const banterNumber = value.slice(-10);
  //     this.employeeForm.get('banterno').setValue(banterNumber);
  //   }
  // });

  // }

  validateControls() {
    this.employeeForm.get('department').valueChanges.subscribe((res: any) => {
      const pseudoname = this.employeeForm.get('pseudoname');
      if (res == 'Bench Sales') {
        pseudoname.setValidators(Validators.required);
      } else {
        pseudoname.clearValidators();
      }
      pseudoname.updateValueAndValidity();
    });
    this.employeeForm.get('role.roleid').valueChanges.subscribe((res: any) => {
      const manager = this.employeeForm.get('manager');
      const tl = this.employeeForm.get('teamlead');
      if (res == 5 || res == 6) {
        this.managerflg = true;
        this.teamleadflg = false;
        manager.setValidators(Validators.required);
      } else if (res == 7 || res == 8) {
        this.managerflg = true;
        this.teamleadflg = true;
        manager.setValidators(Validators.required);
      } else {
        this.managerflg = false;
        this.teamleadflg = false;
        manager.clearValidators();
      }
      manager.updateValueAndValidity();
    });
  }


  get addEmpForm() {
    return this.employeeForm.controls;
  }

  private optionsMethod(type = "roles") {

    if (type === "roles") {
      this.filteredRoleOptions =
        this.employeeForm.controls.role.valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filter(value) : this.roleOptions.slice();
          }

          )
        );
      return
    } else if (type === "manager") {
      this.filteredManagerOptions =
        this.employeeForm.controls.manager.valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filter(value) : this.managerOptions.slice();
          }
          )
        );
    } else if (type === "department") {
      this.filteredDepartmentOptions =
        this.employeeForm.controls.department.valueChanges.pipe(
          startWith(''),
          map((value: any) =>
            this._filterOptions(value || '', this.departmentOptions)
          )
        );
    } else {
      this.filteredTeamLeadOptions =
        this.employeeForm.controls.teamlead.valueChanges.pipe(
          startWith(''),
          map((value: any) => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filter(value) : this.teamLeadOptions.slice();
          }
          )
        );
    }

  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.roleOptions.filter(option => option.rolename.toLowerCase().includes(filterValue));
  }

  private _filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  displayFn(obj: any): string {
    return obj && obj.rolename ? obj.rolename : '';
  }

  getRoles() {
    this.empManagementServ
      .getRolesDropdown(localStorage.getItem('companyid'))
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.rolearr = response.data;
          this.roleOptions = response.data;
          console.log(this.roleOptions,'roleoptionss');
          
        },
        error: (err) => {
          this.dataTobeSentToSnackBarService.message = err.message;
          this.dataTobeSentToSnackBarService.panelClass = [
            'custom-snack-failure',
          ];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
      });
  }

  getCompanies() {
    this.empManagementServ
      .getCompaniesDropdown()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.companyarr = response.data;
          this.companyOptions = response.data;
          console.log(this.roleOptions,'roleoptionss');
          
        },
        error: (err) => {
          this.dataTobeSentToSnackBarService.message = err.message;
          this.dataTobeSentToSnackBarService.panelClass = [
            'custom-snack-failure',
          ];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
      });
  }

checkCompany(companyid:any){

  this.empManagementServ
  .getValidDateCompanyGiven(companyid)
  .pipe(takeUntil(this.destroyed$))
  .subscribe({
    next: (response: any) => {
      this.isCompanyToDisplay = response.data;
    },
    error: (err) => {
      this.dataTobeSentToSnackBarService.message = err.message;
      this.dataTobeSentToSnackBarService.panelClass = [
        'custom-snack-failure',
      ];
      this.snackBarServ.openSnackBarFromComponent(
        this.dataTobeSentToSnackBarService
      );
    },
  });

}

  getManager() {
    this.empManagementServ
      .getManagerDropdown()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.managerarr = response.data;
          this.managerOptions = response.data;
        },
        error: (err) => {
          this.dataTobeSentToSnackBarService.message = err.message;
          this.dataTobeSentToSnackBarService.panelClass = [
            'custom-snack-failure',
          ];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
      });
  }

  managerid(event: MatSelectChange) {
    const selectedManagerId = event.value;
    if (selectedManagerId) {
      this.getTeamLead(selectedManagerId);
    }
  }

  getTeamLead(id: number) {
    this.empManagementServ
      .getTLdropdown(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.tlarr = response.data;
          this.teamLeadOptions = response.data;
        },
        error: (err) => {
          this.dataTobeSentToSnackBarService.message = err.message;
          this.dataTobeSentToSnackBarService.panelClass = [
            'custom-snack-failure',
          ];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
      });
  }

  onSubmit() {
    this.submitted = true;
    const joiningDateFormControl = this.employeeForm.get('joiningdate');
    const relievingDateFormControl = this.employeeForm.get('relievingdate');
    const compId = this.employeeForm.get('companyid');
    if (joiningDateFormControl.value) {
      const formattedJoiningDate = this.datePipe.transform(joiningDateFormControl.value, 'yyyy-MM-dd');
      const formattedRelievingDate = this.datePipe.transform(relievingDateFormControl.value, 'yyyy-MM-dd');
      joiningDateFormControl.setValue(formattedJoiningDate);
      relievingDateFormControl.setValue(formattedRelievingDate);
    }
    if (this.employeeForm.invalid) {
      this.displayFormErrors();
      this.isFormSubmitted = false
      return;
    }
    else{
      this.isFormSubmitted = true
    } 
   
  this.employeeForm.patchValue({
    added: localStorage.getItem('userid') 
  });

    if (this.data.actionName === "edit-employee") {
      [this.employeeForm.value].forEach((formVal, idx) => {
        this.empObj.aadharno = formVal.aadharno;
        this.empObj.accno = formVal.accno;
        this.empObj.bankname = formVal.bankname;
        this.empObj.department = formVal.department;
        this.empObj.fullname = formVal.fullname;
        this.empObj.pseudoname = formVal.pseudoname;
        this.empObj.email = formVal.email;
        this.empObj.personalcontactnumber = formVal.personalcontactnumber;
        this.empObj.companycontactnumber = formVal.companycontactnumber;
        this.empObj.designation = formVal.designation;
        this.empObj.joiningdate = formVal.joiningdate;
        this.empObj.relievingdate = formVal.relievingdate;
        this.empObj.personalemail = formVal.personalemail;
        this.empObj.manager = formVal.manager;
        this.empObj.panno = formVal.panno;
        this.empObj.bankname = formVal.bankname;
        this.empObj.accno = formVal.accno;
        this.empObj.ifsc = formVal.ifsc;
        this.empObj.branch = formVal.branch;
        this.empObj.teamlead = formVal.teamlead;
        this.empObj.role = formVal.role;
        this.empObj.banterno = formVal.banterno;
        this.empObj.cid = formVal.cid;
        this.empObj.added=localStorage.getItem('userid');
      })
    }
    this.trimSpacesFromFormValues();
    const saveObj = this.data.actionName === "edit-employee" ? this.empObj : this.employeeForm.value;
    this.empManagementServ.addOrUpdateEmployee(saveObj, this.data.actionName).pipe(takeUntil(this.destroyed$)).subscribe({
      next: (data: any) => {
        if (data.status == 'success') {
          this.submit(data.data.userid);
          this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-success'];
          this.dataTobeSentToSnackBarService.message =
            this.data.actionName === 'add-employee'
              ? 'Employee added successfully'
              : 'Employee updated successfully';
          this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
          this.employeeForm.reset();
          this.dialogRef.close();
        } else {
          this.dataTobeSentToSnackBarService.message =
            this.data.actionName === 'add-employee'
              ? data.message
              : data.message;
          this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
        }

      },
      error: (err) => {
        this.dataTobeSentToSnackBarService.message =
          this.data.actionName === 'add-employee'
            ? 'Employee addition is failed'
            : 'Employee updation is failed';
        this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
      },
    });
  }

  trimSpacesFromFormValues() {
    Object.keys(this.employeeForm.controls).forEach((controlName: string) => {
      const control = this.employeeForm.get(controlName);
      if (control.value && typeof control.value === 'string') {
        control.setValue(control.value.trim());
      }
    });
  }

  displayFormErrors() {
    Object.keys(this.employeeForm.controls).forEach((field) => {
      const control = this.employeeForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  relievingDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const joiningDate = control.root.get('joiningdate')?.value;
    const relievingDate = control.value;

    if (joiningDate && relievingDate && new Date(relievingDate) < new Date(joiningDate)) {
      return { 'relievingBeforeJoining': true };
    }

    return null;
  }

  onlyNumberKey(evt: any) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
      return false;
    return true;
  }

  onlyAlphanumericKey(evt: any) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode;
    if (!((ASCIICode >= 48 && ASCIICode <= 57) || (ASCIICode >= 65 && ASCIICode <= 90))) {
      return false;
    }
    return true;
  }

  private getDialogConfigData(dataToBeSentToDailog: Partial<IConfirmDialogData>, action: { delete: boolean; edit: boolean; add: boolean, updateSatus?: boolean }) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = action.edit || action.add ? '65vw' : action.delete ? 'fit-content' : '400px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = dataToBeSentToDailog.actionName;
    dialogConfig.data = dataToBeSentToDailog;
    return dialogConfig;
  }

  // DOCS UPLOAD
  flg = true;
  resumeError: boolean = false;
  aadharError: boolean = false;
  panError: boolean = false;
  bankError: boolean = false;
  multifilesError: boolean = false;
  resumeFileNameLength: boolean = false;
  aadharFileNameLength: boolean = false;
  panFileNameLength: boolean = false;
  bankFileNameLength: boolean = false;
  multifilesFileNameLength: boolean = false;


  @ViewChild('resume')
  resume: any = ElementRef;
  resumeupload!: any;
  uploadResume(event: any) {
    this.resumeupload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    var items = file.name.split(".");
    const str = items[0];
    if (str.length > 20) {
      this.resumeFileNameLength = true;
    }
    if (fileSizeInKB > 2048) {
      this.flg = false;
      this.resumeError = true;
    }
    else {
      this.resumeError = false;
      this.flg = true;
    }
  }

  @ViewChild('aadhar') aadhar: any = ElementRef;
  aadharUpload!: any;
  uploadAadhar(event: any) {
    this.aadharUpload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    var items = file.name.split(".");
    const str = items[0];
    if (str.length > 20) {
      this.aadharFileNameLength = true;
    }
    if (fileSizeInKB > 2048) {
      this.flg = false;
      this.aadharError = true;
      return;
    }
    else {
      this.aadharError = false;
      this.flg = true;
    }
  }

  @ViewChild('pan')
  pan: any = ElementRef;
  panUpload!: any;
  uploadPan(event: any) {
    this.panUpload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    var items = file.name.split(".");
    const str = items[0];
    if (str.length > 20) {
      this.panFileNameLength = true;
    }

    if (fileSizeInKB > 2048) {
      this.flg = false;
      this.panError = true;
      return;
    }
    else {
      this.panError = false;
    }
  }

  @ViewChild('bank')
  bank: any = ElementRef;
  bankUpload!: any;
  uploadBank(event: any) {
    this.bankUpload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    var items = file.name.split(".");
    const str = items[0];
    if (str.length > 20) {
      this.bankFileNameLength = true;
    }

    if (fileSizeInKB > 2048) {
      this.flg = false;
      this.bankError = true;
      return;
    }
    else {
      this.bankError = false;
      this.flg = true;
    }
  }

  @ViewChild('multifiles')
  multifiles: any = ElementRef;
  sum = 0;
  onFileChange(event: any) {
    this.uploadedFileNames = [];
    for (var i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      var items = file.name.split(".");
      const str = items[0];
      const fileSizeInKB = Math.round(file.size / 1024);
      this.sum = this.sum + fileSizeInKB;
      if (str.length > 20) {
        this.multifilesFileNameLength = true;
      }
      if (fileSizeInKB < 4048) {
        this.uploadedfiles.push(event.target.files[i]);
        this.uploadedFileNames.push(file.name);
        this.multifilesError = false;
      }
      else {
        this.multifiles.nativeElement.value = "";
        this.uploadedfiles = [];
        this.multifilesError = true;
        this.multifilesFileNameLength = false;
      }
    }
  }
  private fileService = inject(FileManagementService);

  submit(id: number) {
    const formData = new FormData();

    for (var i = 0; i < this.uploadedfiles.length; i++) {
      formData.append("files", this.uploadedfiles[i]);
    }
    if (this.resumeupload != null) {
      formData.append('resume', this.resumeupload, this.resumeupload.name);
    }
    if (this.aadharUpload != null) {
      formData.append('aadhar', this.aadharUpload, this.aadharUpload.name);
    }
    if (this.panUpload != null) {
      formData.append('pan', this.panUpload, this.panUpload.name);
    }

    if (this.bankUpload != null) {
      formData.append('passbook', this.bankUpload, this.bankUpload.name);
    }
    this.fileService.uploadFile(formData, id)
      .subscribe((response: any) => {
        if (response.status === 200) {

        } else {
        }
      }
      );
  }

  downloadfile(id: number, filename: string, flg: string) {
    var items = filename.split(".");
     this.fileService
       .downloadresume(id, flg)
       .subscribe(blob => {
         if (items[1] == 'pdf' || items[1] == 'PDF') {
           var fileURL: any = URL.createObjectURL(blob);
           var a = document.createElement("a");
           a.href = fileURL;
           a.target = '_blank';
           a.click();
         }
         else {
           saveAs(blob, filename)
         }
       }
       );

  }

  deletefile(id: number, doctype: string) {
      const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
        title: 'Confirmation',
        message: 'Are you sure you want to delete?',
        confirmText: 'Yes',
        cancelText: 'No',
        actionData: id,
        actionName: 'delete-employee'
      };
      const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog,{delete: true, edit: false, add: false});
      const dialogRef = this.dialogServ.openDialogWithComponent(
        ConfirmComponent,
        dialogConfig
      );
      // call delete api after  clicked 'Yes' on dialog click
      dialogRef.afterClosed().subscribe({
        next: (resp) => {
          if (dialogRef.componentInstance.allowAction) {
            // call delete api
            this.fileService.removefile(id,doctype).pipe(takeUntil(this.destroyed$)).subscribe({
              next: (response: any) => {
                if (response.status == 'success') {
                  this.dataTobeSentToSnackBarService.message =
                    'File Deleted successfully';
                    this.dialogRef.close();
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

  deletemultiple(id: number) {
     const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: id,
      actionName: 'delete-employee'
    };
    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog,{delete: true, edit: false, add: false});
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );
    // call delete api after  clicked 'Yes' on dialog click
    dialogRef.afterClosed().subscribe({
      next: (resp) => {
        if (dialogRef.componentInstance.allowAction) {
          // call delete api
          this.fileService.removefiles(id).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response: any) => {
              if (response.status == 'success') {
                this.dataTobeSentToSnackBarService.message =
                  'File Deleted successfully';
                  this.dialogRef.close();
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

  type!: any;
  filedetails(fileData: FileData) {
  this.type = fileData.filename;
     var items = this.type.split(".");
     this.fileService
       .downloadfile(fileData.docid)
       .subscribe(blob => {
         if (items[1] == 'pdf' || items[1] == 'PDF') {
           var fileURL: any = URL.createObjectURL(blob);
           var a = document.createElement("a");
           a.href = fileURL;
           a.target = '_blank';
           a.click();
         }
         else {
           saveAs(blob, fileData.filename)
         }
       }
       );

  }

  toggleOtherDetails(checked: boolean): void {
    const aadharControl = this.employeeForm.get('aadharno');
    const panControl = this.employeeForm.get('panno');
    const bankNameControl = this.employeeForm.get('bankname');
    const bankAccountNoControl = this.employeeForm.get('accno');
    const bankIfscControl = this.employeeForm.get('ifsc');
    const bankBranchNameControl = this.employeeForm.get('branch');
    
    if (checked) {
      this.showOtherDetails = true;
      // Add validators when checkbox is checked
      aadharControl?.setValidators([Validators.required, Validators.pattern(/^\d{12}$/)]);
      panControl?.setValidators([Validators.required, Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/)],);
      bankNameControl?.setValidators( [Validators.required, Validators.maxLength(100)]);
      bankAccountNoControl?.setValidators([Validators.required, Validators.pattern(/^\d{1,15}$/)]);
      bankIfscControl?.setValidators([Validators.required, Validators.pattern(/^([A-Za-z]{4}\d{7})$/)]);
      bankBranchNameControl?.setValidators([Validators.required]);
    } else {
      this.showOtherDetails = false;
      // Remove validators when checkbox is unchecked
      aadharControl?.clearValidators();
      panControl?.clearValidators();
      bankNameControl?.clearValidators();
      bankAccountNoControl?.clearValidators();
      bankIfscControl?.clearValidators();
      bankBranchNameControl?.clearValidators();
    }

    // Update validators status
    aadharControl?.updateValueAndValidity();
    panControl?.updateValueAndValidity();
    bankNameControl?.updateValueAndValidity();
      bankAccountNoControl?.updateValueAndValidity();
      bankIfscControl?.updateValueAndValidity();
      bankBranchNameControl?.updateValueAndValidity();
  }

  camelCase(event: any) {
    const inputValue = event.target.value;
    event.target.value = this.capitalizeFirstLetter(inputValue);
  }
  
  capitalizeFirstLetter(input: string): string {
    return input.toLowerCase().replace(/(?:^|\s)\S/g, function (char) {
      return char.toUpperCase();
    });
  }

  convertToLowerCase(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.toLowerCase();
  }

  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };

  emailDuplicate(event: any) {
    const email = event.target.value;
    this.empManagementServ.emailDuplicateCheck(email,localStorage.getItem('companyid')).subscribe((response: any) => {
      if (response.status == 'success') {
        this.message = '';
      } else if (response.status == 'fail') {
        const cn = this.employeeForm.get('email');
        cn.setValue('');
        this.message = 'Record already available with given Mail address';
        this.dataToBeSentToSnackBar.message = 'Record already available with given Mail address';
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      } else {
        this.dataToBeSentToSnackBar.message = 'Internal Server Error';
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      }
    });
  }

}


export class FileData {
  docid!: number;
  consultantid!: number;
  filename?: string;
  contentType?: string;
  size?: number;
  eid!: number;
}
