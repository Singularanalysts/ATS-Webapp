import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-job-description',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent implements OnInit {
  
  dataSource: any;
  private openReqServ = inject(OpenreqService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<JobDescriptionComponent>);
  jobDescriptionWithLineBreaks: any;

  ngOnInit(): void {
    this.getReqInfo();
  }

  getReqInfo() {
    this.openReqServ.getOpenReqsById(this.data.id).subscribe(
        (resp: any) => {
        if (resp.status === 'success') {
          if (resp.data) {
            this.dataSource = resp.data;
            if (resp.data.job_description) {
              this.jobDescriptionWithLineBreaks = resp.data.job_description.replace(/\n/g, '<br>');
            }
          }
        }
        }
      )
  }
}
