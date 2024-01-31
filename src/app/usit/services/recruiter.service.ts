import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {

  private apiServ = inject(ApiService);

  //register vms
  public registerEntity(entity: any) {
    return this.apiServ.post("vms/recruiter/save", entity);
  }

  public duplicatecheckEmail(email: string) {
    return this.apiServ.get("vms/recruiter/duplicateMail/" + email);
  }


  //used for get the resource
  getAll() {
    return this.apiServ.get("vms/recruiter/all");
  }

  getAllRecruiters( access: string, userid: number) {
    return this.apiServ.get("vms/recruiter/all/" + access + "/" + userid);
  }



  getAllRecruitersPagination( access: string, userid: number,page: any, size: any,field:any) {
    return this.apiServ.get("vms/recruiter/all/" + access + "/" + userid+"/"+page+"/"+size+"/"+field);
  }

  deleteEntity(id: number) {
    return this.apiServ.delete("vms/recruiter/delete/" + id);
  }
  getEntity(id: number) {
    return this.apiServ.get("vms/recruiter/recruiter/" + id);
  }

  rejectRecruiter(id: number, remarks: string) {
    return this.apiServ.get("vms/recruiter/reject?id=" + id +"&remarks=" + remarks);
  }

  getEntitybyCompany(id: number) {
    return this.apiServ.get("vms/recruiter/recrbycompany/" + id);
  }

  //register vms
  public updateEntity(entity: any) {
    return this.apiServ.put("vms/recruiter/recruiter", entity);
  }

  getCompanies(flg:string) {
    return this.apiServ.get("vms/recruiter/venodorCompanies/"+flg);
  }

  //used for delete the resource
  changeStatus(entity: any) {
    return this.apiServ.patch("vms/recruiter/status", entity);
  }

  changeStatus2(id: number, status: string, remarks: string) {
    return this.apiServ.get("vms/recruiter/status?id=" + id + "&status=" + status + "&remarks=" + remarks);
  }

  approve(action: string, id: number, userid:number) {//this.role,action,id
    return this.apiServ.get("vms/recruiter/approve?stat=" + action + "&id=" + id);
  }

  uploadexcel(file: any) {
    return this.apiServ.post("vms/recruiter/upload", file);
  }

  uploadexcels(file: any, id:number) {
    return this.apiServ.post("vms/recruiter/excelUpload", file);
  }

  addOrUpdateRecruiter(entity: any, action: string){
    return action === "edit-recruiter" ? this.updateEntity(entity) : this.registerEntity(entity);
 
   }

   approveORRejectRecruiter(entity: any, action: 'Approved' | 'Reject'){
    return action === 'Approved' ? this.approve(entity.action, entity.id, entity.userid): this.rejectRecruiter(entity.id, entity.remarks);
  }

  getAllVendorByType(access: string, userid: number,page: any, size: any, recruitertype: any, field:any) {
    return this.apiServ.get("vms/recruiter/getAll/" + access + "/" + userid+"/"+page+"/"+size+"/"+ recruitertype + "/" +field);
  }
}
