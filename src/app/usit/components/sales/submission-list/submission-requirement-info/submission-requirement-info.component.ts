import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SubmissionService } from 'src/app/usit/services/submission.service';

@Component({
  selector: 'app-submission-requirement-info',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './submission-requirement-info.component.html',
  styleUrls: ['./submission-requirement-info.component.scss']
})
export class SubmissionRequirementInfoComponent implements OnInit {

  dataSource: any;
  private submissionServ = inject(SubmissionService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<SubmissionRequirementInfoComponent>);

  ngOnInit(): void {
    //console.log(this.data);
    this.submissionServ.getSubReqInfo(this.data.id).subscribe(
      (resp: any) => {
        if(resp.status === 'success'){
          if(resp.data){
            this.dataSource = resp.data;
          }
        }
      }
    )
    
  }


}
