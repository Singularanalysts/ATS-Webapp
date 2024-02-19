import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from 'src/app/usit/services/dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { SourcingupdateComponent } from './sourcingupdate/sourcingupdate.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTooltipModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    MatMenuModule
  ],
})
export class DashboardComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  dataSourceDice = new MatTableDataSource([]);
  private dialogServ = inject(DialogService);
  dataTableColumns: string[] = [
    'Name',
    'Category',
    'Address',
    'Email',
    'ContactNumber',
    'Owner',
    'Track'
  ];
  dataTableColumnsDice: string[] = [
    'PostedDate',
    'JobTitle',
    'Category',
    'JobLocation',
    'Vendor',
    'TaggedDate',
    'TaggedBy'
  ];
  entity: any;
  datarr: any[] = [];
  private dashboardServ = inject(DashboardService);
  private router = inject(Router);
  submissionCount: any;
  closureFlag = 'Monthly';
  interviewFlag = 'daily';
  submissionFlag = 'Today';
  subCountArr: any[] = [];
  intCountArr: any[] = [];
  closecountArr: [] = [];
  subcount = 0;
  reccount = 0;
  sintcount = 0;
  rintcount = 0;
  sclosecount = 0;
  rclosecount = 0;
  userid!: any;
  role!: any;
  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');

    this.role = localStorage.getItem('role');//Sales Executive   Team Leader Recruiting  Team Leader Sales  Recruiter
    this.getDiceReqs();
    this.getSourcingLeads();
    this.dashboardServ.vmstransactions().subscribe(
      ((response: any) => {
        this.datarr = response.data;
      })
    );

    if (this.role === 'Sales Executive' || this.role === 'Team Leader Recruiting' || this.role === 'Team Leader Sales' || this.role === 'Recruiter') {
      this.countCallingExecutiveAndLead();
    }
    else {
      this.countCallingHigherRole();
    }
  }

  countCallingHigherRole() {
    this.dashboardServ.getClosureCount('monthly').subscribe(
      ((response: any) => {
        this.closecountArr = response.data;
        this.closecountArr.forEach((ent: any) => {
          if (ent.salescount != null) {
            this.sclosecount = ent.salescount;
          }
          if (ent.reccount != null) {
            this.rclosecount = ent.reccount;
          }
        });
      })
    );
    this.dashboardServ.getInterviewCount('daily').subscribe(
      ((response: any) => {
        this.intCountArr = response.data;
        this.intCountArr.forEach((ent: any) => {
          if (ent.salescount != null) {
            this.sintcount = ent.salescount;
          }
          if (ent.reccount != null) {
            this.rintcount = ent.reccount;
          }
        });
      })
    );
    this.dashboardServ.getsubmissionCount('daily').subscribe(
      ((response: any) => {
        this.subCountArr = response.data;
        this.subCountArr.forEach((ent: any) => {
          if (ent.salescount != null) {
            this.subcount = ent.salescount;
          }
          if (ent.reccount != null) {
            this.reccount = ent.reccount;
          }
        });
      })
    );
  }
  getSourcingLeads() {
    this.dashboardServ.getSourcingLeads(this.userid).subscribe(
      (response: any) => {
        //this.entity = response.data;
        this.dataSource.data = response.data;
        console.log(response.data)
        // this.dataSource.data.map((x: any, i) => {
        //   x.serialNum = i + 1;
        // });
      }
    )
  }
  // getSubmissionCount() {
  //   this.dashboardServ.getsubmissionCount('weekly').subscribe((response: any) => {
  //     this.submissionCount = response.data;
  //   })
  // }
  subCount(flag: string, flg: string) {
    this.subcount = 0;
    this.reccount = 0;
    this.submissionFlag = flg;

    if (this.role === 'Sales Executive' || this.role === 'Team Leader Recruiting' || this.role === 'Team Leader Sales' || this.role === 'Recruiter') {
      this.dashboardServ.getsubmissionCountForExAndLead(flag, this.userid).subscribe(
        ((response: any) => {
          this.subCountArr = response.data;
          this.subCountArr.forEach((ent: any) => {
            if (ent.salescount != null) {
              this.subcount = ent.salescount;
            }
            if (ent.reccount != null) {
              this.reccount = ent.reccount;
            }
          });
        })
      );
    }
    else {
      this.dashboardServ.getsubmissionCount(flag).subscribe(
        ((response: any) => {
          this.subCountArr = response.data;
          this.subCountArr.forEach((ent: any) => {
            if (ent.salescount != null) {
              this.subcount = ent.salescount;
            }
            if (ent.reccount != null) {
              this.reccount = ent.reccount;
            }
          });
        })
      );
    }

  }

  intCount(flag: string, flg: string) {
    this.interviewFlag = flg;
    this.sintcount = 0;
    this.rintcount = 0;
    if (this.role === 'Sales Executive' || this.role === 'Team Leader Recruiting' || this.role === 'Team Leader Sales' || this.role === 'Recruiter') {
      this.dashboardServ.getInterviewCountForExAndLead(flag, this.userid).subscribe(
        ((response: any) => {
          this.intCountArr = response.data;
          this.intCountArr.forEach((ent: any) => {
            if (ent.salescount != null) {
              this.sintcount = ent.salescount;
            }
            if (ent.reccount != null) {
              this.rintcount = ent.reccount;
            }
          });
        })
      );
    }
    else {
      this.dashboardServ.getInterviewCount(flag).subscribe(
        ((response: any) => {
          this.intCountArr = response.data;
          this.intCountArr.forEach((ent: any) => {
            if (ent.salescount != null) {
              this.sintcount = ent.salescount;
            }
            if (ent.reccount != null) {
              this.rintcount = ent.reccount;
            }
          });
        })
      );
    }
  }

  closureCount(flag: string, flg: string) {
    this.closureFlag = flg;
    this.sclosecount = 0;
    this.rclosecount = 0;
    if (this.role === 'Sales Executive' || this.role === 'Team Leader Recruiting' || this.role === 'Team Leader Sales' || this.role === 'Recruiter') {

      this.dashboardServ.getClosureCountForExAndLead(flag, this.userid).subscribe(
        ((response: any) => {
          this.closecountArr = response.data;
          this.closecountArr.forEach((ent: any) => {
            if (ent.salescount != null) {
              this.sclosecount = ent.salescount;
            }
            if (ent.reccount != null) {
              this.rclosecount = ent.reccount;
            }
          });
        })
      );
    }
    else {
      this.dashboardServ.getClosureCount(flag).subscribe(
        ((response: any) => {
          this.closecountArr = response.data;
          this.closecountArr.forEach((ent: any) => {
            if (ent.salescount != null) {
              this.sclosecount = ent.salescount;
            }
            if (ent.reccount != null) {
              this.rclosecount = ent.reccount;
            }
          });
        })
      );
    }
  }
  getDiceReqs() {
    this.dashboardServ.getDiceRequirements().subscribe(
      (response: any) => {
        //this.entity = response.data;
        this.dataSourceDice.data = response.data;
        // this.dataSourceDice.data.map((x: any, i) => {
        //   x.serialNum = i + 1;
        // });
      }
    )
  }

  goToConsultantInfo(id: any) {
    this.router.navigate(['usit/consultant-info', 'dashboard', 'consultant', id])
  }

  goToUserInfo(id: any) {
    this.router.navigate(['usit/user-info', 'dashboard', id])
  }
  // for executive and lead
  countCallingExecutiveAndLead() {
    this.dashboardServ.getClosureCountForExAndLead('monthly', this.userid).subscribe(
      ((response: any) => {
        this.closecountArr = response.data;
        this.closecountArr.forEach((ent: any) => {
          if (ent.salescount != null) {
            this.sclosecount = ent.salescount;
          }
          if (ent.reccount != null) {
            this.rclosecount = ent.reccount;
          }
        });
      })
    );
    this.dashboardServ.getInterviewCountForExAndLead('daily', this.userid).subscribe(
      ((response: any) => {
        this.intCountArr = response.data;
        this.intCountArr.forEach((ent: any) => {
          if (ent.salescount != null) {
            this.sintcount = ent.salescount;
          }
          if (ent.reccount != null) {
            this.rintcount = ent.reccount;
          }
        });
      })
    );
    this.dashboardServ.getsubmissionCountForExAndLead('daily', this.userid).subscribe(
      ((response: any) => {
        this.subCountArr = response.data;
        this.subCountArr.forEach((ent: any) => {
          if (ent.salescount != null) {
            this.subcount = ent.salescount;
          }
          if (ent.reccount != null) {
            this.reccount = ent.reccount;
          }
        });
      })
    );
  }

  updateSlead(sourcingLeadData: any) {
    console.log(sourcingLeadData)
    const actionData = {
      title: 'Sourcing Update',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'sourcing-update',
      souringData: sourcingLeadData,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "65vw";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "sourcing-update";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(SourcingupdateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.allowAction){
        //this.getAllVisa();
      }
    })
  }
}
