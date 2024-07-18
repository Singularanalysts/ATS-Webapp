import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportsService } from 'src/app/usit/services/reports.service';

@Component({
  selector: 'app-candidate-interviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-interviews.component.html',
  styleUrls: ['./candidate-interviews.component.scss']
})
export class CandidateInterviewsComponent {
  data = inject(MAT_DIALOG_DATA);
  reportServ = inject(ReportsService);
  dataSource: any;
 
  ngOnInit(): void {
    if (this.data) {
      this.reportServ.candidateInterviewPopup(this.data).subscribe({
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
