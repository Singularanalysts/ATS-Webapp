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
import { SubmissionCountListComponent } from './submission-count-list/submission-count-list.component';
import { Closure } from '../../models/closure';
import { ClosureCountListComponent } from './closure-count-list/closure-count-list.component';
import { InterviewCountListComponent } from './interview-count-list/interview-count-list.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, MatTooltipModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatStepperModule, MatMenuModule
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
  submissionFlag = 'daily';

  closureFlagInd = 'Monthly';
  interviewFlagInd = 'daily';
  submissionFlagInd = 'daily';

  subCountArr: any[] = [];
  intCountArr: any[] = [];
  closecountArr: [] = [];

  subCountIndArr: any[] = [];
  closureCountIndArr: [] = [];
  intCountIndArr: any[] = [];

  subcount = 0;
  subcountIndividual = 0;
  reccount = 0;
  reccountIndividual = 0;

  sintcount = 0;
  sintcountIndividual = 0;
  rintcount = 0;
  rintcountIndividual = 0;

  sclosecount = 0;
  sclosecountIndividual = 0;
  rclosecount = 0;
  rclosecountIndividual = 0;

  userid!: any;
  role!: any;
  submitted = false;
  individualCounts = true;
  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.role = localStorage.getItem('role');//Sales Executive   Team Leader Recruiting  Team Leader Sales  Recruiter
    this.getDiceReqs();
    this.getSourcingLeads();
    this.dashboardServ.vmstransactions().subscribe(
      ((response: any) => {
        this.datarr = response.data;
        this.countCallingExecutiveAndLead();
        this.countCallingHigherRole();
      })
    );
    if (this.role === 'Sales Executive' || this.role === 'Team Leader Recruiting' || this.role === 'Team Leader Sales' || this.role === 'Recruiter' || this.role === 'Sales Manager' || this.role === 'Recruiting Manager') {
      this.individualCounts = true;
    }
    else {
      this.individualCounts = false;
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
  countCallingExecutiveAndLead() {
    this.dashboardServ.getClosureCountForExAndLead('monthly', this.userid).subscribe(
      ((response: any) => {
        this.closureCountIndArr = response.data;
        this.closureCountIndArr.forEach((ent: any) => {
          if (ent.salescount != null) {
            this.sclosecountIndividual = ent.salescount;
          }
          if (ent.reccount != null) {
            this.rclosecountIndividual = ent.reccount;
          }
        });
      })
    );
    this.dashboardServ.getInterviewCountForExAndLead('daily', this.userid).subscribe(
      ((response: any) => {
        this.intCountIndArr = response.data;
        this.intCountIndArr.forEach((ent: any) => {
          if (ent.salescount != null) {
            this.sintcountIndividual = ent.salescount;
          }
          if (ent.reccount != null) {
            this.rintcountIndividual = ent.reccount;
          }
        });
      })
    );
    this.dashboardServ.getsubmissionCountForExAndLead('daily', this.userid).subscribe(
      ((response: any) => {
        this.subCountIndArr = response.data;
        this.subCountIndArr.forEach((ent: any) => {
          if (ent.salescount != null) {
            this.subcountIndividual = ent.salescount;
          }
          if (ent.reccount != null) {
            this.reccountIndividual = ent.reccount;
          }
        });
      })
    );
  }

  subCount(flag: string, flg: string) {
    this.subcount = 0;
    this.reccount = 0;
    this.submissionFlag = flg;
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
  subCountInd(flag: string, flg: string) {
    this.subcountIndividual = 0;
    this.reccountIndividual = 0;
    this.submissionFlagInd = flg;
    this.dashboardServ.getsubmissionCountForExAndLead(flag, this.userid).subscribe(
      ((response: any) => {
        this.subCountIndArr = response.data;
        this.subCountIndArr.forEach((ent: any) => {
          if (ent.salescount != null) {
            this.subcountIndividual = ent.salescount;
          }
          if (ent.reccount != null) {
            this.reccountIndividual = ent.reccount;
          }
        });
      })
    );
  }
  intCount(flag: string, flg: string) {
    this.interviewFlag = flg;
    this.sintcount = 0;
    this.rintcount = 0;
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

  intCountInd(flag: string, flg: string) {
    this.interviewFlagInd = flg;
    this.sintcountIndividual = 0;
    this.rintcountIndividual = 0;
    this.dashboardServ.getInterviewCountForExAndLead(flag, this.userid).subscribe(
      ((response: any) => {
        this.intCountIndArr = response.data;
        this.intCountIndArr.forEach((ent: any) => {
          if (ent.salescount != null) {
            this.sintcountIndividual = ent.salescount;
          }
          if (ent.reccount != null) {
            this.rintcountIndividual = ent.reccount;
          }
        });
      })
    );
  }
  closureCount(flag: string, flg: string) {
    this.closureFlag = flg;
    this.sclosecount = 0;
    this.rclosecount = 0;
    // console.log(this.submissionFlag + " = " + this.interviewFlag + " = " + this.closureFlag)
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
  closureCountInd(flag: string, flg: string) {
    this.closureFlagInd = flg;
    this.sclosecountIndividual = 0;
    this.rclosecountIndividual = 0;
    //console.log(this.submissionFlag + " = " + this.interviewFlag + " = " + this.closureFlag)
    this.dashboardServ.getClosureCountForExAndLead(flag, this.userid).subscribe(
      ((response: any) => {
        this.closureCountIndArr = response.data;
        this.closureCountIndArr.forEach((ent: any) => {
          if (ent.salescount != null) {
            this.sclosecountIndividual = ent.salescount;
          }
          if (ent.reccount != null) {
            this.rclosecountIndividual = ent.reccount;
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
        // console.log(response.data)
        // this.dataSource.data.map((x: any, i) => {
        //   x.serialNum = i + 1;
        // });
      }
    )
  }
  // for executive and lead


  updateSlead(sourcingLeadData: any) {
    // console.log(sourcingLeadData)
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
      if (dialogRef.componentInstance.submitted) {
        this.getSourcingLeads();
      }
    })


    // dialogRef.afterClosed().subscribe(() => {
    //   if(dialogRef.componentInstance.allowAction){
    //     //this.getAllVisa();
    //     this.getSourcingLeads();
    //   }
    // })
  }

  subPop(element: any, condition: any) {
    const actionData = {
      title: element + ' Submissions',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'submission-count',
      flag: element,
      duration: this.submissionFlag,
      condition: condition,
      userduration: this.submissionFlagInd,
      // souringData: sourcingLeadData,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '90dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'submission-count';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      SubmissionCountListComponent,
      dialogConfig
    );
  }

  intPop(element: any, condition: any) {
    //console.log(this.interviewFlag)
    const actionData = {
      title: element + ' Interviews',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'submission-count',
      flag: element,
      duration: this.interviewFlag,
      condition: condition,
      userduration: this.interviewFlagInd,
      // souringData: sourcingLeadData,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '90dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'submission-count';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      InterviewCountListComponent,
      dialogConfig
    );
  }

  closurePop(element: any, condition: any) {
    const actionData = {
      title: element + ' Closures',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'submission-count',
      flag: element,
      duration: this.closureFlag,
      condition: condition,
      userduration: this.closureFlagInd,
      // souringData: sourcingLeadData,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '90dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'submission-count';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      ClosureCountListComponent,
      dialogConfig
    );
  }

  goToConsultantInfo(id: any) {
    this.router.navigate(['usit/consultant-info', 'dashboard', 'consultant', id])
  }

  goToUserInfo(id: any) {
    this.router.navigate(['usit/user-info', 'dashboard', id])
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
}
