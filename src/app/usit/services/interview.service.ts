import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {

  constructor(private apiServ: ApiService) { }

   //register vms
   public registerEntity(entity: any) {
    return this.apiServ.post("interview/save", entity);
  }

  //register vms
  public updateEntity(entity: any) {
    return this.apiServ.post("interview/save", entity);
  }

  //used for get the resource
  getlist(flg: string,access:string,userid:number) {
    return this.apiServ.get("interview/all/" + flg+"/"+access+"/"+userid);
  }


    //used for get the resource
    getPaginationlist(flg: string,access:string,userid:number, page: any, size: any, field: any, sortField:string,sortOrder:string, company: any) {
      return this.apiServ.get("interview/all/" + flg+"/"+access+"/"+userid+ "/" + page + "/" + size + "/" + field+"/"+sortField+"/"+sortOrder+"/"+company );
    }

  getsubmissions(flg: string,id:any,role:string) {
    return this.apiServ.get("interview/submissiondetails/" + flg+"/"+id+"/"+role);
  }

  getsubmissionsDropDown(flg: string,id:any,role:string, subid:number,companyId:any) {
    return this.apiServ.get("interview/subdetails/" + flg+"/"+id+"/"+role+"/"+subid+"/"+companyId);
  }

  //used for delete the resource
  deleteEntity(id: number) {
    return this.apiServ.delete("interview/delete/" + id);
  }

  //used for get one resource
  getEntity(id: number) {
    return this.apiServ.get("interview/getinterview/" + id);
  }

  addORUpdateInterview(entity: any, action: 'edit-interview' | 'add-interview'){
    return action === 'edit-interview' ? this.updateEntity(entity): this.registerEntity(entity);
  }

  addClosure(entity: any) {
    return this.apiServ.post("billpay/saveClosure", entity);
  }
  getClosureByIntId(id: number) {
    return this.apiServ.get("billpay/getByInterviewId/" + id);
  }

  getOnboardedDetails(flg: string, company: any) {
    return this.apiServ.get("interview/getOnboardedDetails/" + flg+"/"+company);
  }

  public getConsultantInterviewDataPagination(data: any) {
    return this.apiServ.post("interview/getEmployeeInterviews", data);
  }
}
