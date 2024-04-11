import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RequirementInfoComponent } from '../../recruitment/requirement-list/requirement-info/requirement-info.component';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { RequirementService } from 'src/app/usit/services/requirement.service';
import { Observable } from 'rxjs';
interface Recruiter {
  recruitername: string;
  recruiteremail: string;
}
@Component({
  selector: 'app-recru-info',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule, MatTableModule],
  templateUrl: './recru-info.component.html',
  styleUrls: ['./recru-info.component.scss']
})
export class RecruInfoComponent {
  dataSource: any;
  private requirementServ = inject(RequirementService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<RequirementInfoComponent>);
  recruiters: Recruiter[] = [
    { recruitername: '', recruiteremail: '' },
  ];
  OpenreqService: any;
  apiServ: any;
  constructor(private http: HttpClient) { }
  displayedColumns: string[] = ['sno', 'recruitername', 'recruiteremail'];

  ngOnInit(): void {

    this.getRecruiters();
  }
  onClick(): void {
    this.dialogRef.close();
  }
  getRecruiters() {
    // alert(this.data.vendor)
    this.requirementServ.getRecruiters(this.data.id)
      .subscribe(
        (response: any) => {
          if (response.status === 'success' && response.data) {
            if (response.data) {
              // Assuming resp.data is an array of recruiters
              this.recruiters = response.data;
            }
          }
        });
  }

}
