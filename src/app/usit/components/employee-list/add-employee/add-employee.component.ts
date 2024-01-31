import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Inject,
  InjectionToken,
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
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Observable, startWith, map, takeUntil, Subject } from 'rxjs';
import { EmployeeManagementService } from 'src/app/usit/services/employee-management.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { MatDialogConfig } from '@angular/material/dialog';
import { FileManagementService } from 'src/app/usit/services/file-management.service';
import { Employee } from 'src/app/usit/models/employee';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
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
    SearchPipe,
    NgxMatIntlTelInputComponent,
    MatTableModule,
  ],
  providers: [DatePipe],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddEmployeeComponent {
  departmentOptions: string[] = [
    'Administration',
    'Recruiting',
    'SoftWare',
    'Bench Sales',
    'Sourcing',
    'Accounts',
    'Guest',
  ];

  roleOptions: any[] = [
    // 'Super Admin',
    // 'Admin',
    // 'Manager',
    // 'Team Lead',
    // 'Employee',
  ];

  managerOptions: any[] = [
    // 'John Smith', 'Sarah Johnson', 'David Anderson'
  ];

  teamLeadOptions: any[] = [
    // 'Alice', 'Bob', 'Charlie', 'David', 'Eva'
  ];

  filteredDepartmentOptions!: Observable<string[]>;
  filteredRoleOptions!: Observable<any[]>;
  filteredManagerOptions!: Observable<any[]>;
  filteredTeamLeadOptions!: Observable<any[]>;

  employeeForm: any = FormGroup;
  submitted = false;
  rolearr: any = [];
  message!: string;
  managerflg = false;
  teamleadflg = false;
  managerarr: any = [];
  tlarr: any = [];
  uploadedfiles: string[] = []
  uploadedFileNames: string[] = [];
  displayedColumns: string[] = ['date', 'document_name', 'delete'];
  // allDocumentsData = new MatTableDataSource<any>([]);
  allDocumentsData: any = [];
  empObj = new Employee();
  tech: any;
  filesArr!: any;
  id!: number;
  // snack bar data
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
  dialogRef = inject(MatDialogRef<AddEmployeeComponent>);
  private fileServ = inject(FileManagementService);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.getRoles(); // common for add employee
    this.getManager();// common for add employee
    if (this.data.actionName === 'edit-employee') {
      // this.getDataOnEdit(this.data.employeeData.userid);
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
          }
        })
    } else {
      //  for add employee
      this.initilizeAddEmployeeForm(null);
      this.validateControls();
    }
    // common for add employee
    // this.validateControls();
    this.optionsMethod('department'); // for auto-complete
    //this.optionsMethod('roles');
  }

  private initilizeAddEmployeeForm(employeeData: any) {
    this.employeeForm = this.formBuilder.group({
      fullname: [
        employeeData ? employeeData.fullname : '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      pseudoname: [employeeData ? employeeData.pseudoname : ''],
      email: [
        employeeData ? employeeData.email : 'SALES@MAIL.COM',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      personalcontactnumber: [employeeData ? employeeData.personalcontactnumber : '', [Validators.required]],
      //['', [Validators.required]],
      companycontactnumber: [employeeData && employeeData.companycontactnumber ? employeeData.companycontactnumber : ''],
      designation: [employeeData ? employeeData.designation : 'SALES'],
      department: [employeeData ? employeeData.department : '', Validators.required],
      joiningdate: [employeeData ? employeeData.joiningdate : '', Validators.required],
      relievingdate: [employeeData ? employeeData.relievingdate : '', [this.relievingDateValidator]],
      personalemail: [
        employeeData ? employeeData.personalemail : 'SALES@MAIL.COM',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      manager: [employeeData ? employeeData.manager : ''],
      aadharno: [
        employeeData ? employeeData.aadharno : '123456789124',
        [Validators.required, Validators.pattern(/^\d{12}$/)],
      ],

      panno: [
        employeeData ? employeeData.panno : 'CRRPB1315H',
        [Validators.required, Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/)],
      ],
      bankname: [employeeData ? employeeData.bankname : 'AXIS', [Validators.required, Validators.maxLength(100)]],
      accno: [employeeData ? employeeData.accno : '234235235235235', [Validators.required, Validators.pattern(/^\d{1,15}$/)]],
      ifsc: [
        employeeData ? employeeData.ifsc : 'UTIB0004055',
        [Validators.required, Validators.pattern(/^([A-Za-z]{4}\d{7})$/)],
      ],
      branch: [employeeData ? employeeData.branch : 'AMEERPET', [Validators.required]],
      teamlead: [employeeData ? employeeData.teamlead : ''],
      // role: [employeeData ? employeeData.role.rolename : '', Validators.required],
      role: this.formBuilder.group({
        roleid: new FormControl(employeeData ? employeeData.role.roleid : '', [
          Validators.required
        ]),
      })
    });

  }

  validateControls() {
    // for psuedo name validation
    this.employeeForm.get('department').valueChanges.subscribe((res: any) => {
      const pseudoname = this.employeeForm.get('pseudoname');
      if (res == 'Bench Sales') {
        pseudoname.setValidators(Validators.required);
      } else {
        pseudoname.clearValidators();
      }
      pseudoname.updateValueAndValidity();
    });
    // for manager validation
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
        // tl.setValidators(Validators.required);
      } else {
        this.managerflg = false;
        this.teamleadflg = false;
        manager.clearValidators();
        // tl.clearValidators();
      }
      manager.updateValueAndValidity();
      // tl.updateValueAndValidity();
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
      .getRolesDropdown()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.rolearr = response.data;
          this.roleOptions = response.data;
          //TBD: auto-complete -
          // this.optionsMethod("roles")
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
          //TBD: auto-complete -
          //  this.optionsMethod("manager")
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
          // TBD autocomplete:
          // this.optionsMethod("teamLead")
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
    const relievingDateFormControl = this.employeeForm.get('relievingdate')
    if (joiningDateFormControl.value) {
      const formattedJoiningDate = this.datePipe.transform(joiningDateFormControl.value, 'yyyy-MM-dd');
      const formattedRelievingDate = this.datePipe.transform(relievingDateFormControl.value, 'yyyy-MM-dd');
      joiningDateFormControl.setValue(formattedJoiningDate);
      relievingDateFormControl.setValue(formattedRelievingDate);
    }
    if (this.employeeForm.invalid) {
      this.displayFormErrors();
      return;
    }
    // updates employee object form values
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
      })
    }
    const saveObj = this.data.actionName === "edit-employee" ? this.empObj : this.employeeForm.value;
    //this.uploadFileOnSubmit(1);
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

  onContryChange(ev: any) {

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
      // formData.append("files",this.resumeupload,this.resumeupload.name);
    }
    if (this.aadharUpload != null) {
      formData.append('aadhar', this.aadharUpload, this.aadharUpload.name);
      // formData.append("files",this.resumeupload,this.resumeupload.name);
    }
    if (this.panUpload != null) {
      formData.append('pan', this.panUpload, this.panUpload.name);
      // formData.append("files",this.resumeupload,this.resumeupload.name);
    }

    if (this.bankUpload != null) {
      formData.append('passbook', this.bankUpload, this.bankUpload.name);
      // formData.append("files",this.resumeupload,this.resumeupload.name);
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
           // Don't set download attribute
           //a.download = filename;
           a.click();
         }
         else {
           saveAs(blob, filename)
         }
       }
       );

  }

  deletefile(id: number, doctype: string) {
    /*  alertify.confirm("Remove File", "Are you sure you want to remove the " + fl + " ? ", () => {
        this._service.removefile(id, doctype).subscribe(
          (response: any) => {
            if (response.status === 'success') {
              alertify.success(fl + " removed successfully");
              this.loadData(did);
            }
            else {
              alertify.error("file not removed");
            }
          }
        )
      }, function () { });

      */
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
                //  this.getAllEmployees();
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
    /* alertify.confirm("Remove File", "Are you sure you want to remove the file ? ", () => {
       this._service.removingfiles(id).subscribe(
         (response: any) => {
           if (response.status === 'success') {
             alertify.success("file removed successfully");
             this.ngOnInit();
           }
           else {
             alertify.error("file not removed");
           }
         }
       )
     }, function () { });
     */

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
              //  this.getAllEmployees();
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

  // fileList?: FileData[];
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
           // a.download = filename;
           a.click();
         }
         else {
           saveAs(blob, fileData.filename)
         }
       }
         // saveAs(blob, fileData.filename)
       );

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
