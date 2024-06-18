import { Component, Inject, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { MatCardModule } from '@angular/material/card';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PurchaseOrderService } from 'src/app/usit/services/purchase-order.service';
import { Subject, takeUntil } from 'rxjs';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { FileManagementService } from 'src/app/usit/services/file-management.service';
@Component({
  selector: 'app-add-purchase-order',
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
    MatCardModule,
    NgxMatIntlTelInputComponent,
    NgxGpAutocompleteModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  providers: [DatePipe],
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.scss']
})
export class AddPurchaseOrderComponent {
  purchaseOrderForm: any = FormGroup;
  private formBuilder = inject(FormBuilder);
  poTypeSelected!: string;
  companySelected!: string;
  vendorSelected: any;
  consultantSelected!: any;
  recruitingFlag: boolean = false;
  private purchaseOrderServ = inject(PurchaseOrderService);
  vendordata: any = [];
  consultantdata: any = [];
  consultantInfo: any;
  company: any = [];

  private destroyed$ = new Subject<void>();
  entity: any;
  protected isFormSubmitted: boolean = false;
  private snackBarServ = inject(SnackBarService);
  private fileService = inject(FileManagementService);
  constructor(private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddPurchaseOrderComponent>
  ) { }

  ngOnInit(): void {
    this.getCompanies();
   // this.initializePurchaseOrderForm(null);

    if (this.data.actionName === "edit-purchase-order") {
      this.initializePurchaseOrderForm(this.data.purchaseOrderData);
      this.companySelected = this.data.purchaseOrderData.company
      if (this.data.purchaseOrderData.potype == "InWard") {
        this.poTypeSelected = "Sales"
      } else {
        this.poTypeSelected = "Recruiting"
      }
      this.purchaseOrderServ.getVendors(this.companySelected, this.poTypeSelected).subscribe(
        (response: any) => {
          this.vendordata = response.data
        }
      )

      this.purchaseOrderServ.getSelectedOfVendor(this.data.purchaseOrderData.vendor).subscribe(
        (response: any) => {
          this.consultantdata = response.data
        }
      )

    } else {
      this.initializePurchaseOrderForm(null);
    }
  }

  getCompanies() {
    this.purchaseOrderServ.getCompanies().subscribe((response: any) => {
      this.company = response.data;
    });
  }

  private initializePurchaseOrderForm(purchaseOrderData: any) {
    this.purchaseOrderForm = this.formBuilder.group({
      poid: [purchaseOrderData ? purchaseOrderData.poid : ''],
      vendor: [purchaseOrderData ? purchaseOrderData.vendor : '', [Validators.required]],
      company: [purchaseOrderData ? purchaseOrderData.company : '', [Validators.required]],
      potype: [purchaseOrderData ? purchaseOrderData.potype : '', [Validators.required]],
      consultant: [purchaseOrderData ? purchaseOrderData.consultant : '', [Validators.required]],
      endclient: [purchaseOrderData ? purchaseOrderData.endclient : '', [Validators.required]],
      implpartner: [purchaseOrderData ? purchaseOrderData.implpartner : ''],

      projstartdate: [purchaseOrderData ? purchaseOrderData.projstartdate : '', [Validators.required]],
      projenddate: [purchaseOrderData ? purchaseOrderData.projenddate : ''],
      duration: [purchaseOrderData ? purchaseOrderData.duration : '', [Validators.required]],
      billingcycle: [purchaseOrderData ? purchaseOrderData.billingcycle : '', [Validators.required]],
      netterm: [purchaseOrderData ? purchaseOrderData.netterm : '', [Validators.required]],
      recname: [purchaseOrderData ? purchaseOrderData.recname : ''],
      recemail: [purchaseOrderData ? purchaseOrderData.recemail : ''],
      recnumber: [purchaseOrderData ? purchaseOrderData.recnumber : ''],
      ///addedby: [this.data.actionName === "edit-interview" ? interviewData?.users : localStorage.getItem('userid')],
      updatedby: [this.data.actionName === "edit-purchase-order" ? localStorage.getItem('userid') : '0'],
      addedby: [purchaseOrderData ? purchaseOrderData.addedby : localStorage.getItem('userid')],
      acrname: [purchaseOrderData ? purchaseOrderData.acrname : '', [Validators.required]],
      acrmail: [purchaseOrderData ? purchaseOrderData.acrmail : '', [Validators.required]],
      acrno: [purchaseOrderData ? purchaseOrderData.acrno : '', [Validators.required]],
      percentage: [purchaseOrderData ? purchaseOrderData.percentage : '', [Validators.required]],
      payratetoconsultant: [purchaseOrderData ? purchaseOrderData.payratetoconsultant : '', [Validators.required]],
      acpname: [purchaseOrderData ? purchaseOrderData.acpname : ''],
      acpmail: [purchaseOrderData ? purchaseOrderData.acpmail : ''],
      acpno: [purchaseOrderData ? purchaseOrderData.acpno : ''],


      hourlyrate: [purchaseOrderData ? purchaseOrderData.hourlyrate : '', [Validators.required]],

      // hourlyrate: this.flg === 'OutWard' ?
      // this.formBuilder.control(purchaseOrderData && purchaseOrderData.billratevendor ? purchaseOrderData.billratevendor : '') :
      // null,

    });

    this.purchaseOrderForm.get('potype').valueChanges.subscribe((res: any) => {

      const acpname = this.purchaseOrderForm.get('acpname');
      const acpmail = this.purchaseOrderForm.get('acpmail');
      const acpno = this.purchaseOrderForm.get('acpno');

      if (res == "OutWard") {
        acpname.setValidators(Validators.required);
        acpmail.setValidators(Validators.required);
        acpno.setValidators(Validators.required);
      }
      else {
        acpname.clearValidators();
        acpmail.clearValidators();
        acpno.clearValidators();
      }
      acpname.updateValueAndValidity();
      acpmail.updateValueAndValidity();
      acpno.updateValueAndValidity();
    })
  }
  flg !: any;
  onPoTypeSelect(event: MatSelectChange) {
    if (event.value == "OutWard") {
      this.flg = "OutWard"
      this.poTypeSelected = 'Recruiting';
      this.recruitingFlag = true;
    } else {
      this.poTypeSelected = 'Sales';
      this.recruitingFlag = false;
    }
    this.resetFormFields();
    this.getVendorcompanies();
  }

  hourlyRate!: any;
  percentage!: number;
  consultantPercentage!: number;
  consultantAmount!: number;
  vendorAMount!: number;
  calculateMargin(event: MatSelectChange) {
    this.hourlyRate = parseFloat(this.purchaseOrderForm.get('hourlyrate').value);// this.purchaseOrderForm.get('hourlyrate');
    this.percentage = event.value;
    this.consultantPercentage = 100 - this.percentage;
    this.consultantAmount = this.hourlyRate * this.consultantPercentage / 100;
    this.vendorAMount = this.hourlyRate * this.percentage / 100;
    this.purchaseOrderForm.get('payratetoconsultant').setValue(this.consultantAmount)
  }

  onCompanySelect(event: MatSelectChange) {
    if (event.value !== "") {
      this.companySelected = event.value;
    }
    this.resetFormFields();
    this.getVendorcompanies();
  }

  private resetFormFields() {
    this.purchaseOrderForm.patchValue({
      vendor: '',
      consultant: '',
      endclient: '',
      implpartner: '',
      hourlyrate: '',
      projstartdate: '',
      projenddate: '',
      duration: '',
      billingcycle: '',
      netterm: '',
      recname: '',
      recemail: '',
      recnumber: '',
      acrname: '',
      acrmail: '',
      acrno: '',
      acpname: '',
      acpmail: '',
      acpno: '',
      percentage: '',
      payratetoconsultant: '',
    });
  }

  getVendorcompanies() {
    if (this.poTypeSelected && this.companySelected) {
      this.purchaseOrderServ.getVendors(this.companySelected, this.poTypeSelected).subscribe(
        (response: any) => {
          this.vendordata = response.data
        }
      )
    }
  }

  onVendorSelect(event: MatSelectChange) {
    if (event.value !== "") {
      this.vendorSelected = event.value;
    }
    this.resetVendorFormFields();
    this.purchaseOrderServ.getSelectedOfVendor(this.vendorSelected).subscribe(
      (response: any) => {
        this.consultantdata = response.data
      }
    )
  }

  private resetVendorFormFields() {
    this.purchaseOrderForm.patchValue({
      consultant: '',
      endclient: '',
      implpartner: '',
      hourlyrate: '',
      projstartdate: '',
      projenddate: '',
      duration: '',
      billingcycle: '',
      netterm: '',
      recname: '',
      recemail: '',
      recnumber: '',
      acrname: '',
      acrmail: '',
      acrno: '',
      acpname: '',
      acpmail: '',
      acpno: '',
      percentage: '',
      payratetoconsultant: '',
    });
  }

  onConsultantSelect(event: MatSelectChange) {
    if (event.value !== "") {
      this.consultantSelected = event.value;
    }
    this.purchaseOrderServ.getSelectedConsultantInfo(this.consultantSelected, this.vendorSelected).subscribe(
      (response: any) => {
        this.consultantInfo = response.data
        const paymentCycleValue = parseInt(response.data.paymentcycle, 10);
        this.purchaseOrderForm.get("endclient").setValue(response.data.endclient);
        this.purchaseOrderForm.get("implpartner").setValue(response.data.implpartner);
        this.purchaseOrderForm.get("hourlyrate").setValue(response.data.billratevendor);
        this.purchaseOrderForm.get("projstartdate").setValue(response.data.projectstartdate);
        this.purchaseOrderForm.get("projenddate").setValue(response.data.projectendtdate);
        this.purchaseOrderForm.get("duration").setValue(response.data.projectduration);
        this.purchaseOrderForm.get("billingcycle").setValue(response.data.billingcycle);
        this.purchaseOrderForm.get("netterm").setValue(paymentCycleValue);
        this.purchaseOrderForm.get("recname").setValue(response.data.recruiter);
        this.purchaseOrderForm.get("recemail").setValue(response.data.empmail);
        this.purchaseOrderForm.get("recnumber").setValue(response.data.empcontact);
      }
    )
  }

  // flg = true;
  msaError: boolean = false;
  msaFileNameLength: boolean = false;
  poError: boolean = false;
  poFileNameLength: boolean = false;

  @ViewChild('msa')
  msa: any = ElementRef;
  msaupload!: any;
  uploadMsa(event: any) {
    this.msaupload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    var items = file.name.split(".");
    const str = items[0];
    if (str.length > 20) {
      this.msaFileNameLength = true;
    }
    if (fileSizeInKB > 2048) {
      this.flg = false;
      this.msaError = true;
    }
    else {
      this.msaError = false;
      this.flg = true;
    }
  }


  @ViewChild('po') po: any = ElementRef;
  poUpload!: any;
  uploadPo(event: any) {
    this.poUpload = event.target.files[0];
    const file = event.target.files[0];
    const fileSizeInKB = Math.round(file.size / 1024);
    var items = file.name.split(".");
    const str = items[0];
    if (str.length > 20) {
      this.poFileNameLength = true;
    }
    if (fileSizeInKB > 2048) {
      this.flg = false;
      this.poError = true;
      return;
    }
    else {
      this.poError = false;
      this.flg = true;
    }
  }
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  getSaveData() {
    if (this.data.actionName === 'edit-purchase-order') {
      return { ...this.entity, ...this.purchaseOrderForm.value }
    }
    return this.purchaseOrderForm.value;
  }
  submitted = false;
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

    if (this.purchaseOrderForm.invalid) {
      this.purchaseOrderForm.markAllAsTouched();
      return;
    }

    const projstartdateDateFormControl = this.purchaseOrderForm.get('projstartdate');
    const projenddateDateFormControl = this.purchaseOrderForm.get('projenddate');
    if (projstartdateDateFormControl?.value) {
      const formattedstartDate = this.datePipe.transform(projstartdateDateFormControl.value, 'yyyy-MM-dd');
      const formattedendDate = this.datePipe.transform(projenddateDateFormControl?.value, 'yyyy-MM-dd');
      projstartdateDateFormControl.setValue(formattedstartDate);
      projenddateDateFormControl?.setValue(formattedendDate);
    }

    const saveReqObj = this.getSaveData();
    this.purchaseOrderServ
      .savePO(saveReqObj)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-po'
                ? 'PO added successfully'
                : 'PO updated successfully';
            this.onFileSubmit(resp.data.poid);
            this.dialogRef.close();
          } else {
            this.isFormSubmitted = false;
            dataToBeSentToSnackBar.message = resp.message ? resp.message : 'Transaction Failed';
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          this.isFormSubmitted = false;
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-po'
              ? 'PO addition is failed'
              : 'PO updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });


  }

  onFileSubmit(id: number) {
    const formData = new FormData();

    if (this.msaupload != null) {
      formData.append('msa', this.msaupload, this.msaupload.name);
      // formData.append("files",this.resumeupload,this.resumeupload.name);
    }

    if (this.poUpload != null) {
      formData.append('po', this.poUpload, this.poUpload.name);
      // formData.append("files",this.resumeupload,this.resumeupload.name);
    }

    if (this.poUpload != null || this.msaupload != null) {
    //upload
    this.fileService
      .poFilesUpload(formData, id)
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
  }

  onCancel() {
    this.dialogRef.close();
  }
  selectOptionObj = {
    margin: MARGIN,
    netterm: NETTERM,
  };


}

export const MARGIN = [
  '20',
  '30',
]

export const NETTERM = [
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
  'Net 90',
]
