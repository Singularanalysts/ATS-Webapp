import { Component, NgZone, OnInit, inject ,ViewChild } from '@angular/core';
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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
import { PrivilegesService } from 'src/app/services/privileges.service';
import { utils, writeFile } from 'xlsx';
import { EmpAppliedJobsListComponent } from './emp-applied-jobs-list/emp-applied-jobs-list.component';
import { EmpSubmissionsListComponent } from './emp-submissions-list/emp-submissions-list.component';
import { EmpInterviewsListComponent } from './emp-interviews-list/emp-interviews-list.component';
import { JsonpInterceptor } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule,MatAutocompleteModule, MatPaginatorModule, MatSelectModule, ReactiveFormsModule, MatDatepickerModule,  MatTooltipModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatStepperModule, MatMenuModule, MatInputModule
  ],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  dataSourceDice = new MatTableDataSource([]);
  dataSourceDicelax = new MatTableDataSource([]);
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
  showReport: boolean = false;
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

  empAppliedJobsFlag = "Today";
  empSubmissionsFlag = "Today";
  empInterviewsFlag = "Today";

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

  empAppliedJobsCount = 0;
  empSubmissionCount = 0;
  empInterviewCount = 0;

  userid!: any;
  role!: any;
  submitted = false;
  individualCounts = true;

  private intervalSubscription!: Subscription;
  protected privilegeServ = inject(PrivilegesService);
  private ngZone = inject(NgZone);
  myForm: any;
  startDateControl: FormControl | undefined;
  endDateControl: FormControl | undefined;
  public dialog= inject(MatDialog);
  ratingflag: string = 'Monthly'; // Default selection
  selectedFilter: string = 'monthly'; // Default API filter
  performanceData: any = null; // Holds the fetched data
  
  sourcingCountRating(filterType: string, displayName: string) {
    this.ratingflag = displayName; // Update UI label
    this.selectedFilter = filterType; // Update API filter
    
    this.getPerformanceRatings(filterType);
  }
  
  getPerformanceRatings(filter?: string) {
    this.privilegeServ.getPerformanceRatings(filter).subscribe({
      next: (response: any) => {
        this.performanceData = response.data;
        this.calculateStars(response.data.avg_rating);
      },
      error: (error: any) => {
        console.error('Error fetching ratings:', error);
      }
    });
  }
  fullStars:any
  halfStar:any
  // Compute full and half stars
  calculateStars(avgRating: number) {
    const fullStarsCount = Math.floor(avgRating);
    this.fullStars = Array(fullStarsCount).fill(0); // Array of full stars
    this.halfStar = avgRating % 1 !== 0; // Show half star if needed
  }
// pagination code
page: number = 1;
itemsPerPage = 50;
AssignedPageNum !: any;
totalItems: any;
field = "empty";
currentPageIndex = 0;
pageEvent!: PageEvent;
// pageSize = 50;
showPageSizeOptions = true;
showFirstLastButtons = true;
pageSizeOptions = [50, 75, 100];

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe) { }
  refresh() {
    this.closureFlag = 'Monthly';
    this.interviewFlag = 'daily';
    this.submissionFlag = 'daily';
    this.sourcingFlag = 'daily';

    this.closureFlagInd = 'Monthly';
    this.interviewFlagInd = 'daily';
    this.submissionFlagInd = 'daily';

    this.empAppliedJobsFlag = "Today";
    this.empSubmissionsFlag = "Today";
    this.empInterviewsFlag = "Today";

    this.sclosecount = 0;
    this.rclosecount = 0;
    this.sintcount = 0;
    this.rintcount = 0;
    this.subcount = 0;
    this.reccount = 0;
    this.sourcingVerifiedcount = 0;
    this.sourcingMoveToSalescount = 0;
    this.sourcingInitiatedcount = 0;
    this.sourcingCompletedcount = 0;
    this.sclosecountIndividual = 0;
    this.rclosecountIndividual = 0;
    this.sintcountIndividual = 0;
    this.rintcountIndividual = 0;
    this.subcountIndividual = 0;
    this.reccountIndividual = 0;

    this.empAppliedJobsCount = 0;
    this.empSubmissionCount = 0;
    this.empInterviewCount = 0;

    if (this.department !== 'Consultant' && this.role !== 'Employee') {
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
    } else {
      this.employeeDefaultCount();
    }
    
  }
  refreshFlg = 'executive';
  department!: any;
  sourcingLead = true;
  ngOnInit(): void {
    this.getPerformanceRatings(this.ratingflag)
const previlage= localStorage.getItem('privileges')
console.log(previlage,'previlage');

    const shoWresult = this.privilegeServ.hasPrivilege('EXCEL_EXPORT')

    console.log(shoWresult,'shoWresult');
    
    if (shoWresult) {
      this.showReport = true;
    } else {
      this.showReport = false;
    }
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
    if (this.department !== 'Consultant' && this.role !== 'Employee') {
      // this.getDiceReqs(); 
      this.getDiceReqss(1); 
      // this.getDiceReqss();
      this.getSourcingLeads();
      // this.getReqVendorCount();
      // this.getReqCatergoryCount();
      // this.getEmployeeNames();
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
    } else {
      this.employeeDefaultCount();
    }
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
  goToCompany(companyName: string) {
    this.router.navigate(['/usit/vendors'], { queryParams: { company: companyName } });
    console.log(companyName,'companyname');
    
  }
  navigateToRecruiters(vendorName: string) {
    this.router.navigate(['/usit/recruiters'], { queryParams: { company: vendorName } });
    console.log(vendorName,'vendornameee');
    
  }
  ngOnDestroy() {
    // Unsubscribe from the interval to prevent memory leaks
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
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

  // getSourcingLeads() {
  //   this.dashboardServ.getSourcingLeads(this.userid).subscribe(
  //     (response: any) => {
  //       //this.entity = response.data;
  //       this.dataSource.data = response.data;
  //       // this.dataSource.data.map((x: any, i) => {
  //       //   x.serialNum = i + 1;
  //       // });
  //     }
  //   )
  // }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  currentPage = 1;
  pageSize = 13;
  totalPages = 1;
  
  getSourcingLeads() {
    const payload = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      userId: this.userid
    };
  
    this.dashboardServ.getSourcingLeads(payload).subscribe(
      (response: any) => {
        this.dataSource.data = response.data.content;
        const totalRecords = response.data.totalElements;
console.log(totalRecords,'totalrecords'); 
        this.totalPages = Math.ceil(totalRecords / this.pageSize);
      }
    );
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getSourcingLeads();
    }
  }
  
  nextPage() {
    console.log('nextpage');

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      console.log('sourceleads');
      
      this.getSourcingLeads();
    }
  }
  
  goToPage(page: number) {
    this.currentPage = page;
    this.getSourcingLeads();
  }
  
  // Function to display only 4 pages at a time
  getPageNumbers(): number[] {
    const maxPagesToShow = 4;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
  
    return Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);
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
  handleExport() {
    const currentDate = new Date();
    const chicagoDate = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(currentDate);

    const headings = [[
      'Posted Date',
      'Job Title',
      'Job Location',
      'Vendor',
      'Tagged Date',
      'Tagged Count',
      'Tagged Name'
    ]];
    const excelData = this.dataSourceDice.data.map((c: any) => [
      c.posted_on,
      c.job_title,
      c.category_skill,
      c.job_location,
      c.vendor,
      c.taggeddate,
      c.pseudoname,
      c.taggedcount,
    ]);

    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, excelData, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'data');
    writeFile(wb, 'daily-requirement-tagged@' + chicagoDate + '.xlsx');
  }

  goToConsultantInfo(id: any) {
    this.router.navigate(['usit/consultant-info', 'dashboard', 'consultant', id])
  }

  goToUserInfo(id: any) {
    this.router.navigate(['usit/user-info', 'dashboard', id])
  }

  currentPagedice = 1;
  pageSizedice = 13;
  totalPagesdice = 1;
    showTable = false;  // Initially hide the table

  toggleTable() {
    this.showTable = !this.showTable;
    if (this.showTable && this.dataSourceDice.data.length === 0) {
      this.getDiceReqs(); // Fetch data only when table is first opened
    }
  }
  getDiceReqs() {
    const payload = {
      pageNumber: this.currentPagedice,
      pageSize: this.pageSizedice,
      userId: 0,
      role:this.role
    };
  
    this.dashboardServ.getDiceRequirements(payload).subscribe(
      (response: any) => {
        this.dataSourceDice.data = response.data.content;
        console.log(this.dataSourceDice.data, 'this.dataSourceDice.data');
  
        const totalRecords = response.data.totalElements;
        console.log(totalRecords, 'Total Records');
  
        this.totalPagesdice = Math.ceil(totalRecords / this.pageSize);
      }
    );
  }
  
  prevPagedice() {
    if (this.currentPagedice > 1) {
      this.currentPagedice--;
      this.getDiceReqs();
    }
  }
  
  nextPagedice() {
    if (this.currentPagedice < this.totalPagesdice) {
      this.currentPagedice++;
      console.log('dailyrequireents');

      this.getDiceReqs();
    }
  }
  
  goToPagedice(page: number) {
    this.currentPagedice = page;
    this.getDiceReqs();
  }
  
  // Function to display only 4 pages at a time
  getPageNumbersdice(): number[] {
    const maxPagesToShow = 4;
    let startPage = Math.max(1, this.currentPagedice - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPagesdice, startPage + maxPagesToShow - 1);
  
    return Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);
  }
  
  // allData: any = []; // Stores full data
  // pageSizedata = 20; // Number of items per load
  // currentPage = 1; // Tracks the page number
  // getDiceReqs() {
  //   this.dashboardServ.getDiceRequirements(this.role, this.userid).subscribe((response: any) => {
  //     this.allData = response.data;
      
  //     this.loadMore();
  //   });
  // }
  // displayedColumns: string[] = ['PostedDate', 'JobTitle', 'Category', 'JobLocation', 'Vendor', 'TaggedDate', 'TaggedBy', 'TCount'];

  // loadMore() {
  //   const nextData = this.allData.slice(0, this.currentPage * this.pageSizedata);
  //   this.dataSourceDice.data = nextData;
  //   console.log( this.dataSourceDice.data ,' this.dataSourceDice.data ');
    
  //   this.currentPage++;
  // }

  // getDiceReqss(pagIdx: any = 1, pagesize: any = 50, sortField: any="Postedon", sortOrder: any = "desc" , keyword: any = "empty") {
  //   // getDiceReqss(sortField: any="Title", sortOrder: any = "asc") {
  //   const actData = {
  //     pageNumber: pagIdx,
  //     pageSize: pagesize,
  //     sortField: sortField,
  //     sortOrder: sortOrder,
  //     keyword: keyword,
  //     userid :this.userid
  //   };

  //   this.dashboardServ.getDiceRequirementslax(this.role, actData).subscribe(
  //     (response: any) => {
  //       //this.entity = response.data;
  //       this.dataSourceDicelax.data = response.data.content;
  //       console.log( this.dataSourceDicelax.data,'other same data');
        
  //       this.totalItems = response.data.totalElements;
  //       this.dataSourceDicelax.data.map((x: any, i) => {
  //         // x.serialNum = i + 1;
  //         x.serialNum = this.generateSerialNumber(i);
  //       });
  //     }
  //   );
  // }
  getDiceReqss(pagIdx: any = 1, pagesize: any = 50, sortField: any = "Postedon", sortOrder: any = "desc", keyword: any = "empty") {
    const actData = {
      pageNumber: pagIdx,
      pageSize: pagesize,
      sortField: sortField,
      sortOrder: sortOrder,
      keyword: keyword,
      userid: this.userid
    };
  
    const apiCall = this.dashboardServ.getDiceRequirementslax(this.role, actData);
  
    if (apiCall) { // Only make API call if apiCall is not null
      apiCall.subscribe(
        (response: any) => {
          this.dataSourceDicelax.data = response.data.content;
          console.log(this.dataSourceDicelax.data, 'other same data');
  
          this.totalItems = response.data.totalElements;
          this.dataSourceDicelax.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
        }
      );
    } else {
      console.log("No API call required for this role.");
    }
  }
  

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getDiceReqss(event.pageIndex + 1);
    }
    return;
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  // getDiceReqss() {
  //   this.dashboardServ.getDiceRequirementss().subscribe(
  //     (response: any) => {
  //       this.dataSourceDice.data = response.data;
  //     }
  //   );
  // }

  openLink(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
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

  onVendorFilter(event: any) {
    this.dataSourceVendor.filter = event.target.value;
  }

  onDiceFilter(event: any) {
    this.dataSourceDice.filter = event.target.value;
  }


  onCategoryFilter(event: any) {
    this.dataSourceTech.filter = event.target.value;
  }
  //lavanya
  // benchSalesEmployees: any[] = []; // Store employees

  // Remove this from ngOnInit()
  // ngOnInit() { this.getEmployeeNames(); }  ❌ Remove this
  
  getEmployeeNames(): void {
    if (this.benchSalesEmployees.length > 0) return; // Prevent multiple API calls
  
    this.dashboardServ.getEmployeeName().subscribe({
      next: (response: any) => {
        this.benchSalesEmployees = response.data; // Store employee names
      },
      error: (error: any) => {
        console.error('Error fetching employee names:', error);
      }
    });
  }
  
  onEmployeeChange(selectedOption: any): void {
    if (!selectedOption) return;
  
    this.selectedEmployeeName = selectedOption.value[1]; // Set name for display
    const empId = selectedOption.value[0]; // Get ID for API
  
    const fromDate = this.myForm.get('startDate').value;
    const toDate = this.myForm.get('endDate').value;
    const formattedStartDate = this.formatDate(fromDate);
    const formattedEndDate = this.formatDate(toDate);
  
    this.filterData(formattedStartDate, formattedEndDate, empId);
  }
  

  // onEmployeeChange(event: any): void {
  //   const fromDate = this.myForm.get('startDate').value;
  //   const toDate = this.myForm.get('endDate').value;
  //   const empId = event.value;
  //   const formatedStartDate = this.formatDate(fromDate);
  //   const formatedEndDate = this.formatDate(toDate);
  //   this.filterData(formatedStartDate, formatedEndDate, empId);

  // }
  employeeControl = new FormControl('');

  selectedEmployeeName:any
  // onEmployeeChange(selectedOption: any): void {
  //   if (!selectedOption) return;

  //   this.selectedEmployeeName = selectedOption.value[1]; // Set the name for display
  //   const empId = selectedOption.value[0]; // Get ID for API

  //   const fromDate = this.myForm.get('startDate').value;
  //   const toDate = this.myForm.get('endDate').value;
  //   const formatedStartDate = this.formatDate(fromDate);
  //   const formatedEndDate = this.formatDate(toDate);

  //   this.filterData(formatedStartDate, formatedEndDate, empId);
  // }
  formatDate(date: string): string {
    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();
    const month = ("0" + (selectedDate.getMonth() + 1)).slice(-2);
    const day = ("0" + selectedDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  filterData(fromDate: any, toDate: any, userId: any) {
    const payload = { fromDate, toDate, userId,
      pageNumber: this.currentPagedice,  // Include pagination
      pageSize: this.pageSizedice
     }; // Send data in the request body
  
    this.dashboardServ.getFilteredEmployee(payload)
      .subscribe(
        (response: any) => {
          if (response && response.data) {
            this.dataSourceDice.data = response.data.content;
  
            // Assign serial numbers after filtering
            this.dataSourceDice.data.forEach((item: any, index: number) => {
              item.serialNum = index + 1;
            });
          } else {
            console.error('Invalid response:', response);
          }
        },
        (error: any) => {
          console.error('An error occurred:', error);
        }
      );
  }
  
  refreshData() {
    this.myForm.reset();
    this.getDiceReqs();
    this.employeeControl.setValue('')
    const endDateControl = this.myForm.get('endDate');
    if (!endDateControl.value) {
      const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      endDateControl.setValue(currentDate);
    }

  }

  employeeDefaultCount() {
    const appliedObj = {
      type: "appliedjobs",
      userid: this.userid,
      interval: "today",
    }
    this.dashboardServ.getEmployeeDashboardCount(appliedObj).subscribe({
      next: (response: any) => {
        this.empAppliedJobsCount = response.data;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
    const subObj = {
      type: "submissions",
      userid: this.userid,
      interval: "today",
    }
    this.dashboardServ.getEmployeeDashboardCount(subObj).subscribe({
      next: (response: any) => {
        this.empSubmissionCount = response.data;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
    const intObj = {
      type: "interviews",
      userid: this.userid,
      interval: "today",
    }
    this.dashboardServ.getEmployeeDashboardCount(intObj).subscribe({
      next: (response: any) => {
        this.empInterviewCount = response.data;
      },
      error: (err: any) => {
        console.log(err);
      }
    });

    this.dashboardServ.getEmployeeDashboardRecentActivity(this.userid).subscribe({
      next: (response: any) => {
        this.datarr = response.data;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  employeeAppliedJobsCount(flg: any, interval: any) {
    this.empAppliedJobsFlag = interval;
    const appliedObj = {
      type: "appliedjobs",
      userid: this.userid,
      interval: flg,
    }
    this.dashboardServ.getEmployeeDashboardCount(appliedObj).subscribe({
      next: (response: any) => {
        this.empAppliedJobsCount = response.data;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  employeeSubmissionCount(flg: any, interval: any) {
    this.empSubmissionsFlag = interval;
    const subObj = {
      type: "submissions",
      userid: this.userid,
      interval: flg,
    }
    this.dashboardServ.getEmployeeDashboardCount(subObj).subscribe({
      next: (response: any) => {
        this.empSubmissionCount = response.data;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  employeeInterviewCount(flg: any, interval: any) {
    this.empInterviewsFlag = interval;
    const intObj = {
      type: "interviews",
      userid: this.userid,
      interval: flg,
    }
    this.dashboardServ.getEmployeeDashboardCount(intObj).subscribe({
      next: (response: any) => {
        this.empInterviewCount = response.data;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  empAppliedJobsPopup() {
    this.dialog.open(EmpAppliedJobsListComponent,
      {
        width: '80%',
        data: {
          id: this.userid,
          duration: this.empAppliedJobsFlag,
        },
      });
  }

  empSubmissionsPopup() {
    this.dialog.open(EmpSubmissionsListComponent,
      {
        width: '80%',
        data: {
          id: this.userid,
          duration: this.empSubmissionsFlag,
        },
      });
  }

  empInterviewsPopup() {
    this.dialog.open(EmpInterviewsListComponent,
      {
        width: '80%',
        data: {
          id: this.userid,
          duration: this.empInterviewsFlag,
        },
      });
  }
  
}