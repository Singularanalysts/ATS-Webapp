import { Component, OnInit, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit {

  invoiceForm!: FormGroup;
  private formBuilder = inject(FormBuilder);

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddInvoiceComponent>
  ) {}

  ngOnInit(): void {
    this.initializeInvoiceForm(null);
  }

  private initializeInvoiceForm(invoiceData: any) {
    this.invoiceForm = this.formBuilder.group({
      invoicenumber: [invoiceData ? invoiceData.invoicenumber : '', [Validators.required]],
      vendor: [invoiceData ? invoiceData.vendor : '', [Validators.required]],
      consultant: [invoiceData ? invoiceData.consultant : '', [Validators.required]],
      netterm: [invoiceData ? invoiceData.netterm : '', [Validators.required]],
      invoicedate: [invoiceData ? invoiceData.invoicedate : '', [Validators.required]],
      duedate: [invoiceData ? invoiceData.duedate : '', [Validators.required]],
      jobdescription: [invoiceData ? invoiceData.jobdescription : '', [Validators.required]],
      numberofhours: [invoiceData ? invoiceData.numberofhours : '', [Validators.required]],
      hourlyrate: [invoiceData ? invoiceData.hourlyrate : '', [Validators.required]],
      tax: [0],
      invoicevalue: [invoiceData ? invoiceData.invoicevalue : '', [Validators.required]],
      pocemail: [invoiceData ? invoiceData.pocemail : ''],
      remarks: [invoiceData ? invoiceData.remarks : '', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }
  }

  onFileChange(event: any) {

  }

  onCancel() {
    this.dialogRef.close();
  }

}
