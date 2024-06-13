import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {

  constructor(private apiServ: ApiService) { }

  //register requirement
  public registerRequirement(entity: any) {
    return this.apiServ.post("requirement/save", entity);
  }

  // get max require number 
  getReqNumber(flg:string) {
    return this.apiServ.get("requirement/getmaxnumber/" + flg);
  }

  getVendorCompanies(flg:string) {
    return this.apiServ.get("requirement/venodorCompanies/" + flg);
  }

  getTech() {
    return this.apiServ.get("requirement/tech");
  }

  getSkillData(id: number) {
    return this.apiServ.get("requirement/getskillsbyid/" + id);
  }
  
  getEmployee() {
    return this.apiServ.get("requirement/recruiterlist");
  }

  getAllRequirementData(data: any) {
    return this.apiServ.post( "requirement/allRequirements" , data);
  }

  getRecruiterOfTheVendor(id:number, flg:string) {
    return this.apiServ.get("requirement/getRecruiters/"+id+"/"+flg);
  }

  deleteEntity(id: number) {
    return this.apiServ.delete("requirement/delete/" + id);
  }

  //Update requirement
  public updateRequirement(entity: any) {
    return this.apiServ.post("requirement/update", entity);
  }

  addORUpdateRequirement(entity: any, action: 'edit-requirement' | 'add-requirement'){
    return action === 'edit-requirement' ? this.updateRequirement(entity): this.registerRequirement(entity);
  }

  getAssignedRecruiter(id: number) {
    return this.apiServ.get("requirement/getEmpsByReqId/" + id);
  }
  
  //used for get one resource  // get single requirement
  getEntity(id: number) {
    return this.apiServ.get("requirement/getbyid/" + id);
  }

  getReqtData( page: any, size: any, field: any) {
    return this.apiServ.get("requirement/all/" + page + "/" + size + "/" + field);
  }

  public gettechDropDown(techid: any) {
    return this.apiServ.get("consultant/technology/"+techid);
  }

  getVendorById(id: number) {
    return this.apiServ.get("vms/vendor/vendor/" + id);
  }

  getRecruiters(vendor:string){
    return this.apiServ.get("openreqs/dice/recruiterpopup/"+vendor);
  }

}
