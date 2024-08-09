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
import { read, utils, writeFile } from 'xlsx';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './upload-vms-excel.component.html',
  styleUrls: ['./upload-vms-excel.component.scss']
})
export class UploadVmsExcelComponent implements OnInit {

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SNo',
    'Company',
    'Name',
    'Email',
    'Type',
    'VendorType',
    'CompanyType',
    'Location',
    'Contact',
    'Country'
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
  upload: boolean = true;
  loading: boolean = false;

  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
  }

  @ViewChild('resume')
  resume: any = ElementRef;
  excelupload!: any;
  excelFileName: string = 'No file chosen';
  uploadResume(event: any) {
    this.excelupload = event.target.files[0];
    this.excelFileName = this.excelupload ? this.excelupload.name : 'No file chosen';
    const files = event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        if (sheets.length) {
          this.upload = false;
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          this.excel = rows;
          this.excel.map((x: any, i) => {
            x.serialNum = i + 1;
          });
        }
      }
      reader.readAsArrayBuffer(file);
    }
  }

  submit(id: number) {
    this.loading = true;
    const formData = new FormData();

    if (this.excelupload != null) {
      formData.append('file', this.excelupload, this.excelupload.name);
    }
    this.fileService.excelUploadFile(formData, id)
      .subscribe((response: any) => {
        if (response.status === 200) {
          this.loading = true;
          this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-success'];
          this.dataTobeSentToSnackBarService.message = 'Excel Uploaded Succcessfully';
          this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
        } else {
          this.loading = true;
          this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
          this.dataTobeSentToSnackBarService.message = 'Excel Uploaded Failed';
          this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
        }
        this.dialogRef.close();
      }
      );
  }

  handleExport() {
    const headings = [[
      'Company',
      'Name',
      'Email',
      'Type',
      'VendorType',
      'CompanyType',
      'Location',
      'Contact',
      'Country'
    ]];
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, this.excel, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'data');
    writeFile(wb, 'VMS_Data_Sample.xlsx');
  }

  onCancel() {
    this.dialogRef.close();
  }
}
