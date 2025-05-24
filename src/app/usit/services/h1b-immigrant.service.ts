import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class H1bImmigrantService {

  constructor(private apiServ: ApiService) { }

  //to get comapnies
  getCompanies() {
    return this.apiServ.get("auth/company/allcompanies"); 
  }

  getCompaniesDropdown() {
    return this.apiServ.get("auth/company/getCompaniesDropdown"); 
  }
getAllCompanies(){
  return this.apiServ.get("auth/company/allAssociatedCompanies");
}
saveCompanies(data : any){
  return this.apiServ.post("auth/company/saveAssociatedcompany" , data);
}
deleteCompany(id : any){
  return this.apiServ.delete(`auth/company/deleteAssociatedCompany/${id}`);
}
  //to get visas
  getVisas() {
    return this.apiServ.get("auth/visa/h1visas");
  }

  //register h1b immigrant
  public registerH1bImmigrant(entity: any) {
    return this.apiServ.post("img/people/save", entity);
  }

  //update h1b immigrant
  public updateH1bImmigrant(entity: any) {
    return this.apiServ.post("img/people/save", entity);
  }

  addORUpdateH1bImmigrant(entity: any, action: 'edit-active' | 'add-active'){
    return action === 'edit-active' ? this.updateH1bImmigrant(entity): this.registerH1bImmigrant(entity);
  }
  
  // get all h1b applicants
  getAll() {
    return this.apiServ.get("img/people/all")
  }

  getH1bById(id: any) {
    return this.apiServ.get("img/people/getH1BApplicant/"+ id)
  }

  getAllH1bApplicants(page: any, size: any, field: any, sortField: any, sortOrder: any) {
    return this.apiServ.get(`img/people/all/${page}/${size}/${field}/${sortField}/${sortOrder}`);
  }

  getAllActiveApplicants(entity: any) {
    return this.apiServ.post(`img/people/all`, entity);
  }

  //used for delete the resource
  deleteEntity(id: number) {
    return this.apiServ.delete("img/people/delete/" + id);
  }
}
