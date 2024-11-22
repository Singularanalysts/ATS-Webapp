import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, inject } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { RoleManagementService } from 'src/app/usit/services/role-management.service';

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
  protected roleManagementServ= inject(RoleManagementService);
  department: any;
  role: any;
  cardPvis: string[] = [];
  myarra: never[] | undefined;
  roleNames: string[] = [];
  menuData: any[] = [];

  ngOnInit(): void {
    this.department = localStorage.getItem('department');
    this.role = localStorage.getItem('role');
    const cardPriv= localStorage.getItem('cardPrivileges');
   
       // Call the method that returns the Observable
      //  this.getRoles().subscribe({
      //   next: (roles: string[]) => {
      //     if(this.role===roles){
      //       alert("inside role match========="+this.role +" "+this.role);
      //        this.getSideNavData('assets/For-testing.json');
      //     }
      //   },
      //   error: (err) => {
      //     alert('Failed to fetch roles');
      //   }
      // });

    if (this.role==="Super Administrator" && this.department === 'SoftWare') {

      
      // alert("First===========");
      this.myRoles();
      // this.getSideNavData1('assets/For-testing.json');
    }
    else if (this.role=='Administrator' || this.department=='SoftWare' || this.department=='Software'){
      this.myRoles();
      // this.getSideNavData('assets/For-testing.json')
    }
    else if(this.department=='DomRecruiting'){
      this.myRoles();
      // this.getSideNavData('assets/For-testing.json')
    }
    else if(this.role=='Sales Manager'){
      this.myRoles();
      // this.getSideNavData('assets/For-testing.json')
    }
    else if (this.role=='Recruiting Manager'){
      this.myRoles();
      // this.getSideNavData('aassets/For-testing.json')
    }
    else if ( (this.role=='Team Leader Recruiting' || this.role=='Recruiter') && (this.department == 'Recruiting')){
      this.myRoles();
      // this.getSideNavData('assets/For-testing.json')
    }
    else if ( (this.role=='Team Leader Sales' || this.role=='Sales Executive') && (this.department == 'Bench Sales')){
      this.myRoles();
      // this.getSideNavData('assets/For-testing.json')
    }
    else if (this.department=='Sourcing'){
      this.myRoles();
      // this.getSideNavData('assets/For-testing.json')
    }
    else{
      this.myRoles();
      // this.getSideNavData('assets/For-testing.json')
    }

  }

superAdmin(){



  


}



myRoles(){
  // alert("second===========");
  this.getRoles().subscribe({
    next: (roles: string[]) => {
  this.roleNames = roles;  
      // console.log(this.roleNames);  
      
      const formattedRoleNames = this.roleNames.map(role => `"${role}"`).join(', ');

      this.updateMenuRoles(formattedRoleNames);
    },
    error: (err) => {
    }
  });
}

   // This method now returns an Observable of string[]
   getRoles(): Observable<string[]> {
    return this.roleManagementServ.getAllRoles().pipe(
      map((response: any) => response.data.map((role: any) => role.rolename))
    );
  }

  updateMenuRoles(formattedRoleNames: string) {
    const menuData = [
      {
        "test": "DASHBOARD",
        "text": "Dashboard",
        "icon": "dashboard",
        "routerLink": "/usit/dashboard",
        "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
      },
      {
        "test": "SEARCH",
        "text": "Search",
        "icon": "search",
        "routerLink": "/usit/search",
        "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
      },
      {
        "test": "VMS",
        "text": "VMS",
        "icon": "work",
        "routerLink": "",
        "children": [
          {
            "test": "VENDOR",
            "text": "Vendor",
            "icon": "group",
            "routerLink": "/usit/vendors",
            "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
          },
          {
            "test": "RECRUITER",
            "text": "Recruiters",
            "icon": "business_center",
            "routerLink": "/usit/recruiters",
            "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
          },
          {
            "test": "Blacklisted Companies",
            "text": "Blacklisted Companies",
            "icon": "block",
            "routerLink": "/usit/blacklisted-companies",
            "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
          },
          {
            "test": "Current Primary Vendor",
            "text": "Current Primary Vendor",
            "icon": "group",
            "routerLink": "/usit/current-primary-vendor",
            "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
          },
          {
            "test": "Future Primary Vendor",
            "text": "Future Primary Vendor",
            "icon": "group",
            "routerLink": "/usit/future-primary-vendor",
            "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
          },
          {
            "test": "Know Vendor Contacts",
            "text": "Known Contacts",
            "icon": "group",
            "routerLink": "/usit/known-contacts",
            "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
          }
        ]
      },
      {
        "test": "MASS_MAILING",
        "text": "Mass Mailing",
        "icon": "mail",
        "routerLink": "/usit/mass-mailing",
        "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
      },
      {
        "test": "TECHNOLOGY_TAG",
        "text": "Technology Tags",
        "icon": "build",
        "routerLink": "/usit/technology-tag",
        "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
      },
      {
        "test": "TECH_SUPPORT",
        "text": "Tech & Support",
        "icon": "build",
        "routerLink": "/usit/list-techsupport",
        "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
      }, 
      {
        "test": "PEOPLE",
        "text": "People",
        "icon": "groups",
        "children": [
          {
            "test": "Active",
            "text": "Active",
            "icon": "check_circle",
            "routerLink": "/usit/active",
            "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
          },
          {
            "test": "Leave of Absence",
            "text": "Leave of Absence",
            "icon": "event_busy",
            "routerLink": "/usit/leave-of-absence",
            "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
          },
          {
            "test": "Terminated",
            "text": "Terminated",
            "icon": "cancel",
            "routerLink": "/usit/terminated",
            "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
          }
        ]
      },
      {
        "test": "USER",
        "text": "Employees",
        "icon": "people",
        "routerLink": "/usit/employees",
        "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
      },
      {
        "test": "H_TRANSFER",
        "text": "H1 Transfer",
        "icon": "people",
        "routerLink": "/usit/h1transfer",
        "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
      },
      {
        "test": "PRESALES",
        "text": "Pre-sales",
        "icon": "local_offer",
        "routerLink": "/usit/pre-sales",
        "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
      },
    {
      "test": "SOURCING",
      "text": "Sourcing",
      "icon": "local_offer",
      "children": [
        {
          "test": "Sourcing",
          "text": "Sourcing",
          "icon": "flash_on",
          "routerLink": "/usit/sourcing",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "Pursuing",
          "text": "Pursuing",
          "icon": "person",
          "routerLink": "/usit/pursuing",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "OnBoarding",
          "text": "OnBoarding",
          "icon": "assignment",
          "routerLink": "/usit/onboarding",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "Closures",
          "text": "Closures",
          "icon": "check_circle",
          "routerLink": "/usit/sourcing-closures",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        }
      ]
    },
    {
      "test": "SALES",
      "text": "Sales",
      "icon": "attach_money",
      "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  ,
      "children": [
        {
          "test": "Hot List",
          "text": "Hot List",
          "icon": "flash_on",
          "routerLink": "/usit/hot-list",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "Consultant",
          "text": "Consultants",
          "icon": "person",
          "routerLink": "/usit/sales-consultants",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "SUBMISSION",
          "text": "Submissions",
          "icon": "assignment",
          "routerLink": "/usit/sales-submissions",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "INTERVIEW",
          "text": "Interviews",
          "icon": "chat_bubble_outline",
          "routerLink": "/usit/sales-interviews",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        }
        ,
    
    {
      "text": "Recruitment",
      "icon": "business",
      "children": [
        {
          "text": "Requirements",
          "icon": "assignment_turned_in",
          "routerLink": "/usit/rec-requirements"
        },
        {
          "text": "Consultants",
          "icon": "person_search",
          "routerLink": "/usit/rec-consultants"
        },
        {
          "text": "Submissions",
          "icon": "assignment",
          "routerLink": "/usit/rec-submissions"
        },
        {
          "text": "Interviews",
          "icon": "chat_bubble_outline",
          "routerLink": "/usit/rec-interviews"
        },
        {
          "text": "Closures",
          "icon": "check_circle",
          "routerLink": "/usit/rec-closures"
        }
      ]
    },
    {
      "text": "Dom Recruitment",
      "icon": "business",
      "children": [
        {
          "text": "Requirements",
          "icon": "assignment_turned_in",
          "routerLink": "/usit/dom-requirements"
        },
        {
          "text": "Consultants",
          "icon": "person_search",
          "routerLink": "/usit/dom-consultants"
        },
        {
          "text": "Submissions",
          "icon": "assignment",
          "routerLink": "/usit/dom-submission"
        },
        {
          "text": "Interviews",
          "icon": "chat_bubble_outline",
          "routerLink": "/usit/dom-interview"
        },
        {
          "text": "Closures",
          "icon": "check_circle",
          "routerLink": "/usit/dom-closures"
        }
      ]
    },
        {
          "test": "Closures",
          "text": "Closures",
          "icon": "check_circle",
          "routerLink": "/usit/sales-closures",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        }
      ]
    },
    {
      "test": "ONBOARDING",
      "text": "OnBoarding",
      "icon": "business",
      "children": [
        {
          "test": "Employment Contact",
          "text": "Employement Contract",
          "icon": "assignment_turned_in",
          "routerLink": "/usit/employement-contract",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "Tax Documents",
          "text": "Tax Documents",
          "icon": "person_search",
          "routerLink": "/usit/tax-documents",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "Offer benefits package",
          "text": "Offer Benefits Package",
          "icon": "assignment",
          "routerLink": "/usit/offer-benefits-package",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "set up payroll",
          "text": "Set Up Payroll",
          "icon": "chat_bubble_outline",
          "routerLink": "/usit/set-up-payroll",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        }
      ]
    },
        {
          "test": "OPEN_REQUIREMENTS",
          "text": "Open Requirements",
          "icon": "work",
          "children": [
            {
              "test": "Portal Requirements",
              "text": "Portal Requirements",
              "icon": "group",
              "routerLink": "/usit/portalreqs",
              "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
            },
            {
              "test": "cpv portal requirements",
              "text": "CPV Portal Requirements",
              "icon": "group",
              "routerLink": "/usit/cpv-portal-requirements",
              "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
            },
            {
              "test": "Fpv Portal Requirements",
              "text": "FPV Portal Requirements",
              "icon": "group",
              "routerLink": "/usit/fpv-portal-requirements",
              "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
            },
            {
              "test": "Rss",
              "text": "RSS",
              "icon": "business_center",
              "routerLink": "/usit/rssfeed",
              "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
            },
            {
              "test": "Email Extraction",
              "text": "Email Extraction",
              "icon": "business_center",
              "routerLink": "/usit/email-extraction-list",
              "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
            }
          ]
        },
      {
        "test": "OPEN_REQS_JOB_APPLICATION",
        "text": "Openreqs Job Applications",
        "icon": "view_carousel",
        "routerLink": "/usit/openreqs-job-applications",
        "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
      },
      {
        "test": "TALENT_POOL",
        "text": "Talent Pool",
        "icon": "business_center",
        "routerLink": "/usit/linkedinprofiles",
        "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
      },
      {
        "test": "VC_CX_PROFILES",
        "text": "VC-CX Profiles",
        "icon": "badge",
        "routerLink": "/usit/vc-cx-profiles",
        "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
      },
    {
      "test": "TALENT_ACQUISITION",
      "text": "Talent Acquisition",
      "icon": "person_search",
      "children": [
        {
          "test": "Hot List Providers",
          "text": "Hot List Providers",
          "icon": "groups",
          "routerLink": "/usit/hot-list-providers",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        }
      ]
    },
      {
        "test": "ROLE",
          "text": "Roles - Privileges",
          "icon": "assignment_ind",
          "routerLink": "/usit/roles",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "REPORTS",
          "text": "Reports",
          "icon": "reports",
          "children": [
            {
              "test": "Employee Reports",
              "text": "Employees Reports",
              "icon": "assignment_ind",
              "routerLink": "/usit/employee-report",
              "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
            },
            {
              "test": "Sourcing Reports",
              "text": "Sourcing Reports",
              "icon": "dynamic_feed",
              "routerLink": "/usit/sourcing-report",
              "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
            },
            {
              "test": "Open Reqs Reports",
              "text": "Open Reqs Reports",
              "icon": "dynamic_feed",
              "routerLink": "/usit/open-reqs-report",
              "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
            },
            {
              "test": "Banter Reports",
              "text": "Banter Reports",
              "icon": "fax",
              "routerLink": "/usit/banter-report",
              "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
            },
            {
              "test": "Candidate Reports",
              "text": "Candidate Reports",
              "icon": "contact_page",
              "routerLink": "/usit/candidate-reports",
              "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
            }
          ]
        },
    {
      "test": "MASTERS",
      "text": "Masters",
      "icon": "extension",
      "children": [
        {
          "test": "Visa",
          "text": "Visa",
          "icon": "credit_card",
          "routerLink": "/usit/visa",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "Qualification",
          "text": "Qualification",
          "icon": "school",
          "routerLink": "/usit/qualification",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "Companies",
          "text": "Companies",
          "icon": "business",
          "routerLink": "/usit/companies",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        }
      ]
    },
    {
      "test": "BILLPAY",
      "text": "Bill Pay",
      "icon": "account_balance",
      "children": [
        {
          "test": "Purchase orders",
          "text": "Purchase Orders",
          "icon": "request_page",
          "routerLink": "/billpay/purchase-orders",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "invoices",
          "text": "Invoices",
          "icon": "description",
          "routerLink": "/billpay/invoices",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        },
        {
          "test": "receipts",
          "text": "Receipts",
          "icon": "receipt",
          "routerLink": "/billpay/receipts",
          "roles":["Super Administrator", "Administrator", "Sales Manager", "Recruiting Manager","Team Leader Sales", "Team Leader Recruiting", "Sales Executive"]  
        }
      ]
    }
        
    ];

    // Replace static roles with dynamic roles
    // menuData.forEach(item => {
    //   item.roles = formattedRoleNames.split(', ').map(role => role.replace(/"/g, ''));
   
    // });

     // Replace static roles with dynamic roles
  menuData.forEach(item => {
    
    // For the item itself, assign roles if no children exist
  //   if (!item.children || !Array.isArray(item.children)) {
  //     item.roles = formattedRoleNames.split(', ').map(role => role.replace(/"/g, ''));
  //   }

  menuData.forEach(item => {
      item.roles = formattedRoleNames.split(', ').map(role => role.replace(/"/g, ''));
      // alert("parent roles dynamic==="+JSON.stringify(item.roles) +" " +item.text);
    });

     // If item has children, assign roles to children
     if (item.children && Array.isArray(item.children)) {
      let myno=0;
      item.children.forEach((child: any) => {
        item.children[myno].roles = formattedRoleNames.split(', ').map(role => role.replace(/"/g, ''));
        // alert("child roles dynamic==="+JSON.stringify(child.roles) +" "+item.children[myno].roles +" "+item.children[myno].test);
        myno=myno+1;
      });
    }

  });

    this.menuData = menuData;
    // console.log("Lak final data-----------"+JSON.stringify(this.menuData));
    this.getSideNavData(this.menuData);
  }

  private getSideNavData(path: any) {
    // Clear the menuList before populating it
    this.menuList = [];
  
    // Get card privileges from local storage and split into an array
    const cardPriv = localStorage.getItem('privileges');
    const cardPrivArray = cardPriv ? cardPriv.split(',').map(item => item.trim()) : [];
  
    // Recursive function to filter menus and their children based on roles and privileges
    const filterMenuItems = (menuItems: any[]) => {
      return menuItems.filter((item: any) => {
        // Check if the item satisfies the role and privileges condition
        const isRoleValid = item.roles.includes(this.role!);
        const isPrivilegeValid = cardPrivArray.includes(item.test);
  
        // If the item is valid, check for children
        if (isRoleValid && isPrivilegeValid) {
          // If the item has children, recursively filter the children
          if (item.children && Array.isArray(item.children)) {
            item.children = filterMenuItems(item.children); // Apply filtering recursively on children
          }
          return true; // Include this menu item if it satisfies the conditions
        }
  
        // Exclude this menu item if it does not meet the role or privilege conditions
        return false;
      });
    };
  
    // Apply the recursive filter to the provided menu path
    this.menuList = filterMenuItems(path);
  
    // Assign the filtered menuList to the privileges service
    this.privilegeServ.menuList = this.menuList;
  
    // You can optionally log the filtered menu list to debug
    // console.log('Filtered Menu List:', JSON.stringify(this.menuList));
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
