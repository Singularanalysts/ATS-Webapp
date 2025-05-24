import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {

  private apiServ = inject(ApiService);
   /*** EMPOLOYEE SERVICES _ START */
   //employee management
   getRolesDropdown(companyId:any) { 
    return this.apiServ.get(`auth/roles/getroles/${companyId}`);
  }

  getCompaniesDropdown() {
    return this.apiServ.get("auth/company/getCompanysDropDown");
  }

  getManagerDropdown() {
    return this.apiServ.get("auth/users/manageDropDown");
  }

  getValidDateCompanyGiven(companyid:any) {
    return this.apiServ.get("auth/users/companyCheck/"+companyid);
  }

  getTLdropdown(id: number) {
    return this.apiServ.get("auth/users/TlDropDown/" + id);
  }

  //register EMployee
  registerEmployee(entity: any) {
    return this.apiServ.post("auth/users/save", entity)

  }
  //used for get the resource
  getAllEmployees(status: any, companyid:any) {
    return this.apiServ.get(`auth/users/all/${status}`);
  }

  deleteEmployeeById(id: number) {
    return this.apiServ.delete("auth/users/delete/" + id);
  }

  //used for delete the resource
  changeEmployeeStatus(entity: any) {
    return this.apiServ.patch("auth/users/status", entity);
  }
  //used for delete the resource
  unlockEmployee(entity: any) {
    return this.apiServ.patch("auth/users/unlock", entity);
  }
  //used for get one resource
  getEmployeeById(id: number) {
    return this.apiServ.get("auth/users/userbyid/" + id);
  }

  //used for get one resource
  getEmployeeInfoById(id: number) {
    return this.apiServ.get("auth/users/userinfo/" + id);
  }
  //Update Employee
  public updateEmployee(entity: any) {
    return this.apiServ.put("auth/users/update", entity);
  }

   //Update Employee
   public getAllTLBench() {
    return this.apiServ.get("auth/users/teamleads");
  }

  addOrUpdateEmployee(entity: any, action: string){
   return action === "edit-employee" ? this.updateEmployee(entity) : this.registerEmployee(entity);
  }

  emailDuplicateCheck(email: any,companyId: any) {
    return this.apiServ.get(`auth/users/validate/${email}/${companyId}`);
  }

  /** EMPLOYEE SERVICES - END */

  //FILES UPLOAD
  
}
