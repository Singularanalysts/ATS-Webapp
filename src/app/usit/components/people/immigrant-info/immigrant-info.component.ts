import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { H1bImmigrantService } from 'src/app/usit/services/h1b-immigrant.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { FileManagementService } from 'src/app/usit/services/file-management.service';
import * as saveAs from 'file-saver';
import { DialogService } from 'src/app/services/dialog.service';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { Subject, takeUntil } from 'rxjs';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { VisaService } from 'src/app/usit/services/visa.service';


@Component({
  selector: 'app-immigrant-info',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './immigrant-info.component.html',
  styleUrls: ['./immigrant-info.component.scss']
})
export class ImmigrantInfoComponent implements OnInit {
  
  dataSource: any;
  private h1bServ = inject(H1bImmigrantService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ImmigrantInfoComponent>);
  private fileService = inject(FileManagementService);
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private destroyed$ = new Subject<void>();
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  private visaServ = inject(VisaService);
  filesArr!: any;

  ngOnInit(): void {
    this.getImgInfo();
  }

  getImgInfo() {
    this.h1bServ.getH1bById(this.data.imginfo.applicantid).subscribe(
      (resp: any) => {
        if(resp.status === 'success'){
          if(resp.data){
            this.dataSource = resp.data;
            this.filesArr = resp.data.i797doc;
            const visaId = this.dataSource.visa;
            if (visaId) {
              this.visaServ.getVisaById(visaId).subscribe({
                next: (res: any) => {
                  this.dataSource.visa = res.data.visastatus;
                }
              })
            }
          }
        }
      }
    )
  }

  downloadfile(id: number, filename: string, flg: string) {
    var items = filename.split(".");
     this.fileService
       .downloadH1bFile(id, flg)
       .subscribe(blob => {
        if (items[items.length - 1] == 'pdf' || items[items.length - 1] == 'PDF') {
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

  type:any
  downloadMultiplefiles(fileData: FileData) {
    this.type = fileData.filename;
    var items = this.type.split(".");
    this.fileService
      .downloadMultipleFiles(fileData.docid)
      .subscribe(blob => {
        if (items[items.length - 1] == 'pdf' || items[items.length - 1] == 'PDF') {
          var fileURL: any = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = fileURL;
          a.target = '_blank';
          a.click();
        }
        else {
          saveAs(blob, fileData.filename)
        }
      }
      );
  }

  deletefile(id: number, doctype: string) {
      const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
        title: 'Confirmation',
        message: 'Are you sure you want to delete?',
        confirmText: 'Yes',
        cancelText: 'No',
        actionData: id,
        actionName: 'delete-file'
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = dataToBeSentToDailog;
      dialogConfig.width = "fit-content";
      const dialogRef = this.dialogServ.openDialogWithComponent(
        ConfirmComponent,
        dialogConfig
      );
      // call delete api after  clicked 'Yes' on dialog click
      dialogRef.afterClosed().subscribe({
        next: (resp: any) => {
          if (dialogRef.componentInstance.allowAction) {
            // call delete api
            this.fileService.h1bRemoveFile(id,doctype).pipe(takeUntil(this.destroyed$)).subscribe({
              next: (response: any) => {
                if (response.status == 'success') {
                //  this.getAllEmployees();
                  this.dataToBeSentToSnackBar.message =
                    'File Deleted successfully';
                    this.dialogRef.close();
                } else {
                  this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                  this.dataToBeSentToSnackBar.message = 'Record Deletion failed';
                }
                this.snackBarServ.openSnackBarFromComponent(
                  this.dataToBeSentToSnackBar
                );
              },
              error: (err) => {
                this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                this.dataToBeSentToSnackBar.message = err.message;
                this.snackBarServ.openSnackBarFromComponent(
                  this.dataToBeSentToSnackBar
                );
              },
            });
          }
        },
      });
  }
}

export class FileData {
  docid!: number;
  applicantid!: number;
  filename?: string;
  contentType?: string;
  size?: number;
  eid!: number;
}
