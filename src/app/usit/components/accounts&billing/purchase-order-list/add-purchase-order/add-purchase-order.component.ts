import { Component, Inject, OnDestroy, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { Vms } from 'src/app/usit/models/vms';
import { MatCardModule } from '@angular/material/card';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  of,
  Subject,
  takeUntil,
  startWith,
  map,
} from 'rxjs';
import {MatRadioChange, MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SubmissionService } from 'src/app/usit/services/submission.service';
import { SubmissionInfo } from 'src/app/usit/models/submissioninfo';
import { PurchaseOrderService } from 'src/app/usit/services/purchase-order.service';


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

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddPurchaseOrderComponent>
  ) {}

  ngOnInit(): void {
    this.initializePurchaseOrderForm(null);
  }

  private initializePurchaseOrderForm(purchaseOrderData: any) {
    this.purchaseOrderForm = this.formBuilder.group({
      vendor: [purchaseOrderData ? purchaseOrderData.vendor : '', [Validators.required]],
      company: [purchaseOrderData ? purchaseOrderData.company : '', [Validators.required]],
      potype: [purchaseOrderData ? purchaseOrderData.potype : '', [Validators.required]],
      consultant: [purchaseOrderData ? purchaseOrderData.consultant : '', [Validators.required]],
      endclient: [purchaseOrderData ? purchaseOrderData.endclient : '', [Validators.required]],
      implpartner: [purchaseOrderData ? purchaseOrderData.implpartner : ''],
      hourlyrate: [purchaseOrderData ? purchaseOrderData.hourlyrate : '', [Validators.required]],
      projstartdate: [purchaseOrderData ? purchaseOrderData.projstartdate : '', [Validators.required]],
      projenddate: [purchaseOrderData ? purchaseOrderData.projenddate : ''],
      duration: [purchaseOrderData ? purchaseOrderData.duration : '', [Validators.required]],
      billingcycle: [purchaseOrderData ? purchaseOrderData.billingcycle : '', [Validators.required]],
      netterm: [purchaseOrderData ? purchaseOrderData.netterm : '', [Validators.required]],
      recname: [purchaseOrderData ? purchaseOrderData.recname : ''],
      recemail: [purchaseOrderData ? purchaseOrderData.recemail : ''],
      recnumber: [purchaseOrderData ? purchaseOrderData.recnumber : ''],
      acrname: [purchaseOrderData ? purchaseOrderData.acrname : ''],
      acrmail: [purchaseOrderData ? purchaseOrderData.acrmail : '', [Validators.required]],
      acrno: [purchaseOrderData ? purchaseOrderData.acrno : '', [Validators.required]],

    });
  }

  onPoTypeSelect(event: MatSelectChange) {
    if(event.value == "To"){
      this.poTypeSelected = 'Recruiting';
      this.recruitingFlag = true;
    } else {
      this.poTypeSelected = 'Sales';
      this.recruitingFlag = false;
    }
    this.getVendorcompanies();
  }

  onCompanySelect(event: MatSelectChange) {
    if(event.value !== ""){
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
    if(event.value !== ""){
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
    });
  }

  onConsultantSelect(event: MatSelectChange) {
    if(event.value !== ""){
      this.consultantSelected = event.value;
    }
    this.purchaseOrderServ.getSelectedConsultantInfo(this.consultantSelected, this.vendorSelected).subscribe(
      (response: any) => {
        this.consultantInfo = response.data
        const paymentCycleValue = parseInt(response.data.paymentcycle, 10);
        this.purchaseOrderForm.get("endclient").setValue(response.data.endclient);
        this.purchaseOrderForm.get("implpartner").setValue(response.data.implpartner);
        this.purchaseOrderForm.get("hourlyrate").setValue(response.data.submissionrate);
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

  flg = true;
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


  onSubmit() {
    if (this.purchaseOrderForm.invalid) {
      this.purchaseOrderForm.markAllAsTouched();
      return;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}
