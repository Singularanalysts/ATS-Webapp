import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private baseUrl = "http://69.216.19.140:8080/usit/";
  //private baseUrl = "http://localhost:8090/usit/";
 // private baseUrl: any = environment.API_BASE_URL;
  constructor(private http: HttpClient) { }

  //register vms
  // public dummy(entity: any) {
  //   return this.http.post(this.baseUrl + "city/save", entity);
  // }
  /// previllages //

  //register priviliges
  public registerprevilage(entity: any) {
    return this.http.post(this.baseUrl + "priviliges/savePrevileges", entity);
  }

  //

  //used for get one resource
  getprivilegesbyid(roleId: number) {
    return this.http.get(this.baseUrl + "priviliges/getPrivilegesById/" + roleId);
  }

  getallprivilages() {
    return this.http.get(this.baseUrl + "priviliges/getPrivileges/");
  }

  public restapi(entity: any) {
    return this.http.post(this.baseUrl + "priviliges/addprevtorole", entity);
  }

  public dummy() {
    return this.http.get(this.baseUrl + "priviliges/all");
  }

}
