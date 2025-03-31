import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(private apiServ: ApiService) { }

  getConsultantDropdown(flg: string,id:number) {
   // getconsultInfo
    return this.apiServ.get("submission/getconsultInfo/" + flg+"/"+id);
    //return this.apiServ.get("submission/consultantinfo/" + flg);
  }

  
  getRequirementByIdDropdown(id:number) {
    return this.apiServ.get("submission/getreqbyid/"+id);
  }

  getRecruiterOfTheVendor(id:number, flg:string) {
    return this.apiServ.get("submission/getRecruiters/"+id+"/"+flg);
  }
  getCompanies(flg:string) {
    return this.apiServ.get("submission/getVenodorCompanies/"+flg);
  }

  //used for create the resource
  registerSubmission(submission: any) {
    return this.apiServ.post("submission/savesubmission", submission);
  }

  // supporting drop down apis
  public getRequirements(flg: string) {
    return this.apiServ.get("submission/getrequirements/"+ flg);
  }

  public getsubmissiondata(flg: string,access:string,userid:number) {
    return this.apiServ.get("submission/all/" + flg+"/"+access+"/"+userid);
  }

  public getsubmissiondataPagination(flg: string,access:string,userid:number, page: any, size: any, field: any, sortField:string,sortOrder:string, company: any) {
    return this.apiServ.get("submission/all/" + flg+"/"+access+"/"+userid+ "/" + page + "/" + size + "/" + field+"/"+sortField+"/"+sortOrder+"/"+company);
  }
 
  deletesubmission(id: number) {
    return this.apiServ.delete("submission/delete/" + id);
  }

  //used for get one resource
  getsubdetailsbyid(id: number) {
    return this.apiServ.get("submission/getbyid/" + id);
  }

  addORUpdateSubmission(entity: any, action: 'edit-submission' | 'add-submission'){
    return action === 'edit-submission' ? this.registerSubmission(entity): this.registerSubmission(entity);
  }

  getSubReqInfo(id: any) {
    return this.apiServ.get("requirement/getbyid/" + id);
  }

  getConsultantById(id: number) {
    return this.apiServ.get("consultant/getbyid/" + id);
  }

  getVendorById(id: number) {
    return this.apiServ.get("vms/vendor/vendor/" + id);
  }

  public getConsultantSubmissionDataPagination(data: any) {
    return this.apiServ.post("submission/getEmployeeSubmissions", data);
  }
}
