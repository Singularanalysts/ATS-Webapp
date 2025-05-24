import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportsService } from 'src/app/usit/services/reports.service';
import { utils, writeFile } from 'xlsx';
import { MatButtonModule } from '@angular/material/button';
import { PrivilegesService } from 'src/app/services/privileges.service';

@Component({
  selector: 'app-interview-report',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './interview-report.component.html',
  styleUrls: ['./interview-report.component.scss'],
})
export class InterviewReportComponent {
  department: any;
  excelName!: string;

  headings!: string[][];
  excelData: any;
  consultant: any[] = [];
  uniquePseudonames: any;
  popUpImport() {
    if (this.vo.vo.status == 'submission') {
      this.headings = [
        [
          'DOS',
          'Consultant',
          'Requirement',
          'Impl Partner',
          'End Client',
          'Vendor',
          'Submission Rate',
          'Project Location',
          'Submitted By',
          'Status',
        ],
      ];
      this.excelData = this.consultant.map(
        (c: {
          createddate: any;
          consultantname: any;
          position: any;
          implpartner: any;
          endclient: any;
          vendor: any;
          submissionrate: any;
          projectlocation: any;
          pseudoname: any;
          substatus: any;
        }) => [
          c.createddate,
          c.consultantname,
          c.position,
          c.implpartner,
          c.endclient,
          c.vendor,
          c.submissionrate,
          c.projectlocation,
          c.pseudoname,
          c.substatus,
        ]
      );
    } else if (
      this.vo.vo.status == 'interview' ||
      this.vo.vo.status == 'Schedule' ||
      this.vo.vo.status == 'Hold' ||
      this.vo.vo.status == 'Closed' ||
      this.vo.vo.status == 'Rejected' ||
      this.vo.vo.status == 'onboarded' ||
      this.vo.vo.status == 'backout' ||
      this.vo.vo.status == 'Selected'
    ) {
      this.headings = [
        [
          'Consultant Name',
          'Date & Time Of Interview',
          'Round',
          'Mode',
          'Vendor',
          'End Client',
          'Date Of Submission',
          'Employee Name',
          'Interview Status',
        ],
      ];
      this.excelData = this.consultant.map(
        (c: {
          name: any;
          interview_date: any;
          round: any;
          mode: any;
          vendor: any;
          endclient: any;
          createddate: any;
          pseudoname: any;
          interview_status: any;
        }) => [
          c.name,
          c.interview_date,
          c.round,
          c.mode,
          c.vendor,
          c.endclient,
          c.createddate,
          c.pseudoname,
          c.interview_status,
        ]
      );
    } else if (this.vo.vo.status == 'consultant') {
      this.headings = [
        [
          'Date',
          'Name',
          'Email',
          'Contact Number',
          'Visa',
          'Current Location',
          'Position',
          'Exp',
          'Relocation',
          'Rate',
        ],
      ];
      this.excelData = this.consultant.map(
        (c: {
          createddate: any;
          consultantname: any;
          consultantemail: any;
          contactnumber: any;
          visa_status: any;
          currentlocation: any;
          position: any;
          experience: any;
          relocation: any;
          hourlyrate: any;
        }) => [
          c.createddate,
          c.consultantname,
          c.consultantemail,
          c.contactnumber,
          c.visa_status,
          c.currentlocation,
          c.position,
          c.experience,
          c.relocation,
          c.hourlyrate,
        ]
      );
    }
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, this.headings);
    utils.sheet_add_json(ws, this.excelData, {
      origin: 'A2',
      skipHeader: true,
    });
    utils.book_append_sheet(wb, ws, 'data');
    this.excelName =
      'Report @' +
      ' ' +
      this.executive +
      ' ' +
      this.vo.vo.status +
      ' ' +
      this.vo.vo.flg +
      ' ' +
      this.vo.vo.startDate +
      ' TO ' +
      this.vo.vo.endDate +
      '.xlsx';
    writeFile(wb, this.excelName);
  }
  submenuflg = '';
  executive = '';
  consultantname = '';

  constructor(
    public dialogRef: MatDialogRef<InterviewReportComponent>,
    @Inject(MAT_DIALOG_DATA) public vo: any, // Expect 'vo' directly
    private reportservice: ReportsService
  ) {}
  showReport: boolean = false;
  protected privilegeServ = inject(PrivilegesService);
  ngOnInit(): void {
    const shoWresult = this.privilegeServ.hasPrivilege('EXCEL_EXPORT')
    if (shoWresult) {
      this.showReport = true;
    } else {
      this.showReport = false;
    }

    if (this.vo.vo) {
      this.reportservice.consultant_DrillDown_report(this.vo.vo,localStorage.getItem('companyid')).subscribe(
        (response: any) => {
          this.consultant = response.data;
          this.executive = this.vo.additionalValue1;
        },
        (error) => {
          console.error('Error fetching consultant data:', error);
        }
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
