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
    MatDialogModule
  ],
  templateUrl: './all-files.component.html',
  styleUrls: ['./all-files.component.scss']
})
export class AllFilesComponent {
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Name',
    'DateModified',
    'Type',
    'Size'
  ];

  private allFilesServ = inject(AllFilesService);
  private dialog = inject(MatDialog);
  userid!: string | null;
  currentPageIndex = 0;

  ngOnInit() {
    this.userid = localStorage.getItem('userid')
    this.getAllFiles();
  }

  getAllFiles(): void {
    const allFilesObj = {
      userid: this.userid
    }
    this.allFilesServ.getAllFiles(allFilesObj).subscribe({
      next: (response: any) => {
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
    const dialogRef = this.dialog.open(AddFolderComponent, {
      width: '25vw',
      data: {
        title: 'Add-Folder'
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAllFiles()
      }
    });
  }

  uploadDocuments() {
    const dialogRef = this.dialog.open(UploadDocumentsComponent, {
      width: '25vw',
      data: {
        title: 'Upload-Folder'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      
    });
  }

}
