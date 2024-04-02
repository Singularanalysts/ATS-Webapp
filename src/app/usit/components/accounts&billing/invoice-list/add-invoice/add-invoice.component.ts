import { Component, OnInit, inject, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PurchaseOrderService } from 'src/app/usit/services/purchase-order.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { Subject, takeUntil } from 'rxjs';
import { FileManagementService } from 'src/app/usit/services/file-management.service';

@Component({
  selector: 'app-add-invoice',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [DatePipe],
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit {
  private fileService = inject(FileManagementService);
  company: any = [];
  vendordata: any = [];
  consultantdata: any[] = [];
  invoiceForm!: FormGroup;
  poTypeSelected!: string;
  companySelected!: string;
  vendorSelected: any;
  consultantSelected!: any;
  private formBuilder = inject(FormBuilder);
  private purchaseOrderServ = inject(PurchaseOrderService);
  constructor(private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddInvoiceComponent>
  ) { }
  // invoiceNumber = 
  invoiceData !: any;
  ngOnInit(): void {
    this.getCompanies();
    if (this.data.actionName === "edit-invoice") {
      this.initializeInvoiceForm(this.data.invoiceData);
      this.purchaseOrderServ.getPoDropdown(this.data.invoiceData.potype).subscribe(
        (response: any) => {
          this.poData = response.data;
        }
      )
      this.getConsultant(this.data.invoiceData);
      this.getVendorcompanies(this.data.invoiceData);
    }
    else {
      this.initializeInvoiceForm(null);
    }
  }
  private initializeInvoiceForm(invoiceData: any) {
    this.invoiceForm = this.formBuilder.group({
      company: [invoiceData ? invoiceData.company : ''],
      invoiceid: [invoiceData ? invoiceData.invoiceid : ''],
      poid: [invoiceData ? invoiceData.poid : '', [Validators.required]],
      potype: [invoiceData ? invoiceData.potype : '', [Validators.required]],
      invoicenumber: [invoiceData ? invoiceData.invoicenumber : '', [Validators.required]],
      vendor: [invoiceData ? invoiceData.vendor : '', [Validators.required]],
      consultant: [invoiceData ? invoiceData.consultant : '', [Validators.required]],
      additionalcharges: [invoiceData ? invoiceData.additionalcharges : ''],
      netterm: [invoiceData ? invoiceData.netterm : '', [Validators.required]],
      invoicedate: [invoiceData ? invoiceData.invoicedate : new Date(), [Validators.required]],
      duedate: [invoiceData ? invoiceData.duedate : '', [Validators.required]],
      jobdescription: [invoiceData ? invoiceData.jobdescription : '', [Validators.required]],
      expensesfor :  [invoiceData ? invoiceData.expensesfor : '', [Validators.required]],
      numberofhours: [invoiceData ? invoiceData.numberofhours : '', [Validators.required]],
      hourlyrate: [invoiceData ? invoiceData.hourlyrate : '', [Validators.required]],
      tax: [invoiceData ? invoiceData.tax : ''],
      invoicevalue: [invoiceData ? invoiceData.invoicevalue : '', [Validators.required]],
      remarks: [invoiceData ? invoiceData.remarks : '', [Validators.required]],
      cloudMaxnumber: [invoiceData ? invoiceData.cloudMaxnumber : ''],
      proMaxnumber: [invoiceData ? invoiceData.proMaxnumber : ''],
      singMaxnumber: [invoiceData ? invoiceData.singMaxnumber : ''],
      narveeMaxnumber: [invoiceData ? invoiceData.narveeMaxnumber : ''],
      maxnumber: [invoiceData ? invoiceData.maxnumber : ''],
      updatedby: [this.data.actionName === "edit-purchase-order" ? localStorage.getItem('userid') : '0'],
      addedby: [invoiceData ? invoiceData.addedby : localStorage.getItem('userid')],

    });
  }
  poData: any[] = [];
  flg !: any;
  onPoTypeSelect(event: MatSelectChange) {
    if (event.value == "OutWard") {
      this.flg = "OutWard"
      this.poTypeSelected = 'Recruiting';
      // this.recruitingFlag = true;
    } else {
      this.poTypeSelected = 'Sales';
      this.flg = "InWard"
      //this.recruitingFlag = false;
    }

    this.purchaseOrderServ.getPoDropdown(this.flg).subscribe(
      (response: any) => {
        this.poData = response.data;
      }
    )
  }
  onNettermChange(event: MatSelectChange) {
    const str: string = event.value;
    const num: number = parseInt(str.match(/\d+/)?.[0] || "0", 10);
    const currentDate: Date = new Date();
    const newDate: Date = new Date(currentDate.getTime() + num * 24 * 60 * 60 * 1000);
    this.invoiceForm.get("duedate")?.setValue(newDate);

  }
  onPoSelect(event: MatSelectChange) {
    this.purchaseOrderServ.getPoById(event.value).subscribe(
      (response: any) => {
        //this.poData = response.data;
        this.getConsultant(response.data);
        this.getVendorcompanies(response.data);
        this.invoiceForm.get("hourlyrate")?.setValue(response.data.hourlyrate)
        this.invoiceForm.get("netterm")?.setValue(response.data.netterm)
        this.getInvoiceNumber(response.data.company)
      }
    )
  }
  getConsultant(data: any) {
    // this.resetVendorFormFields();
    console.log(data.vendor + " = " + data.consultant)
    this.purchaseOrderServ.getConsultantData(data.vendor, data.consultant).subscribe(
      (response: any) => {
        this.consultantdata = response.data;
        this.invoiceForm.get("consultant")?.setValue(data.consultant)
        console.log(response.data)
      }
    )
  }

  getVendorcompanies(data: any) {
    // if (this.poTypeSelected && this.companySelected) {
    this.purchaseOrderServ.getVendorsPO(data.consultant, data.vendor).subscribe(
      (response: any) => {
        this.vendordata = response.data;
        this.invoiceForm.get("vendor")?.setValue(data.vendor)
      }
    )
    // }
  }
  getCompanies() {
    this.purchaseOrderServ.getCompanies().subscribe((response: any) => {
      this.company = response.data;
      console.log(response.data)
    });
  }
  getInvoiceNumber(company: any) {
    const selectedCompany = this.company.find((option: any[]) => option[0] === company);
    const companyName = selectedCompany[1];
    this.purchaseOrderServ.getInvoiceNumber(companyName).subscribe((response: any) => {
      console.log(response.data);
      this.invoiceForm.get("invoicenumber")?.setValue(response.data[0]);

      if (companyName == 'Narvee') {
        this.invoiceForm.get("narveeMaxnumber")?.setValue(response.data[1]);
      }
      else if (companyName == 'Singular') {
        this.invoiceForm.get("singMaxnumber")?.setValue(response.data[1]);
      }

      else if (companyName == 'ProBPM') {
        this.invoiceForm.get("proMaxnumber")?.setValue(response.data[1]);
      }
      else {
        this.invoiceForm.get("cloudMaxnumber")?.setValue(response.data[1]);
      }
    });

  }
  hourlyRate!: number;
  numberOfHours!: number;
  additionalCharges!: number;
  tax!: number;
  otherCharges!: number;
  invoiceActualValue!: number;
  totalValue!: number;

  calculateInvoice() {
    this.hourlyRate = this.invoiceForm.get('hourlyrate')?.value;
    this.numberOfHours = this.invoiceForm.get('numberofhours')?.value;
    this.additionalCharges = parseFloat(this.invoiceForm.get('additionalcharges')?.value);
    this.tax = parseFloat(this.invoiceForm.get('tax')?.value);

    if (isNaN(this.additionalCharges)) {
      this.additionalCharges = 0;
    }
    if (isNaN(this.tax)) {
      this.tax = 0;
    }

    // Calculate additional charges
    this.otherCharges = this.additionalCharges + this.tax;

    // Calculate actual invoice value
    this.invoiceActualValue = this.hourlyRate * this.numberOfHours;

    // Calculate total invoice value
    this.totalValue = this.invoiceActualValue + this.otherCharges;

    // Set total value in form
    this.invoiceForm.get('invoicevalue')?.setValue(this.totalValue);
  }
  entity !: any;
  protected isFormSubmitted: boolean = false;
  private snackBarServ = inject(SnackBarService);
  getSaveData() {
    if (this.data.actionName === 'edit-purchase-order') {
      return { ...this.entity, ...this.invoiceForm.value }
    }
    return this.invoiceForm.value;
  }
  private destroyed$ = new Subject<void>();
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

    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }

    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }

    const invoiceDateFormControl = this.invoiceForm.get('invoicedate');
    const dueDateFormControl = this.invoiceForm.get('duedate');
    if (invoiceDateFormControl?.value) {
      const formattedinvDate = this.datePipe.transform(invoiceDateFormControl.value, 'yyyy-MM-dd');
      const formatteddueDate = this.datePipe.transform(dueDateFormControl?.value, 'yyyy-MM-dd');
      invoiceDateFormControl.setValue(formattedinvDate);
      dueDateFormControl?.setValue(formatteddueDate);
    }

    const saveReqObj = this.getSaveData();
    this.purchaseOrderServ
      .saveInvoice(saveReqObj)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            this.submit(resp.data.invoiceid);
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-invoice'
                ? 'Invoice added successfully'
                : 'Invoice updated successfully';
            //this.onFileSubmit(resp.data.poid);
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
            this.data.actionName === 'add-invoice'
              ? 'Invoice addition is failed'
              : 'Invoice updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }
  multifilesError: boolean = false;
  uploadedFileNames: string[] = [];
  uploadedfiles: string[] = []
  multifilesFileNameLength: boolean = false;
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


  submit(id: number) {
    const formData = new FormData();

    for (var i = 0; i < this.uploadedfiles.length; i++) {
      formData.append("files", this.uploadedfiles[i]);
    }
    
    this.fileService.uploadFileBillPay(formData, id)
      .subscribe((response: any) => {
        if (response.status === 200) {

        } else {
        }
      }
      );
  }
  onCancel() {
    this.dialogRef.close();
  }

  selectOptionObj = {
    jobdescription: JOBDESCRIPTION,
    netterm: NETTERM,
  };

 
}

export const NETTERM = [
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
  'Net 90',
]

export const JOBDESCRIPTION = [
  'Consultation Charges For',
  'Travelling Expenses from',
]