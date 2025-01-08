import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReportsService } from 'src/app/usit/services/reports.service';
import { utils, writeFile } from 'xlsx';
import { PrivilegesService } from 'src/app/services/privileges.service';


@Component({
  selector: 'app-requirement-report',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './requirement-report.component.html',
  styleUrls: ['./requirement-report.component.scss']
})
export class RequirementReportComponent  {
  vendor: any;
  headings!: string[][];
  excelData: any;
  excelName!: string;
  showReport: boolean = false;
  protected privilegeServ = inject(PrivilegesService);

  constructor(
    public dialogRef: MatDialogRef<RequirementReportComponent>,
    @Inject(MAT_DIALOG_DATA) public vo: any,
    private reportservice: ReportsService
  ) {}
 
  consultant: any[] = [];

  ngOnInit(): void {
    const shoWresult = this.privilegeServ.hasPrivilege('EXCEL_EXPORT')
    if (shoWresult) {
      this.showReport = true;
    } else {
      this.showReport = false;
    }

    
    if (this.vo.vo) {
      this.reportservice.requirementPopup(this.vo.vo).subscribe(
        (response: any) => {
          this.consultant = response.data;
          this.vendor = this.vo.additionalValue1;
        },
        (error) => {
          console.error('Error fetching consultant data:', error);
        }
      );
    }


  }


 

  popUpImport() { 
    this.headings = [
      [
        'Date',
        'Requirement Number',
        'Job Title',
        'Location',
        'IP/Vendor',
        'Employeement Type',
        'Added By',
        'Status',
       
      ],
    ];
    this.excelData = this.consultant.map(
      (c: {
        createddate: any;
        reqnumber: any;
        jobtitle: any;
        location: any;
        vendor: any;
        employmenttype: any;
        pseudoname: any;
        status: any;
      }) => [
        c.createddate,
        c.reqnumber,
        c.jobtitle,
        c.location,
        c.vendor,
        c.employmenttype,
        c.pseudoname,
        c.status,
      
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
      'Report @' +this.vo.additionalValue1 +
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
    

  closeDialog(): void {
    this.dialogRef.close();
  }

}
