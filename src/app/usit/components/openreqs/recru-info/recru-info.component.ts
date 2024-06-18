import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RequirementInfoComponent } from '../../recruitment/requirement-list/requirement-info/requirement-info.component';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { RequirementService } from 'src/app/usit/services/requirement.service';
import { Observable } from 'rxjs';
import { AddRecruiterComponent } from '../../vendor-management/recruiter-list/add-recruiter/add-recruiter.component';
import { DialogService } from 'src/app/services/dialog.service';
import { AddVendorComponent } from '../../vendor-management/vendor-list/add-vendor/add-vendor.component';
interface Recruiter {
  recruitername: string;
  recruiteremail: string;
}
@Component({
  selector: 'app-recru-info',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './recru-info.component.html',
  styleUrls: ['./recru-info.component.scss'],
})
export class RecruInfoComponent {
  dataSource: any;
  private requirementServ = inject(RequirementService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<RequirementInfoComponent>);
  recruiters: Recruiter[] = [{ recruitername: '', recruiteremail: '' }];
  OpenreqService: any;
  apiServ: any;
  constructor(private http: HttpClient) {}
  displayedColumns: string[] = ['sno', 'recruitername', 'recruiteremail'];
  private dialogServ = inject(DialogService);

  ngOnInit(): void {
    this.getRecruiters();
  }

  onClick(): void {
    this.dialogRef.close();
  }

  getRecruiters() {
    this.requirementServ
      .getRecruiters(this.data.id)
      .subscribe((response: any) => {
        if (response.status === 'success' && response.data) {
          if (response.data) {
            this.recruiters = response.data;
          }
        }
      });
  }

  addvendor() {
    const actionData = {
      title: 'Add Vendor',
      vendorData: null,
      actionName: 'add-vendor',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-vendor';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddVendorComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        // this.getAllData(this.currentPageIndex + 1);
      }
    });
  }

  addRecruiter() {
    const actionData = {
      title: 'Add Recruiter',
      recruiterData: null,
      actionName: 'add-recruiter',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-recruiter';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddRecruiterComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        // this.getAllRecruiters(this.currentPageIndex + 1);
      }
    });
  }

}
