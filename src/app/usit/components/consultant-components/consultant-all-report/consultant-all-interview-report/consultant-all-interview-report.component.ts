import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportsService } from 'src/app/usit/services/reports.service';

@Component({
  selector: 'app-consultant-all-interview-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultant-all-interview-report.component.html',
  styleUrls: ['./consultant-all-interview-report.component.scss']
})
export class ConsultantAllInterviewReportComponent {
  data = inject(MAT_DIALOG_DATA);
  reportServ = inject(ReportsService);
  dataSource: any;
 
  ngOnInit(): void {
    if (this.data) {
      this.reportServ.employeeInterviewPopup(this.data).subscribe({
        next: (response: any) => {
          this.dataSource = response.data;
        },
        error: (err: any) => {
          console.error('Error fetching consultant data:', err);
        }
      });
    }
  }
}