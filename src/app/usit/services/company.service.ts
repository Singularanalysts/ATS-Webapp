import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private apiServ = inject(ApiService);

  constructor() { }

  //register company
  addCompany(entity: any) {
    return this.apiServ.post("auth/company/save", entity);
  }

  // get all companies
  getAllCompanies() {
    return this.apiServ.get("auth/company/all");
  }

  //used for get one resource
  getCompanyById(id: number) {
    return this.apiServ.get("auth/company/getbyid/" + id);
  }

   //update company
   updateCompany(entity: any) {
    return this.apiServ.post("auth/company/save", entity);
  }

  //delete company
  deleteCompany(id: number) {
    return this.apiServ.delete("auth/company/delete/" + id);
  }

  //register or update company
  addOrUpdateCompany(entity: any, action: string) {
    return action === "update-company" ? this.updateCompany(entity) : this.addCompany(entity);
  }

}
