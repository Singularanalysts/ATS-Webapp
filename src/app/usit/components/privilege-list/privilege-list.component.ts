import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { ActivatedRoute, Router } from '@angular/router';
import { every, Subject, takeUntil } from 'rxjs';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { ManagePrivilegeComponent } from './manage-privilege/manage-privilege.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoleManagementService } from '../../services/role-management.service';
import { Role } from '../../models/role';

@Component({
  selector: 'app-privilege-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './privilege-list.component.html',
  styleUrls: ['./privilege-list.component.scss'],
})

export class PrivilegeListComponent implements OnInit, OnDestroy {
  // variables
  keysObj = Object;
  flg: boolean = false;
  id!: number;
  RoleName!: string;
  entity = new Privilege();
  role: any[] = [];
  type: string[] = [];
  name!: string;
  vendor: any[] = [];
  recruiter: any[] = [];
  tech_support: any[] = [];
  visa: any[] = [];
  configuration: any[] = [];
  taskmanagement: any[] = [];
  
  qualification: any[] = [];
  kpt: any[] = [];
  requirement: any[] = [];
  technology_tags: any[] = [];

  immigration: any[] = [];
  users: any[] = [];

  sourcing_reports: any[] = [];
  us_reports: any[] = [];
  vc_cx_profiles: any[] = [];
  Open_reqs_job_application: any[] = [];
  presales: any[] = [];
  h1_transfer: any[] = [];
  mass_mailing: any[] = [];
  privilegResp: any[] = [];
  company: any[] = [];
  cards: any[] = [];



  dashboard: any[] = [];
  search: any[] = [];

  rolename!: string;
  roleNames: string[] = [];
  vms: any[] = [];
  sales: any[] = [];
  recruitment: any[] = [];
  dom_recruitment: any[] = [];

  talent_acquisition: any[] = [];
  people: any[] = [];
  masters: any[] = []; 
  billpay: any[] = []; 
  sourcing: any[] = []; 
  onboarding: any[] = []; 
  open_requirements: any[] = [];
  reports: any[] = [];

  sales_consultant: any[] = [];
  sales_submission: any[] = [];
  sales_interview: any[] = [];
  sales_closures: any[] = [];

  recruiting_requirement: any[] = [];
  recruiting_consultant: any[] = [];
  recruiting_submission: any[] = [];
  recruiting_interview: any[] = [];
  recruiting_closures: any[] = [];
  
  dom_requirement: any[] = [];
  dom_consultant: any[] = [];
  dom_submission: any[] = [];
  dom_interview: any[] = [];
  dom_closures: any[] = [];
  talentpool: any[] = [];

  projects: any[] = [];
  tcvr: any[] = [];
  view_consultant_profile: any[] = [];
  consultant_job_requirements: any[] = [];
 
  consultants_applied_jobs: any[] = [];
 
  consultatnt_submissions: any[] = []; 
  consultatnt_interviews: any[] = [];
  consultant_report: any[] = [];

  // snackbaran
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };

  // services
  private snackBarServ = inject(SnackBarService);
  private activatedRoute = inject(ActivatedRoute);
  private privilegServ = inject(PrivilegesService);
  private router = inject(Router);
  private dialogServ = inject(DialogService);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private roleManagementServ: RoleManagementService) {}

  ngOnInit(): void {
        // Retrieve the rolename from the route parameter
        this.rolename = this.route.snapshot.paramMap.get('rolename')!;

    this.id = this.activatedRoute.snapshot.params['id'];
    this.entity.roleId = +this.id;
    this.getAll();
    
  }

  /**
   * fetch privileges
   */
  getAll() {
    this.privilegServ
      .getAllPrivileges()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        // alert("full=="+JSON.stringify(response.data.vms));
        this.users = response.data.user;
        this.vendor = response.data.vendor;
        this.recruiter = response.data.recruiter;
        this.tech_support = response.data.tech_support;
        
        this.visa = response.data.visa;
        this.configuration = response.data.configuration;
        this.qualification = response.data.qualification;
        
        this.requirement = response.data.requirement;
        this.kpt = response.data.kpt;
        this.role = response.data.role;
        this.company = response.data.company;
      
        this.taskmanagement = response.data.taskmanagement;
        this.technology_tags = response.data.technology_tag;
        this.immigration = response.data.immigration;

        this.sourcing_reports = response.data.sourcing_reports;
        this.us_reports = response.data.us_reports;
        this.dashboard = response.data.dashboard;

        this.search = response.data.search;
        this.mass_mailing = response.data.massmailing;
        this.h1_transfer = response.data.h1transfer;
        this.presales = response.data.presales;
        this.Open_reqs_job_application = response.data.open_reqs_job_application;
        this.talentpool = response.data.talentpool;
        this.vc_cx_profiles = response.data.vc_cx_profiles;
        this.vms = response.data.vms;
        this.sales = response.data.sales;
        this.recruitment = response.data.recruitment;  
        this.dom_recruitment = response.data.dom_recruitment;
        this.talent_acquisition = response.data.talent_acquisition;
        this.people = response.data.people;
        this.masters = response.data.masters;
        this.billpay = response.data.billpay;
        this.sourcing = response.data.sourcing;
        this.onboarding = response.data.onboarding;
        this.open_requirements = response.data.open_requirements;
        this.reports = response.data.reports;

        this.sales_consultant = response.data.sales_consultant;
        this.sales_submission = response.data.sales_submission;
        this.sales_interview = response.data.sales_interview;
        this.sales_closures = response.data.sales_closures;
   
        this.recruiting_requirement = response.data.recruiting_requirement;
        this.recruiting_consultant = response.data.recruiting_consultant;
        this.recruiting_submission = response.data.recruiting_submission;
        this.recruiting_interview = response.data.recruiting_interview;
        this.recruiting_closures = response.data.recruiting_closures;

        this.dom_requirement = response.data.dom_requirement;
        this.dom_consultant = response.data.dom_consultant;
        this.dom_submission = response.data.dom_submission;
        this.dom_interview = response.data.dom_interview;
        this.dom_closures = response.data.dom_closures;

        this.projects = response.data.projects;
        this.tcvr = response.data.tcvr;
        this.view_consultant_profile = response.data.view_consultant_profile;
        this.consultant_job_requirements = response.data.consultant_job_requirements;
        this.consultants_applied_jobs = response.data.consultatnts_applied_jobs;

        this.consultatnt_submissions = response.data.consultatnt_submissions;
        this.consultatnt_interviews = response.data.consultatnt_interviews;
        this.consultant_report = response.data.consultant_report;

        this.selecedPrivileges();
        this.mapResponseData();
        // this.selecedPrivileges();
      });
  }

  private mapResponseData() {


    this.privilegResp.push(  
      // array of objects
      {
        title: 'Role',
        privileges: this.role,
        isSelected: this.role
          ? this.role.every((priv: any) => priv.selected === true)
          : false,  
      },
      {
        title: 'User',
        privileges: this.users,
        isSelected: this.users
          ? this.users.every((priv: any) => priv.selected === true)
          : false
      },
      {
        title: 'DASHBOARD',
        privileges: this.dashboard,
        isSelected: this.dashboard
          ? this.dashboard.every((priv: any) => priv.selected === true)
          : false,
      },
     
      {
        title: 'Search',
        privileges: this.search,
        isSelected: this.search
          ? this.search.every((priv: any) => priv.selected === true)
          : false,
      },
    
      {
        title: 'Tech & Support',
        privileges: this.tech_support,
        isSelected: this.tech_support
          ? this.tech_support.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'VMS',
        privileges: this.vms,
        isSelected: this.vms
          ? this.vms.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Vendor',
        privileges: this.vendor,
        isSelected: this.vendor
          ? this.vendor.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Recruiter',
        privileges: this.recruiter,
        isSelected: this.recruiter
          ? this.recruiter.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Tcvr',
        privileges: this.tcvr,
        isSelected: this.tcvr
          ? this.tcvr.every((priv: any) => priv.selected === true)
          : false,
      },
   
      {
        title: 'Presales',
        privileges: this.presales,
        isSelected: this.presales
          ? this.presales.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Sales',
        privileges: this.sales,
        isSelected: this.sales
          ? this.sales.every((priv: any) => priv.selected === true)
          : false,
      },
      {

        title: 'Sales Consultants',
        privileges: this.sales_consultant,
        isSelected: this.sales_consultant
          ? this.sales_consultant.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Sales Submission',
        privileges: this.sales_submission,
        isSelected: this.sales_submission
          ? this.sales_submission.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Sales Interview',
        privileges: this.sales_interview,
        isSelected: this.sales_interview
          ? this.sales_interview.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Sales Closures',
        privileges: this.sales_closures,
        isSelected: this.sales_closures
          ? this.sales_closures.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Recruitment',
        privileges: this.recruitment,
        isSelected: this.recruitment
          ? this.recruitment.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Recruitment Requirements',
        privileges: this.recruiting_requirement,
        isSelected: this.recruiting_requirement
          ? this.recruiting_requirement.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Recruitment Consultants',
        privileges: this.recruiting_consultant,
        isSelected: this.recruiting_consultant
          ? this.recruiting_consultant.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Recruitment Submission',
        privileges: this.recruiting_submission,
        isSelected: this.recruiting_submission
          ? this.recruiting_submission.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Recruitment Interview',
        privileges: this.recruiting_interview,
        isSelected: this.recruiting_interview
          ? this.recruiting_interview.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Recruitment Closures',
        privileges: this.recruiting_closures,
        isSelected: this.recruiting_closures
          ? this.recruiting_closures.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Dom Recruitment',
        privileges: this.dom_recruitment,
        isSelected: this.dom_recruitment
          ? this.dom_recruitment.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Dom Requirements',
        privileges: this.dom_requirement,
        isSelected: this.dom_requirement
          ? this.dom_requirement.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Dom Consultants',
        privileges: this.dom_consultant,
        isSelected: this.dom_consultant
          ? this.dom_consultant.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Dom Submission',
        privileges: this.dom_submission,
        isSelected: this.dom_submission
          ? this.dom_submission.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Dom Interview',
        privileges: this.dom_interview,
        isSelected: this.dom_interview
          ? this.dom_interview.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Dom Closures',
        privileges: this.dom_closures,
        isSelected: this.dom_closures
          ? this.dom_closures.every((priv: any) => priv.selected === true)
          : false,
      },

      {
        title: 'Immigration',
        privileges: this.immigration,
        isSelected: this.immigration
          ? this.immigration.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'H1 Transfer',
        privileges: this.h1_transfer,
        isSelected: this.h1_transfer
          ? this.h1_transfer.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Technology Tags',
        privileges: this.technology_tags,
        isSelected: this.technology_tags
          ? this.technology_tags.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'masters',
        privileges: this.masters,
        isSelected: this.masters
          ? this.masters.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Company',
        privileges: this.company,
        isSelected: this.company
          ? this.company.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Visa',
        privileges: this.visa,
        isSelected: this.visa
          ? this.visa.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Qualificaton',
        privileges: this.qualification,
        isSelected: this.qualification
          ? this.qualification.every((priv: any) => priv.selected === true)
          : false,
      },
     
      {
        title: 'KPT',
        privileges: this.kpt,
        isSelected: this.kpt
          ? this.kpt.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Task Management',
        privileges: this.taskmanagement,
        isSelected: this.taskmanagement
          ? this.taskmanagement.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'projects',
        privileges: this.projects,
        isSelected: this.projects
          ? this.projects.every((priv: any) => priv.selected === true)
          : false,
      },

      {
        title: 'Sourcing Reports',
        privileges: this.sourcing_reports,
        isSelected: this.sourcing_reports
          ? this.sourcing_reports.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'S&R Reports',
        privileges: this.us_reports,
        isSelected: this.us_reports
          ? this.us_reports.every((priv: any) => priv.selected === true)
          : false,
      },
    
      {
        title: 'Mass Mailing',
        privileges: this.mass_mailing,
        isSelected: this.mass_mailing
          ? this.mass_mailing.every((priv: any) => priv.selected === true)
          : false,
      },
     
     
      {
        title: 'Open_reqs_job_application',
        privileges: this.Open_reqs_job_application,
        isSelected: this.Open_reqs_job_application
          ? this.Open_reqs_job_application.every(
              (priv: any) => priv.selected === true
            )
          : false,
      },
      {
        title: 'Talentpool',
        privileges: this.talentpool,
        isSelected: this.talentpool
          ? this.talentpool.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Vc-cx-profiles',
        privileges: this.vc_cx_profiles,
        isSelected: this.vc_cx_profiles
          ? this.vc_cx_profiles.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'talent_acquisition',
        privileges: this.talent_acquisition,
        isSelected: this.talent_acquisition
          ? this.talent_acquisition.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'people',
        privileges: this.people,
        isSelected: this.people
          ? this.people.every((priv: any) => priv.selected === true)
          : false,
      },
   
      {
        title: 'billpay',
        privileges: this.billpay,
        isSelected: this.billpay
          ? this.billpay.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'sourcing',
        privileges: this.sourcing,
        isSelected: this.sourcing
          ? this.sourcing.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'onboarding',
        privileges: this.onboarding,
        isSelected: this.onboarding
          ? this.onboarding.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'open_requirements',
        privileges: this.open_requirements,
        isSelected: this.open_requirements
          ? this.open_requirements.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'reports',
        privileges: this.reports,
        isSelected: this.reports
          ? this.reports.every((priv: any) => priv.selected === true)
          : false,
      },
     
      {
        title: 'View Consultant Profile',
        privileges: this.view_consultant_profile,
        isSelected: this.view_consultant_profile
          ? this.view_consultant_profile.every((priv: any) => priv.selected === true)
          : false,
      },

      {
        title: 'Consultant Job Requirements',
        privileges: this.consultant_job_requirements,
        isSelected: this.consultant_job_requirements
          ? this.consultant_job_requirements.every((priv: any) => priv.selected === true)
          : false,
      },
     
      {
        title: 'Consultatnts Applied Jobs',
        privileges: this.consultants_applied_jobs,
        isSelected: this.consultants_applied_jobs
          ? this.consultants_applied_jobs.every((priv: any) => priv.selected === true)
          : false,
      }
      ,
     
      {
        title: 'Consultatnt Submissions',
        privileges: this.consultatnt_submissions,
        isSelected: this.consultatnt_submissions
          ? this.consultatnt_submissions.every((priv: any) => priv.selected === true)
          : false,
      }
      ,
     
      {
        title: 'Consultatnt Interviews',
        privileges: this.consultatnt_interviews,
        isSelected: this.consultatnt_interviews
          ? this.consultatnt_interviews.every((priv: any) => priv.selected === true)
          : false,
      }
      ,
     
      {
        title: 'Consultant Report',
        privileges: this.consultant_report,
        isSelected: this.consultant_report
          ? this.consultant_report.every((priv: any) => priv.selected === true)
          : false,
      }

    );
    
  }



  /**
   * fetch privileges by id
   */
  selecedPrivileges() {
    this.privilegServ
      .getPrivilegesById(+this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {

        if (this.vendor != null) {
          this.vendor.forEach((ele) => {
            response.data.vendor.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.role != null) {
          this.role.forEach((role) => {
            response.data.role.forEach((userresp: any) => {
              if (role.id === userresp.id) {
                this.entity.privilegeIds.push(userresp.id);
                role.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.recruiter != null) {
          this.recruiter.forEach((ele) => {
            response.data.recruiter.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.tcvr != null) {
          this.tcvr.forEach((ele) => {
            response.data.tcvr.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }
        
        if (this.users != null) {
          this.users.forEach((userele) => {
            response.data.user.forEach((userresp: any) => {
              if (userele.id === userresp.id) {
                this.entity.privilegeIds.push(userresp.id);
                userele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.technology_tags != null) {
          this.technology_tags.forEach((ele) => {
            response.data.technology_tag.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.tech_support != null) {
          this.tech_support.forEach((ele) => {
            response.data.tech_support.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.immigration != null) {
          this.immigration.forEach((ele) => {
            response.data.immigration.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.visa != null) {
          this.visa.forEach((ele) => {
            response.data.visa.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.sales != null) {
          this.sales.forEach((ele) => {
            response.data.sales.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.sales_consultant != null) {
          this.sales_consultant.forEach((ele) => {
            response.data.sales_consultant.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.sales_submission != null) {
          this.sales_submission.forEach((ele) => {
            response.data.sales_submission.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.sales_interview != null) {
          this.sales_interview.forEach((ele) => {
            response.data.sales_interview.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.sales_closures != null) {
          this.sales_closures.forEach((ele) => {
            response.data.sales_closures.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.recruitment != null) {
          this.recruitment.forEach((ele) => {
            response.data.recruitment.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.recruiting_requirement != null) {
          this.recruiting_requirement.forEach((ele) => {
            response.data.recruiting_requirement.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.recruiting_consultant != null) {
          this.recruiting_consultant.forEach((ele) => {
            response.data.recruiting_consultant.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.recruiting_submission != null) {
          this.recruiting_submission.forEach((ele) => {
            response.data.recruiting_submission.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.recruiting_interview != null) {
          this.recruiting_interview.forEach((ele) => {
            response.data.recruiting_interview.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.recruiting_closures != null) {
          this.recruiting_closures.forEach((ele) => {
            response.data.recruiting_closures.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.dom_recruitment != null) {
          this.dom_recruitment.forEach((ele) => {
            response.data.dom_recruitment.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.dom_requirement != null) {
          this.dom_requirement.forEach((ele) => {
            response.data.dom_requirement.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.dom_consultant != null) {
          this.dom_consultant.forEach((ele) => {
            response.data.dom_consultant.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.dom_submission != null) {
          this.dom_submission.forEach((ele) => {
            response.data.dom_submission.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.dom_interview != null) {
          this.dom_interview.forEach((ele) => {
            response.data.dom_interview.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.dom_closures != null) {
          this.dom_closures.forEach((ele) => {
            response.data.dom_closures.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }


        //requirement
        if (this.qualification != null) {
          this.qualification.forEach((ele) => {
            response.data.qualification.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.taskmanagement != null) {
          this.taskmanagement.forEach((ele) => {
            response.data.taskmanagement.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }
        //taskmanagement

        if (this.visa != null) {
          this.visa.forEach((ele) => {
            response.data.visa.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.requirement != null) {
          this.requirement.forEach((ele) => {
            response.data.requirement.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.kpt != null) {
          this.kpt.forEach((ele) => {
            response.data.kpt.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        //requirement
        if (this.qualification != null) {
          this.qualification.forEach((ele) => {
            response.data.qualification.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.company != null) {
          this.company.forEach((ele) => {
            response.data.company.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.us_reports != null) {
          this.us_reports.forEach((ele) => {
            response.data.us_reports.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.sourcing_reports != null) {
          this.sourcing_reports.forEach((ele) => {
            response.data.sourcing_reports.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.dashboard != null) {
          this.dashboard.forEach((ele) => {
            response.data.dashboard.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.search != null) {
          this.search.forEach((ele) => {
            response.data.search.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.mass_mailing != null) {
          this.mass_mailing.forEach((ele) => {
            response.data.massmailing.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.h1_transfer != null) {
          this.h1_transfer.forEach((ele) => {
            response.data.h1transfer.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.presales != null) {
          this.presales.forEach((ele) => {
            response.data.presales.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.Open_reqs_job_application != null) {
          this.Open_reqs_job_application.forEach((ele) => {
            response.data.open_reqs_job_application.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.talentpool != null) {
          this.talentpool.forEach((ele) => {
            response.data.talentpool.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.vc_cx_profiles != null) {
          this.vc_cx_profiles.forEach((ele) => {
            response.data.vc_cx_profiles.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.vms != null) {
          this.vms.forEach((ele) => {
            response.data.vms.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.talent_acquisition != null) {
          this.talent_acquisition.forEach((role) => {
            response.data.talent_acquisition.forEach((userresp: any) => {
              if (role.id === userresp.id) {
                this.entity.privilegeIds.push(userresp.id);
                role.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.people != null) {
          this.people.forEach((ele) => {
            response.data.people.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.masters != null) {
          this.masters.forEach((ele) => {
            response.data.masters.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.billpay != null) {
          this.billpay.forEach((ele) => {
            response.data.billpay.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.sourcing != null) {
          this.sourcing.forEach((ele) => {
            response.data.sourcing.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.onboarding != null) {
          this.onboarding.forEach((ele) => {
            response.data.onboarding.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.open_requirements != null) {
          this.open_requirements.forEach((ele) => {
            response.data.open_requirements.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.reports != null) {
          this.reports.forEach((ele) => {
            response.data.reports.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.projects != null) {
          this.projects.forEach((ele) => {
            response.data.projects.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.view_consultant_profile != null) {
          this.view_consultant_profile.forEach((ele) => {
            response.data.view_consultant_profile.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.consultant_job_requirements != null) {
          this.consultant_job_requirements.forEach((role) => {
            response.data.consultant_job_requirements.forEach((userresp: any) => {
              if (role.id === userresp.id) {
                this.entity.privilegeIds.push(userresp.id);
                role.selected = true;
                this.flg = true;
              }
            });
          });
        }

           if (this.consultants_applied_jobs != null) {
          this.consultants_applied_jobs.forEach((ele) => {
            response.data.consultants_applied_jobs.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.consultatnt_submissions != null) {
          this.consultatnt_submissions.forEach((role) => {
            response.data.consultatnt_submissions.forEach((userresp: any) => {
              if (role.id === userresp.id) {
                this.entity.privilegeIds.push(userresp.id);
                role.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.consultatnt_interviews != null) {
          this.consultatnt_interviews.forEach((role) => {
            response.data.consultatnt_interviews.forEach((userresp: any) => {
              if (role.id === userresp.id) {
                this.entity.privilegeIds.push(userresp.id);
                role.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.consultant_report != null) {
          this.consultant_report.forEach((role) => {
            response.data.consultant_report.forEach((userresp: any) => {
              if (role.id === userresp.id) {
                this.entity.privilegeIds.push(userresp.id);
                role.selected = true;
                this.flg = true;
              }
            });
          });
        }

      });
  }

  /**
   * To provide / revoke all the accesses
   * @param card
   * @param event
   */
  selectAllAccess(card: any, event: MatCheckboxChange) {
    card.privileges?.forEach((ele: any) => {
      if (event.checked) {
        ele.selected = true;
        this.entity.privilegeIds.push(ele.id);
        card.isSelected = true;
      } else {
        ele.selected = false;
        card.isSelected = false;
        this.entity.privilegeIds.forEach((id, index) => {
          if (ele.id === id) {
            this.entity.privilegeIds?.splice(index, 1);
          }
        });
      }
      this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)];
    });
    JSON.stringify('selected:' + this.entity.privilegeIds);
  }

  /**
   * manage side nav-item's visibility
   */
  // private getSideNavData() {}

  /**
   * form privilge ids based on selected type
   * @param data
   * @param event
   */
  commonFunction(data: any, event: any) {
    data.forEach((ele: any) => {
      if (event.target.checked) {
        this.entity.privilegeIds.push(ele.id);
        data.isSelected = true;
      } else {
        data.isSelected = false;
        this.entity.privilegeIds.forEach((id, index) => {
          if (data.id === id) {
            this.entity.privilegeIds.splice(index, 1);
          }
        });
      }
    });
  }

  selectCardAccess(event: MatCheckboxChange, cardId: number, card: any) {
    if (event.checked) {
      // Increment cardId by 1
      const adjustedCardId = cardId + 1;

      this.cards[adjustedCardId] = event.checked;

      this.entity.cardIds.push(adjustedCardId);
      this.entity.cardIds = [...new Set(this.entity.cardIds)];

      card.privileges?.forEach((ele: any) => {
        // if (event.checked) {
        ele.selected = true;
        this.entity.privilegeIds.push(ele.id);
        card.isSelected = true;
        // }
        this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)];
      });
    } else {
      // Remove cardId from cardIds array if unchecked
      const adjustedCardId = cardId + 1;
      this.entity.cardIds = this.entity.cardIds.filter(
        (id) => id !== adjustedCardId
      );

      //  this.entity.cardIds = [...new Set(this.entity.cardIds)];
      //     this.cards[cardId].selected = event.checked;
      //     const uncheckedPrivId = this.cards[cardId].id;
      //     const uncheckedPrivIdIndex = this.entity.cardIds.indexOf(uncheckedPrivId)
      //     if (uncheckedPrivIdIndex >= 0) {
      //       this.entity.cardIds.splice(uncheckedPrivIdIndex, 1);
      //     }

      card.privileges?.forEach((ele: any) => {
        if (event.checked) {
        } else {
          ele.selected = false;
          card.isSelected = false;
          this.entity.privilegeIds.forEach((id, index) => {
            if (ele.id === id) {
              this.entity.privilegeIds?.splice(index, 1);
            }
          });
        }
        this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)];
      });
    }
  }

  /**
   * checkbox event
   * @param event
   */
  selectInidividualAccess(
    event: MatCheckboxChange,
    privileges: any,
    privId: number,
    cardId: number,
    card: any,
  priv: any,  privilegResp: any) {
// alert("single card index"+cardId);

if(priv.cardType==='many' && event.checked){

  let myval: number=0;
  let mypri: number=0;
 privilegResp?.forEach((care:any) => {
     care.privileges?.forEach((ar: any)=>{
         // alert("priv names========="+ar.name.toLowerCase() +" " +priv.name.toLowerCase());
       if(priv.name.toLowerCase() === ar.name.toLowerCase() && cardId!=myval){

        care.privileges?.forEach((ele: any) => {
        if (event.checked) {
          ele.selected = true;
          this.entity.privilegeIds.push(ele.id);
          care.isSelected = true;
        }
        this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)];
      });
         // alert("same titled privilege matched========="+ar.name.toLowerCase() +" "+priv.name.toLowerCase() +" "+cardId +" "+myval);
       }
   })
   myval=myval+1;
 })

}  //if end
else if(priv.cardType.toLowerCase()==='many'.toLowerCase() && !event.checked){
  
 let myval: number=0;
 let mypri: number=0;
privilegResp?.forEach((care:any) => {
    care.privileges?.forEach((ar: any)=>{
        // alert("priv names========="+ar.name.toLowerCase() +" " +priv.name.toLowerCase());
      if(priv.name.toLowerCase() === ar.name.toLowerCase() && cardId!=myval){
        care.privileges?.forEach((ele: any) => {
          // alert("alert"+JSON.stringify(ele)) 
          let count =0;
          if(ele.selected==true && ele.name!="")
          
          if (privId === 0 || privId != 0) {
            ele.selected = false;
            care.isSelected = false;
            this.entity.privilegeIds.forEach((id, index) => {
              if (ele.id === id) {
                this.entity.privilegeIds?.splice(index, 1);
              }
            });
          }else{
  
          }
          this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)];
        });
        // alert("same titled privilege matched========="+ar.name.toLowerCase() +" "+priv.name.toLowerCase() +" "+cardId +" "+myval);
      }
  })
  myval=myval+1;
}
)
}

    let boolean = true;
    if (event.checked && privId === 0) {
      boolean = false;

      card.privileges?.forEach((ele: any) => {
        if (event.checked) {
          ele.selected = true;
          this.entity.privilegeIds.push(ele.id);
          card.isSelected = true;
        }
        this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)];
      });
    } else {
      
      card.privileges?.forEach((ele: any) => {
        // alert("alert"+JSON.stringify(ele)) 
        let count =0;
        if(ele.selected==true && ele.name!="")
        
        if (privId === 0) {
          ele.selected = false;
          card.isSelected = false;
          this.entity.privilegeIds.forEach((id, index) => {
            if (ele.id === id) {
              this.entity.privilegeIds?.splice(index, 1);
            }
          });
        }else{

        }
        this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)];
      });
    }
    // this.privilegResp[cardId].isSelected = privileges.every(
    //   (priv: any) => priv.selected === true
    // );

    if (event.checked && privId != 0) {
      privileges[0].selected = event.checked;
      privileges[privId].selected = event.checked;
      this.entity.privilegeIds.push(privileges[privId].id);
      this.entity.privilegeIds.push(privileges[0].id);

      this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)];
    } else if (boolean) {
      // Uncheck the privilege
      // privileges[0].selected = event.checked;
      privileges[privId].selected = event.checked;
      this.entity.privilegeIds.push(privileges[0].id);

      // Remove the unchecked privilege ids from privilegeIds array
      this.entity.privilegeIds = this.entity.privilegeIds.filter(
        (id) => id !== privileges[privId].id && id !== privileges[1].id
      );
    }
  }

  /**
   * Add privilege
   */

  // add
  addPrivilege() {
    const actionData = {
      title: 'Add Privilege',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'add-privilege',
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '480px';
    dialogConfig.height = '300px';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-privilege';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      ManagePrivilegeComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((resp) => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll();
      }
    });
  }

  /**
   * save
   */
  savePrivileges() {
    //console.log("Save Privileges Object", this.entity)
    this.privilegServ
      .addPrevilegeToRole(this.entity)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (result) => {
          this.dataToBeSentToSnackBar.message =
            'Previleges added successfully!';
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
          this.router.navigate(['/usit/roles']);
        },
        (error: any) => {
          if (error.status == 401) {
            this.dataToBeSentToSnackBar.message =
              'Previleges addition is failed!';
            this.snackBarServ.openSnackBarFromComponent(
              this.dataToBeSentToSnackBar
            );
          } else {
            this.dataToBeSentToSnackBar.message =
              'Previleges addition is failed!';
            this.snackBarServ.openSnackBarFromComponent(
              this.dataToBeSentToSnackBar
            );
          }
        }
      );
  }

  onCancel() {
    this.router.navigate(['/usit/roles']);
  }

  //  onReset(role : Role) {
  //   // this.router.navigate(['/usit/roles']);
  //   // this.router.navigate(['/usit/privileges']);
  //   this.router.navigate(['/usit/privileges', role.roleid, role.rolename])
  // }

  ngOnDestroy(): void {
    this.destroyed$.next(undefined);
    this.destroyed$.complete();
  }
}

export class Privilege {
  roleId!: number;
  privilegeIds: any[] = [];
  cardIds: any[] = [];
}
