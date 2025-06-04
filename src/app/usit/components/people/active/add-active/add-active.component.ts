import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
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
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxMatInputTelComponent } from 'ngx-mat-input-tel';

@Component({
  selector: 'app-add-active',
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
    MatInputModule,
    NgxMatInputTelComponent
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
  templateUrl: './add-active.component.html',
  styleUrls: ['./add-active.component.scss']
})
export class AddActiveComponent implements OnInit {

  h1bForm: any = FormGroup;
  private formBuilder = inject(FormBuilder);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddActiveComponent>);
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
  showPermField: boolean = false;
  showI140Field: boolean = false;
  filesArr!: any;
  userid!: string | null;

  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.getVisas();
    this.getCompanies();
    if(this.data.actionName === "edit-active"){
      this.initializeH1bForm(new H1bImmigrantInfo());
      this.h1bServ.getH1bById(this.data.activeData.applicantid).subscribe(
        (response: any) => {
          this.entity = response.data;
          this.filesArr = response.data.i797doc;
          this.initializeH1bForm(response.data);
        }
      );
    } else {
      this.initializeH1bForm(null);
    }
  }

  private initializeH1bForm(h1bData: any) {
    const dateRangeValidator: ValidatorFn = (control: AbstractControl): {[key: string]: any} | null => {
      const validFrom = control.get('h1validfrom')?.value;
      const validTo = control.get('h1validto')?.value;
      if (validFrom && validTo && new Date(validFrom) >= new Date(validTo)) {
        return { 'invalidDateRange': true };
      }
      return null;
    };

    this.h1bForm = this.formBuilder.group({
      employeename: [h1bData ? h1bData.employeename : '', Validators.required],
      email: [h1bData ? h1bData.email : '', [Validators.required, Validators.email]],
      contactnumber: [h1bData ? h1bData.contactnumber : '', Validators.required],
      visa: [h1bData ? h1bData.visa : '', Validators.required],
      // noticetype: [h1bData ? h1bData.noticetype : '', Validators.required],
      location: [h1bData ? h1bData.location : '', Validators.required],
      petitioner: [h1bData ? h1bData.petitioner : '', Validators.required],
      receiptnumber: [h1bData ? h1bData.receiptnumber : '', [Validators.required, Validators.pattern(/^[A-Z]{3}\d{10}$/)]],
      servicecenter: [h1bData ? h1bData.servicecenter : ''],
      consulatepoe: [h1bData ? h1bData.consulatepoe :''],
      lcanumber:[h1bData ? h1bData.lcanumber : ''],
      company: [h1bData ? h1bData.company :'', Validators.required],
      h1validfrom: [h1bData ? h1bData.h1validfrom :'', Validators.required],
      h1validto: [h1bData ? h1bData.h1validto :'', [Validators.required, this.toDateValidator]],
      everifydate: [h1bData ? h1bData.everifydate :'', Validators.required],
      lasti9date: [h1bData ? h1bData.lasti9date :'', Validators.required],
      gcstatus: [h1bData ? h1bData.gcstatus :'', Validators.required],
      stateofworking: [h1bData ? h1bData.stateofworking :'', Validators.required],
      doj: [h1bData ? h1bData.doj : '', Validators.required],
      paytype: [h1bData ? h1bData.paytype : '', Validators.required],
      status: [this.data.actionName === "edit-active" ? h1bData.status : 'Active'],
      reason: [this.data.actionName === "edit-active" ? h1bData.reason : ''],
      employeementype: [h1bData ? h1bData.employeementype : '', Validators.required],
      permReferenceNumber: [h1bData ? h1bData.permReferenceNumber : ''],
      i140ReceiptNumber: [h1bData ? h1bData.i140ReceiptNumber : ''],
      terminationandloadate: [ h1bData ? h1bData.terminationandloadate : ''],
      physicaladdress: [h1bData ? h1bData.physicaladdress : '', Validators.required],
      addedby: [h1bData && h1bData.addedby ? h1bData.addedby : this.userid],
      updatedby: [this.data.actionName === "edit-active" ? this.userid : null]
    });

    this.h1bForm.get('status').valueChanges.subscribe((status: string) => {
      if (status === 'Leave of Absence' || status === 'Terminated') {
        this.h1bForm.get('reason').setValidators(Validators.required);
        this.h1bForm.get('terminationandloadate').setValidators(Validators.required);
      } else {
        this.h1bForm.get('reason').clearValidators();
        this.h1bForm.get('terminationandloadate').clearValidators();
      }
      this.h1bForm.get('reason').updateValueAndValidity();
      this.h1bForm.get('terminationandloadate').updateValueAndValidity();
    });

  }

  toDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const joiningDate = control.root.get('h1validfrom')?.value;
    const relievingDate = control.value;

    if (joiningDate && relievingDate && new Date(relievingDate) < new Date(joiningDate)) {
      return { 'toBeforeFrom': true };
    }

    return null;
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

  handleWorkAddressChange(address: any) {
    this.h1bForm.controls['stateofworking'].setValue(address.formatted_address);
  }

  handlePermanentAddressChange(address: any) {
    this.h1bForm.controls['physicaladdress'].setValue(address.formatted_address);
  }

   // DOCS UPLOAD
   flg = true;
   passportError: boolean = false;
   everifyError: boolean = false;
   i9Error: boolean = false;
   i94Error: boolean = false;
   ssnError: boolean = false;
   w2Error: boolean = false;
   lcaCopyError: boolean = false;
   passportFileNameLength: boolean = false;
   everifyFileNameLength: boolean = false;
   i9FileNameLength: boolean = false;
   lcaCopyFileNameLength: boolean = false;
   i94FileNameLength: boolean = false;
   ssnFileNameLength: boolean = false;
   w2FileNameLength: boolean = false;
 
 
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

   @ViewChild('w2Doc')
   w2doc: any = ElementRef;
   w2docUpload!: any;
   uploadW2(event: any) {
    this.w2docUpload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    var items = file.name.split(".");
    const str = items[0];
    this.w2Error = false;
    this.w2FileNameLength = false;
    if (str.length > 20) {
      this.w2FileNameLength = true;
    }

    if (fileSizeInKB > 2048) {
      this.flg = false;
      this.w2Error = true;
      return;
    } else {
      this.w2Error = false;
    }
  }
 
   @ViewChild('lcaCopy')
   lcaCopydoc: any = ElementRef;
   lcaCopydocUpload!: any;
   uploadLcaCopy(event: any) {
     this.lcaCopydocUpload = event.target.files[0];
     const file = event.target.files[0];
     const fileSizeInKB = Math.round(file.size / 1024);
     var items = file.name.split(".");
     const str = items[0];
     this.lcaCopyError = false;
     this.lcaCopyFileNameLength = false;
     if (str.length > 20) {
       this.lcaCopyFileNameLength = true;
     }
 
     if (fileSizeInKB > 2048) {
       this.flg = false;
       this.lcaCopyError = true;
       return;
     }
     else {
       this.lcaCopyError = false;
       this.flg = true;
     }
   }

  @ViewChild('i797doc')
  I797doc!: ElementRef;
  I797UploadedFiles: File[] = [];
  I797UploadedFileNames: string[] = [];
  i797Error: boolean = false;
  i797FileNameLength: boolean = false;

  uploadI797(event: any) {
    this.I797UploadedFileNames = [];
    this.i797Error = false;
    this.i797FileNameLength = false;

    for (var i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const fileSizeInKB = Math.round(file.size / 1024);
      var items = file.name.split(".");
      const str = items[0];

      if (str.length > 20) {
        this.i797FileNameLength = true;
        continue;
      }

      if (fileSizeInKB > 2048) {
        this.i797Error = true;
        continue;
      }

      this.I797UploadedFiles.push(file);
      this.I797UploadedFileNames.push(file.name);
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
      Object.keys(this.h1bForm.controls).forEach(key => {
        const control = this.h1bForm.get(key);
        if (control && control.invalid) {
        }
      });
  
      return;
    }
    const ValidityFormFormControl = this.h1bForm.get('h1validfrom');
    const ValidityToFormControl = this.h1bForm.get('h1validto');
    const EverifyFormControl = this.h1bForm.get('everifydate')
    const LastI9FormControl = this.h1bForm.get('lasti9date')
    const dojFormControl = this.h1bForm.get('doj')
    const formattedValidityForm = this.datePipe.transform(ValidityFormFormControl.value, 'yyyy-MM-dd');
    const formattedValidityTo = this.datePipe.transform(ValidityToFormControl.value, 'yyyy-MM-dd');
    const formattedEverify = this.datePipe.transform(EverifyFormControl.value, 'yyyy-MM-dd');
    const formattedLastI9 = this.datePipe.transform(LastI9FormControl.value, 'yyyy-MM-dd');
    const formattedDOJ = this.datePipe.transform(dojFormControl.value, 'yyyy-MM-dd');
    ValidityFormFormControl.setValue(formattedValidityForm);
    ValidityToFormControl.setValue(formattedValidityTo);
    EverifyFormControl.setValue(formattedEverify);
    LastI9FormControl.setValue(formattedLastI9);
    dojFormControl.setValue(formattedDOJ);
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    const saveReqObj = this.getSaveData();
    this.h1bServ
      .addORUpdateH1bImmigrant(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-active'
                ? 'Active Immigrant added successfully'
                : 'Active Immigrant updated successfully';
              this.submit(resp.data.applicantid);
            this.dialogRef.close();
          } else {
            dataToBeSentToSnackBar.message = resp.message ? resp.message : 'Active Immigrant already Exists';
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-active'
              ? 'Active Immigrant addition is failed'
              : 'Active Immigrant updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  getSaveData() {
    if(this.data.actionName === 'edit-active'){
      return {...this.entity, ...this.h1bForm.value}
    }
    return this.h1bForm.value;
  }

  submit(id: number) {
    const formData = new FormData();
    for (var i = 0; i < this.I797UploadedFiles.length; i++) {
      formData.append("i797doc", this.I797UploadedFiles[i]);
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

    if (this.lcaCopydocUpload != null) {
      formData.append('lcaCopy', this.lcaCopydocUpload, this.lcaCopydocUpload.name);
    }

    if (this.i94docUpload != null) {
      formData.append('i94doc', this.i94docUpload, this.i94docUpload.name);
    }

    if (this.ssndocUpload != null) {
      formData.append('ssndoc', this.ssndocUpload, this.ssndocUpload.name);
    }
    if (this.w2docUpload != null) {
      formData.append('w2Doc', this.w2docUpload, this.w2docUpload.name);
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
         if (items[items.length - 1] == 'pdf' || items[items.length - 1] == 'PDF') {
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

  type:any
  downloadMultiplefiles(fileData: FileData) {
    this.type = fileData.filename;
    var items = this.type.split(".");
    this.fileService
      .downloadMultipleFiles(fileData.docid)
      .subscribe(blob => {
        if (items[items.length - 1] == 'pdf' || items[items.length - 1] == 'PDF') {
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
            this.fileService.h1bRemoveFile(id,doctype).pipe(takeUntil(this.destroyed$)).subscribe({
              next: (response: any) => {
                if (response.status == 'success') {
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


  deleteMultiplefile(id: number) {
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
          this.fileService.h1bRemoveFilesMultiple(id).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response: any) => {
              if (response.status == 'success') {
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

  onlyNumberKey(evt: any) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
      return false;
    return true;
  }

  onlyCapitalAlphanumericKey(evt: any) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode;
    if (!((ASCIICode >= 48 && ASCIICode <= 57) || (ASCIICode >= 65 && ASCIICode <= 90))) {
      return false;
    }
    return true;
  }

  onGCStatusChange() {
    const gcStatus = this.h1bForm.get('gcstatus')?.value;
    this.showPermField = gcStatus === 'PERM';
    this.showI140Field = gcStatus === 'I140';

    // Update validators for additional fields
    if (this.showPermField) {
      this.h1bForm.get('permReferenceNumber')?.setValidators([Validators.required]);
    } else {
      this.h1bForm.get('permReferenceNumber')?.clearValidators();
    }

    if (this.showI140Field) {
      this.h1bForm.get('i140ReceiptNumber')?.setValidators([Validators.required, Validators.pattern(/^[A-Z]{3}\d{10}$/)]);
    } else {
      this.h1bForm.get('i140ReceiptNumber')?.clearValidators();
    }

    // Trigger validation update
    this.h1bForm.get('permReferenceNumber')?.updateValueAndValidity();
    this.h1bForm.get('i140ReceiptNumber')?.updateValueAndValidity();
  }

}


export class FileData {
  docid!: number;
  applicantid!: number;
  filename?: string;
  contentType?: string;
  size?: number;
  eid!: number;
}
export const NOTICE_TYPE = ['LCA-Requested', 'Filling with USCIS', 'Notice Received', 'RFE/Approved', 'Approved'] as const;