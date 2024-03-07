import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FileManagementService } from 'src/app/usit/services/file-management.service';
import { read, utils } from 'xlsx';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-upload-vms-excel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './upload-vms-excel.component.html',
  styleUrls: ['./upload-vms-excel.component.scss']
})
export class UploadVmsExcelComponent implements OnInit {

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'Company',
    'Name',
    'Email',
    'Type',
    'VendorType',
    'CompanyType',
    'Location',
    'Contact',
  ];
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<UploadVmsExcelComponent>);
  private fileService = inject(FileManagementService);
  file!: any;
  excel: any[] = [];
  flg = false;
  userid: any;
  private snackBarServ = inject(SnackBarService);
  // snack bar data
  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };

  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
  }

  @ViewChild('resume')
  resume: any = ElementRef;
  excelupload!: any;
  uploadResume(event: any) {
    this.excelupload = event.target.files[0];
    const files = event.target.files;
    console.log(this.excelupload);
    
    if (files.length) {
      // this.submit(this.userid);
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          this.excel = rows;
          console.log(this.excel);
        }
      }
      reader.readAsArrayBuffer(file);
    }
  }

  // submit(id: number) {
  //   const formData = new FormData();

  //   if (this.excelupload != null) {
  //     formData.append('file', this.excelupload, this.excelupload.name);
  //   }
  //   this.fileService.excelUploadFile(formData, id)
  //     .subscribe((response: any) => {
  //       if (response.status === 200) {
  //         console.log('Excel Uploaded Succcessfully');
  //         this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-success'];
  //         this.dataTobeSentToSnackBarService.message = 'Excel Uploaded Succcessfully';
  //         this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
  //       } else {
  //         this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
  //         this.dataTobeSentToSnackBarService.message = 'Excel Uploaded Failed';
  //         this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
  //       }
  //       this.dialogRef.close();
  //     }
  //     );
  // }


  onCancel() {
    this.dialogRef.close();
  }
}
