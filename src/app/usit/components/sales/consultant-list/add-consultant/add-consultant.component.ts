import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
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

  private api = inject(ApiService);
  private baseUrl = this.api.apiUrl;
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
  private activatedRoute = inject(ActivatedRoute);
  private dialogServ = inject(DialogService);
  private fileService = inject(FileManagementService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddconsultantComponent>);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  isRadSelected: any;
  submitted: boolean = false;
  dailCode: string = "";
  constructor(
    private http: HttpClient,
  ) { }
  get frm() {
    return this.consultantForm.controls;
  }
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    // below apis are common for add / update consultant
    this.getvisa();
    this.gettech();
    this.getQualification();
    this.getCompanies();
    this.getFlag(this.data.flag.toLocaleLowerCase());
    if (this.data.actionName === "edit-consultant") {
      this.initConsultantForm(new Consultantinfo());
      this.consultantServ.getConsultantById(this.data.consultantData.consultantid)
        .subscribe(
          {
            next: (response: any) => {
              this.entity = response.data;
              this.cno = this.entity.consultantno;
              this.autoskills = response.data.skills;
              this.filesArr = response.data.fileupload;
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
  getFlag(type: string) {
    //alert(type)
    if (type === 'sales') {
      this.flag = 'sales';
    } else if (type === 'presales') {
      this.flag = 'presales';
    } else if (type === 'recruiting') { // for edit
      this.flag = "Recruiting";
    } else {
      this.flag  = 'DomRecruiting';
    }
  }
  initConsultantForm(consultantData: Consultantinfo) {
    this.consultantForm = this.formBuilder.group({
      consultantid : [consultantData ? consultantData.consultantid : ''],
      consultantno : [consultantData ? consultantData.consultantno : ''],
      salesmaxno : [consultantData ? consultantData.salesmaxno : ''],
      dommaxno : [consultantData ? consultantData.dommaxno : ''],
      recmaxno: [consultantData ? consultantData.recmaxno : ''],
      h1bcopy: [consultantData ? consultantData.h1bcopy : ''],
      resume: [consultantData ? consultantData.resume : ''],
      dlcopy: [consultantData ? consultantData.dlcopy : ''],



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
      status: [this.data.actionName === "edit-consultant" ?  consultantData.status : 'Initiated'],
      experience: [consultantData ? consultantData.experience : '', [Validators.required, Validators.pattern('^[0-9]*$')]],
      hourlyrate: [consultantData ? consultantData.hourlyrate : ''],
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
      // status:[this.consultantForm.status],
     relocation: [consultantData ? consultantData.relocation : ''],//  kiran
     relocatOther: [consultantData ? consultantData.relocatOther : ''],//,kiran
      consultantflg: this.data.flag.toLocaleLowerCase(),
      /* requirements: this.formBuilder.group({
         requirementid: id
       }),
       */
      addedby: localStorage.getItem('userid'),
    });

    this.validateControls();
  }
  private validateControls() {
    if (this.flag == 'Recruiting' || this.flag == 'sales') {
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
        this.consultantForm.get('technology.id').setValue('14');
        this.consultantForm.get('qualification.id').setValue('6');
        consultantemail.clearValidators();
        contactnumber.clearValidators();
        projectavailabity.clearValidators();
        availabilityforinterviews.clearValidators();
        position.clearValidators();
        experience.clearValidators();contactnumber
        firstname.clearValidators();
        lastname.clearValidators();
        ratetype.clearValidators();
        currentlocation.clearValidators();
      } else {
        consultantemail.setValidators([
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ]);
        contactnumber.setValidators(Validators.required);
        projectavailabity.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]);
        availabilityforinterviews.setValidators(Validators.required);
        position.setValidators(Validators.required);
        experience.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]);
        firstname.setValidators(Validators.required);
        lastname.setValidators(Validators.required);
        ratetype.setValidators(Validators.required);
        currentlocation.setValidators(Validators.required);
      }
      consultantemail.updateValueAndValidity();
      contactnumber.updateValueAndValidity();
      projectavailabity.updateValueAndValidity();
      availabilityforinterviews.updateValueAndValidity();
      position.updateValueAndValidity();
      experience.updateValueAndValidity();
      firstname.updateValueAndValidity();
      lastname.updateValueAndValidity();
      ratetype.updateValueAndValidity();
      currentlocation.updateValueAndValidity();
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

    const priority = this.consultantForm.get('priority');
    if (this.flag == 'sales') {
      priority.setValidators(Validators.required);
      this.consultantForm.get('requirements')?.patchValue(null);
    } else {
      priority.clearValidators();
    }
    priority.updateValueAndValidity();
  }

  // techskills(event: any) {
  //   const newVal = event.target.value;
  //   this.consultantServ.getSkilldata(newVal).subscribe((response: any) => {
  //     this.autoskills = response.data;
  //   });
  // }
  techskills(event: MatSelectChange) {
    const newVal = event.value;
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
    //getCompanies
    //  alert()
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
  enableButton = '';
  onSubmit() {
    this.onFileSubmitted = true;
    this.submitted = true;
    // stop here if consultantForm is invalid
    if (this.consultantForm.invalid) {
      this.isRadSelected = true;
      this.displayFormErrors();
      return;
    }
    if (this.flag != 'presales') {
      this.consultantForm.get("status").setValue("Active");
    }
    if (this.data.actionName === "edit-consultant"){
      [this.consultantForm.value].forEach((formVal, idx) => {
        this.entity.firstname = formVal.firstname;
        this.entity.lastname = formVal.lastname;
        this.entity.consultantemail = formVal.consultantemail;
        this.entity.linkedin = formVal.linkedin;
        this.entity.projectavailabity = formVal.projectavailabity;
        this.entity.visa = formVal.visa;
        this.entity.availabilityforinterviews = formVal.availabilityforinterviews;
        this.entity.priority = formVal.priority;
        this.entity.position = formVal.position;
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
        this.entity.refcont = formVal.refcont;
        this.entity.relocation = formVal.relocation;
        this.entity.relocatOther = formVal.relocatOther;
      })
    }

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
  getSaveObjData() {
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
    this.consultantServ.gettech().subscribe((response: any) => {
      this.techdata = response.data;
    });
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
        this.dataToBeSentToSnackBar.message =  'Record already available with given Mail address';
              this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
              this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      } else {
        this.dataToBeSentToSnackBar.message =  'Internal Server Error';
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
          // const cn = this.consultantForm.get('number');
          // cn.setValue('');
          this.message = 'Record already available with given Contact Number';
          this.dataToBeSentToSnackBar.message =  'Record already available with given Contact Number';
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        } else {
          this.dataToBeSentToSnackBar.message =  'Internal Server Error';
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
      });
  }
  /**
   *
   * @param event fetch dial-code of the country for contact number
   */
  onContryChange(event: any){
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
        this.dataToBeSentToSnackBar.message =  'File name is too large, please rename the file before upload, it should be 15 to 20 characters';
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
        this.dataToBeSentToSnackBar.message =  'Files size should not exceed 4 mb';
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
      this.dataToBeSentToSnackBar.message =  'Resume size should be less than 2 mb';
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
      this.dataToBeSentToSnackBar.message =  'H1B size should be less than 2 mb';
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
      this.dataToBeSentToSnackBar.message =  'DL size should be less than 2 mb';
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
  stopEvntProp(event: Event){
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
    dialogConfig.data =  dataToBeSentToDailog;
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
            this.fileService.conremovefile(id,doctype).pipe(takeUntil(this.destroyed$)).subscribe({
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
   deletemultiple(id: number){
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
