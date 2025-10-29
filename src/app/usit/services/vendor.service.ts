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
saveemployeehub(entity:any){
  return this.apiServ.post("vms/H1BDataHub/save", entity);

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

  getAllVendorsByPagination2(access: string, userid: number, page: any, size: any, field: any) {
    return this.apiServ.get("vms/vendor/all/" + access + "/" + userid + "/" + page + "/" + size + "/" + field);
  }

  getAllVendorsByPagination(data: any) {
    return this.apiServ.post("vms/vendor/all", data);
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
  
  approvevms(action: string, id: number,userid:number) {
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
addORUpdateEmployeeHub(entity: any, action: 'edit-H1B-Employee-Data-Hub' | 'add-H1B-Employee-Data-Hub'){
    return action === 'edit-H1B-Employee-Data-Hub' ? this.updateEntity(entity): this.saveemployeehub(entity);
  }
  approveORRejectVendor(entity: any, action: 'Approved' | 'Reject'){
    return action === 'Approved' ? this.approvevms(entity.action, entity.id, entity.userid): this.rejectVendor(entity.id, entity.remarks, entity.userid);
  }

  getAllVendorByType(access: string, userid: number,page: any, size: any, companytype: any, field:any) {
    return this.apiServ.get("vms/vendor/getAll/" + access + "/" + userid+"/"+page+"/"+size+"/"+ companytype + "/" +field);
  }

  getAllBlacklistedByPagination(page: any, size: any, field: any, sortField:string, sortOrder:string ) {
    return this.apiServ.get("vms/vendor/allBlacklisted/" + page + "/" + size + "/" + field + "/" +sortField + "/" + sortOrder);
  }

  //save hotlist provider
  public saveHotlistProvider(entity: any) {
    return this.apiServ.post("vms/htProviders/save", entity);
  }

  addORHotlistProvider(entity: any, action: 'edit-hot-list-provider' | 'add-hot-list-provider'){
    return action === 'edit-hot-list-provider' ? this.updateEntity(entity): this.saveHotlistProvider(entity);
  }

  //used for get the resource
  getAllHotlistProviders() {
    return this.apiServ.get("vms/htProviders/getAllHotListProviders");
  }

  getHotlistProviderById(id: number) {
    return this.apiServ.get(`vms/htProviders/getById/${id}`);
  }

  deleteHotlistProvider(id: number) {
    return this.apiServ.delete("vms/htProviders/delete/" + id);
  }

  getAllHotListProvidersByPagination(page: any, size: any, field: any, sortField:string, sortOrder:string ) {
    return this.apiServ.get("vms/htProviders/getAllHotListProviders/" + page + "/" + size + "/" + field + "/" +sortField + "/" + sortOrder);
  }

  getAllCurrentOrFuturePrimaryVendorByPagination(vendorType: any, page: any, size: any, field: any, sortField:string, sortOrder:string ) {
    return this.apiServ.get(`vms/vendor/getAllFPVendors/${vendorType}/${page}/${size}/${field}/${sortField}/${sortOrder}`);
  }

  moveToCPVOrFPV(vendorType: any, id: any, userid: any) {
    return this.apiServ.get(`vms/vendor/move/${vendorType}/${id}/${userid}`);
  }
  
 moveToBlacklistedOrBack(status: any, id: any, userid: any, remarks?: string) {
  const encodedRemarks = encodeURIComponent(remarks || '');
  return this.apiServ.get(`vms/vendor/blacklisted/${status}/${id}/${userid}/${encodedRemarks}`);
}



  public saveKnownVendorContact(entity: any) {
    return this.apiServ.post("vms/knownContact/saveContact", entity);
  }

  public updateKnownVendorContact(entity: any) {
    return this.apiServ.put("vms/knownContact/updateContact", entity);
  }

  SaveOrUpdateKnownUpdateContact (entity: any, action: 'edit-known-vendor-contact' | 'add-known-vendor-contact'){
    return action === 'edit-known-vendor-contact' ? this.updateKnownVendorContact(entity): this.saveKnownVendorContact(entity);
  }

  getAllKnownVendorContacts(entity: any) {
    return this.apiServ.post("vms/knownContact/all", entity);
  }

  getKnownVendorContactById(id: number) {
    return this.apiServ.get(`vms/knownContact/getById/${id}`);
  }

  deleteKnownVendorContact(id: number) {
    return this.apiServ.delete(`vms/knownContact/deleteById/${id}`);
  }
  geth1bemployeedata(payload:any){
    return this.apiServ.post(`vms/H1BDataHub/all`,payload)
  }
   employeeh1bimport(payload: FormData, userid: number) {
  return this.apiServ.post(`vms/H1BDataHub/uploadExcel/${userid}`, payload);
}

}
