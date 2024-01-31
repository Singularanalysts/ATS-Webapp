import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiServ = inject(ApiService);

  getCompanies() {
    return this.apiServ.get("vms/recruiter/venodorCompanies/all");
  }

  //register vms
  public registerEntity(entity: any) {
    return this.apiServ.post("vms/vendor/save", entity);
  }

  public duplicatecheck(vendor: string,id:number) {
    return this.apiServ.get("vms/vendor/duplicatecheck/" + vendor+"/"+id);
  }

  //used for get the resource
  getAll() {
    return this.apiServ.get("vms/vendor/all");
  }

  getAllVendors(access: string, userid: number) {
    return this.apiServ.get("vms/vendor/all/" + access + "/" + userid);
  }

  getAllVendorsByPagination(access: string, userid: number, page: any, size: any, field: any) {
    return this.apiServ.get("vms/vendor/all/" + access + "/" + userid + "/" + page + "/" + size + "/" + field);
  }

  deleteEntity(id: number) {
    return this.apiServ.delete("vms/vendor/delete/" + id);
  }

  getEntity(id: number) {
    return this.apiServ.get("vms/vendor/vendor/" + id);
  }

  //register vms
  public updateEntity(entity: any) {
    return this.apiServ.put("vms/vendor/vendor", entity);
  }
  approvevms(action: string, id: number,userid:number) { //this.role,action,id
    return this.apiServ.get("vms/vendor/approve?stat=" + action + "&id=" + id+"&userid="+userid);
  }

  //used for delete the resource
  changeStatus(entity: any) {
    return this.apiServ.patch("vms/vendor/status", entity);
  }

  changeStatus2(id: number, status: string, remarks: string) {
    return this.apiServ.get("vms/vendor/status?id=" + id + "&status=" + status + "&remarks=" + remarks);
  }

  rejectVendor(id: number, remarks: string, userid:number) {
    return this.apiServ.get("vms/vendor/reject?id=" + id + "&remarks=" + remarks+"&userid="+userid);
  }

  search(keyword: string) {
    return this.apiServ.get("auth/users/search2/" + keyword);
  }

  uploadexcel(file: any) {
    return this.apiServ.post("vms/vendor/upload", file);
  }

  addORUpdateVendor(entity: any, action: 'edit-vendor' | 'add-vendor'){
    return action === 'edit-vendor' ? this.updateEntity(entity): this.registerEntity(entity);
  }

  approveORRejectVendor(entity: any, action: 'Approved' | 'Reject'){
    return action === 'Approved' ? this.approvevms(entity.action, entity.id, entity.userid): this.rejectVendor(entity.id, entity.remarks, entity.userid);
  }

  getAllVendorByType(access: string, userid: number,page: any, size: any, companytype: any, field:any) {
    return this.apiServ.get("vms/vendor/getAll/" + access + "/" + userid+"/"+page+"/"+size+"/"+ companytype + "/" +field);
  }
}
