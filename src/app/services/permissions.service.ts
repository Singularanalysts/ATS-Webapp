import { Injectable,inject } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { Employee } from '../usit/models/employee';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PrivilegesService } from './privileges.service';
import { RoleService } from './role.service';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  isUserLoggedIn: boolean = false;
  user = new Employee();
  selectedRoles: string[] = [];
  id!: any;
  // private baseUrl = "http://69.216.19.140:8080/usit/";
  //private baseUrl = "http://localhost:1122/auth/";
  private apiServ = inject(ApiService);

  private userPrivileges: PrivilegesService[] = [];
 // private baseUrl: any = environment.API_BASE_URL;
  constructor(private route: ActivatedRoute, private router: Router, private service: RoleService
    , private http: HttpClient) {
  }

  isAdmin(userRole: string): Observable<boolean> {
    return of(userRole === 'Admin');
  }

  isLoggedIn(): Observable<boolean> {
    return of(false);
  }
  isLoggedOut() :  Observable<boolean>{
    return of(false);
  }

  login(user: any) {
    this.isUserLoggedIn = true;
    localStorage.setItem('userName', user.fullname);
    //localStorage.setItem('token', 'HTTP_TOKEN ' + user.token);
    localStorage.setItem('token', 'Bearer ' + user.token);
    localStorage.setItem('role', user.roles);
    localStorage.setItem('department', user.department);
    localStorage.setItem('userid', user.userid);
    localStorage.setItem('designation', user.designation);
    localStorage.setItem('privileges', user.rolePrivileges);
    //this.setUserPrivileges(user.rolePrivileges);
    //rolePrivileges
    this.id = user.roleno;



    return of(this.isUserLoggedIn).pipe(
      delay(1000),
      tap(val => {
      })
    );
  }
  setUserPrivileges(privileges: PrivilegesService[]): void {
    this.userPrivileges = privileges;
  }

  hasPrivilege(privilege: string) {
    this.userPrivileges.forEach((e: any) => {
      if (e.includes(privilege)) {
        return true;
      }
      else {
        return false;
      }
    });
    // return this.userPrivileges.includes(privilege);
  }
  logout(): void {
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('roleno');
    localStorage.removeItem('userid');
    localStorage.removeItem('department');
    localStorage.removeItem('designation');
    localStorage.removeItem('rnum');
    localStorage.removeItem('vnum');
    localStorage.removeItem('privileges');

  }
  signout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userid');
    localStorage.removeItem('roleno');
    localStorage.removeItem('department');
    localStorage.removeItem('designation');
    localStorage.removeItem('rnum');
    localStorage.removeItem('vnum');
    localStorage.removeItem('privileges');
    //alertify.warning("Token expired please login");
    this.router.navigate(['/']);
    //this.router.navigateByUrl('signin');
  }

  isUserSignedin() {
    return localStorage.getItem('token') !== null;
  }

  getSignedinUser() {
    return localStorage.getItem('user') as string;
  }

  getToken() {
    return localStorage.getItem('token') as string ;
  }

  logOut() {
    const userId = localStorage.getItem('userid');
    return this.http.get(this.apiServ.apiUrl + "auth/login/logout/" + userId);
  }

  getCurrentURL(): string {
    return window.location.pathname;
  }

  sendOtp(email: any) {
    return this.http.post(this.apiServ.apiUrl + "auth/login/forgotPassword", email);
  }

  validateOtp(userId: any, otp: any) {
    return this.http.get(this.apiServ.apiUrl + "auth/login/validate/" + userId + "/"+ otp);
  }
  
  changePassword(value: any) {
    return this.http.post(this.apiServ.apiUrl + "auth/login/change_password", value);
  }

  consultantSendOtp(email: any) {
    return this.http.get(this.apiServ.apiUrl + "auth/conLogin/emailVerification/" + email);
  }

  consultantValidateOtp(userId: any, otp: any) {
    return this.http.get(this.apiServ.apiUrl + "auth/conLogin/validateOtp/" + userId + "/"+ otp);
  }

  consultantRegistration(consultantdata: any) {
    return this.http.post(this.apiServ.apiUrl + "auth/conLogin/consultantRegistration", consultantdata);
  }
  getsubmission(){
    return this.http.get(this.apiServ.apiUrl + "submission/getAll")
  }
// In your submission.service.ts
updatesubmission(id: number, status: string) {
  return this.http.put(this.apiServ.apiUrl + `submission/updateSubmission/${id}/${status}`, {});
}

}
