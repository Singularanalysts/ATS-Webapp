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
  role: any;
  cardPvis: string[] = [];
  myarra: never[] | undefined;
  roleNames: string[] = [];
  menuData: any[] = [];

  ngOnInit(): void {
    
    this.role = localStorage.getItem('role');
    const cardPriv= localStorage.getItem('cardPrivileges')
    this.myRoles();
      
    

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
        "roles":["Super Administrator"]  
      },
      {
        "test": "SEARCH",
        "text": "Search",
        "icon": "search",
        "routerLink": "/usit/search",
        "roles":["Super Administrator"]  
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
            "roles":["Super Administrator"]  
          },
          {
            "test": "RECRUITER",
            "text": "Recruiters",
            "icon": "business_center",
            "routerLink": "/usit/recruiters",
            "roles":["Super Administrator"]  
          },
          {
            "test": "Blacklisted Companies",
            "text": "Blacklisted Companies",
            "icon": "block",
            "routerLink": "/usit/blacklisted-companies",
            "roles":["Super Administrator"]  
          },
          {
            "test": "Current Primary Vendor",
            "text": "Current Primary Vendor",
            "icon": "group",
            "routerLink": "/usit/current-primary-vendor",
            "roles":["Super Administrator"]  
          },
          {
            "test": "Future Primary Vendor",
            "text": "Future Primary Vendor",
            "icon": "group",
            "routerLink": "/usit/future-primary-vendor",
            "roles":["Super Administrator"]  
          },
          
          {
            "test": "Know Vendor Contacts",
            "text": "Known Contacts",
            "icon": "group",
            "routerLink": "/usit/known-vendor-contacts",
            "roles":["Super Administrator"]  
          },
          {
            "test": "TCVR",
            "text": "TCVR",
            "icon": "handshake",
            "routerLink": "/usit/tcvr",
            "roles":["Super Administrator"]  
          },
          // {
          //   "test": "TCVR",
          //   "text": "H1B Vendors",
          //   "icon": "handshake",
          //   "routerLink": "/usit/h1b-vendor",
          //   "roles":["Super Administrator"]  
          // }
        ]
      },
      {
        "test": "MASS_MAILING",
        "text": "Mass Mailing",
        "icon": "mail",
        "routerLink": "/usit/mass-mailing",
        "roles":["Super Administrator"]  
      },
      {
        "test": "TECHNOLOGY_TAG",
        "text": "Technology Tags",
        "icon": "build",
        "routerLink": "/usit/technology-tag",
        "roles":["Super Administrator"]  
      },
      {
        "test": "TECH_SUPPORT",
        "text": "Tech & Support",
        "icon": "build",
        "routerLink": "/usit/list-techsupport",
        "roles":["Super Administrator"]  
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
            "roles":["Super Administrator"]  
          },
          {
            "test": "Leave of Absence",
            "text": "Leave of Absence",
            "icon": "event_busy",
            "routerLink": "/usit/leave-of-absence",
            "roles":["Super Administrator"]  
          },
          {
            "test": "Terminated",
            "text": "Terminated",
            "icon": "cancel",
            "routerLink": "/usit/terminated",
            "roles":["Super Administrator"]  
          }
        ]
      },
      {
        "test": "USER",
        "text": "Employees",
        "icon": "people",
        "routerLink": "/usit/employees",
        "roles":["Super Administrator"]  
      },
      {
        "test": "H_TRANSFER",
        "text": "H1 Transfer",
        "icon": "people",
        "routerLink": "/usit/h1transfer",
        "roles":["Super Administrator"]  
      },
      {
        "test": "PRESALES",
        "text": "Pre-sales",
        "icon": "local_offer",
        "routerLink": "/usit/pre-sales",
        "roles":["Super Administrator"]  
      },
    // {
    //   "test": "SOURCING",
    //   "text": "Sourcing",
    //   "icon": "local_offer",
    //   "children": [
    //     {
    //       "test": "Sourcing",
    //       "text": "Sourcing",
    //       "icon": "flash_on",
    //       "routerLink": "/usit/sourcing",
    //       "roles":["Super Administrator"]  
    //     },
    //     {
    //       "test": "Pursuing",
    //       "text": "Pursuing",
    //       "icon": "person",
    //       "routerLink": "/usit/pursuing",
    //       "roles":["Super Administrator"]  
    //     },
    //     {
    //       "test": "OnBoarding",
    //       "text": "OnBoarding",
    //       "icon": "assignment",
    //       "routerLink": "/usit/onboarding",
    //       "roles":["Super Administrator"]  
    //     },
    //     {
    //       "test": "Closures",
    //       "text": "Closures",
    //       "icon": "check_circle",
    //       "routerLink": "/usit/sourcing-closures",
    //       "roles":["Super Administrator"]  
    //     }
    //   ]
    // },
    {
      "test": "SALES",
      "text": "Sales",
      "icon": "attach_money",
      "roles":["Super Administrator"]  ,
      "children": [
        {
          "test": "Hot_List",
          "text": "Hot List",
          "icon": "flash_on",
          "routerLink": "/usit/hot-list",
          "roles":["Super Administrator"]  
        },
        {
          "test": "SALES_CONSULTANT",
          "text": "Consultants",
          "icon": "person",
          "routerLink": "/usit/sales-consultants",
          "roles":["Super Administrator"]  
        },
        {
          "test": "SALES_SUBMISSION",
          "text": "Submissions",
          "icon": "assignment",
          "routerLink": "/usit/sales-submissions",
          "roles":["Super Administrator"]  
        },
        {
          "test": "SALES_INTERVIEW",
          "text": "Interviews",
          "icon": "chat_bubble_outline",
          "routerLink": "/usit/sales-interviews",
          "roles":["Super Administrator"]  
        },
        {
          "test": "SALES_CLOSURES",
          "text": "Closures",
          "icon": "check_circle",
          "routerLink": "/usit/sales-closures",
          "roles":["Super Administrator"]  
        },
        {
          "test": "SALES_TRASH_BIN",
          "text": "Submission Trash Bin",
          "icon": "check_circle",
          "routerLink": "/usit/sales-submissionsTrash",
          "roles":["Super Administrator"]  
        }
      ]
    } ,
        {
      "test":"RECRUITMENT",
      "text": "Recruitment",
      "icon": "business",
      "children": [
        {
          "test":"RECRUITING_REQUIREMENT",
          "text": "Requirements",
          "icon": "assignment_turned_in",
          "routerLink": "/usit/rec-requirements",
          "roles":["Super Administrator"] 
        },
        {
          "test":"RECRUITING_CONSULTANT",
          "text": "Consultants",
          "icon": "person_search",
          "routerLink": "/usit/rec-consultants",
          "roles":["Super Administrator"] 
        },
        {
          "test":"RECRUITING_SUBMISSION",
          "text": "Submissions",
          "icon": "assignment",
          "routerLink": "/usit/rec-submissions",
          "roles":["Super Administrator"] 
        },
        {
          "test":"RECRUITING_INTERVIEW",
          "text": "Interviews",
          "icon": "chat_bubble_outline",
          "routerLink": "/usit/rec-interviews",
          "roles":["Super Administrator"] 
        },
        {
          "test":"RECRUITING_CLOSURES",
          "text": "Closures",
          "icon": "check_circle",
          "routerLink": "/usit/rec-closures",
          "roles":["Super Administrator"] 
        },
        {
          "test":"RECRUITING_TRASH_BIN",
          "text": "Submission Trash Bin",
          "icon": "check_circle",
          "routerLink": "/usit/Recruitment-submissionsTrash",
          "roles":["Super Administrator"] 
        }
      ]
    },
    {
      "test": "DOM_RECRUITMENT",
      "text": "Dom Recruitment",
      "icon": "business",
      "children": [
        {
          "test":"DOM_REQUIREMENT",
          "text": "Requirements",
          "icon": "assignment_turned_in",
          "routerLink": "/usit/dom-requirements",
          "roles":["Super Administrator"]  
        },
        {
          "test":"DOM_CONSULTANT",
          "text": "Consultants",
          "icon": "person_search",
          "routerLink": "/usit/dom-consultants",
          "roles":["Super Administrator"]  
        },
        {
          "test":"DOM_SUBMISSION",
          "text": "Submissions",
          "icon": "assignment",
          "routerLink": "/usit/dom-submission",
          "roles":["Super Administrator"]  
        },
        {
          "test":"DOM_INTERVIEW",
          "text": "Interviews",
          "icon": "chat_bubble_outline",
          "routerLink": "/usit/dom-interview",
          "roles":["Super Administrator"]  
        },
        {
          "test":"DOM_CLOSURES",
          "text": "Closures",
          "icon": "check_circle",
          "routerLink": "/usit/dom-closures",
          "roles":["Super Administrator"]  
        },
        {
          "test":"DOM_TRASH_BIN",
          "text": "Submission Trash Bin",
          "icon": "check_circle",
          "routerLink": "/usit/Dom-submissionTrash",
          "roles":["Super Administrator"]  
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
          "roles":["Super Administrator"]  
        },
        {
          "test": "Tax Documents",
          "text": "Tax Documents",
          "icon": "person_search",
          "routerLink": "/usit/tax-documents",
          "roles":["Super Administrator"]  
        },
        {
          "test": "Offer benefits package",
          "text": "Offer Benefits Package",
          "icon": "assignment",
          "routerLink": "/usit/offer-benefits-package",
          "roles":["Super Administrator"]  
        },
        {
          "test": "set up payroll",
          "text": "Set Up Payroll",
          "icon": "chat_bubble_outline",
          "routerLink": "/usit/set-up-payroll",
          "roles":["Super Administrator"]  
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
              "roles":["Super Administrator"]  
            },
            {
              "test": "Portal Requirements",
              "text": "Apply With Resume",
              "icon": "group",
              "routerLink": "/usit/resume-upload",
              "roles":["Super Administrator"]  
            },
            {
              "test": "cpv portal requirements",
              "text": "CPV Portal Requirements",
              "icon": "group",
              "routerLink": "/usit/cpv-portal-requirements",
              "roles":["Super Administrator"]  
            },
            {
              "test": "Fpv Portal Requirements",
              "text": "FPV Portal Requirements",
              "icon": "group",
              "routerLink": "/usit/fpv-portal-requirements",
              "roles":["Super Administrator"]  
            },
            {
              "test": "Rss",
              "text": "RSS",
              "icon": "business_center",
              "routerLink": "/usit/rssfeed",
              "roles":["Super Administrator"]  
            },
            {
              "test": "Email Extraction",
              "text": "Email Extraction",
              "icon": "business_center",
              "routerLink": "/usit/email-extraction-list",
              "roles":["Super Administrator"]  
            }
          ]
        },
      {
        "test": "OPEN_REQS_JOB_APPLICATION",
        "text": "Openreqs Job Applications",
        "icon": "view_carousel",
        "routerLink": "/usit/openreqs-job-applications",
        "roles":["Super Administrator"]  
      },
      {
        "test": "TALENT_POOL",
        "text": "Talent Pool",
        "icon": "business_center",
        "routerLink": "/usit/linkedinprofiles",
        "roles":["Super Administrator"]  
      },
      {
        "test": "VC_CX_PROFILES",
        "text": "VC-CX Profiles",
        "icon": "badge",
        "routerLink": "/usit/vc-cx-profiles",
        "roles":["Super Administrator"]  
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
          "roles":["Super Administrator"]  
        }
      ]
    },
      {
        "test": "ROLE",
          "text": "Roles - Privileges",
          "icon": "assignment_ind",
          "routerLink": "/usit/roles",
          "roles":["Super Administrator"]  
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
              "roles":["Super Administrator"]  
            },
            
            {
              "test": "Sourcing Reports",
              "text": "Sourcing Reports",
              "icon": "dynamic_feed",
              "routerLink": "/usit/sourcing-report",
              "roles":["Super Administrator"]  
            },
            {
              "test": "Open Reqs Reports",
              "text": "Open Reqs Reports",
              "icon": "dynamic_feed",
              "routerLink": "/usit/open-reqs-report",
              "roles":["Super Administrator"]  
            },
            {
              "test": "Banter Reports",
              "text": "Banter Reports",
              "icon": "fax",
              "routerLink": "/usit/banter-report",
              "roles":["Super Administrator"]  
            },
            {
              "test": "Candidate Reports",
              "text": "Candidate Reports",
              "icon": "contact_page",
              "routerLink": "/usit/candidate-reports",
              "roles":["Super Administrator"]  
            },
            {
              "test": "TaggedCount_Report",
              "text": "Comments Report",
              "icon": "contact_page",
              "routerLink": "/usit/taggedcount-report",
              "roles":["Super Administrator"]  
            },
      
            
            {
              "test": "Ratings",
              "text": "Executive Ratings",
              "icon": "star",
              "routerLink": "/usit/executive-ratings",
              "roles": ["Super Administrator"]
            }
          ]
        },
    {
      "test": "MASTERS",
      "text": "Masters",
      "icon": "extension",
      "children": [
        {
          "test": "VISA",
          "text": "Visa",
          "icon": "credit_card",
          "routerLink": "/usit/visa",
          "roles":["Super Administrator"]  
        },
        {
          "test": "QUALIFICATION",
          "text": "Qualification",
          "icon": "school",
          "routerLink": "/usit/qualification",
          "roles":["Super Administrator"]  
        },
        {
          "test": "COMPANY",
          "text": "Companies",
          "icon": "business",
          "routerLink": "/usit/companies",
          "roles":["Super Administrator"]  
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
          "roles":["Super Administrator"]  
        },
        {
          "test": "invoices",
          "text": "Invoices",
          "icon": "description",
          "routerLink": "/billpay/invoices",
          "roles":["Super Administrator"]  
        },
        {
          "test": "receipts",
          "text": "Receipts",
          "icon": "receipt",
          "routerLink": "/billpay/receipts",
          "roles":["Super Administrator"]  
        },
        {
          "test": "Time_Sheets",
          "text": "Time Sheets",
          "icon": "receipt",
          "routerLink": "/usit/time-sheets",
          "roles":["Super Administrator"]  
        }
      ]
    },
    {
      "test": "TASKMANAGEMENT",
      "text": "Task Management",
      "icon": "task",
      "children": [
        {
          "test": "PROJECTS",
          "text": "Projects",
          "icon": "work",
          "routerLink": "/task-management/projects",
          "roles":["Super Administrator"]  
        }
      ]
    },
    {
      "test": "KPT",
      "text": "KPT",
      "icon": "quiz",
      "children": [
        {
          "test": "ADD_KPT",
          "text": "ADD_KPT",
          "icon": "quiz",
          "routerLink": "/usit/quiz-list",
         "roles":["Super Administrator"] 
        },
        {
          "test": "WRITE_KPT",
          "text": "WRITE_KPT",
          "icon": "assignment",
          "routerLink": "/usit/attempt-quiz",
          "roles":["Super Administrator"] 
        },
        {
          "test": "RESULT_KPT",
          "text": "RESULT_KPT",
          "icon": "assignment",
          "routerLink": "/usit/quiz-result",
         "roles":["Super Administrator"] 
         
        }
      ]
    },
    {
      "test": "EMPLOYEE_LOGIN_VIEW_PROFILE",
      "text": "View Profile",
      "icon": "person",
      "routerLink": "/usit/profile",
      "roles":["Super Administrator"] 
    }
    ,
  {  
    "test":"EMPLOYEE_LOGIN_JOB_REQUIREMENTS",
    "text": "Job Requirements",
    "icon": "business_center",
    "children": [
      {
        "test":"EMPLOYEE_LOGIN_CONTRACT_REQUIREMENTS",
        "text": "Contract",
        "icon": "library_books",
        "routerLink": "/usit/open-requirements",
        "roles":["Super Administrator"] 
      },
      {
        "test":"EMPLOYEE_LOGIN_FULL_TIME_REQUIREMENTS",
        "text": "Full Time",
        "icon": "library_books",
        "routerLink": "/usit/full-time-requirements",
        "roles":["Super Administrator"] 
      }
    ]
  },
  {
      "test":"DOCSYNCH",
      "text": "Docsync",
      "icon": "folder",
      "children": [
      {
        "test":"VIEW",
        "text": "All Files",
        "icon": "view_list",
        "routerLink": "/docsync/all-files",
        "roles":["Super Administrator"] 
        }],
      
  }
  
  
  ,
  {
    "test":"EMPLOYEE_LOGIN_APPLIED_JOBS",
    "text": "Applied Jobs",
    "icon": "bookmark_border",
    "routerLink": "/usit/applied-jobs",
    "roles":["Super Administrator"] 
  }
  ,
  {
    "test":"EMPLOYEE_LOGIN_SUBMISSIONS",
    "text": "Submissions",
    "icon": "assignment",
    "routerLink": "/usit/submissions",
    "roles":["Super Administrator"] 
  },
  {
    "test":"EMPLOYEE_LOGIN_INTERVIEWS",
    "text": "Interviews",
    "icon": "chat_bubble_outline",
    "routerLink": "/usit/interviews",
    "roles":["Super Administrator"] 
  },
  {
    "test":"EMPLOYEE_LOGIN_REPORT",
    "text": "Report",
    "icon": "reports",
    "routerLink": "/usit/report",
    "roles":["Super Administrator"] 
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
  console.log(this.menuData,'menudata');
  

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
