import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportsService } from 'src/app/usit/services/reports.service';

@Component({
  selector: 'app-candidate-applied-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-applied-jobs.component.html',
  styleUrls: ['./candidate-applied-jobs.component.scss']
})
export class CandidateAppliedJobsComponent {
  data = inject(MAT_DIALOG_DATA);
  reportServ = inject(ReportsService);
  dataSource: any;
 
  ngOnInit(): void {
    if (this.data) {
      this.reportServ.candidateAppliedJobsPopup(this.data,localStorage.getItem('companyid')).subscribe({
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