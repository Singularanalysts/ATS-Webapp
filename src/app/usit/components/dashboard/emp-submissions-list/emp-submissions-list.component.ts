import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from 'src/app/usit/services/dashboard.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-emp-submissions-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emp-submissions-list.component.html',
  styleUrls: ['./emp-submissions-list.component.scss']
})

export class EmpSubmissionsListComponent {
  data = inject(MAT_DIALOG_DATA);
  dashboardServ = inject(DashboardService);
  dataSource: any;
  pageSize:number = 50;
  page: number = 1;
  sortField = 'updateddate';
  sortOrder = 'desc';

  ngOnInit(): void {
    if (this.data) {
      this.dashboardServ.getEmployeeDashboardSubmissionPopup(this.data).subscribe({
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
