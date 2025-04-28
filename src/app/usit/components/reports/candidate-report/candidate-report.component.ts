import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/usit/services/reports.service';
import {
  Observable,
} from 'rxjs';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { Recruiter } from 'src/app/usit/models/recruiter';
import { utils, writeFile } from 'xlsx';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CandidateSubmissionsComponent } from './candidate-submissions/candidate-submissions.component';
import { CandidateInterviewsComponent } from './candidate-interviews/candidate-interviews.component';
import { CandidateAppliedJobsComponent } from './candidate-applied-jobs/candidate-applied-jobs.component';

@Component({
  selector: 'app-candidate-report',
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
  templateUrl: './candidate-report.component.html',
  styleUrls: ['./candidate-report.component.scss'],
  providers: [
    DatePipe,
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService },
  ],
})
export class CandidateReportComponent {
  candidatereport!: FormGroup;
  submitted = false;
  showReport = false;
  c_data: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportsService,
    private datePipe: DatePipe ) { }
  
  dataTableColumns: string[] = [
    'SerialNum',
    'CandidateName',
    'AppliedJobs',
    'Submission',
    'Scheduled',
    'OnHold',
    'Closed',
    'Rejected',
    'OnBoarded',
    'BackOut',
    'Selected'
  ];
  dataSource = new MatTableDataSource<any>([]);
  currentPageIndex = 0;
  totalItems: number = 0;
  payload: any;
  userid!: string | null;
  public dialog= inject(MatDialog);
  private router = inject(Router);
  get f() {
    return this.candidatereport.controls;
  }

  ngOnInit() {
    this.userid = localStorage.getItem('userid')
    this.candidatereport = this.formBuilder.group({
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
    if (this.candidatereport.invalid) {
      this.showReport = false;
      return;
    } else {
      this.showReport = true;
    }
    const joiningDateFormControl = this.candidatereport.get('startDate');
    const relievingDateFormControl = this.candidatereport.get('endDate');
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

    this.payload = {
      endDate: formattedRelievingDate,
      startDate: formattedJoiningDate
    };

    this.reportService.candidateReport(this.payload,localStorage.getItem('companyid')).subscribe((res: any) => {
      this.c_data = res.data;
      this.dataSource.data = res.data;
      this.dataSource.data.map((x: any, i) => {
        x.serialNum = this.generateSerialNumber(i);
      });
      this.totalItems = res.data.totalElements;
    });
  }

  reset() {
    this.candidatereport.reset();
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  headings: any[] = [];
  excelData: any[] = [];
  excelImport() {
    this.headings = [[
    'Candidate Name',
    'Applied Jobs',
    'Submission',
    'Scheduled',
    'On Hold',
    'Closed',
    'Rejected',
    'OnBoarded',
    'BackOut',
    'Selected'
    ]];

    this.excelData = this.c_data.map(c => [
      c.consultantname,
      c.apply_count,
      c.submission,
      c.schedule,
      c.onhold,
      c.closed,
      c.rejected,
      c.onboarded,
      c.backout,
      c.selected,
    ]);
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, this.headings);
    utils.sheet_add_json(ws, this.excelData, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'data');
    writeFile(wb, 'Candidate-Report@' + this.payload.startDate + ' TO ' + this.payload.endDate + '.xlsx');
  }

  subOrIntPopup(status: any, element: any) {
    const sDate = this.candidatereport.get('startDate')!.value;
    const eDate = this.candidatereport.get('endDate')!.value;
    if (status == 'submission') {
      this.dialog.open(CandidateSubmissionsComponent, 
      { width: '80%',
      data: {
          id: element.userid,
          startDate: this.datePipe.transform(sDate, 'yyyy-MM-dd'),
          endDate: this.datePipe.transform(eDate, 'yyyy-MM-dd'),
        },
      });
      
    } else  {
      this.dialog.open(CandidateInterviewsComponent, 
      { width: '80%',
      data: {
        status: status,
        id: element.userid,
        startDate: this.datePipe.transform(sDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(eDate, 'yyyy-MM-dd'),
        },
      });
    }
  }

  appliedJobsPopup(element: any) {
    const sDate = this.candidatereport.get('startDate')!.value;
    const eDate = this.candidatereport.get('endDate')!.value;
    this.dialog.open(CandidateAppliedJobsComponent,
      {
        width: '80%',
        data: {
          candidateName: element.consultantname,
          id: element.userid,
          startDate: this.datePipe.transform(sDate, 'yyyy-MM-dd'),
          endDate: this.datePipe.transform(eDate, 'yyyy-MM-dd'),
        },
      });
  }

}