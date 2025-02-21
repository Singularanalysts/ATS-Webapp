import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AllFilesService } from '../services/all-files.service';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { AddFolderComponent } from './add-folder/add-folder.component';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { DialogService } from 'src/app/services/dialog.service';
import { share, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as saveAs from 'file-saver';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { ShareComponent } from 'src/app/dialogs/share/share.component';

@Component({
  selector: 'app-all-files',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    RouterModule,
    MatTooltipModule
  ],
  templateUrl: './all-files.component.html',
  styleUrls: ['./all-files.component.scss']
})
export class AllFilesComponent {
 
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'Select',
    // 'SerialNum',
    'Name',
    'DateModified',
    'Type',
    'Size',
    'Extension',
    'View'
  ];

  private allFilesServ = inject(AllFilesService);
  private dialog = inject(MatDialog);
  private snackBarServ = inject(SnackBarService);
  private dialogServ = inject(DialogService);
  userid!: string | null;
  currentPageIndex = 0;
  rename="rename";
  share="share";
  download="download";
  delete="delete";
  newfolder="newfolder";
  upload="upload";
  
  private service = inject(OpenreqService);
  blockedEmails: any; // Initialize as an empty array

  selection = new SelectionModel<any>(true, []);
  showButtons = false;
  private destroyed$ = new Subject<void>();
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private history: { path: string; id: string; parentId: string | null }[] = [];
  private currentPathIndex = -1;
  breadcrumbPaths: { path: string; label: string }[] = [];
  currentFolderName: string = '';

  ngOnInit() {
    this.userid = localStorage.getItem('userid');
    this.route.paramMap.subscribe(params => {
      const folderName = params.get('folderName');
      if (folderName) {
        this.handleClick(decodeURIComponent(folderName));
      } else {
        this.getAllFiles();
      }
    });
  }

  getAllFiles(): void {
    const allFilesObj = {
      userid: this.userid
    }
    this.allFilesServ.getAllFiles(allFilesObj).subscribe({
      next: (response: any) => {
        
//         console.log("fileids and foldersids of all====="+JSON.stringify(response.data));
//         alert("fileids and foldersids of all====="+response.data.map((item: {
//           item_id: any; parent: any; 
// }) => {item.parent;item.item_id}));

        this.dataSource.data = response.data;
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  addFolder() {
    const parentId = this.history.length ? this.history[this.history.length - 1].id : 0;
    const filepath = this.history.length
      ? '/' + this.history.map(entry => entry.path).join('/')
      : '';

    const dialogRef = this.dialog.open(AddFolderComponent, {
      width: '25vw',
      data: {
        actionName: 'add-folder',
        title: 'Add-Folder',
        parentId: parentId,
        filepath: filepath
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        if (filepath === '') {
          this.getAllFiles();
        } else {
          this.loadFolderContents(parentId);
        }
      }
    });
  }

  uploadDocuments() {
    const parentId = this.history.length ? this.history[this.history.length - 1].id : 0;
    const filepath = this.history.length
      ? '/' + this.history.map(entry => entry.path).join('/')
      : '';

    const dialogRef = this.dialog.open(UploadDocumentsComponent, {
      width: '25vw',
      data: {
        actionName: 'upload-files',
        title: 'Upload-Files',
        parentId: parentId
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (dialogRef.componentInstance.submitted) {
        if (filepath === '') {
          this.getAllFiles();
        } else {
          this.loadFolderContents(parentId);
        }
      }
    });
  }

  getIcon(itemType: string): string {
    switch (itemType) {
      case 'file':
        return 'description';
      case 'image':
        return 'image';
      case 'folder':
        return 'folder';
      default:
        return 'help';
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isIndeterminate() {
    return this.selection.hasValue() && !this.isAllSelected();
  }

  selectAll(event: MatCheckboxChange): void {
    if (event.checked) {
      this.dataSource.data.forEach(row => this.selection.select(row));
    } else {
      this.selection.clear();
    }
    this.updateDeleteButtonVisibility();
  }

  isOneSelected(): boolean {
    return this.selection.selected.length === 1;
  }

  edit(): void {
    if (this.selection.selected.length === 1) {
      const selectedRecord = this.selection.selected[0];
      let actionName: string;
      let title: string;

      if (selectedRecord.item_type === 'folder') {
        actionName = 'rename-folder';
        title = 'Rename Folder';
      } else if (selectedRecord.item_type === 'file') {
        actionName = 'rename-file';
        title = 'Rename File';
      } else {
        console.warn('Unsupported item type.');
        return;
      }

      const dialogRef = this.dialog.open(AddFolderComponent, {
        width: '25vw',
        data: {
          actionName: actionName,
          title: title,
          record: selectedRecord
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        if (dialogRef.componentInstance.submitted) {
          this.getAllFiles();
        }
      });
    }
  }

  toggleSelection(element: any) {
    this.selection.toggle(element);
    this.updateDeleteButtonVisibility();
  }

  updateDeleteButtonVisibility(): void {
    this.showButtons = this.selection.selected.length > 0;
  }

  bulkDownload(): void {
    const selectedItems = this.selection.selected;
    const folderIds: any[] = [];
    const fileIds: any[] = [];

    selectedItems.forEach(item => {
      if (item.item_type === "folder") {
        folderIds.push(item.item_id);
      } else if (item.item_type === "file") {
        fileIds.push(item.item_id);
      }
    });

    const downloadObj = {
      // folder: folderIds,
      sourceFileIds: fileIds
    }

    if (folderIds.length || fileIds.length) {
      this.allFilesServ.downloadFoldersAndFiles(downloadObj)
        .subscribe({
          next: (blob: Blob) => {
            saveAs(blob, 'docsync.zip')
            this.dataToBeSentToSnackBar.message = 'Files downloaded Successfully';
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
            this.snackBarServ.openSnackBarFromComponent(
              this.dataToBeSentToSnackBar
            );
            this.getAllFiles();
            this.selection.clear();
            this.updateDeleteButtonVisibility();
          },
          error: (error: any) => {
            this.dataToBeSentToSnackBar.message = error.message;
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(
              this.dataToBeSentToSnackBar
            );
          }
        });
    }
  }

  bulkDelete(): void {
    const selectedItems = this.selection.selected;
    const folderIds: any[] = [];
    const fileIds: any[] = [];

    selectedItems.forEach(item => {
      if (item.item_type === "folder") {
        folderIds.push(item.item_id);
      } else if (item.item_type === "file") {
        fileIds.push(item.item_id);
      }
    });

    const deleteObj = {
      folder: folderIds,
      file: fileIds
    }

    if (folderIds.length || fileIds.length) {
      const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
        title: 'Confirmation',
        message: 'Are you sure you want to delete the selected items?',
        confirmText: 'Yes',
        cancelText: 'No',
        actionData: deleteObj
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '400px';
      dialogConfig.height = 'auto';
      dialogConfig.disableClose = false;
      dialogConfig.panelClass = 'delete-folders-and-files';
      dialogConfig.data = dataToBeSentToDailog;
      const dialogRef = this.dialogServ.openDialogWithComponent(ConfirmComponent, dialogConfig);

      dialogRef.afterClosed().subscribe({
        next: () => {
          if (dialogRef.componentInstance.allowAction) {
            this.allFilesServ.deleteFoldersAndFiles(deleteObj)
              .pipe(takeUntil(this.destroyed$))
              .subscribe({
                next: (response: any) => {
                  this.dataToBeSentToSnackBar.message = response.message;
                  this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
                  this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
                  this.getAllFiles();
                  this.selection.clear();
                  this.updateDeleteButtonVisibility();
                },
                error: (error: any) => {
                  this.dataToBeSentToSnackBar.message = error.message;
                  this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                  this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
                }
              });
          }
        }
      });
    }
  }

  handleClick(element: any): void {
    if (element.item_type === 'folder') {
      this.onFolderClick(element);
    } else {
    }
  }

  private onFolderClick(element: any): void {

    const path = element.name ? encodeURIComponent(element.name) : '';

    if (!path) {
      console.error('Invalid path for folder:', element);
      return;
    }

    this.currentPathIndex++;
    this.history = this.history.slice(0, this.currentPathIndex);
    this.history.push({ path: element.name, id: element.item_id, parentId: element.parent });

    this.updateBreadcrumbs();

    this.allFilesServ.getFoldersandFilesByFolderId(element.item_id, this.userid).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });

        this.router.navigate([path], { relativeTo: this.route });

        this.updateBreadcrumbs();
      },
      error: (err: any) => {
        console.error('Error fetching folder contents:', err);
      }
    });
  }

  updateBreadcrumbs() {
    console.log(this.history);
    this.breadcrumbPaths = this.history.map(entry => ({
      path: entry.path,
      label: decodeURIComponent(entry.path.split('/').pop() || '')
    }));
  }

  goToFolder(index: number): void {
    if (index < this.currentPathIndex) {
      this.currentPathIndex = index;
      this.history = this.history.slice(0, index + 1);
      const folder = this.history[index];
      this.loadFolderContents(folder.id);
      this.updateBreadcrumbs();
    }
  }

  private loadFolderContents(folderId: string | number): void {
    this.allFilesServ.getFoldersandFilesByFolderId(folderId, this.userid).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
        this.updateBreadcrumbs();
        this.router.navigate([encodeURIComponent(this.history[this.currentPathIndex].path)], { relativeTo: this.route });
      },
      error: (err: any) => {
        console.error('Error fetching folder contents:', err);
      }
    });
  }

  goBack(): void {
    if (this.currentPathIndex > 0) {
      this.currentPathIndex--;
      const previousFolder = this.history[this.currentPathIndex];
      this.loadFolderContents(previousFolder.id);
    }
  }

  goToHome(): void {
    this.router.navigate(['/docsync/all-files']).then(() => {
      this.breadcrumbPaths = [];
      this.history = [];
      this.getAllFiles();
    });
  }

  viewAttachment() {
    // Logic to view the attachment
    // window.open(attachment.url, '_blank');
  }

  shareFileOrFolders(){

    this.service.blockedEmailsLists().subscribe({
      next: (response: any) => {
  
        // Store the response data properly
        this.blockedEmails = response.data;
        const attachments = response.data;
        // Format & Alert the response in a readable way
  
        // alert(`Blocked Emails:\n${formattedResponse}`);
 
        const selectedItems = this.selection.selected;
        const parentIds = selectedItems.map(item => item.parent).filter(parent => parent !== null);
        const itemIds = selectedItems.map(item => item.item_id);
       
        // Configure the dialog with the fetched data
        const dialogConfig = {
          width: '600px',
          data: { attachments, parentIds, itemIds } // Pass the fetched attachments to the dialog
        };

        // Open the dialog with the attachments data
        this.dialog.open(ShareComponent, dialogConfig);

      },
      error: (error: any) => {
      
      }
    });

  }

  viewPDF(pdfUrl: any, name: any) {
    if (pdfUrl) {
      // Extract file name and extension
      const fileName = name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  
      // Determine MIME type based on file extension
      const mimeType = this.getMimeType(fileExtension);
  
      // Decode Base64 to binary data
      const byteCharacters = atob(pdfUrl);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
  
      // Create a Blob with the detected MIME type
      const blob = new Blob([byteArray], { type: mimeType });
  
      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);
  
      // Check if the file should be opened
      if (['pdf', 'png', 'jpg', 'jpeg', 'gif', 'docx', 'xlsx'].includes(fileExtension)) {
        window.location.href = url; // Open in the same tab
         //  window.open(pdfUrl, '_blank'); // Open in a new tab
      } else {
        alert("It's not a supported file type");
      }
    }
  }
  
  
getMimeType(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'zip': 'application/zip',
    'rar': 'application/vnd.rar',
    '7z': 'application/x-7z-compressed',
    'mp3': 'audio/mpeg',
    'mp4': 'video/mp4',
    'wav': 'audio/wav',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime'
  };
  
  return mimeTypes[extension] || 'application/octet-stream'; // Default to binary if unknown
}



}
