import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(private apiServ: ApiService) { }

  getVendors(company: string, potype: string) {
    return this.apiServ.get("billpay/OnboardedVendor/" + company + "/" + potype);
  }

  getSelectedOfVendor(vid: number) {
    return this.apiServ.get("billpay/listProfiles/" + vid);
  }

  getSelectedConsultantInfo(cid: number, vid: number) {
    return this.apiServ.get("billpay/consultantInfo/" + cid + "/" + vid);
  }
}
