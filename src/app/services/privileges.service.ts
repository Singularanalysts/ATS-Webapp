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
    return this.apiServ.get("auth/priviliges/getPrivileges/");
  }

  getPrivilegesById(roleId: number) {
    return this.apiServ.get("auth/priviliges/getPrivilegesById/" + roleId);
  }

  addPrevilegeToRole(entity: any) {
    return this.apiServ.post("auth/priviliges/addprevtorole", entity);
  }

  hasPrivilege(priv: string): boolean {
    let privilagesArr: string[] = [];
    const arr = localStorage.getItem('privileges');
    if (arr && arr.length) {
       privilagesArr = arr.split(',');
    }
    return privilagesArr.includes(priv);
  }

}
