import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementService } from 'src/app/usit/services/requirement.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-email-body',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './email-body.component.html',
  styleUrls: ['./email-body.component.scss']
})

export class EmailBodyComponent implements OnInit {
  
  dataSource: any;
  private requirementServ = inject(RequirementService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<EmailBodyComponent>);

  ngOnInit(): void {
    this.getReqInfo();
  }

  getReqInfo() {
    this.requirementServ.getEntity(this.data.id).subscribe(
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
