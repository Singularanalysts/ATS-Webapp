import { Component, NgZone, OnInit, inject } from '@angular/core';
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
import { ClosureCountListComponent } from './closure-count-list/closure-count-list.component';
import { InterviewCountListComponent } from './interview-count-list/interview-count-list.component';
import { interval, Subscription } from 'rxjs';
import { SourcingCountListComponent } from './sourcing-count-list/sourcing-count-list.component';
import { OpenReqsAnalysisComponent } from './open-reqs-analysis/open-reqs-analysis.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule, MatDatepickerModule, RouterLink, MatTooltipModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatStepperModule, MatMenuModule, MatInputModule
  ],
providers: [DatePipe]
})
export class DashboardComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  dataSourceDice = new MatTableDataSource([]);
  dataSourceTech = new MatTableDataSource([]);
  dataSourceVendor = new MatTableDataSource([]);
benchSalesEmployees: any = [];

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
    // 'Category',
    'JobLocation',
    'Vendor',
    'TaggedDate',
    'TaggedBy',
    'TCount'
   
    

  ];

 

  dataTableColumnsTechAnalysis: string[] = [
    'SNo',
    'Date',
    'Category',
    'VendorCount',
  ];
  dataTableColumnsVendorAnalysis: string[] = [
    'SNo',
    'Date',
    'Vendor',
    'CategoryCount',
  ];
  entity: any;
  datarr: any[] = [];
  private dashboardServ = inject(DashboardService);
  private router = inject(Router);
  submissionCount: any;
  closureFlag = 'Monthly';
  interviewFlag = 'daily';
  submissionFlag = 'daily';
  sourcingFlag = 'daily';

  closureFlagInd = 'Monthly';
  interviewFlagInd = 'daily';
  submissionFlagInd = 'daily';

  subCountArr: any[] = [];
  intCountArr: any[] = [];
  closecountArr: [] = [];
  sourcingcountArr: [] = [];

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

  sourcingInitiatedcount = 0;
  sourcingCompletedcount = 0;
  sourcingVerifiedcount = 0;
  sourcingMoveToSalescount = 0;

  userid!: any;
  role!: any;
  submitted = false;
  individualCounts = true;

  private intervalSubscription!: Subscription;

  private ngZone = inject(NgZone);
myForm: any;
  startDateControl:FormControl| undefined;
  endDateControl: FormControl | undefined;

constructor(private formBuilder: FormBuilder, private datePipe: DatePipe) { }
  refresh() {
    //console.log('Dash Board Refreshed '+this.refreshFlg);
    // You can perform any actions or logic inside this method
    if (this.refreshFlg == 'executive') {
      this.countCallingExecutiveAndLead();
      this.countCallingHigherRole();
    }
    else {
      this.countCallingHigherRole();
    }

    this.dashboardServ.vmstransactions().subscribe(
      ((response: any) => {
        this.datarr = response.data;
      })
    );
  }
refreshFlg = 'executive';
department!: any;
sourcingLead = true;
  ngOnInit(): void {
this.getEmployeeNames();
    // this.intervalSubscription = interval(1 * 60 * 1000)
    this.intervalSubscription = interval(30 * 1000)
      .subscribe(() => {
        this.ngZone.run(() => {
          this.refresh();
        });
      });

    this.userid = localStorage.getItem('userid');
    this.department = localStorage.getItem('department');
    if (this.department == 'Bench Sales' || this.department == 'Recruiting') {
      this.sourcingLead = false;
    }
    else {
      this.sourcingLead = true;
    }
    this.role = localStorage.getItem('role');//Sales Executive   Team Leader Recruiting  Team Leader Sales  Recruiter
    this.getDiceReqs();
    this.getSourcingLeads();
    this.getReqVendorCount();
    this.getReqCatergoryCount();
    this.dashboardServ.vmstransactions().subscribe(
      ((response: any) => {
        this.datarr = response.data;
      })
    );
    if (this.role === 'Sales Executive' || this.role === 'Team Leader Recruiting' || this.role === 'Team Leader Sales' || this.role === 'Recruiter' || this.role === 'Sales Manager' || this.role === 'Recruiting Manager') {
      this.individualCounts = true;
      this.refreshFlg = 'executive'
    }
    else {
      this.individualCounts = false;
      this.refreshFlg = 'company'
    }
    this.countCallingExecutiveAndLead();
    this.countCallingHigherRole();
  
    this.myForm = this.formBuilder.group({
      startDate: [''], // Set default value if needed
      endDate: [''], // Set default value if needed
      benchSalesEmployees: [''] // Set default value if needed
    });
    const endDateControl = this.myForm.get('endDate');
    if (!endDateControl.value) {
      const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      endDateControl.setValue(currentDate);
    }
   
  }
  ngOnDestroy() {
    // Unsubscribe from the interval to prevent memory leaks
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
   console.log("destroyed")
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
    this.dashboardServ.getsourcingCount('daily').subscribe(
      ((response: any) => {
        this.sourcingcountArr = response.data;
        this.sourcingVerifiedcount = response.data.verified;
        this.sourcingMoveToSalescount = response.data.moveToSales;
        this.sourcingInitiatedcount = response.data.initiated;
        this.sourcingCompletedcount = response.data.completed;
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

  sourcingCount(flag: string, flg: string) {
    this.sourcingFlag = flg;
    this.sourcingInitiatedcount = 0;
    this.sourcingCompletedcount = 0;
    this.sourcingVerifiedcount = 0;
    this.sourcingMoveToSalescount = 0;
    this.dashboardServ.getsourcingCount(flag).subscribe(
      ((response: any) => {
        this.sourcingcountArr = response.data;
        this.sourcingVerifiedcount = response.data.verified;
        this.sourcingMoveToSalescount = response.data.moveToSales;
        this.sourcingInitiatedcount = response.data.initiated;
        this.sourcingCompletedcount = response.data.completed;
      })
    );
  }

  getSourcingLeads() {
    this.dashboardServ.getSourcingLeads(this.userid).subscribe(
      (response: any) => {
        //this.entity = response.data;
        this.dataSource.data = response.data;
        // this.dataSource.data.map((x: any, i) => {
        //   x.serialNum = i + 1;
        // });
      }
    )
  }
  // for executive and lead


  updateSlead(sourcingLeadData: any) {
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
    );
  }


  sourcingPop(element: any, condition: any) {
    const actionData = {
      title: element + ' Consultants List',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'sourcing-count',
      flag: element,
      duration: this.sourcingFlag,
      condition: condition,
      // userduration: this.closureFlagInd,
      // souringData: sourcingLeadData,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '90dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'sourcing-count';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      SourcingCountListComponent,
      dialogConfig
    );
  }
  
  search = 'empty'
  getReqVendorCount() {
    this.dashboardServ.getReqCounts(this.search, 'count', 'vendor', 'empty').subscribe(
      (response: any) => {
        this.dataSourceTech.data = response.data;
        this.dataSourceTech.data.map((x: any, i) => {
          x.serialNum = i + 1;
        });
      }
    )
  }
  
  getReqCatergoryCount() {
    this.dashboardServ.getReqCounts(this.search, 'count', 'category', 'empty').subscribe(
      (response: any) => {
        this.dataSourceVendor.data = response.data;
        this.dataSourceVendor.data.map((x: any, i) => {
          x.serialNum = i + 1;
        });
      }
    )
  }

  vendorCategoryPopup(vendorOrCategory: any, date: any, type: any) {
    const actionData = {
      title: vendorOrCategory,
      vendorOrCategory: vendorOrCategory,
      date: date,
      type: type,
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'vendor-category-count',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '90dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'vendor-category-count';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      OpenReqsAnalysisComponent,
      dialogConfig
    );
  }

  onVendorFilter(event: any){
    this.dataSourceVendor.filter = event.target.value;
  }

  onDiceFilter(event: any){
    this.dataSourceDice.filter = event.target.value;
  }

  onCategoryFilter(event: any){
    this.dataSourceTech.filter = event.target.value;
  }
//lavanya
  getEmployeeNames() {
    this.dashboardServ.getEmployeeName().subscribe(
      (response: any) => {
        // Assuming the API response contains an array of objects with 'name' property for each employee
        this.benchSalesEmployees = response.data;
      },
      (error: any) => {
        console.error('Error fetching employee names:', error);
      }
    );
  }

  onEmployeeChange(event: any): void {
    const fromDate = this.myForm.get('startDate').value; 
    const toDate = this.myForm.get('endDate').value; 
    const empId = event.value; 
    const formatedStartDate = this.formatDate(fromDate);
    const formatedEndDate = this.formatDate(toDate);
    this.filterData(formatedStartDate, formatedEndDate, empId);

  }
 formatDate(date: string): string {
    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();
    const month = ("0" + (selectedDate.getMonth() + 1)).slice(-2);
    const day = ("0" + selectedDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  filterData(startDate: any, endDate: any, empId: any) {

    this.dashboardServ.getFilteredEmployee(startDate, endDate, empId)
      .subscribe(
        (response: any) => {
          // Check if response contains data property
          if (response && response.data) {
            // Assign the response data to the dataSource for displaying filtered data
            this.dataSourceDice.data = response.data;
            // Reassign serial numbers after filtering
            this.dataSourceDice.data.forEach((item: any, index: number) => {
              item.serialNum = index + 1;
            });
          } else {
            // Handle empty or invalid response
            console.error('Invalid response:', response);
          }
        },
        (error: any) => {
          // Handle errors here
          console.error('An error occurred:', error);
        }
      );
  }
  
  refreshData() {
    // Reset form fields
    this.myForm.reset();
    this.getDiceReqs();
    const endDateControl = this.myForm.get('endDate');
    if (!endDateControl.value) {
      const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      endDateControl.setValue(currentDate);
    }
   
  }
//

}



