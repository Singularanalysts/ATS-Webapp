import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardService } from 'src/app/usit/services/dashboard.service';

@Component({
  selector: 'app-emp-applied-jobs-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emp-applied-jobs-list.component.html',
  styleUrls: ['./emp-applied-jobs-list.component.scss']
})
export class EmpAppliedJobsListComponent {
  data = inject(MAT_DIALOG_DATA);
  dashboardServ = inject(DashboardService);
  dataSource: any;
  pageSize:number = 50;
  page: number = 1;
  sortField = 'updateddate';
  sortOrder = 'desc';

  ngOnInit(): void {
    
    if (this.data) {
      this.dashboardServ.getEmployeeDashboardApPopup(this.data).subscribe({
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
