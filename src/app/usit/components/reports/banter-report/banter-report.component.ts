import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/usit/services/reports.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import {
  Observable,
} from 'rxjs';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { Recruiter } from 'src/app/usit/models/recruiter';
import { utils, writeFile } from 'xlsx';

@Component({
  selector: 'app-banter-report',
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
    MatSortModule,
  ],
  templateUrl: './banter-report.component.html',
  styleUrls: ['./banter-report.component.scss'],
  providers: [
    DatePipe,
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService },
  ],
})
export class BanterReportComponent {
  sourcingreport!: FormGroup;

  submitted = false;
  showReport = false;
  c_data: any[] = [];
  Activecnt = 0;
  groupby!: any;
  stdate!: any;
  eddate!: any;
  hiddenflg = 'main';
  router: any;
  employees: any;
  constructor(
    private formBuilder: FormBuilder,
    private service: ReportsService,
    private datePipe: DatePipe  ) { }
  get f() {
    return this.sourcingreport.controls;
  }
  department!: any;
  options: Observable<string[]> | undefined;
  allOptions: string[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 1000;
  tableSizes: any = [3, 6, 9, 12];
  dataTableColumns: string[] = [
    'SerialNum',
    'BanterNo',
    'EmployeeName',
    'PsuedoName',
    'Department',
    'DailedCalls',
    'DailedInMinutes',
    'AnsweredCalls',
    'AnsweredInMinutes',
    'MissedCalls',
    'TotalMinutes',
    // 'Target',
    'Percentage',
  ];
  dataSource = new MatTableDataSource<any>([]);
  // paginator
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected privilegeServ = inject(PrivilegesService);

  hasAcces!: any;
  loginId!: any;
  assignToPage: any;
  datarr: any[] = [];
  recrData: Recruiter[] = [];
  entity: any[] = [];
  totalItems: number = 0;
  // pagination code
  itemsPerPage = 50;
  field = 'empty';
  isRejected: boolean = false;
  payload: any;
  departmentSelected: boolean = false;

  ngOnInit() {
    this.department = localStorage.getItem('department');
    this.sourcingreport = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      groupby: ['', Validators.required],
      employee: [],
    });
  }

  onDepartmentChange(department: any): void {
    this.departmentSelected = true;
    this.sourcingreport.get('employee')?.reset();
    this.sourcingreport.get('employee')?.enable();
    
    if (department) {
      this.service.getEmployeeByDeparment(department.value).subscribe((res: any) => {
        this.employees = res.data;
      })
    }
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  onSubmit() {
    this.submitted = true;
    if (this.sourcingreport.invalid) {
      this.showReport = false;
      return;
    } else {
      this.showReport = true;
    }
    const joiningDateFormControl = this.sourcingreport.get('startDate');
    const relievingDateFormControl = this.sourcingreport.get('endDate');
    const formattedJoiningDate = this.datePipe.transform(
      joiningDateFormControl!.value,
      'yyyy-MM-dd'
    );
    const formattedRelievingDate = this.datePipe.transform(
      relievingDateFormControl?.value,
      'yyyy-MM-dd'
    );
    joiningDateFormControl!.setValue(formattedJoiningDate);
    relievingDateFormControl?.setValue(formattedRelievingDate);

    const flag = this.sourcingreport.get('groupby')!.value;
    const empid = this.sourcingreport.get('employee')!.value;

    this.payload = {
      endDate: formattedRelievingDate,
      startDate: formattedJoiningDate,
      flg: flag,
      id: empid
    };

    this.service.getBanterReport(this.payload).subscribe((res: any) => {
      this.c_data = res.data;
      this.dataSource.data = res.data;
      this.dataSource.data.map((x: any, i) => {
        x.serialNum = this.generateSerialNumber(i);
      });
      this.totalItems = res.data.totalElements;
    });
  }

  /**
   * Sort
   * @param event
   */
  sortField = 'skillset';
  sortOrder = 'asc';
  onSort(event: Sort) {
    if (event.active == 'SerialNum') this.sortField = 'skillset';
    else this.sortField = event.active;

    this.sortOrder = event.direction;

    if (event.direction != '') {
    }
  }

  pageChanged(event: PageEvent) {
    this.payload.pageNumber = event.pageIndex + 1;
    this.payload.pageSize = event.pageSize;

    this.service.getOpenReqsReport(this.payload).subscribe((res: any) => {

      this.c_data = res.data.content;
      this.dataSource.data = res.data.content;
      this.dataSource.data.map((x: any, i) => {
        x.serialNum = this.generateSerialNumber(i);
      });
    });
  }

  reset() {
    this.sourcingreport.reset();
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  headings: any[] = [];
  excelData: any[] = [];
  excelImport() {
    this.headings = [[
    'Banter No.',
    'Employee Name',
    'Psuedo Name',
    'Department',
    'Dailed Calls',
    'Dailed In Minutes',
    'Answered Calls',
    'Answered In Minutes',
    'Missed Calls',
    'Total Minutes',
    'Percentage',
    ]];

    this.excelData = this.c_data.map(c => [
      c.banter_No,
      c.emp_Name,
      c.pseudo_Name,
      c.department,
      c.dialled,
      c.minutes_Dialled,
      c.answered,
      c.minutes_answered,
      c.missed,
      c.total_Min,
      c.percentage,
    ]);
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, this.headings);
    utils.sheet_add_json(ws, this.excelData, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'data');
    writeFile(wb, 'Banter-Report@' + this.payload.startDate + ' TO ' + this.payload.endDate + '.xlsx');
  }
}
