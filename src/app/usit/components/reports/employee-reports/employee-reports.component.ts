import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, Validators } from '@angular/forms';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { ReportsService } from 'src/app/usit/services/reports.service';
import { utils, writeFile } from 'xlsx';
import { DialogService } from 'src/app/services/dialog.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InterviewReportComponent } from './interview-report/interview-report.component';
import { ConsultantReportComponent } from './consultant-report/consultant-report.component';
import { SubmissionReportComponent } from './submission-report/submission-report.component';
import { PrivilegesService } from 'src/app/services/privileges.service';

interface Select {
  value: string;
  display: String;
}

@Component({
  selector: 'app-employee-reports',
  templateUrl: './employee-reports.component.html',
  styleUrls: ['./employee-reports.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class EmployeeReportsComponent {
  excutivewiseSales: string[] = [
    '#',
    'Consultant/Employee/Vendor',
    'Submission',
    'Interview',
    'Scheduled',
    'Hold',
    'Closed',
    'Rejected',
    'On Boarded',
    'Back Out',
    'Selected',
  ];
  excutivewiseRecruting: string[] = [
    '#',
    'Consultant/Employee/Vendor',
    'Reqs',
    'Submission',
    'Interview',
    'Scheduled',
    'Hold',
    'Closed',
    'Rejected',
    'On Boarded',
    'Back Out',
    'Consultant',
    'Selected',
  ];
  VendorSales: string[] = [
    '#',
    'Consultant/Employee/Vendor',
    'Reqs',
    'Submission',
    'Interview',
    'Scheduled',
    'Hold',
    'Closed',
    'Rejected',
    'On Boarded',
    'Back Out',
    'Consultant',
    'Selected',
  ];
  selectedGroupBy: string = 'Select GroupBy';
  employeeReport!: FormGroup;
  isSelected: boolean = true;
  selectedDepartment: string = 'Select Departmentr';
  groupBy: Select[] = [
    { value: '', display: 'Select GroupBy' },
    { value: 'employee', display: 'Executive Wise' },
    { value: 'consultant', display: 'Consultant' },
    { value: 'requirements', display: 'Vendor Wise' },
  ];
  consultant: any;
  protected privilegeServ = inject(PrivilegesService);
  reset() {
    this.employeeReport.reset();
  }
  private router = inject(Router);
  disFlg!: boolean;
  flag!: boolean;
  hideflg = true;
  groupby = '';
  flag2 = false;
  flag3 = false;
  subTotal = 0;
  selectTotal = 0;
  intTotal = 0;
  reqsTotal = 0;
  scheduleTotal = 0;
  holdTotal = 0;
  closedTotal = 0;
  rejectTotal = 0;
  consultantTotal = 0;
  onboardedCnt = 0;
  backoutCnt = 0;
  submitted: boolean = false;
  showReport: boolean = false;
  passName!:string;
  onSort(event: any) { }
  c_data: any[] = [];
  Activecnt = 0;
  stdate!: any;
  eddate!: any;
  hiddenflg = 'main';
  dataTableColumns: string[] = [];
  drilldown(
    id: any,
    status: any,
    executive: string,
    consul: string,
    company: string
  ) {
    this.submissionPopup();
    if (this.vo.groupby == 'employee') {
      this.passName = executive;
    }
    else if (this.vo.groupby == 'consultant') {
      this.passName = consul;
    }
    else {
      this.passName = company;
    }


    if (status == 'submission') {
      const dialogRef = this.dialog.open(SubmissionReportComponent, {
        width: '80%', // adjust the width as needed
        // data: this.vo,
        data: {
          vo: this.vo,
          additionalValue1: this.passName,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        // handle any result or action after the dialog is closed
      });
    } else if (
      status == 'interview' ||
      status == 'Schedule' ||
      status == 'Hold' ||
      status == 'Closed' ||
      status == 'Rejected' ||
      status == 'onboarded' ||
      status == 'backout' ||
      status == 'Selected'
    ) {
      const dialogRef = this.dialog.open(InterviewReportComponent, {
        width: '80%', // adjust the width as needed
        // data: this.vo,
        data: {
          vo: this.vo,
          additionalValue1: this.passName,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        // handle any result or action after the dialog is closed
      });
    } else if (status == 'consultant') {
      const dialogRef = this.dialog.open(ConsultantReportComponent, {
        width: '80%', // adjust the width as needed
        data: {
          vo: this.vo,
          additionalValue1: this.passName,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        // handle any result or action after the dialog is closed
      });
    }

    this.hiddenflg == 'submain';
    if (consul == null && company == null) {
      this.executive = executive;
    } else if (executive == null && consul == null) {
      this.executive = company;
    } else {
      this.executive = consul;
    }
    this.vo.id = id;
    this.submenuflg = status;
    this.vo.startDate = this.employeeReport.get('startDate')?.value;
    this.vo.endDate = this.employeeReport.get('endDate')?.value;
    this.vo.groupby = this.employeeReport.get('groupby')?.value;
    this.vo.flg = this.employeeReport.get('flg')?.value;
    this.vo.status = status;
    return this.reportservice
      .consultant_DrillDown_report(this.vo)
      .subscribe((response: any) => {
        this.consultant = response.data;
        // console.log(JSON.stringify(response.data))
      });
  }

  vo = new ReportVo();
  submenuflg = '';
  executive = '';
  consultantname = '';
  updateDisplayedColumns() {
    // Get values from the form
    const selectedGroupBy = this.employeeReport.get('groupBy')?.value;
    const selectedDepartment =
      this.employeeReport.get('selectDepartment')?.value;

    // Determine which headers to use based on user selection
    if (
      selectedGroupBy === 'Executive Wise' ||
      (selectedGroupBy === 'Consultant Wise' && selectedDepartment === 'sales')
    ) {
      this.dataTableColumns = this.excutivewiseSales.slice();
    } else if (
      selectedGroupBy === 'Executive Wise' &&
      selectedDepartment === 'Recruiting'
    ) {
      this.dataTableColumns = this.excutivewiseRecruting.slice();
    } else if (
      selectedGroupBy === 'Vendor Wise' &&
      selectedDepartment === 'Sales'
    ) {
      this.dataTableColumns = this.VendorSales.slice();
    } else {
      // Set default columns if no specific condition is met
      this.dataTableColumns = ['number', 'cost'];
    }
  }

  generateSerialNumber(index: number): string {
    const serialNumber = (this.page - 1) * this.tableSize + index + 1;
    return serialNumber.toString();
  }
  dataSource = new MatTableDataSource<any>([]);
  page: number = 1;
  count: number = 0;
  tableSize: number = 1000;
  tableSizes: any = [3, 6, 9, 12];
  onTableDataChange(event: any) {
    this.page = event;
  }
  toggle(event: any) {
    const value = event.target.value;
    if (value == 'consultant') {
      this.disFlg = true;
    } else {
      this.disFlg = false;
    }
    if (value == 'Recruiting') {
      this.flag = true;
    } else {
      this.flag = false;
    }
  }
  // pagination code

  itemsPerPage = 50;
  AssignedPageNum!: any;
  totalItems: any;
  field = 'empty';
  currentPageIndex = 0;
  pageEvent!: PageEvent;
  pageSize = 50;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageSizeOptions = [50, 75, 100];
  private getDialogConfigData(
    dataToBeSentToDailog: Partial<IConfirmDialogData>,
    action: {
      delete: boolean;
      edit: boolean;
      add: boolean;
      updateSatus?: boolean;
    }
  ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width =
      action.edit || action.add
        ? '62dvw'
        : action.delete
          ? 'fit-content'
          : '400px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = dataToBeSentToDailog.actionName;
    dialogConfig.data = dataToBeSentToDailog;
    return dialogConfig;
  }

  constructor(
    private formBuilder: FormBuilder,
    private reportservice: ReportsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.employeeReport = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      groupby: ['', Validators.required],
      flg: ['', Validators.required],
    });

    // Subscribe to form value changes
    this.employeeReport.valueChanges.subscribe(() => {
      this.updateDisplayedColumns();
    });
  }

  selectDepartment: Select[] = [
    { value: '', display: 'Select Department' },
    { value: 'sales', display: 'Sales' },
    { value: 'Recruiting', display: 'Recruiting' },
  ];

  trackByFunction(index: number, thing: any): any {
    return thing.value; // Replace with an appropriate unique identifier from your data
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }
  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
    }
    return;
  }
  grpby = '';
  onSubmit() {

    const shoWresult = this.privilegeServ.hasPrivilege('US_M1EXCELIMP')
    this.submitted = true;
    if (this.employeeReport.invalid) {
      this.showReport = false;
      return;
    }
    //consultant_report
    if (shoWresult) {
      this.showReport = true;
    } else {
      this.showReport = false;
    }

    this.vo.startDate = this.employeeReport.get('startDate')?.value;
    this.vo.endDate = this.employeeReport.get('endDate')?.value;
    this.vo.flg = this.employeeReport.get('flg')?.value;
    this.vo.groupby = this.employeeReport.get('groupby')?.value;
    const groupBy = this.employeeReport.get('groupby')?.value;
    const flg = this.employeeReport.get('flg')?.value;
    this.groupby = groupBy;

    if (groupBy == 'employee') {
      this.hideflg = false;
      this.grpby = 'employee';
    }
    else if (groupBy == 'requirements' && this.vo.flg != 'sales') {
      this.hideflg = true;
      this.grpby = 'requirements';
      this.flag3 = true;
    }
    else {
      this.hideflg = true;
      this.grpby = 'requirements';
      this.flag3 = false;
    }

    if (this.vo.flg == 'Recruiting' && this.grpby != 'requirements') {
      this.flag2 = true;
    }
    else {
      this.flag2 = false;
    }
    // console.log(JSON.stringify(this.vo) + "   ==  " + JSON.stringify(this.employeeReport.value))
    this.reportservice.consultant_report(this.employeeReport.value)
      .subscribe((data: any) => {
        this.c_data = data.data;
        //  console.log(JSON.stringify(this.c_data))
        this.subTotal = this.c_data.reduce((a, b) => a + b.submission, 0);
        this.intTotal = this.c_data.reduce((a, b) => a + b.interview, 0);
        this.scheduleTotal = this.c_data.reduce((a, b) => a + b.schedule, 0);
        this.holdTotal = this.c_data.reduce((a, b) => a + b.onhold, 0);
        this.closedTotal = this.c_data.reduce((a, b) => a + b.closed, 0);
        this.rejectTotal = this.c_data.reduce((a, b) => a + b.rejected, 0);
        this.onboardedCnt = this.c_data.reduce((a, b) => a + b.onboarded, 0);
        this.selectTotal = this.c_data.reduce((a, b) => a + b.selected, 0);
        this.backoutCnt = this.c_data.reduce((a, b) => a + b.backout, 0);
        this.consultantTotal = this.c_data.reduce((a, b) => a + b.consultant, 0); // 
        this.reqsTotal = this.c_data.reduce((a, b) => a + b.req_count, 0);
      });
  }

  printPage() {
    window.print();
  }
  headings: any[] = [];
  excelData: any[] = [];

  submissionPopup() {
    // const dataToBeSentToDailog = {
    //   title: 'Add Employee',
    //   empployeeData: null,
    //   actionName: 'add-employee',
    // };
    // const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog, {
    //   delete: false,
    //   edit: false,
    //   add: true,
    // });
    // const dialogRef = this.dialogServ.openDialogWithComponent(
    //   SubmissionReportComponent,
    //   dialogConfig
    // );
    // dialogRef.afterClosed().subscribe(() => {
    //   if (dialogRef.componentInstance.submitted) {
    //     //this.getAllEmployees()
    //   }
    // });
  }

  excelImport() {
    console.log(this.vo)
    if (this.vo.groupby == 'employee' && this.vo.flg == 'sales') {
      this.headings = [[
        'Employee Name',
        'Submission',
        'Interview',
        'Schedule',
        'Hold',
        'Closed',
        'Rejected',
        'On Boarded',
        'Back Out',
        'Selected',
      ]];
      this.excelData = this.c_data.map(c => [
        c.pseudoname,
        c.submission,
        c.interview,
        c.schedule,
        c.onhold,
        c.closed,
        c.rejected,
        c.onboarded,
        c.backout,
        c.selected,
      ]);
    }
    else if (this.vo.groupby == 'consultant' && this.vo.flg == 'sales') {
      this.headings = [[
        'Consultant Name',
        'Submission',
        'Interview',
        'Schedule',
        'Hold',
        'Closed',
        'Rejected',
        'On Boarded',
        'Back Out',
        'Selected',
      ]];
      this.excelData = this.c_data.map(c => [
        c.consultantname,
        c.submission,
        c.interview,
        c.schedule,
        c.onhold,
        c.closed,
        c.rejected,
        c.onboarded,
        c.backout,
        c.selected,
      ]);
    }

    else if (this.vo.groupby == 'employee' && this.vo.flg == 'Recruiting') {
      this.headings = [[
        'Employee Name',
        'Submission',
        'Interview',
        'Schedule',
        'Hold',
        'Closed',
        'Rejected',
        'On Boarded',
        'Back Out',
        'Profiles Pulled',
        'Selected',
      ]];
      this.excelData = this.c_data.map(c => [
        c.pseudoname,
        c.submission,
        c.interview,
        c.schedule,
        c.onhold,
        c.closed,
        c.rejected,
        c.onboarded,
        c.backout,
        c.consultant,
        c.selected,
      ]); //groupby: "requirements", flg: "Recruiting"
    }

    else if (this.vo.groupby == 'requirements' && this.vo.flg == 'Recruiting') {
      this.headings = [[
        'Vendor',
        'Reqs',
        'Submission',
        'Interview',
        'Schedule',
        'Hold',
        'Closed',
        'Rejected',
        'On Boarded',
        'Back Out',
        'Selected',
      ]];
      this.excelData = this.c_data.map(c => [
        c.company,
        c.req_count,
        c.submission,
        c.interview,
        c.schedule,
        c.onhold,
        c.closed,
        c.rejected,
        c.onboarded,
        c.backout,
        c.selected,
      ]);
    }

    else if (this.vo.groupby == 'requirements' && this.vo.flg == 'sales') {
      this.headings = [[
        'Vendor',
        'Submission',
        'Interview',
        'Schedule',
        'Hold',
        'Closed',
        'Rejected',
        'On Boarded',
        'Back Out',
        'Selected',
      ]];
      this.excelData = this.c_data.map(c => [
        c.company,
        c.submission,
        c.interview,
        c.schedule,
        c.onhold,
        c.closed,
        c.rejected,
        c.onboarded,
        c.backout,
        c.selected,
      ]);
    }

    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, this.headings);
    utils.sheet_add_json(ws, this.excelData, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'data');
    writeFile(wb, 'Report@' + this.vo.groupby + ' ' + this.vo.flg + ' ' + this.vo.startDate + ' TO ' + this.vo.endDate + '.xlsx');
  }

}

export class ReportVo {
  startDate: any;
  endDate: any;
  groupby: any;
  status: any;
  id: any;
  flg: any;
}
