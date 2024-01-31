import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { Recruiter } from 'src/app/usit/models/recruiter';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { Subject, takeUntil } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewService } from 'src/app/usit/services/interview.service';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { Consultantinfo } from 'src/app/usit/models/consultantinfo';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-consultant-info',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './consultant-info.component.html',
  styleUrls: ['./consultant-info.component.scss']
})
export class ConsultantInfoComponent implements OnInit{

  private router = inject(Router);
  private consultantServ = inject(ConsultantService);
  private activatedRoute = inject(ActivatedRoute);
  entity = new Consultantinfo();
  flag!: any;
  flag1!: any;
  flg = true;
  message: any;
  id!: any;
    uploadedfiles: any;

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.consultantServ.getConsultantById(this.id).subscribe(
      (response: any) => {
        this.entity = response.data;
        // this.autoskills = response.data.skills;
        // this.files = response.data.fileupload;
      }
    )
  }

  navigateToDashboard() {

  }

  backTo() {
    //alert(this.flag+" = "+this.flag1)
    if (this.flag == 'sales' && this.flag1 == 'list') {
      this.router.navigate(['sales-consultants/sales']);
    }
    else if (this.flag == 'presales') {
      this.router.navigate(['pre-sales/presales']);
    }
    else if (this.flag == 'sales' && this.flag1 == 'sub') {
      this.router.navigate(['sales-submission/sales']);
    }
    else if (this.flag == 'sales' && this.flag1 == 'interview') {
      this.router.navigate(['sales-interview/sales']);
    }
    else if (this.flag == 'Recruiting' && this.flag1 == 'sub') {
      this.router.navigate(['recruiting-submission/recruiting']);
    }
    else if (this.flag == 'Recruiting' && this.flag1 == 'interview') {
      this.router.navigate(['recruiting-interview/recruiting']);
    }
    else if (this.flag == 'h1transfer' && this.flag1 == 'list') {
      this.router.navigate(['h1transfer']);
    }
    else if (this.flag == 'dashboard' && this.flag1 == 'info') {
      this.router.navigate(['dashboard']);
    }
    else {
      this.router.navigate(['recruiting-consultants/recruiting']);
    }
  }

//   downloadfile(id: number, filename: string, flg: string) {
//     var items = filename.split(".");
//     this.consultantServ
//       .downloadresume(id, flg)
//       .subscribe(blob => {
//         if (items[1] == 'pdf' || items[1] == 'PDF') {
//           var fileURL: any = URL.createObjectURL(blob);
//           var a = document.createElement("a");
//           a.href = fileURL;
//           a.target = '_blank';
//           // Don't set download attribute
//           //a.download = filename;
//           a.click();
//         }
//         else {
//           saveAs(blob, filename)
//         }
//       }
//       );
//   }
  @ViewChild('resume')
  resume: any = ElementRef;
  resumeupload!: any;
  uploaddoc(event: any) {
    this.resumeupload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    if (fileSizeInKB > 10300) {
      this.flg = false;
      this.resume.nativeElement.value = "";
      this.message = "Resume size should be less than 2 mb";
      // alertify.error("Resume size should be less than 2 mb");
      return;
    }
    else {
      this.message = "";
      this.flg = true;
    }
  }
  h1bupload!: any;
  @ViewChild('h1b')
  h1b: any = ElementRef;
  uploadH1B(event: any) {
    this.h1bupload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    if (fileSizeInKB > 10300) {
      this.flg = false;
      this.h1b.nativeElement.value = "";
      this.message = "H1B size should be less than 2 mb";
      // alertify.error("H1B size should be less than 2 mb");
      return;
    }
    else {
      this.message = "";
      this.flg = true;
    }
  }
  dlupload!: any;
  @ViewChild('dl')
  dl: any = ElementRef;
  uploadDL(event: any) {
    this.dlupload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    if (fileSizeInKB > 10300) { //2200
      this.flg = false;
      this.dl.nativeElement.value = "";
      this.message = "DL size should be less than 2 mb";
      return;
    }
    else {
      this.message = "";
      this.flg = true;
    }
  }

  @ViewChild('multifiles')
  multifiles: any = ElementRef;
  sum = 0;
  onFileChange(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      //this.uploadedfiles.push(event.target.files[i]);
      const file = event.target.files[i];
      var items = file.name.split(".");
      const str = items[0];
      if (str.length > 20) {
        // alertify.error("File name is toot large, please rename the file before upload, it should be 15 to 20 characters")
      }
      const fileSizeInKB = Math.round(file.size / 1024);
      this.sum = this.sum + fileSizeInKB;
      if (fileSizeInKB < 10300) {
        this.uploadedfiles.push(event.target.files[i]);
      }
      else {
        this.multifiles.nativeElement.value = "";
        this.uploadedfiles = [];
        // alertify.error("Files size should not exceed 4 mb")
      }
    }
  }

//   deletefile(id: number, doctype: string) {
//     const fl = doctype.toUpperCase();
//     // alertify.confirm("Remove File", "Are you sure you want to remove the " + fl + " ? ", () => {
//       this.consultantServ.removingfile(id, doctype).subscribe(
//         (response: any) => {
//           if (response.status === 'success') {

//             this.ngOnInit();
//           }
//           else {

//           }
//         }
//       )
//     }, function () { });

    fieldArray: any = [];
  newAttribute: any = {};

  addFieldValue() {
    this.fieldArray.push(this.newAttribute)
    this.newAttribute = {};
  }

  deleteFieldValue(index: any) {
    this.fieldArray.splice(index, 1);
  }

//   deletemultiple(id: number) {
//     // alertify.confirm("Remove File", "Are you sure you want to remove the file ? ", () => {
//       this.consultantServ.removingfiles(id).subscribe(
//         (response: any) => {
//           if (response.status === 'success') {
//             // alertify.success("file removed successfully");
//             this.ngOnInit();
//           }
//           else {
//             // alertify.error("file not removed");
//           }
//         }
//       )
//     }, function () { });
  }
