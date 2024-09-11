import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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
}
