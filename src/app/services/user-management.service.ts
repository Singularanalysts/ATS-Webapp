import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Employee } from '../usit/models/employee';
import { Observable, map } from 'rxjs';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  // private baseUrl = "http://69.216.19.140:8080/usit/";
  //private baseUrl = "http://localhost:1122/";
  private apiServ = inject(ApiService);
  constructor(private http: HttpClient) { }

  // login controller signin method
  login(user: Partial<Employee>): Observable<any> {
    return this.http.post<any>(this.apiServ.apiUrl + 'auth/login/signin', user,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).pipe(map((resp) => {
        return resp;
      }));
  }

  // loginv2


  getUserName(): string {
    const userName = localStorage.getItem('userName');
    return userName !== null ? userName : ''
  }

  /**************ROLES SERVICES -  STARTS************* */
  // roles management
  //register role
  addRole(entity: any) {
    return this.apiServ.post("auth/roles/save", entity);
  }

  //used for get one resource
  getRoleById(id: number) {
    return this.apiServ.get("auth/roles/getrole/" + id);
  }

  //update role
  updateRole(entity: any) {
    return this.apiServ.put("auth/roles/updaterole", entity);
  }
  // get all roles
  getAllRoles() {
    return this.apiServ.get("auth/roles/all");
  }

  // delete role
  deleteRole(id: number) {
    return this.apiServ.delete("auth/roles/delete/" + id);
  }
  //used for delete the resource
  updateRoleStatus(entity: any) {
    return this.http.patch(this.apiServ.apiUrl + "auth/roles/status", entity);
  }
  /**************ROLES SERVICES -  ENDS************* */

  /*** EMPOLOYEE SERVICES _ START */
   //employee management
  getRolesDropdown() {
    return this.http.get(this.apiServ.apiUrl + "auth/users/getroles");
  }

  getManagerDropdown() {
    return this.http.get(this.apiServ.apiUrl + "auth/users/manageDropDown");
  }

  getTLdropdown(id: number) {
    return this.http.get(this.apiServ.apiUrl + "auth/users/TlDropDown/" + id);
  }

  //register EMployee
  registerEmployee(entity: any) {
    return this.http.post(this.apiServ.apiUrl + "auth/users/save", entity)

  }
  //used for get the resource
  getAllEmployees() {
    return this.http.get(this.apiServ.apiUrl + "auth/users/all");
  }

  deleteEmployeeById(id: number) {
    return this.http.delete(this.apiServ.apiUrl + "auth/users/delete/" + id);
  }

  //used for delete the resource
  changeEmployeeStatus(entity: any) {
    return this.http.patch(this.apiServ.apiUrl + "auth/users/status", entity);
  }
  //used for delete the resource
  unlockEmployee(entity: any) {
    return this.http.patch(this.apiServ.apiUrl + "auth/users/unlock", entity);
  }
  //used for get one resource
  getEmployeeById(id: number) {
    return this.http.get(this.apiServ.apiUrl + "auth/users/userbyid/" + id);
  }

  //used for get one resource
  getEmployeeInfoById(id: number) {
    return this.http.get(this.apiServ.apiUrl + "auth/users/userinfo/" + id);
  }
  //Update Employee
  public updateEmployee(entity: any) {
    return this.http.put(this.apiServ.apiUrl + "auth/users/update", entity);
  }

   //Update Employee
   public getAllTLBench() {
    return this.http.get(this.apiServ.apiUrl + "auth/users/teamleads");
  }
  /** EMPLOYEE SERVICES - END */
}
