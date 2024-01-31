import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementService } from 'src/app/usit/services/requirement.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-requirement-info',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './requirement-info.component.html',
  styleUrls: ['./requirement-info.component.scss']
})
export class RequirementInfoComponent implements OnInit {
  
  dataSource: any;
  private requirementServ = inject(RequirementService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<RequirementInfoComponent>);

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
