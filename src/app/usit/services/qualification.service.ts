import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class QualificationService {

  private apiServ = inject(ApiService);

  constructor() { }

  //register qualification
  addQualification(entity: any) {
    return this.apiServ.post("auth/qualification/saveQualification", entity);
  }

  //used for get one resource
  getQualificationById(id: number) {
    return this.apiServ.get("auth/qualification/getqualification/" + id);
  }

  // get all qualifications
  getAllQualifications() {
    return this.apiServ.get("auth/qualification/all");
  }

  updateQualification(entity: any){
    return this.apiServ.post("auth/qualification/saveQualification", entity);
  }

  //delete qualification
  deleteQualification(id: number) {
    return this.apiServ.delete("auth/qualification/delete/" + id);
  }

  addOrUpdateQualification(entity: any, action: string) {
    return action === "update-qualification" ? this.updateQualification(entity) : this.addQualification(entity);
  }
}
