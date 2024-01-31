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

  ngOnInit(): void {
    this.getSideNavData()
  }

  private getSideNavData() {
    this.apiServ.getJson('assets/side-navbar-items.json').subscribe({
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
