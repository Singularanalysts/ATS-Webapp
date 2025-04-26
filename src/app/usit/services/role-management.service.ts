import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {

  private apiServ = inject(ApiService);


  /**************ROLES SERVICES -  STARTS************* */
  // roles management
  //register role
  addRole(entity: any,companyId:any) {
    return this.apiServ.post(`auth/roles/save/${companyId}`, entity);
  }

  //used for get one resource
  getRoleById(id: number) {
    return this.apiServ.get("auth/roles/getrole/" + id);
  }

  //update role
  updateRole(entity: any,companyId:any) {
    return this.apiServ.put(`auth/roles/updaterole/${companyId}`, entity);
  }
  // get all roles
  getAllRoles() {
    return this.apiServ.get("auth/roles/all");
  }

  getAllRolesBasedOnCompanyWise(company: any) {
    return this.apiServ.get("auth/roles/all/"+company);
  }

  getAllRolesBasedOnCompanyWiseWithCompany(companyid: any) {
    return this.apiServ.get("auth/roles/allRoles/"+companyid);
  }

  // get roles based on page num
  getRolesBasedOnPageNum(page: any, size: any) {
    return this.apiServ.get("auth/roles/all2/"+page+"/"+size);
  }

  // delete role companywise
  deleteRoleCompanyWise(id: number) {
    return this.apiServ.delete("auth/roles/delete/"+id);
  }

  //used for delete the resource
  updateRoleStatus(entity: any) {
    return this.apiServ.patch("auth/roles/status", entity);
  }

  // add or update role bases on action edit => update; add=> add
  addOrUpdateRole(entity: any, action: string,companyId:any){
    return action === "update-role" ? this.updateRole(entity,companyId) : this.addRole(entity,companyId);
  }
  /**************ROLES SERVICES -  ENDS************* */

}
