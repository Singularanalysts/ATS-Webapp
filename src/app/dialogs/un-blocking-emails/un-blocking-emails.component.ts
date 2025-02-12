import { Component, inject, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { IConfirmDialogData } from '../models/confirm-dialog-data';
import { EmailsDeleteConfirmComponent } from '../emails-delete-confirm/emails-delete-confirm.component';
import { DialogService } from 'src/app/services/dialog.service';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-un-blocking-emails',
  templateUrl: './un-blocking-emails.component.html',
  styleUrls: ['./un-blocking-emails.component.scss'],
  standalone: true,
imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule
  ],
})

export class UnBlockingEmailsComponent {

private service = inject(OpenreqService);
private dialogServ = inject(DialogService);
private snackBarServ = inject(SnackBarService);
selection = new SelectionModel<any>(true, []);
private router = inject(Router);

dataSource = new MatTableDataSource<any>([]);

dataTableColumns: string[] = [
    'select',
    'SerialNum'
  ];

dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };

  attachments: any[] = [];

  constructor(public dialogRef: MatDialogRef<UnBlockingEmailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.attachments = data.attachments || [];
  }

// unblockEmails(id:any) {
 unblockEmails(selectedIds: any) {

  const dataToBeSentToDialog: Partial<IConfirmDialogData> = {
    title: 'Confirmation',
    message: 'Are you sure you want to Un-block the selected emails?',
    confirmText: 'Yes',
    cancelText: 'No',
  };

  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = "400px";
  dialogConfig.height = "auto";
  dialogConfig.disableClose = false;
  dialogConfig.panelClass = "delete-confirmation";
  dialogConfig.data = dataToBeSentToDialog;

  const dialogRef = this.dialogServ.openDialogWithComponent(EmailsDeleteConfirmComponent, dialogConfig);

  dialogRef.afterClosed().subscribe({
    next: () => {
      if (dialogRef.componentInstance.allowAction) {
        
        this.service.unblockingEmailWithId(selectedIds).subscribe({
          next: (response: any) => {
        if (response.status === 'Success') {

      //   this.selection.clear();
      //  this.showDeleteButton=false;
      //  this.showBlockButton=false;
      //   this.getAll();

        this.dataToBeSentToSnackBar.message = "Mails Un-Blocked Successfully";
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
        this.snackBarServ.openSnackBarFromComponent(
          this.dataToBeSentToSnackBar
        );
        this.router.navigateByUrl('/usit/email-extraction-list');
      }
          },
          error: (error: any) => {
            
            this.dataToBeSentToSnackBar.message = error.message || 'Failed to block email';
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
          }
        });
      }
    },
    error: (err: any) => {
    
    }
  });
  
  }

  onAction(action: string) {
    if (action === 'SAFE_CLOSE') {
      this.dialogRef.close();
    }
  }

   selectAll(event: MatCheckboxChange): void {
    if (event.checked) {
      this.attachments.forEach(row => this.selection.select(row));
    } else {
      this.selection.clear();
    }
    // this.updateDeleteButtonVisibility();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.attachments.length;
    return numSelected === numRows;
  }

  isIndeterminate() {
    return this.selection.hasValue() && !this.isAllSelected();
  }

  // toggleSelection(element: any) {
  //   this.selection.toggle(element);
  //   // this.updateDeleteButtonVisibility();
  // }

  selectedEmailsToUnblock(){

  }


  // selectedAttachments: string[] = [];
  selectedAttachments: number[] = [];

toggleSelection(attachmentId: number, isChecked: boolean) {
    if (isChecked) {
      // alert("inside toggle selection===="+attachmentId);
        this.selectedAttachments.push(attachmentId);
    } else {
        this.selectedAttachments = this.selectedAttachments.filter(id => id !== attachmentId);
    }
}

// unblockEmails(selectedIds: string[]) {
//     console.log("Selected Emails to Unblock:", selectedIds);
//     // Call API or perform action with selectedIds
// }


}
