import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { DialogService } from 'src/app/services/dialog.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { Recruiter } from 'src/app/usit/models/recruiter';
import { ReportsService } from 'src/app/usit/services/reports.service';
import { utils, writeFile } from 'xlsx';
import { OpenRequirementPopupListComponent } from '../../reports/open-requirements-reports/open-requirement-popup-list/open-requirement-popup-list.component';
import { ConsultantAllSubmissionReportComponent } from './consultant-all-submission-report/consultant-all-submission-report.component';
import { ConsultantAllInterviewReportComponent } from './consultant-all-interview-report/consultant-all-interview-report.component';

@Component({
  selector: 'app-consultant-all-report',
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
    MatSortModule
  ],
  providers: [DatePipe, { provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
  templateUrl: './consultant-all-report.component.html',
  styleUrls: ['./consultant-all-report.component.scss']
})

export class ConsultantAllReportComponent {

  sourcingreport!: FormGroup
  submitted = false;
  showReport = false;
  c_data: any[] = [];
  Activecnt = 0;
  groupby!: any;
  stdate !: any;
  eddate !: any;
  hiddenflg = "main";
  router: any;
  userid!: string | null;
  constructor(private formBuilder: FormBuilder,
    private reportsServ: ReportsService, private datePipe: DatePipe) { }
  get f() { return this.sourcingreport.controls; }
  department!: any;
  options: Observable<string[]> | undefined;
  allOptions: string[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 1000;
  tableSizes: any = [3, 6, 9, 12];
  dataTableColumns: string[] = [
    'SerialNum',
    'skillset',
    'vendorcount'
  ];
  dataSource = new MatTableDataSource<any>([]);
  // paginator
  pageSize = 50;
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cdr = inject(PaginatorIntlService);
  private dialogServ = inject(DialogService);
  protected privilegeServ = inject(PrivilegesService);
  hasAcces!: any;
  loginId!: any;
  assignToPage: any;
  datarr: any[] = [];
  recrData: Recruiter[] = [];
  entity: any[] = [];
  totalItems: number = 0;
  itemsPerPage = 50;
  field = 'empty';
  isRejected: boolean = false;
  payload: any;
  public dialog= inject(MatDialog);

  ngOnInit() {
    this.department = localStorage.getItem('department');
    this.userid = localStorage.getItem('userid')
    this.sourcingreport = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

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
      const formattedJoiningDate = this.datePipe.transform(joiningDateFormControl!.value, 'yyyy-MM-dd');
      const formattedRelievingDate = this.datePipe.transform(relievingDateFormControl?.value, 'yyyy-MM-dd');
      joiningDateFormControl!.setValue(formattedJoiningDate);
      relievingDateFormControl?.setValue(formattedRelievingDate);
     this.payload = {
      "endDate": formattedRelievingDate,
      "startDate": formattedJoiningDate,
      "userid": this.userid
    }
    this.reportsServ.getEmployeeReport(this.payload).subscribe((res: any) => {
      console.log(res);
        this.c_data = res.data.content;
        this.dataSource.data = res.data.content;
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
        this.totalItems = res.data.totalElements;
      });
  }

  vendorCategoryPopup(data: any) {
    const actionData = {
      ...this.payload,
      ...data,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '90dvw';
    dialogConfig.height = '90vh';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'vendor-category-count';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      OpenRequirementPopupListComponent,
      dialogConfig
    );
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
      'Skill Set',
      'Vendor Count'
    ]];

    this.excelData = this.c_data.map(c => [
      c.category_skill,
      c.vendorcount,
    ]);
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, this.headings);
    utils.sheet_add_json(ws, this.excelData, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'data');
    writeFile(wb, 'Open-Requirements-Report@' + this.payload.startDate + ' TO ' + this.payload.endDate + '.xlsx');

  }

  subOrIntPopup(status: any) {
    const sDate = this.sourcingreport.get('startDate')!.value;
    const eDate = this.sourcingreport.get('endDate')!.value;
    if (status == 'submission') {
      this.dialog.open(ConsultantAllSubmissionReportComponent, 
      { width: '80%',
      data: {
          status: status,
          id: this.userid,
          startDate: this.datePipe.transform(sDate, 'yyyy-MM-dd'),
          endDate: this.datePipe.transform(eDate, 'yyyy-MM-dd'),
        },
      });
      
    } else  {
      this.dialog.open(ConsultantAllInterviewReportComponent, 
      { width: '500px',
      data: {
        status: status,
        id: this.userid,
        startDate: this.datePipe.transform(sDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(eDate, 'yyyy-MM-dd'),
        },
      });
    }
  }

}