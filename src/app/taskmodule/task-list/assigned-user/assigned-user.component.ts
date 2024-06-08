import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConsultantReportComponent } from 'src/app/usit/components/reports/employee-reports/consultant-report/consultant-report.component';
import { TaskService } from '../../services/task.service';
@Component({
  selector: 'app-assigned-user',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './assigned-user.component.html',
  styleUrls: ['./assigned-user.component.scss']
})
export class AssignedUserComponent {
  taskDatarr: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<ConsultantReportComponent>,
    @Inject(MAT_DIALOG_DATA) public vo: any, // Expect 'vo' directly
  ) { }
  title!: string;
  private service = inject(TaskService);
  ngOnInit(): void {
    this.title = this.vo.title
    this.service.popup(this.vo.id).subscribe(
      ((response: any) => {
        this.taskDatarr = response.data;
      })
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}


