import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import { MatSelectModule } from '@angular/material/select';
import { H1bImmigrantService } from 'src/app/usit/services/h1b-immigrant.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { Subject, takeUntil } from 'rxjs';
import { FileManagementService } from 'src/app/usit/services/file-management.service';
import { H1bImmigrantInfo } from 'src/app/usit/models/h1b-immigrant';
import { saveAs } from 'file-saver';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-add-h1b-immigrant',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NgxGpAutocompleteModule,
    MatSelectModule,
    MatInputModule
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
  templateUrl: './add-h1b-immigrant.component.html',
  styleUrls: ['./add-h1b-immigrant.component.scss']
})
export class AddH1bImmigrantComponent implements OnInit {

  h1bForm: any = FormGroup;
  private formBuilder = inject(FormBuilder);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddH1bImmigrantComponent>);
  private h1bServ = inject(H1bImmigrantService);
  private datePipe = inject(DatePipe);
  private snackBarServ = inject(SnackBarService);
  private fileService = inject(FileManagementService);
  private dialogServ = inject(DialogService);
  visadata: any = [];
  companydata: any = [];
  uploadedfiles: string[] = []
  uploadedFileNames: string[] = [];
  options = {
    componentRestrictions: { country: ['IN', 'US'] },
  };
  selectOptionObj = {
    noticeType: NOTICE_TYPE,
  };
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  entity: any;
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  submitted = false;

  ngOnInit(): void {
    this.getVisas();
    this.getCompanies();
    if(this.data.actionName === "edit-h1b"){
      this.initializeH1bForm(new H1bImmigrantInfo());
      this.h1bServ.getH1bById(this.data.h1bData.applicantid).subscribe(
        (response: any) => {
          this.entity = response.data;
          this.initializeH1bForm(response.data);
        }
      );
    } else {
      this.initializeH1bForm(new H1bImmigrantInfo());
    }
  }

  private initializeH1bForm(h1bData: any) {
    this.h1bForm = this.formBuilder.group({
      employeename: [h1bData ? h1bData.employeename : '', Validators.required],
      email: [h1bData ? h1bData.email : '', Validators.required],
      contactnumber: [h1bData ? h1bData.contactnumber : '', Validators.required],
      visa: [h1bData ? h1bData.visa : '', Validators.required],
      noticetype: [h1bData ? h1bData.noticetype : '', Validators.required],
      location: [h1bData ? h1bData.location : '', Validators.required],
      petitioner: [h1bData ? h1bData.petitioner : '', Validators.required],
      receiptnumber: [h1bData ? h1bData.receiptnumber : '', Validators.required],
      servicecenter: [h1bData ? h1bData.servicecenter : ''],
      consulatepoe: [h1bData ? h1bData.consulatepoe :''],
      lcanumber:[h1bData ? h1bData.lcanumber : ''],
      company: [h1bData ? h1bData.company :'', Validators.required],
      h1validfrom: [h1bData ? h1bData.h1validfrom :'', Validators.required],
      h1validto: [h1bData ? h1bData.h1validto :'', Validators.required],
      everifydate: [h1bData ? h1bData.everifydate :'', Validators.required],
      lasti9date: [h1bData ? h1bData.lasti9date :'', Validators.required],
      user: localStorage.getItem('userid'),
    });
  }

  getVisas() {
    this.h1bServ.getVisas().subscribe(
      (response: any) => {
        this.visadata = response.data;
      }
    )
  }
  
  getCompanies() {
    this.h1bServ.getCompanies().subscribe(
      (response: any) => {
        this.companydata = response;
      }
    )
  }

  handleAddressChange(address: any) {
    this.h1bForm.controls['location'].setValue(address.formatted_address);
  }

   // DOCS UPLOAD
   flg = true;
   passportError: boolean = false;
   everifyError: boolean = false;
   i9Error: boolean = false;
   i797Error: boolean = false;
   i94Error: boolean = false;
   ssnError: boolean = false;
   passportFileNameLength: boolean = false;
   everifyFileNameLength: boolean = false;
   i9FileNameLength: boolean = false;
   i797FileNameLength: boolean = false;
   i94FileNameLength: boolean = false;
   ssnFileNameLength: boolean = false;
 
 
   @ViewChild('passportdoc')
   passportdoc: any = ElementRef;
   passportdocupload!: any;
   uploadPassport(event: any) {
     this.passportdocupload = event.target.files[0];
     const file = event.target.files[0];
     const fileSizeInKB = Math.round(file.size / 1024);
     var items = file.name.split(".");
     const str = items[0];
     this.passportError = false;
     this.passportFileNameLength = false;
     if (str.length > 20) {
       this.passportFileNameLength = true;
     }
     if (fileSizeInKB > 2048) {
       this.flg = false;
       this.passportError = true;
     }
     else {
       this.passportError = false;
       this.flg = true;
     }
   }
 
   @ViewChild('everifydoc') 
   everifydoc: any = ElementRef;
   everifydocUpload!: any;
   uploadEverify(event: any) {
     this.everifydocUpload = event.target.files[0];
     const file = event.target.files[0];
     const fileSizeInKB = Math.round(file.size / 1024);
     var items = file.name.split(".");
     const str = items[0];
     this.everifyError = false;
     this.everifyFileNameLength = false;
     if (str.length > 20) {
       this.everifyFileNameLength = true;
     }
     if (fileSizeInKB > 2048) {
       this.flg = false;
       this.everifyError = true;
       return;
     }
     else {
       this.everifyError = false;
       this.flg = true;
     }
   }
 
   @ViewChild('i9doc')
   i9doc: any = ElementRef;
   i9docUpload!: any;
   uploadI9(event: any) {
     this.i9docUpload = event.target.files[0];
     const file = event.target.files[0];
     const fileSizeInKB = Math.round(file.size / 1024);
     var items = file.name.split(".");
     const str = items[0];
     this.i9Error = false;
     this.i9FileNameLength = false;
     if (str.length > 20) {
       this.i9FileNameLength = true;
     }
 
     if (fileSizeInKB > 2048) {
       this.flg = false;
       this.i9Error = true;
       return;
     }
     else {
       this.i9Error = false;
     }
   }
 
   @ViewChild('I797doc')
   I797doc: any = ElementRef;
   I797docUpload!: any;
   uploadI797(event: any) {
     this.I797docUpload = event.target.files[0];
     const file = event.target.files[0];
     const fileSizeInKB = Math.round(file.size / 1024);
     var items = file.name.split(".");
     const str = items[0];
     this.i797Error = false;
     this.i797FileNameLength = false;
     if (str.length > 20) {
       this.i797FileNameLength = true;
     }
 
     if (fileSizeInKB > 2048) {
       this.flg = false;
       this.i797Error = true;
       return;
     }
     else {
       this.i797Error = false;
       this.flg = true;
     }
   }
 
   @ViewChild('i94doc')
   i94doc: any = ElementRef;
   i94docUpload!: any;
   uploadI94(event: any) {
     this.i94docUpload = event.target.files[0];
     const file = event.target.files[0];
     const fileSizeInKB = Math.round(file.size / 1024);
     var items = file.name.split(".");
     const str = items[0];
     this.i94Error = false;
     this.i94FileNameLength = false;
     if (str.length > 20) {
       this.i94FileNameLength = true;
     }
 
     if (fileSizeInKB > 2048) {
       this.flg = false;
       this.i94Error = true;
       return;
     }
     else {
       this.i94Error = false;
       this.flg = true;
     }
   }

   @ViewChild('ssndoc')
   ssndoc: any = ElementRef;
   ssndocUpload!: any;
   uploadSsn(event: any) {
     this.ssndocUpload = event.target.files[0];
     const file = event.target.files[0];
     const fileSizeInKB = Math.round(file.size / 1024);
     var items = file.name.split(".");
     const str = items[0];
     this.ssnError = false;
     this.ssnFileNameLength = false;
     if (str.length > 20) {
       this.ssnFileNameLength = true;
     }
 
     if (fileSizeInKB > 2048) {
       this.flg = false;
       this.ssnError = true;
       return;
     }
     else {
       this.ssnError = false;
       this.flg = true;
     }
   }

  onSubmit() {
    this.submitted = true;
    if (this.h1bForm.invalid) {
      this.h1bForm.markAllAsTouched();
      return;
    }
    const ValidityFormFormControl = this.h1bForm.get('h1validfrom');
    const ValidityToFormControl = this.h1bForm.get('h1validto');
    const EverifyFormControl = this.h1bForm.get('everifydate')
    const LastI9FormControl = this.h1bForm.get('lasti9date')
    const formattedValidityForm = this.datePipe.transform(ValidityFormFormControl.value, 'yyyy-MM-dd');
    const formattedValidityTo = this.datePipe.transform(ValidityToFormControl.value, 'yyyy-MM-dd');
    const formattedEverify = this.datePipe.transform(EverifyFormControl.value, 'yyyy-MM-dd');
    const formattedLastI9 = this.datePipe.transform(LastI9FormControl.value, 'yyyy-MM-dd');
    ValidityFormFormControl.setValue(formattedValidityForm);
    ValidityToFormControl.setValue(formattedValidityTo);
    EverifyFormControl.setValue(formattedEverify);
    LastI9FormControl.setValue(formattedLastI9);
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    const saveReqObj = this.getSaveData();
    // this.submit(1);
    this.h1bServ
      .addORUpdateH1bImmigrant(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-h1b'
                ? 'H1B Immigrant added successfully'
                : 'H1B Immigrant updated successfully';
              this.submit(resp.data.applicantid);
            this.dialogRef.close();
          } else {
            dataToBeSentToSnackBar.message = resp.message ? resp.message : 'H1B Immigrant already Exists';
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-h1b'
              ? 'H1B Immigrant addition is failed'
              : 'H1B Immigrant updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  getSaveData() {
    if(this.data.actionName === 'edit-h1b'){
      return {...this.entity, ...this.h1bForm.value}
    }
    return this.h1bForm.value;
  }

  submit(id: number) {
    const formData = new FormData();
    for (var i = 0; i < this.uploadedfiles.length; i++) {
      formData.append('files', this.uploadedfiles[i]);
    }

    if (this.passportdocupload != null) {
      formData.append('passportdoc', this.passportdocupload, this.passportdocupload.name);
    }
    if (this.everifydocUpload != null) {
      formData.append('everifydoc', this.everifydocUpload, this.everifydocUpload.name);
    }
    if (this.i9docUpload != null) {
      formData.append('i9doc', this.i9docUpload, this.i9docUpload.name);
    }

    if (this.I797docUpload != null) {
      formData.append('I797doc', this.I797docUpload, this.I797docUpload.name);
    }

    if (this.i94docUpload != null) {
      formData.append('i94doc', this.i94docUpload, this.i94docUpload.name);
    }

    if (this.ssndocUpload != null) {
      formData.append('ssndoc', this.ssndocUpload, this.ssndocUpload.name);
    }
    this.fileService.h1bUploadFile(formData, id)
      .subscribe((response: any) => {
        if (response.status === 200) {

        } else {
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.dataToBeSentToSnackBar.message = 'File upload failed';
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
        }
      }
      );
  }

  downloadfile(id: number, filename: string, flg: string) {
    var items = filename.split(".");
     this.fileService
       .downloadH1bFile(id, flg)
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
        actionName: 'delete-file'
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
        next: (resp: any) => {
          if (dialogRef.componentInstance.allowAction) {
            // call delete api
            this.fileService.h1bRemoveFile(id,doctype).pipe(takeUntil(this.destroyed$)).subscribe({
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

  onCancel() {
    this.dialogRef.close();
  }

}

export const NOTICE_TYPE = ['Approved', 'Pending', 'Pre-process'] as const;
