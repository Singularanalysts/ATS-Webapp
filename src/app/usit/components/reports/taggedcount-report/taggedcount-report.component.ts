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
  providers: [
    DatePipe,
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService },
  ],
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
onSort($event: Sort) {
throw new Error('Method not implemented.');
}

  
router: any;
taggedreport!: FormGroup;
// employees: any;
submitted = false;
  showReport = false;
  headings: any[] = [];
  c_data: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  payload: any;


  dataTableColumns: string[] = [
    'SerialNum',
    'BanterNo',
    'EmployeeName',
    'PsuedoName',
    'Department',
  ];

  dataTableColumnss: string[] = [
    'Job Title',
    'Consultant Name',
    'Fullname',
    'Issue Type',
    'comment',
  ];


  constructor(
     private formBuilder: FormBuilder,  private service: ReportsService,
     private datePipe: DatePipe ) { }

     ngOnInit() {
      this.department = localStorage.getItem('department');
      this.taggedreport = this.formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]
      });
    }

    get f() {
      return this.taggedreport.controls;
    }
    department!: any;

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

    this.service.getCommentReport(this.payload).subscribe((res: any) => {
      this.dataSource.data = res.data;
    });
  }

  reset() {
    this.taggedreport.reset();
    this.showReport = false;
    this.dataSource.data = [];
  }
  
}
