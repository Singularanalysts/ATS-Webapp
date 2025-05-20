import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PrivilegesService {
  menuList: any[] = []
  private apiServ = inject(ApiService);
  private privileges: string[] = [];

  setPrivileges(privileges: string[]): void {
    this.privileges = privileges;
  }

  getPrivileges(): string[] {
    return this.privileges;
  }

  // for registering privilages
  public registerprevilage(entity: any) {
    return this.apiServ.post("auth/priviliges/savePrevileges", entity);
  }

  getAllPrivileges() {
    return this.apiServ.get("auth/priviliges/getPrivileges");
  }

  getAllPrivilegeCardsByCompany(company: any) {
    return this.apiServ.get("auth/priviliges/getByCompany/"+company);
  }

  getCompanysDropDown() {
    return this.apiServ.get("auth/company/getCompanysDropDown");
  }

  getPrivilegesById(roleId: number,companyId:any) {
    return this.apiServ.get("auth/priviliges/getPrivilegesById/" + roleId+"/"+companyId);
  }


  addPrevilegeToRole(entity: any ) {
    return this.apiServ.post(`auth/priviliges/addprevtorole`, entity);
  }

  addPrevilegeToRoles(entity: any) {
    return this.apiServ.put("auth/priviliges/update", entity);
  }

addratings(payload:any){
  return this.apiServ.post("report/rating/saveRatings",payload)
}
getratingsbyId(id:any){
  return this.apiServ.get ("report/rating/getRatingsbyid/" +id)
}
  hasPrivilege(priv: string): boolean {
    let privilagesArr: string[] = [];
    const arr = localStorage.getItem('privileges');
    if (arr && arr.length) {
       privilagesArr = arr.split(',');
    }
    return privilagesArr.includes(priv);
  }
 getRateddata(payload:any, companyId:any){
  return this.apiServ.post(`report/rating/getRatings/${companyId}`,payload)
 }
 deleteRating(id:any){
  return this.apiServ.delete("report/rating/deleteRatings/" + id)
 }
 getdropdownmanager(id:any, companyId: any){
  return this.apiServ.get("report/rating/getTlsDropdown/" +id + "/" +companyId)
 }
 getdropdownexecutive(tlId:any){
  return this.apiServ.get("report/rating/getExicutivesDropdown/" +tlId)

 }
 getPerformanceRatings(data:any, companyId:any){
  return this.apiServ.get("report/rating/getBestPerformer/" + data+"/"+companyId)
 }
}
