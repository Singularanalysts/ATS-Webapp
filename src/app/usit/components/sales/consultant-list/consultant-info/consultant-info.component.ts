import { Component, ElementRef, OnInit, ViewChild,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';

import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { FileManagementService } from 'src/app/usit/services/file-management.service';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EmployeeManagementService } from 'src/app/usit/services/employee-management.service';
import { DashboardService } from 'src/app/usit/services/dashboard.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-consultant-info',
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
    CommonModule, RouterLink, MatTooltipModule, 
    MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatStepperModule
  ],
 
  templateUrl: './consultant-info.component.html',
  styleUrls: ['./consultant-info.component.scss']
})
export class ConsultantInfoComponent implements OnInit {

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
  flag!: any;
  entity: any = [];
  datarr: any[] = [];
  id!: any;
  hasAcces: any;
  @ViewChild('stepper') private myStepper!: MatStepper;
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['RoleName', 'Actions'];
  private empServ = inject(EmployeeManagementService);
  private dashboardServ = inject(DashboardService);
  private consultantServ = inject(ConsultantService);
  private snackBarServ = inject(SnackBarService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private fileService = inject(FileManagementService);
  @ViewChild('multifiles')
  multifiles: any = ElementRef;
  sum = 0;
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  subFlag: any;


  

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
  ngOnInit(): void {
      this.hasAcces = localStorage.getItem('role');
      this.id = this.activatedRoute.snapshot.params['id'];
      this.flag = this.activatedRoute.snapshot.params['flg'];
      this.subFlag = this.activatedRoute.snapshot.params['subFlag'];
      // alert(this.flag);
      this.consultantServ.consultantInfoByconId(this.id).subscribe((response: any) => {
        this.entity = response.data;
        this.dataSource.data = response.data;
      });
    }
  
    backtolist() {
      if (this.flag == 'sales' && this.subFlag=='consultant')
        this.router.navigate(['usit/sales-consultants']);

      else if (this.flag == 'presales')
        this.router.navigate(['usit/pre-sales']);

      else if (this.flag == 'DomRecruiting'  && this.subFlag=='consultant')
        this.router.navigate(['usit/dom-consultants']);

      else if (this.flag == 'Recruiting'  && this.subFlag=='consultant')
        this.router.navigate(['usit/rec-consultants']);

      else  if (this.flag == 'Sales' && this.subFlag=='submission')
        this.router.navigate(['usit/sales-submissions']);

        else if (this.flag == 'Domrecruiting'  && this.subFlag=='submission')
        this.router.navigate(['usit/dom-submission']);

      else if (this.flag == 'Recruiting'  && this.subFlag=='submission')
        this.router.navigate(['usit/rec-submissions']);


        else  if (this.flag == 'Sales' && this.subFlag=='interview')
        this.router.navigate(['usit/sales-interviews']);

        else if (this.flag == 'Domrecruiting'  && this.subFlag=='interview')
        this.router.navigate(['usit/dom-interviews']);

      else if (this.flag == 'Recruiting'  && this.subFlag=='interview')
        this.router.navigate(['usit/rec-interviews']);

        else if (this.flag == 'dashboard'  && this.subFlag=='consultant')
        this.router.navigate(['usit/dashboard']);
      
      else this.router.navigate(['usit/dashboard']);
    }
}
