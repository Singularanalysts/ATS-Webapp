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
  selector: 'app-add-receipt',
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
  templateUrl: './add-receipt.component.html',
  styleUrls: ['./add-receipt.component.scss']
})
export class AddReceiptComponent {
  receiptForm!: FormGroup;
  private formBuilder = inject(FormBuilder);

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddReceiptComponent>
  ) {}

  ngOnInit(): void {
    this.initializeReceiptForm(null);
  }

  private initializeReceiptForm(receiptData: any) {
    this.receiptForm = this.formBuilder.group({
      serialno: [receiptData ? receiptData.serialno : '', [Validators.required]],
      amount: [receiptData ? receiptData.amount : '', [Validators.required]],
      transactiontype: [receiptData ? receiptData.transactiontype : '', [Validators.required]],
      chequeno: [receiptData ? receiptData.chequeno : '', [Validators.required]],
      chequedate: [receiptData ? receiptData.chequedate : '', [Validators.required]],
      bankname: [receiptData ? receiptData.bankname : '', [Validators.required]],
      onlineid: [receiptData ? receiptData.onlineid : '', [Validators.required]],
      remarks: [receiptData ? receiptData.remarks : '', [Validators.required]],
      vendor: [receiptData ? receiptData.vendor : '', [Validators.required]],
      invoiceid: [receiptData ? receiptData.invoiceid : '', [Validators.required]],
      bank: [receiptData ? receiptData.bank : '', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.receiptForm.invalid) {
      this.receiptForm.markAllAsTouched();
      return;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}
