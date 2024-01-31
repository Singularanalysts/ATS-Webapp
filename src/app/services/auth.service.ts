import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../usit/models/employee';
import { PrivilegesService } from './privileges.service';
import { RoleService } from './role.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUserLoggedIn: boolean = false;
  user = new Employee();
  selectedRoles: string[] = [];
  id!: any;
  private baseUrl = "http://69.216.19.140:8080/usit/";

  private userPrivileges: PrivilegesService[] = [];
 // private baseUrl: any = environment.API_BASE_URL;
  constructor(private route: ActivatedRoute, private router: Router, private service: RoleService
    , private http: HttpClient) {
  }
  login(user: any) {
    // console.log("authentication " + JSON.stringify(user))
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
        //console.log("Is User Authentication is successful: " + val);
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
    let token = localStorage.getItem('token') as string;
    return token;
  }

  logoutget(id: any) {
    return this.http.get(this.baseUrl + "login/logout/" + id);
  }
}
