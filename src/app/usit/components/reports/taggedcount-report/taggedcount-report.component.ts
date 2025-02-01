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
  c_data: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  payload: any;
  totalItems: number = 0;
  totalPages: number = 0; // To store total pages
  
  // Paginator settings
  pageSize = 50; // Items per page
  currentPageIndex = 0; // Always start from page 0
  pageSizeOptions = [50]; // Fixed at 50 records per page
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  department: string | null | undefined;
  
  dataTableColumns: string[] = [
    'SerialNum',
    'Title',
    'BanterNo',
    'EmployeeName',
    'PsuedoName',
    'Department',
  ];
showPageSizeOptions: any;
 

  constructor(
    private formBuilder: FormBuilder,
    private service: ReportsService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.department = localStorage.getItem('department');
    this.taggedreport = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
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

    const startDate = this.datePipe.transform(
      this.taggedreport.get('startDate')!.value,
      'yyyy-MM-dd'
    );
    const endDate = this.datePipe.transform(
      this.taggedreport.get('endDate')!.value,
      'yyyy-MM-dd'
    );

    // Reset pagination to first page when new data is requested
    this.currentPageIndex = 0; 

    this.payload = {
      pageNumber: this.currentPageIndex + 1, // Page numbers start from 1 for API
      pageSize: this.pageSize,
      sortField: "fullname",
      sortOrder: "desc",
      keyword: "empty",
      startDate: startDate,
      endDate: endDate,
    };

    this.fetchReportData();
  }

  fetchReportData() {
    this.service.getCommentReport(this.payload).subscribe((res: any) => {
      if (res.data) {
        this.c_data = res.data.content;
        this.dataSource.data = res.data.content;
        this.totalItems = res.data.totalElements;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);

        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      }
    });
  }

  reset() {
    this.taggedreport.reset();
    this.showReport = false;
    this.dataSource.data = [];
    this.currentPageIndex = 0;
  }

  pageChanged(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.payload.pageNumber = this.currentPageIndex + 1;
    this.payload.pageSize = event.pageSize;

    this.fetchReportData();
  }

  generateSerialNumber(index: number): number {
    return this.currentPageIndex * this.pageSize + index + 1;
  }
}
