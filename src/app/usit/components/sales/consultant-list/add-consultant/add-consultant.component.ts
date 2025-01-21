import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, map, startWith, takeUntil, tap } from 'rxjs';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Loader } from '@googlemaps/js-api-loader';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { DialogService } from 'src/app/services/dialog.service';
import { AddCompanyComponent } from '../../../masters/companies-list/add-company/add-company.component';
import { AddVisaComponent } from '../../../masters/visa-list/add-visa/add-visa.component';
import { AddTechnologyTagComponent } from '../../../technology-tag-list/add-technology-tag/add-technology-tag.component';
import { AddQualificationComponent } from '../../../masters/qualification-list/add-qualification/add-qualification.component';
import { Consultantinfo } from 'src/app/usit/models/consultantinfo';
import { saveAs } from 'file-saver';
import { FileData } from '../../../employee-list/add-employee/add-employee.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { FileManagementService } from 'src/app/usit/services/file-management.service';
import { ApiService } from 'src/app/core/services/api.service';

import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-add-consultant',
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
    MatRadioModule,
    NgxMatIntlTelInputComponent,
    NgxGpAutocompleteModule,
    MatChipsModule,
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
  templateUrl: './add-consultant.component.html',
  styleUrls: ['./add-consultant.component.scss'],
})
export class AddconsultantComponent implements OnInit, OnDestroy {
  flag!: string;
  // private baseUrl: string = environment.API_BASE_URL;
  protected isFormSubmitted: boolean = false;
  private api = inject(ApiService);
  uploadedfiles: string[] = [];
  message: any;
  consultantForm: any = FormGroup;
  visadata: any = [];
  techdata: any = [];
  requirementdata: any = [];
  onFileSubmitted = false;
  flg = true;
  blur!: string;
  arraydt: any = [];
  consultdata: any = [];
  QualArr: any = [];
  other = false;
  autoskills!: string;
  latestrequirement!: any;
  role!: any;
  errflg!: any;
  company: any = [];
  // edit props
  entity = new Consultantinfo();
  cno !: string;
  filesArr!: any;

  selectData: any = [];
  isAllOptionsSelected = false;
  empArr: any = [];
  employees: any[] = [];
  employeedata: any = [];

  selectOptionObj = {
    interviewAvailability: IV_AVAILABILITY,
    priority: PRIORITY,
    statusType: STATUS,
    radioOptions: RADIO_OPTIONS

  };
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  // services
  private consultantServ = inject(ConsultantService);
  private snackBarServ = inject(SnackBarService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private dialogServ = inject(DialogService);
  private fileService = inject(FileManagementService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddconsultantComponent>);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  isRadSelected: any;
  isRelocationRadSelected: any;
  submitted: boolean = false;
  dailCode: string = "";
  searchTechOptions$!: Observable<any>;
  technologyOptions!: any;
  isTechnologyDataAvailable: boolean = false;

  constructor(

  ) { }
  get frm() {
    return this.consultantForm.controls;
  }

  kiran!:any;
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    // below apis are common for add / update consultant
    this.getvisa();
    this.gettech();
    this.getQualification();
    this.getCompanies();
    this.getFlag(this.data.flag.toLocaleLowerCase());
   
    this.getEmployee();

    if (this.data.actionName === "edit-consultant") {
      this.kiran = 'edit'
      this.initConsultantForm(new Consultantinfo());
      this.consultantServ.getConsultantById(this.data.consultantData.consultantid)
        .subscribe(
          {
            next: (response: any) => {
              this.entity = response.data;
              this.cno = this.entity.consultantno;
              this.autoskills = response.data.skills;
              this.filesArr = response.data.fileupload;
              this.getAssignedEmployee();
              this.initConsultantForm(response.data);
            }, error: err => {
              this.dataToBeSentToSnackBar.message = err.message;
              this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
              this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
            }
          }

        );
    } else {
      this.initConsultantForm(new Consultantinfo());
    }
  }

  get controls() {
    return this.consultantForm.controls;
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
    this.consultantForm.get('empid')!.setValue(mappedData);

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

  }

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
    this.consultantForm.get('empid')!.setValue(mappedData);
    
  }

  getEmployee() {

    if(!(this.flag === 'Recruiting')){
    this.consultantServ.getEmployee().subscribe(
      (response: any) => {
        this.empArr = response.data;
        this.empArr.map((x: any) => x.selected = false);
        this.prepopulateSelectedEmployees();
      }
    )
  }
  else
  {
    this.consultantServ.getRecruiters().subscribe(
      (response: any) => {
        this.empArr = response.data;
        this.empArr.map((x: any) => x.selected = false);
        this.prepopulateSelectedEmployees();
      }
    )
  }
  }

  prepopulateSelectedEmployees() {
    // Clear the existing employees array
    this.selectData = [];
    this.selectData = this.employeedata;
    this.consultantForm.get('empid')?.patchValue(this.selectData);

    if (this.empArr.length && this.employeedata.length) {
      this.employeedata.forEach((x: any, listId: number) => {
        this.empArr.find((y: any) => y.userid === x.userid).selected = true;
      })
    }

    this.isAllOptionsSelected = this.empArr.every((x: any) => x.selected === true)

  }

  private getAssignedEmployee() {
    this.consultantServ.getAssignedRecruiter(this.data.consultantData.consultantid).subscribe(
      (response: any) => {
        this.employeedata = response.data; // saveed selected items from assign rec field
        this.employeedata.map((x: any) => x.selected = true);
        this.getEmployee();
        // this.prepopulateSelectedEmployees();
      }
    );
  }

  getFlag(type: string) {
    //alert(type)
    if (type === 'sales') {
      this.flag = 'sales';
    } else if (type === 'presales') {
      this.flag = 'presales';
    } else if (type === 'recruiting') { // for edit
      this.flag = "Recruiting";
    } else {
      this.flag = 'DomRecruiting';
    }
  }
  initConsultantForm(consultantData: Consultantinfo) {

if( this.flag ==='DomRecruiting'){
  
  this.consultantForm = this.formBuilder.group({
    consultantid: [consultantData ? consultantData.consultantid : ''],
    consultantno: [consultantData ? consultantData.consultantno : ''],
    salesmaxno: [consultantData ? consultantData.salesmaxno : ''],
    dommaxno: [consultantData ? consultantData.dommaxno : ''],
    recmaxno: [consultantData ? consultantData.recmaxno : ''],
    h1bcopy: [consultantData ? consultantData.h1bcopy : ''],
    resume: [consultantData ? consultantData.resume : ''],
    dlcopy: [consultantData ? consultantData.dlcopy : ''],
    // consultanttype: [consultantData ? consultantData.consultanttype : '', Validators.required],
    firstname: [consultantData ? consultantData.firstname : '', Validators.required], //['', [Validators.required, Validators.pattern("^[a-zA-Z][a-zA-Z]*$")]],
    lastname: [consultantData ? consultantData.lastname : '', Validators.required], ///^[+]\d{12}$   /^[+]\d{12}$   ^[0-9]*$
    consultantemail: [
      consultantData ? consultantData.consultantemail : '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ],
    ],
    contactnumber: [consultantData ? consultantData.contactnumber : '', Validators.required],
    linkedin: [consultantData ? consultantData.linkedin : ''],
    projectavailabity: [
      consultantData ? consultantData.projectavailabity : '',
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    visa: [consultantData ? consultantData.visa : '', Validators.required],
    availabilityforinterviews: [consultantData ? consultantData.availabilityforinterviews : '', Validators.required],
    priority: [consultantData ? consultantData.priority : ''],
    company: [consultantData ? consultantData.company : '', Validators.required],
    position: [consultantData ? consultantData.position : '', Validators.required],
    status: [this.data.actionName === "edit-consultant" ? consultantData.status : 'Initiated'],
    // status: [this.data.actionName === "edit-consultant" ? consultantData.status : '', Validators.required],
    experience: [consultantData ? consultantData.experience : '', [Validators.required, Validators.pattern('^[0-9]*$')]],
    hourlyrate: [consultantData ? consultantData.hourlyrate : '', Validators.required],
    skills: [consultantData ? consultantData.skills : ''],
    ratetype: [consultantData ? consultantData.ratetype : '', Validators.required],
    technology: [consultantData ? consultantData.technology : '', Validators.required],
    currentlocation: [consultantData ? consultantData.currentlocation : '', Validators.required],
    summary: [consultantData ? consultantData.summary : ''],
    qualification: [consultantData ? consultantData.qualification : '', Validators.required],
    university: [consultantData ? consultantData.university : ''],
    yop: [consultantData ? consultantData.yop : ''],
    emprefname: [consultantData ? consultantData.emprefname : ''],
    //emprefemail: new FormControl(consultantData ? consultantData.emprefemail : ''),
    emprefemail: [consultantData ? consultantData.emprefemail : ''],
    //emprefcont: new FormControl(consultantData ? consultantData.emprefcont : ''),
    emprefcont: [consultantData ? consultantData.emprefcont : ''],
    companyname: [consultantData ? consultantData.companyname : ''],
    refname: [consultantData ? consultantData.refname : ''],
    // refemail: new FormControl(consultantData ? consultantData.refemail : ''),
    refemail: [consultantData ? consultantData.refemail : ''],
    //refcont: new FormControl(consultantData ? consultantData.refcont : ''),
    refcont: [consultantData ? consultantData.refcont : ''],
    // // number: ['', Validators.required],
    empid: [consultantData ? consultantData.empid : ''],
    // empid:[this.consultantForm.empid, Validators.required],
    // empid: [this.consultantForm.empid : '', Validators.required],
    relocation: [consultantData ? consultantData.relocation : '', Validators.required],//  kiran
    relocatOther: [consultantData ? consultantData.relocatOther : ''],//,kiran
    consultantflg: this.data.flag.toLocaleLowerCase(),
    /* requirements: this.formBuilder.group({
       requirementid: id
     }),
     */
    addedby: localStorage.getItem('userid'),
    preSource: [0]
  });

}else{

  this.consultantForm = this.formBuilder.group({
    consultantid: [consultantData ? consultantData.consultantid : ''],
    consultantno: [consultantData ? consultantData.consultantno : ''],
    salesmaxno: [consultantData ? consultantData.salesmaxno : ''],
    dommaxno: [consultantData ? consultantData.dommaxno : ''],
    recmaxno: [consultantData ? consultantData.recmaxno : ''],
    h1bcopy: [consultantData ? consultantData.h1bcopy : ''],
    resume: [consultantData ? consultantData.resume : ''],
    dlcopy: [consultantData ? consultantData.dlcopy : ''],
    // consultanttype: [consultantData ? consultantData.consultanttype : '', Validators.required],
    firstname: [consultantData ? consultantData.firstname : '', Validators.required], //['', [Validators.required, Validators.pattern("^[a-zA-Z][a-zA-Z]*$")]],
    lastname: [consultantData ? consultantData.lastname : '', Validators.required], ///^[+]\d{12}$   /^[+]\d{12}$   ^[0-9]*$
    consultantemail: [
      consultantData ? consultantData.consultantemail : '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ],
    ],
    contactnumber: [consultantData ? consultantData.contactnumber : '', Validators.required],
    linkedin: [consultantData ? consultantData.linkedin : ''],
    projectavailabity: [
      consultantData ? consultantData.projectavailabity : '',
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    visa: [consultantData ? consultantData.visa : '', Validators.required],
    availabilityforinterviews: [consultantData ? consultantData.availabilityforinterviews : '', Validators.required],
    priority: [consultantData ? consultantData.priority : ''],
    company: [consultantData ? consultantData.company : '', Validators.required],
    position: [consultantData ? consultantData.position : '', Validators.required],
    status: [this.data.actionName === "edit-consultant" ? consultantData.status : 'Initiated'],
    // status: [this.data.actionName === "edit-consultant" ? consultantData.status : '', Validators.required],
    experience: [consultantData ? consultantData.experience : '', [Validators.required, Validators.pattern('^[0-9]*$')]],
    hourlyrate: [consultantData ? consultantData.hourlyrate : '', Validators.required],
    skills: [consultantData ? consultantData.skills : ''],
    ratetype: [consultantData ? consultantData.ratetype : '', Validators.required],
    technology: [consultantData ? consultantData.technology : '', Validators.required],
    currentlocation: [consultantData ? consultantData.currentlocation : '', Validators.required],
    summary: [consultantData ? consultantData.summary : ''],
    qualification: [consultantData ? consultantData.qualification : '', Validators.required],
    university: [consultantData ? consultantData.university : ''],
    yop: [consultantData ? consultantData.yop : ''],
    emprefname: [consultantData ? consultantData.emprefname : ''],
    //emprefemail: new FormControl(consultantData ? consultantData.emprefemail : ''),
    emprefemail: [consultantData ? consultantData.emprefemail : ''],
    //emprefcont: new FormControl(consultantData ? consultantData.emprefcont : ''),
    emprefcont: [consultantData ? consultantData.emprefcont : ''],
    companyname: [consultantData ? consultantData.companyname : ''],
    refname: [consultantData ? consultantData.refname : ''],
    // refemail: new FormControl(consultantData ? consultantData.refemail : ''),
    refemail: [consultantData ? consultantData.refemail : ''],
    //refcont: new FormControl(consultantData ? consultantData.refcont : ''),
    refcont: [consultantData ? consultantData.refcont : ''],
    // // number: ['', Validators.required],
    empid: [consultantData ? consultantData.empid : '', Validators.required],
    // empid:[this.consultantForm.empid, Validators.required],
    // empid: [this.consultantForm.empid : '', Validators.required],
    relocation: [consultantData ? consultantData.relocation : '', Validators.required],//  kiran
    relocatOther: [consultantData ? consultantData.relocatOther : ''],//,kiran
    consultantflg: this.data.flag.toLocaleLowerCase(),
    /* requirements: this.formBuilder.group({
       requirementid: id
     }),
     */
    addedby: localStorage.getItem('userid'),
    preSource: [0]
  });
}
    
   
    if (this.data.actionName === "edit-consultant" && this.role === 'Employee') {
      this.clrValidators();
    }

    if (this.data.actionName === "edit-consultant" && consultantData && consultantData.technology) {
      this.consultantServ.gettechDropDown(consultantData.technology).subscribe(
        (technology: any) => {
          if (technology && technology.data) {
            this.techid = technology.data[0].id;
            this.consultantForm.get('technology').setValue(technology.data[0].technologyarea);
          }
        },
        (error: any) => {
          console.error('Error fetching consultant details:', error);
        }
      );
    }

    this.validateControls();
  }
  private validateControls() {
    if (this.kiran !== "edit" && (this.flag === 'Recruiting' || this.flag === 'sales')) {
      // alert()
      this.consultantForm.get('status').setValue('Active');
  }
  


    this.consultantForm.get('status').valueChanges.subscribe((res: any) => {
      const consultantemail = this.consultantForm.get('consultantemail');
      const contactnumber = this.consultantForm.get('number');
      const projectavailabity = this.consultantForm.get('projectavailabity');
      const availabilityforinterviews = this.consultantForm.get(
        'availabilityforinterviews'
      );
      const position = this.consultantForm.get('position');
      const experience = this.consultantForm.get('experience');
      const firstname = this.consultantForm.get('firstname');
      const lastname = this.consultantForm.get('lastname');
      const ratetype = this.consultantForm.get('ratetype');
      const currentlocation = this.consultantForm.get('currentlocation');



      if (res == 'Tagged') {
        this.consultantForm.get('technology').setValue('14');
        this.consultantForm.get('qualification').setValue('6');
        consultantemail.clearValidators();
        contactnumber.clearValidators();
        projectavailabity.clearValidators();
        availabilityforinterviews.clearValidators();
        position.clearValidators();
        experience.clearValidators();
        firstname.clearValidators();
        lastname.clearValidators();
        ratetype.clearValidators();
        currentlocation.clearValidators();
      } else {
        if (consultantemail) {
          consultantemail.setValidators([
            Validators.required,
            Validators.email,
            Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
          ]);
        }
        if (contactnumber) {
          contactnumber.setValidators(Validators.required);
        }

        if (projectavailabity) {
          projectavailabity.setValidators([
            Validators.required,
            Validators.pattern('^[0-9]*$'),
          ]);
        }
        if (availabilityforinterviews) {
          availabilityforinterviews.setValidators(Validators.required);
        }
        if (position) {
          position.setValidators(Validators.required);
        }
        if (experience) {
          experience.setValidators([
            Validators.required,
            Validators.pattern('^[0-9]*$'),
          ]);
        }
        if (firstname) {
          firstname.setValidators(Validators.required);
        }
        if (lastname) {
          lastname.setValidators(Validators.required);
        }
        if (ratetype) {
          ratetype.setValidators(Validators.required);
        }
        if (currentlocation) {
          currentlocation.setValidators(Validators.required);
        }
      }
      if (consultantemail) {
        consultantemail.updateValueAndValidity();
      }
      if (contactnumber) {
        contactnumber.updateValueAndValidity();
      }

      if (projectavailabity) {
        projectavailabity.updateValueAndValidity();
      }
      if (availabilityforinterviews) {
        availabilityforinterviews.updateValueAndValidity();
      }
      if (position) {
        position.updateValueAndValidity();
      }
      if (experience) {
        experience.updateValueAndValidity();
      }
      if (firstname) {
        firstname.updateValueAndValidity();
      }
      if (lastname) {
        lastname.updateValueAndValidity();
      }
      if (ratetype) {
        ratetype.updateValueAndValidity();
      }
      if (currentlocation) {
        currentlocation.updateValueAndValidity();
      }
      // consultantemail.updateValueAndValidity();
      // contactnumber.updateValueAndValidity();
      // projectavailabity.updateValueAndValidity();
      // availabilityforinterviews.updateValueAndValidity();
      // position.updateValueAndValidity();
      // experience.updateValueAndValidity();
      // firstname.updateValueAndValidity();
      // lastname.updateValueAndValidity();
      // ratetype.updateValueAndValidity();
      // currentlocation.updateValueAndValidity();
    });
    this.consultantForm.get('relocation').valueChanges.subscribe((res: any) => {
      const relocatOther = this.consultantForm.get('relocatOther');
      if (res == 'Other') {
        this.other = true;
        relocatOther.setValidators(Validators.required);
      } else {
        this.other = false;
        relocatOther.clearValidators();
      }
      relocatOther.updateValueAndValidity();
    });
    
    // this.consultantForm.get('consultanttype').valueChanges.subscribe((res: any) => {
    //   if (res == "Future") {
    //     this.consultantForm.get('projectavailabity').clearValidators();
    //     this.consultantForm.get('visa').clearValidators();
    //     this.consultantForm.get('availabilityforinterviews').clearValidators();
    //     this.consultantForm.get('priority').clearValidators();
    //     this.consultantForm.get('company').clearValidators();
    //     this.consultantForm.get('position').clearValidators();
    //     this.consultantForm.get('hourlyrate').clearValidators();
    //     this.consultantForm.get('currentlocation').clearValidators();
    //     this.consultantForm.get('qualification').clearValidators();
    //     this.consultantForm.get('relocation').clearValidators();
    //     this.consultantForm.get('experience').clearValidators();
    //   } else {
    //     this.consultantForm.get('projectavailabity').setValidators([Validators.required]);
    //     this.consultantForm.get('visa').setValidators([Validators.required]);
    //     this.consultantForm.get('availabilityforinterviews').setValidators([Validators.required]);
    //     this.consultantForm.get('priority').setValidators([Validators.required]);
    //     this.consultantForm.get('company').setValidators([Validators.required]);
    //     this.consultantForm.get('position').setValidators([Validators.required]);
    //     this.consultantForm.get('hourlyrate').setValidators([Validators.required]);
    //     this.consultantForm.get('currentlocation').setValidators([Validators.required]);
    //     this.consultantForm.get('qualification').setValidators([Validators.required]);
    //     this.consultantForm.get('relocation').setValidators([Validators.required]);
    //   }
    //   this.consultantForm.get('projectavailabity').updateValueAndValidity();
    //   this.consultantForm.get('visa').updateValueAndValidity();
    //   this.consultantForm.get('availabilityforinterviews').updateValueAndValidity();
    //   this.consultantForm.get('priority').updateValueAndValidity();
    //   this.consultantForm.get('company').updateValueAndValidity();
    //   this.consultantForm.get('position').updateValueAndValidity();
    //   this.consultantForm.get('hourlyrate').updateValueAndValidity();
    //   this.consultantForm.get('currentlocation').updateValueAndValidity();
    //   this.consultantForm.get('qualification').updateValueAndValidity();
    //   this.consultantForm.get('relocation').updateValueAndValidity();
    //   this.consultantForm.get('experience').updateValueAndValidity();
    // });
    const priority = this.consultantForm.get('priority');

    if (this.flag == 'sales') {
      priority.setValidators(Validators.required);
      this.consultantForm.get('requirements')?.patchValue(null);
    } else if(this.flag=='presales' && this.role !== 'Employee') {
      priority.setValidators(Validators.required);
      this.consultantForm.get('requirements')?.patchValue(null);
    }else if(this.flag=='presales' && this.role === 'Employee') {
      priority.clearValidators();
    } else {
      priority.clearValidators();
    }
    priority.updateValueAndValidity();
  }

  clrValidators() {
    // Loop through all controls in the form
    Object.keys(this.consultantForm.controls).forEach(key => {
      const control = this.consultantForm.get(key);
      // Clear validators for each control
      control.clearValidators();
      // Update value and validity
      control.updateValueAndValidity();
    });
  }

  // techskills(event: any) {
  //   const newVal = event.target.value;
  //   this.consultantServ.getSkilldata(newVal).subscribe((response: any) => {
  //     this.autoskills = response.data;
  //   });
  // }
  techskills(option: any) {
    const newVal = option.id;
    this.techid = option.id;
    this.consultantServ.getSkilldata(newVal).subscribe((response: any) => {
      this.consultantForm.get('skills').setValue(response.data);
    });
  }
  options: any = {
    componentRestrictions: { country: ['IN', 'US'] },
  };

  address = '';
  handleAddressChange(address: any) {
    // this.address = address.formatted_address;
    this.consultantForm.get('currentlocation').setValue(address.formatted_address);
  }

  getCompanies() {
    this.consultantServ.getCompanies().subscribe((response: any) => {
      this.company = response.data;
    });
  }

  backTo() {
    if (this.flag == 'sales') {
      this.router.navigate(['sales-consultants/sales']);
    } else if (this.flag == 'presales') {
      this.router.navigate(['pre-sales/presales']);
    } else {
      this.router.navigate(['recruiting-consultants/recruiting']);
    }
  }
  enableButton = ''
  onSubmit() {
    this.onFileSubmitted = true;
    this.submitted = true;
    // stop here if consultantForm is invalid
    if (this.consultantForm.invalid) {
      this.isFormSubmitted = false
      this.isRadSelected = true;
      this.isRelocationRadSelected = true;
      this.displayFormErrors();
      return;
    }
    else {
      this.isFormSubmitted = true
    }
    this.consultantForm.get('technology').setValue(this.techid);
    this.trimSpacesFromFormValues();
    if (this.data.actionName === "edit-consultant") {
    //   this.selectData = consultantData.empid || []; // Assuming empid is an array of employee objects
    // this.consultantForm.get('empid')?.setValue(this.selectData);
    // this.consultantForm.get('empid')?.setValue(this.employeedata);
    this.consultantForm.get('empid')?.setValue(this.empArr);
      [this.consultantForm.value].forEach((formVal, idx) => {
        this.entity.firstname = formVal.firstname.trim();
        this.entity.lastname = formVal.lastname.trim();
        this.entity.consultantemail = formVal.consultantemail;
        this.entity.linkedin = formVal.linkedin;
        this.entity.projectavailabity = formVal.projectavailabity;
        this.entity.visa = formVal.visa;
        this.entity.availabilityforinterviews = formVal.availabilityforinterviews;
        this.entity.priority = formVal.priority;
        this.entity.position = formVal.position.trim();
        this.entity.status = formVal.status;
        this.entity.contactnumber = formVal.contactnumber;
        this.entity.hourlyrate = formVal.hourlyrate;
        this.entity.skills = formVal.skills;
        this.entity.experience = formVal.experience;
        this.entity.ratetype = formVal.ratetype;
        this.entity.technology = formVal.technology;
        this.entity.currentlocation = formVal.currentlocation;
        this.entity.summary = formVal.summary;
        this.entity.qualification = formVal.qualification;
        this.entity.university = formVal.university;
        this.entity.yop = formVal.yop;
        this.entity.emprefname = formVal.emprefname;
        this.entity.emprefemail = formVal.emprefemail;
        this.entity.emprefcont = formVal.emprefcont;
        this.entity.companyname = formVal.companyname;
        this.entity.company = formVal.company;
        this.entity.refname = formVal.refname;
        this.entity.refemail = formVal.refemail;
        this.entity.refcont = formVal.refcont;
        this.entity.relocation = formVal.relocation;
        this.entity.relocatOther = formVal.relocatOther;
        // this.entity.empid = formVal.empid;
        this.entity.empid = this.selectData;
      })
    }
    this.trimSpacesFromFormValues();
    this.consultantForm.get('empid')!.setValue(this.selectData);
    const saveObj = this.data.actionName === "edit-consultant" ? this.entity : this.consultantForm.value;

    const lenkedIn = this.consultantForm.get('linkedin')?.value;

    if (this.flg == true) {
      // const saveReqObj = this.getSaveObjData()
      this.consultantServ.registerconsultant(saveObj)
        .subscribe({
          next: (data: any) => {
            if (data.status == 'success') {
              this.dataToBeSentToSnackBar.message = this.data.actionName === "edit-consultant" ? 'Consultant updated successfully' : 'Consultant added successfully';
              this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
              this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
              this.onFileSubmit(data.data.consultantid);
              this.dialogRef.close();
            } else {
              this.enableButton = '';
              this.message = data.message;
              this.dataToBeSentToSnackBar.message = "Record Insertion failed";
              this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
              this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
            }
          },
          error: err => {
            this.enableButton = '';
          }
        }
        );
    }
  }

  trimSpacesFromFormValues() {
    Object.keys(this.consultantForm.controls).forEach((controlName: string) => {
      const control = this.consultantForm.get(controlName);
      if (control.value && typeof control.value === 'string') {
        control.setValue(control.value.trim());
      }
    });
  }

  getSaveObjData() {
    this.trimSpacesFromFormValues();
    if (this.data.actioName === 'edit-consultant') {
      return { ...this.entity, ...this.consultantForm.value }
    }
    return this.consultantForm.value;
  }
  // supporting drop downs
  getrequirements() {
    this.consultantServ.getrequirements().subscribe((response: any) => {
      this.requirementdata = response.data;
    });
  }
  getvisa() {
    this.consultantServ.getvisa().subscribe((response: any) => {
      this.visadata = response.data;
    });
  }
  gettech() {
    this.searchTechOptions$ = this.consultantServ.gettechDropDown(0).pipe(map((x: any) => x.data), tap(resp => {
      if (resp && resp.length) {
        this.getTechOptionsForAutoComplete(resp);
      }
    }));
  }

  getTechOptionsForAutoComplete(data: any) {
    this.technologyOptions = data;
    this.searchTechOptions$ =
      this.consultantForm.controls.technology.valueChanges.pipe(
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
    if (filteredTechnologies.length === 1) {
      this.techid = filteredTechnologies[0].id;
    }
    return filteredTechnologies;
  }

  getQualification() {
    this.consultantServ.getQualification().subscribe((response: any) => {
      this.QualArr = response.data;
    });
  }

  emailDuplicate(event: any) {
    const email = event.target.value;
    this.consultantServ.duplicatecheckEmail(email).subscribe((response: any) => {
      if (response.status == 'success') {
        this.message = '';
      } else if (response.status == 'fail') {
        const cn = this.consultantForm.get('consultantemail');
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
  ctnumber!: any;
  changeFn(event: any) {
    const number = `+${this.dailCode}${event.target.value}`;
    this.consultantServ
      .duplicatecheck(number)
      .subscribe((response: any) => {
        if (response.status == 'success') {
          this.message = '';
        } else if (response.status == 'fail') {
          const cn = this.consultantForm.get('contactnumber');
          cn.setValue('');
          this.message = 'Record already available with given Contact Number';
          this.dataToBeSentToSnackBar.message = 'Record already available with given Contact Number';
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        } else {
          this.dataToBeSentToSnackBar.message = 'Internal Server Error';
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
      });
  }
  /**
   *
   * @param event fetch dial-code of the country for contact number
   */
  onContryChange(event: any) {
    this.dailCode = event.dialCode;
  }
  @ViewChild('multifiles')
  multifiles: any = ElementRef;
  sum = 0;
  onFileChange(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      var items = file.name.split('.');
      const str = items[0];
      if (str.length > 20) {
        this.dataToBeSentToSnackBar.message = 'File name is too large, please rename the file before upload, it should be 15 to 20 characters';
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        this.multifiles.nativeElement.value = '';
      }
      const fileSizeInKB = Math.round(file.size / 1024);
      this.sum = this.sum + fileSizeInKB;
      if (fileSizeInKB < 4300) {
        this.uploadedfiles.push(event.target.files[i]);
      } else {
        this.multifiles.nativeElement.value = '';
        this.uploadedfiles = [];
        this.dataToBeSentToSnackBar.message = 'Files size should not exceed 4 mb';
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      }
      //this.uploadedfiles.push(event.target.files[i]);
    }
  }

  @ViewChild('resume')
  resume: any = ElementRef;
  resumeupload!: any;
  uploaddoc(event: any) {
    this.resumeupload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    if (fileSizeInKB > 4300) {
      this.flg = false;
      this.resume.nativeElement.value = '';
      this.dataToBeSentToSnackBar.message = 'Resume size should be less than 2 mb';
      this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
      this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);

      return;
    } else {
      this.message = '';
      this.flg = true;
    }
  }
  @ViewChild('h1b') h1b: any = ElementRef;
  h1bupload!: any;
  uploadH1B(event: any) {
    this.h1bupload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    if (fileSizeInKB > 4300) {
      this.flg = false;
      this.h1b.nativeElement.value = '';
      this.message = 'H1B size should be less than 2 mb';
      this.dataToBeSentToSnackBar.message = 'H1B size should be less than 2 mb';
      this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
      this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      return;
    } else {
      this.message = '';
      this.flg = true;
    }
  }
  @ViewChild('dl')
  dl: any = ElementRef;
  dlupload!: any;
  uploadDL(event: any) {
    this.dlupload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    // var items = file.name.split(".");
    // const str = items[0];
    // if (str.length > 16) {
    //   //alertify.error("File name is toot large, please rename the file before upload, it should be 10 to 15 characters")
    //   this.dl.nativeElement.value = "";
    // }

    if (fileSizeInKB > 4300) {
      //2200
      this.flg = false;
      this.dl.nativeElement.value = '';
      this.message = 'DL size should be less than 2 mb';
      this.dataToBeSentToSnackBar.message = 'DL size should be less than 2 mb';
      this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
      this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      return;
    } else {
      this.message = '';
      this.flg = true;
    }
  }
  onFileSubmit(id: number) {
    const formData = new FormData();
    for (var i = 0; i < this.uploadedfiles.length; i++) {
      formData.append('files', this.uploadedfiles[i]);
    }

    if (this.resumeupload != null) {
      formData.append('resume', this.resumeupload, this.resumeupload.name);
      // formData.append("files",this.resumeupload,this.resumeupload.name);
    }

    if (this.h1bupload != null) {
      formData.append('h1b', this.h1bupload, this.h1bupload.name);
      // formData.append("files",this.resumeupload,this.resumeupload.name);
    }

    if (this.dlupload != null) {
      formData.append('dl', this.dlupload, this.dlupload.name);
      // formData.append("files",this.resumeupload,this.resumeupload.name);
    }

    //upload
    this.fileService
      .ConUploadFile(formData, id)
      .subscribe((response: any) => {
        if (response.status === 200) {
        } else {
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.dataToBeSentToSnackBar.message = 'File upload failed';
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
        }
      });
  }
  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.consultantForm.controls).forEach((field) => {
      const control = this.consultantForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }
  onAddCompany() {
    const dataToBeSentToDailog = {
      title: 'Add Company',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionData: this.company,
      actionName: 'add-company'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw';
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddCompanyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.allowAction) {
        this.getCompanies()
      }
    })
  }
  stopEvntProp(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
  onAddVisa() {
    const dataToBeSentToDailog = {
      title: 'Add Visa',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionData: this.visadata,
      actionName: 'add-visa'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw';
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddVisaComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.allowAction) {
        this.getvisa()
      }
    })
  }
  onAddTechnology() {
    const dataToBeSentToDailog = {
      title: 'Add Technology',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionData: this.techdata,
      actionName: 'add-technology'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw';
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddTechnologyTagComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.allowAction) {
        this.gettech()
      }
    })
  }
  onAddQualification() {
    const dataToBeSentToDailog = {
      title: 'Add Qualification',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionData: this.QualArr,
      actionName: 'add-qualification'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw';
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddQualificationComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.allowAction) {
        this.getQualification()
      }
    })
  }
  onRadioChange(event: MatRadioChange) {
    this.isRadSelected = event.value
  }

  onRelocationRadioChange(event: MatRadioChange) {
    this.isRelocationRadSelected = event.value
  }
  // fileList?: FileData[];
  type!: any;
  filedetails(fileData: FileData) {
    this.type = fileData.filename;
    var items = this.type.split(".");
    this.fileService
      .downloadConsultantfile(fileData.docid)
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
  downloadfile(id: number, filename: string, flg: string) {

    var items = filename.split(".");
    this.fileService
      .downloadconresume(id, flg)
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
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: id,
      actionName: 'delete-employee'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = dataToBeSentToDailog;
    dialogConfig.width = "fit-content";
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );
    // call delete api after  clicked 'Yes' on dialog click
    dialogRef.afterClosed().subscribe({
      next: (resp) => {
        if (dialogRef.componentInstance.allowAction) {
          // call delete api
          this.fileService.conremovefile(id, doctype).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response: any) => {
              if (response.status == 'success') {
                //  this.getAllEmployees();
                this.dataToBeSentToSnackBar.message =
                  'File Deleted successfully';
                this.dialogRef.close();
              } else {
                this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                this.dataToBeSentToSnackBar.message = 'Record Deletion failed';
              }
              this.snackBarServ.openSnackBarFromComponent(
                this.dataToBeSentToSnackBar
              );
            },
            error: (err) => {
              this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
              this.dataToBeSentToSnackBar.message = err.message;
              this.snackBarServ.openSnackBarFromComponent(
                this.dataToBeSentToSnackBar
              );
            },
          });
        }
      },
    });
  }
  /**
   *
   * @param id docid
   */
  deletemultiple(id: number) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: id,
      actionName: 'delete-employee'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = dataToBeSentToDailog;
    dialogConfig.width = "fit-content";
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );
    // call delete api after  clicked 'Yes' on dialog click
    dialogRef.afterClosed().subscribe({
      next: (resp) => {
        if (dialogRef.componentInstance.allowAction) {
          // call delete api
          this.fileService.conremovefiles(id).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response: any) => {
              if (response.status == 'success') {
                //  this.getAllEmployees();
                this.dataToBeSentToSnackBar.message =
                  'File Deleted successfully';
                this.dialogRef.close();
              } else {
                this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                this.dataToBeSentToSnackBar.message = 'Record Deletion failed';
              }
              this.snackBarServ.openSnackBarFromComponent(
                this.dataToBeSentToSnackBar
              );
            },
            error: (err) => {
              this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
              this.dataToBeSentToSnackBar.message = err.message;
              this.snackBarServ.openSnackBarFromComponent(
                this.dataToBeSentToSnackBar
              );
            },
          });
        }
      },
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

  onlyNumberKey(evt: any) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
      return false;
    return true;
  }
}
export const IV_AVAILABILITY = [
  'Availabity for the interviews *',
  'Anytime',
  'Morning session',
  'afternoon session'
]
export const PRIORITY = [
  { code: 'P1', desc: 'P1 - Our h1 w2 consultant not on the job' },
  { code: 'P2', desc: 'P2 - our h1 consultant whose project is ending in 4 weeks' },
  { code: 'P3', desc: 'P3 - new visa transfer consultant looking for a job' },
  { code: 'P4', desc: 'P4 - our h1 consultant on a project looking for a high rate' },
  { code: 'P5', desc: 'P5 - OPT /CPT visa looking for a job' },
  { code: 'P6', desc: 'P6 - independent visa holder looking for a job' },
  { code: 'P7', desc: 'P7 - independent visa holder project is ending in 4 weeks' },
  { code: 'P8', desc: 'P8 - independent visa holder project looking for a high rate' },
  { code: 'P9', desc: 'P9 - 3rd party consultant' },
  { code: 'P10', desc: 'P10' },

]

export const STATUS = [
  'Completed',
  'Verified',
  'Tagged',
  'Active',
  'InActive',
  'Initiated'
]

export const RADIO_OPTIONS = {
  rate: [
    { value: 'C2C', id: 1, selected: true },
    { value: '1099', id: 2 },
    { value: 'W2', id: 3 },
    { value: 'Full Time', id: 4 },
    { value: 'C2H', id: 5 }
  ],
  relocation: [
    { value: 'Open', id: 1 },
    { value: 'No', id: 2 },
    { value: 'Other', id: 3 },
  ]
}
