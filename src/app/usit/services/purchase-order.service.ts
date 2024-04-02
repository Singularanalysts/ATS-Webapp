import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(private apiServ: ApiService) { }

  private http = inject(HttpClient);

  getVendors(company: string, potype: string) {
    return this.apiServ.get("billpay/closure/OnboardedVendor/" + company + "/" + potype);
  }

  // getPoVendors(company: string, potype: string) {
  //   return this.apiServ.get("billpay/invoice/poGeneratedVendor/" + company + "/" + potype);
  // }

  getVendorsPO(cid: number, vid: number) {
    return this.apiServ.get("billpay/invoice/getVendor/" + cid + "/" + vid);
  }



  public getInvoiceNumber(company:string) {
    return this.apiServ.get("billpay/invoice/getInvoice/"+company);
  }

  public getPoById(poid: any) {
    return this.apiServ.get("billpay/po/getById/"+ poid);
  }

  public getInvoiceById(invoiceid: any) {
    return this.apiServ.get("billpay/invoice/getById/"+ invoiceid);
  }

  public getAllPos() {
    return this.apiServ.get("billpay/po/all");
  }

  public getAllIvoice() {
    return this.apiServ.get("billpay/invoice/getAll");
  }

  public getCompanies() {
   return this.apiServ.get("billpay/po/company/allcompanies");
  }

  public getPoDropdown(potype: any) {
    return this.apiServ.get("billpay/po/poDropdown/"+ potype);
  }

  public savePO(entity:any) {
    return this.apiServ.post("billpay/po/savepo",entity);
  }

  public saveInvoice(entity:any) {
    return this.apiServ.post("billpay/invoice/saveInvoice",entity);
  }

  getSelectedOfVendor(vid: number) {
    return this.apiServ.get("billpay/closure/listProfiles/" + vid);
  }

  // poGeneratedProfiles(vid: number,company: string, potype: string) {
  //   return this.apiServ.get("billpay/invoice/poGeneratedProfiles/" + vid+"/"+company+"/"+potype);
  // }
  getConsultantData(vid: number,cid: number,){
    return this.apiServ.get("billpay/invoice/getConsultant/" + vid+"/"+cid);
  }
  deletePo(id: number) {
    return this.apiServ.delete("billpay/po/deletePo/" + id);
  }

  deleteInvoice(id: number) {
    return this.apiServ.delete("billpay/invoice/deleteInvoice/" + id);
  }

  getSelectedConsultantInfo(cid: number, vid: number) {
    return this.apiServ.get("billpay/closure/consultantInfo/" + cid + "/" + vid);
  }

  downloadInvoice(id: number): Observable<Blob> {
    return this.http.get(`${this.apiServ.apiUrl}billpay/invoice/pdf/${id}`, {
      responseType: 'blob',
    });
  }
}
