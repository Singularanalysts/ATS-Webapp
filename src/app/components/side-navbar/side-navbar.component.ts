import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ApiService } from 'src/app/core/services/api.service';
import { PrivilegesService } from 'src/app/services/privileges.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent implements OnInit, AfterViewInit {
  menuList: any[] = [];
  @ViewChildren(MatExpansionPanel)
  childMenus!: QueryList<MatExpansionPanel>;
  private apiServ = inject(ApiService);
  protected privilegeServ = inject(PrivilegesService);
  department : any;
  role : any;
  ngOnInit(): void {
    this.department  = localStorage.getItem('department');
    this.role  = localStorage.getItem('role');
// role
    //Super Administrator
    //Recruiting

    // 'Administration',
    // 'Recruiting',
    // 'SoftWare',
    // 'Bench Sales',
    // 'Sourcing',
    // 'Dom Recruiting',
    // 'Accounts',
    // 'Guest',

//     Super Administrator 
// Administrator 
// Sales Manager 
// Recruiting Manager 
// Team Leader Sales 
// Team Leader Recruiting 
// Sales Executive 
// Recruiter 
// Guest 
// OPT Recruiter 
// Developer 
// HR Manager 
    if(this.role=='Super Administrator' || this.role=='HR Manager'){
      this.getSideNavData('assets/side-navbar-Super-Admin.json')
    }
    else if (this.role=='Administrator'  || this.department=='SoftWare' || this.department=='Software'){
      this.getSideNavData('assets/side-navbar-Admin.json')
    }
    else if(this.role=='Sales Manager'){
      this.getSideNavData('assets/side-navbar-sales-manager.json')
    }
    else if (this.role=='Recruiting Manager'){
      this.getSideNavData('assets/side-navbar-recruiting-manager.json')
    }

    else if ( (this.role=='Team Leader Recruiting' || this.role=='Recruiter') && (this.department == 'Recruiting')){
      this.getSideNavData('assets/side-navbar-recruiting-items.json')
    }

    else if ( (this.role=='Team Leader Sales' || this.role=='Sales Executive') && (this.department == 'Bench Sales')){
      this.getSideNavData('assets/side-navbar-sales-items.json')
    }

    else if (this.department=='Sourcing'){
      this.getSideNavData('assets/side-navbar-sourcing-items.json')
    }
    else{
      this.getSideNavData('assets/side-navbar-Super-Admin.json')
    }

/*
    if(this.department == 'Dom Recruiting'){
      this.getSideNavData('assets/side-navbar-items.json')
    }
    else if(this.department == 'Sourcing' ){
      this.getSideNavData('assets/side-navbar-sourcing-items.json')
    }
    else if(this.department == 'Bench Sales' ){
      this.getSideNavData('assets/side-navbar-sales-items.json')
    }
    else if(this.department == 'Recruiting' ){
      this.getSideNavData('assets/side-navbar-recruiting-items.json')
    }
    else if(this.department == 'Dom Recruiting' ){
      this.getSideNavData('assets/side-navbar-dom-items.json')
    }

    // else if(this.department == 'Accounts' ){
    //   this.getSideNavData('assets/side-navbar-accounts-items.json')
    // }
    else{
      this.getSideNavData('assets/side-navbar-accounts-items.json')
    }
    */
  }

  private getSideNavData(path:string) {
    // 'Administration',
    // 'Recruiting',
    // 'SoftWare',
    // 'Bench Sales',
    // 'Sourcing',
    // 'Accounts',
    // 'Guest',

    this.apiServ.getJson(path).subscribe({
      next: (data: any[]) => {
       this.privilegeServ.menuList = data;
        // let indexOfSideNavItem: number = 0;
        // if(!this.privilegeServ.hasPrivilege('LIST_EMPLOYEE')){
        //   indexOfSideNavItem = data.indexOf((item:any) => item.text === "Employees")
        // }
        // else if(!this.privilegeServ.hasPrivilege('LIST_ROLES')){
        //   indexOfSideNavItem = data.indexOf((item:any) => item.text.includes("Roles"));
        // }

        // if(indexOfSideNavItem >=0){
        //   this.privilegeServ.menuList.splice(indexOfSideNavItem, 1)
        // }
      },
    });
  }

  ngAfterViewInit(): void {
    this.childMenus.changes.subscribe(() => {
      this.childMenus.toArray().forEach((panel) => {
        panel.expandedChange.subscribe((expanded) => {
          if (expanded) {
            this.closeOtherChildMenus(panel);
          }
        });
      });
    });
  }

  closeOtherChildMenus(expandedPanel: MatExpansionPanel): void {
    this.childMenus.toArray().forEach((panel) => {
      if (panel !== expandedPanel && panel.expanded) {
        panel.close();
      }
    });
  }
}
