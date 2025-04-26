import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OpenreqService } from 'src/app/usit/services/openreq.service';

@Component({
  selector: 'app-resume-description',
  templateUrl: './resume-description.component.html',
  styleUrls: ['./resume-description.component.scss']
})
export class ResumeDescriptionComponent {
dataSource: any;
  private openReqServ = inject(OpenreqService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ResumeDescriptionComponent>);
  jobDescriptionWithLineBreaks: any;
 ngOnInit(): void {
              console.log(this.data,'dataaa');
              
    if (this.data.jobType === 'fulltime') {
      this.getFulltimeReqInfo();
    } else {
      this.getReqInfo()

    }
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


  getFulltimeReqInfo() {
    this.openReqServ.getOpenFulltimeReqsById(this.data.id).subscribe(
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
