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
  selector: 'app-taggedcount-report',
  templateUrl: './taggedcount-report.component.html',
  styleUrls: ['./taggedcount-report.component.scss'],
  providers: [DatePipe],
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
  ]
})

export class TaggedcountReportComponent {
  router: any;
  taggedreport!: FormGroup;
  submitted = false;
  showReport = false;
  dataSource = new MatTableDataSource<any>([]);
  payload: any;

  c_data: any[] = [];
  pageSize = 50;
  currentPageIndex = 0;
  protected privilegeServ = inject(PrivilegesService);

  dataTableColumns: string[] = [
    'SerialNum',
    'Title',
    'BanterNo',
    'EmployeeName',
    'PsuedoName',
    'Department',
    'Commented Date',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private service: ReportsService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.taggedreport = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  get f() {
    return this.taggedreport.controls;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  onSubmit() {
    this.submitted = true;
    if (this.taggedreport.invalid) {
      this.showReport = false;
      return;
    } else {
      this.showReport = true;
    }

    const startDateControl = this.taggedreport.get('startDate');
    const endDateControl = this.taggedreport.get('endDate');
    const formattedStartDate = this.datePipe.transform(
      startDateControl!.value,
      'yyyy-MM-dd'
    );
    const formattedEndDate = this.datePipe.transform(
      endDateControl?.value,
      'yyyy-MM-dd'
    );

    this.payload = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    this.service.getCommentReport(this.payload,localStorage.getItem('companyid')).subscribe((res: any) => {
      this.c_data = res.data;
      this.dataSource.data = res.data;

      this.dataSource.data.map((x: any, i) => {
        x.serialNum = this.generateSerialNumber(i);
      });

    });
  }

  generateSerialNumber(index: number): number {
    return this.currentPageIndex * this.pageSize + index + 1;
  }

  reset() {
    this.taggedreport.reset();
    this.showReport = false;
    this.dataSource.data = [];
  }


  headings: any[] = [];
  excelData: any[] = [];
  excelImport() {
    this.headings = [[
      'SerialNum',
      'Job Title',
      'Consultant Name',
      'Pseudoname',
      'Issue Type',
      'Comment',
      'Commented Date',
    ]];

    this.excelData = this.c_data.map(c => [
      c.serialNum,
      c.job_Title,
      c.consultantname,
      c.fullname,
      c.issue_type,
      c.comment,
     this.datePipe.transform(c.createddate, 'MM-dd-yyyy HH:mm') || ''
    ]);
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, this.headings);
    utils.sheet_add_json(ws, this.excelData, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'data');
    writeFile(wb, 'Open-Reqs-Comments-Report@' + this.payload.startDate + ' TO ' + this.payload.endDate + '.xlsx');
  }

}
