import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private http = inject(HttpClient);
  private apiServ = inject(ApiService);

  constructor() { }

  sendEmail(formdata: any) {
    return this.http.post(`${this.apiServ.apiUrl}billpay/email/sendInvoiceEmail`, formdata);
  }

  public getAllInvoice(request:any) {
    return this.apiServ.post("billpay/invoice/getAllInvoice",request);
  }

  downloadInvoice(id: number): Observable<Blob> {
    return this.http.get(`${this.apiServ.apiUrl}billpay/invoice/pdf/${id}`, {
      responseType: 'blob',
    });
  }

  deleteInvoice(id: number) {
    return this.apiServ.delete("billpay/invoice/deleteInvoice/" + id);
  }
}
