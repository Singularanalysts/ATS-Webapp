import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportsService } from 'src/app/usit/services/reports.service';
import { utils, writeFile } from 'xlsx';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-consultant-report',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './consultant-report.component.html',
  styleUrls: ['./consultant-report.component.scss'],
})
export class ConsultantReportComponent {
  department: any;
  excelName!: string;

  headings!: string[][];
  excelData: any;
  consultant: any[] = [];
  uniquePseudonames: any;
  popUpImport() {
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
      this.consultantname +
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
  //consult_data:any = [];

  constructor(
    public dialogRef: MatDialogRef<ConsultantReportComponent>,
    @Inject(MAT_DIALOG_DATA) public vo: any, // Expect 'vo' directly
    private reportservice: ReportsService
  ) {}

  ngOnInit(): void {
    if (this.vo.vo) {
      this.reportservice.consultant_DrillDown_report(this.vo.vo).subscribe(
        (response: any) => {
          this.consultant = response.data;
          this.consultantname = this.vo.additionalValue1;
          console.log(this.consultantname);
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
