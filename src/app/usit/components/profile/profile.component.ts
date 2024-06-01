import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultantService } from '../../services/consultant.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogConfig } from '@angular/material/dialog';
import { AddconsultantComponent } from '../sales/consultant-list/add-consultant/add-consultant.component';
import { DialogService } from 'src/app/services/dialog.service';
import { QualificationService } from '../../services/qualification.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FileManagementService } from '../../services/file-management.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private consultantServ = inject(ConsultantService);
  private dialogServ = inject(DialogService);
  private qualificationServ = inject(QualificationService);
  private fileService = inject(FileManagementService);
  profiledata: any;
  qualificationId: any;

  ngOnInit(): void {
    const userid = localStorage.getItem('userid');
    this.consultantServ.getProfile(userid).subscribe((res: any) => {
    this.profiledata = res.data;
    this.qualificationId = res.data.qualification
    // this.qualificationServ.getQualificationById(this.qualificationId).subscribe((res: any) => {
    //   this.profiledata.qualification = res.data.name;
    // })
    })
  }

  editConsultant(consultant: any) {
    const actionData = {
      title: 'Update Profile',
      consultantData: consultant,
      actionName: 'edit-consultant',
      flag: this.profiledata.consultantflg
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'edit-consultant';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddconsultantComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      const userid = localStorage.getItem('userid');
      if (dialogRef.componentInstance.submitted) {
        this.consultantServ.getProfile(userid).subscribe((res: any) => {
          this.profiledata = res.data;
          this.qualificationId = res.data.qualification
          this.qualificationServ.getQualificationById(this.qualificationId).subscribe((res: any) => {
            this.profiledata.qualification = res.data.name;
          })

        })
      }
    });
  }

  editDetails(consultant: any, section: any, type: any) {
    const actionData = {
      title: `${section}`,
      consultantData: consultant,
      actionName: 'edit-consultant',
      type: `${type}`,
      flag: this.profiledata.consultantflg
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'edit-consultant';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      EditProfileComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      const userid = localStorage.getItem('userid');
      if (dialogRef.componentInstance.submitted) {
        this.consultantServ.getProfile(userid).subscribe((res: any) => {
          this.profiledata = res.data;
          this.qualificationId = res.data.qualification
          this.qualificationServ.getQualificationById(this.qualificationId).subscribe((res: any) => {
            this.profiledata.qualification = res.data.name;
          })

        })
      }
    });
  }

  downloadfile(id: number, filename: string, flg: string) {

    var items = filename.split(".");
    this.fileService
      .downloadconresume(id, flg)
      .subscribe(blob => {
        if (items[1] == 'pdf' || items[1] == 'PDF') {
          var fileURL: any = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = fileURL;
          a.target = '_blank';
          // Don't set download attribute
          //a.download = filename;
          a.click();
        }
        else {
          saveAs(blob, filename)
        }
      }
      );

  }

}
