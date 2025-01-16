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
import { ReceiptService } from '../../services/receipt.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

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
    MatNativeDateModule,
    MatTableModule
  ],
  templateUrl: './add-receipt.component.html',
  styleUrls: ['./add-receipt.component.scss']
})
export class AddReceiptComponent {
  receiptForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private receiptServ = inject(ReceiptService);
  private snackBarServ = inject(SnackBarService);
  protected isFormSubmitted: boolean = false;
  private destroyed$ = new Subject<void>();
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  entity: any;
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    // 'SerialNum',
    // 'invoicenumber',
    // 'InvoiceDate',
    // 'DueDate',
    // 'Consultant',
    // 'NetTerm',
    // 'NoOfHours',
    // 'Rate',
    // 'InvoiceValue',
    // 'Status',
    // 'Invoice',
    // 'Action'
  ];
  invoiceId: any;
  invoiceValue!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddReceiptComponent>
  ) { }

  ngOnInit(): void {
    this.invoiceId = this.data.receiptData.invoiceId
    this.invoiceValue = Number(this.data.receiptData.invoiceValue);
    this.initializeReceiptForm(null);
    this.getPayments(this.invoiceId);
  }

  private initializeReceiptForm(receiptData: any) {
    this.receiptForm = this.formBuilder.group({
      invId: [receiptData ? receiptData.invoiceid : this.invoiceId],
      invStatus: [receiptData ? receiptData.invStatus : ''],
      paymentId: [receiptData ? receiptData.paymentId : ''],
      paymentDate: [receiptData ? receiptData.paymentDate : '', [Validators.required]],
      amountReceived: [receiptData ? receiptData.amountReceived : '', [Validators.required]],
      paymentMode: [receiptData ? receiptData.paymentMode : '', [Validators.required]],
      chequeNumber: [receiptData ? receiptData.chequeNumber : ''],
      chequeDate: [receiptData ? receiptData.chequeDate : ''],
      remarks: [receiptData ? receiptData.remarks : ''],
      addedby: [receiptData ? receiptData.addedby : localStorage.getItem('userid')],
      updatedby: [this.data.actionName === "edit-receipt" ? localStorage.getItem('userid') : '0'],
    });
  }

  getPayments(id: any) {
    return this.receiptServ.getReceiptsByInvoiceId(id).subscribe({
      next: (resp: any) => {
        console.log(resp)
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  onSubmit() {
    if (this.receiptForm.invalid) {
      this.receiptForm.markAllAsTouched();
      return;
    }
    const saveReqObj = this.getSaveData();
    const amountReceived = Number(this.receiptForm.get("amountReceived")?.value);

    if (this.invoiceValue === amountReceived) {
      saveReqObj.invStatus = 'PAID'; // Update status to 'PAID'
    } else if (amountReceived > 0 && amountReceived < this.invoiceValue) {
      saveReqObj.invStatus = 'PARTIALLY PAID'; // For partial payments
    } else {
      saveReqObj.invStatus = 'UNPAID'; // Default case if no amount is received
    }

    this.receiptServ
      .addORUpdateReceipt(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            this.dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-receipt'
                ? 'Payment added successfully'
                : 'Payment updated successfully';
            this.dialogRef.close();
          } else {
            this.isFormSubmitted = false;
            this.dataToBeSentToSnackBar.message = resp.message ? resp.message : 'Transaction Failed';
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          }
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          this.isFormSubmitted = false;
          this.dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-receipt'
              ? 'Payment addition is failed'
              : 'Payment updation is failed';
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        },
      });
  }

  getSaveData() {
    const formValue = this.receiptForm.value;
    if (this.data.actionName === 'edit-receipt') {
      return {
        ...this.entity,
        ...formValue,
      };
    }
    return {
      ...formValue
    };
  }

  editReceipt(receipt: any) {

  }

  deleteReceipt(receipt: any) {

  }

  onCancel() {
    this.dialogRef.close();
  }

}
