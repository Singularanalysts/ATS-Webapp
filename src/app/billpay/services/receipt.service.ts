import { inject, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private apiServ = inject(ApiService);

  constructor() { }

  saveReceipt(data: any) {
    return this.apiServ.post("billpay/payments/payPayment", data);
  }

  updateReceipt(data: any) {
    return this.apiServ.post("billpay/payments/updatePayment", data);
  }

  addORUpdateReceipt(entity: any, action: string) {
    return action === 'edit-receipt' ? this.updateReceipt(entity) : this.saveReceipt(entity);
  }

  getReceiptsByInvoiceId(invoiceid: any) {
    return this.apiServ.get(`billpay/payments/getAllPayments/${invoiceid}`);
  }
  
  deleteReceipt(invoiceid: any) {
    return this.apiServ.delete(`billpay/payments /getAllPayments/${invoiceid}`);
  }



  getAllPayments(data: any) {
    return this.apiServ.post("billpay/payments/getAllPayments", data);
  }
}
