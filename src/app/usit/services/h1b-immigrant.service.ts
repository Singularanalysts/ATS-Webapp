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

  //to get visas
  getVisas() {
    return this.apiServ.get("auth/visa/h1visas");
  }

  //register h1b immigrant
  public registerH1bImmigrant(entity: any) {
    return this.apiServ.post("img/H1BApplicants/save", entity);
  }

  //update h1b immigrant
  public updateH1bImmigrant(entity: any) {
    return this.apiServ.post("img/H1BApplicants/save", entity);
  }

  addORUpdateH1bImmigrant(entity: any, action: 'edit-h1b' | 'add-h1b'){
    return action === 'edit-h1b' ? this.updateH1bImmigrant(entity): this.registerH1bImmigrant(entity);
  }
  
  // get all h1b applicants
  getAll() {
    return this.apiServ.get("img/H1BApplicants/all")
  }

  getH1bById(id: any) {
    return this.apiServ.get("img/H1BApplicants/getH1BApplicant/"+ id)
  }
}
