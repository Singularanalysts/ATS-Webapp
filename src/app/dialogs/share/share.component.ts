import { Component, inject, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { IConfirmDialogData } from '../models/confirm-dialog-data';
import { DialogService } from 'src/app/services/dialog.service';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { EmailsDeleteConfirmComponent } from '../emails-delete-confirm/emails-delete-confirm.component'; 
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
  standalone: true,
  imports: [
      CommonModule,
      MatIconModule,
      MatButtonModule,
      MatDialogModule,
      MatCheckboxModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule
    ]
})
export class ShareComponent {

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
    filteredAttachments: any[] = []; // Holds the filtered data
  searchTerm: string = ''; // Search input binding
    parentIds: number[];
    itemIds: number[];
    sourceFileId: any[] = []; // Dynamic assignment
    sourceFolderId: any[] = []; 
    toEmail: any[] = []; 
    constructor(public dialogRef: MatDialogRef<ShareComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
      this.attachments = data.attachments || [];
      this.filteredAttachments = [...this.attachments]; // Initialize with all data
      this.parentIds = data.parentIds; // Access the parent IDs passed from AllFilesComponent
      this.itemIds = data.itemIds;
      
    }
  
 ngOnInit() {
    this.sourceFileId = this.itemIds; // Assign item IDs to sourceFileId
    this.sourceFolderId = this.parentIds;
    this.selection.clear();
  
    // alert('Received Parent IDs:', this.parentIds);
    // You can now use this.parentIds in your component logic
  }

  // sourceFileId: any[]= [580,239];
  //  sourceFolderId: any[]=[151,581];
  // Assign folder IDs correctly
  // toEmail: any[]=["keerthi@narveetech.com"];

  // unblockEmails(id:any) {
   unblockEmails(selectedIds: any) {
  
const datatosend={
 sourceFileIds: this.sourceFileId,
 sourceFolderIds:this.sourceFolderId, 
 toEmails:this.toEmail
};

    const dataToBeSentToDialog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to share to selected emails?',
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
          
          this.service.unblockingEmailWithId(datatosend).subscribe({
            next: (response: any) => {
          if (response.status === 'Success') {
  
        //   this.selection.clear();
        //  this.showDeleteButton=false;
        //  this.showBlockButton=false;
        //   this.getAll();
  
          this.dataToBeSentToSnackBar.message = "Shared Successfully";
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
            
          this.router.navigateByUrl('/docsync/all-files');
         
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
  
  toggleSelection(attachmentId: number, isChecked: boolean, email: string) {
      if (isChecked) {
        // alert("inside toggle selection===="+attachmentId);
          this.selectedAttachments.push(attachmentId);
          this.toEmail.push(email);
      } else {
          this.selectedAttachments = this.selectedAttachments.filter(id => id !== attachmentId);
      }
  }
  
  // unblockEmails(selectedIds: string[]) {
  //     console.log("Selected Emails to Unblock:", selectedIds);
  //     // Call API or perform action with selectedIds
  // }
  
  applyFilter() {
    if (!this.searchTerm) {
      this.filteredAttachments = [...this.attachments]; // Reset if search is empty
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredAttachments = this.attachments.filter(attachment => 
        attachment.email.toLowerCase().includes(searchLower)
      );
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilter();
  }


}
