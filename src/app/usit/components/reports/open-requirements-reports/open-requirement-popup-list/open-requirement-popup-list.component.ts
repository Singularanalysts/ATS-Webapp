import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReportsService } from 'src/app/usit/services/reports.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { utils, writeFile } from 'xlsx';

@Component({
  selector: 'app-open-requirement-popup-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatRippleModule,
    MatTabsModule
  ],
  templateUrl: './open-requirement-popup-list.component.html',
  styleUrls: ['./open-requirement-popup-list.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class OpenRequirementPopupListComponent implements OnInit {

  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<OpenRequirementPopupListComponent>);
  dataSource = new MatTableDataSource([]);
  repServ = inject(ReportsService);
  dataTableColumns: string[] = [
    'SerialNum',
    'posted_on',
    'job_title',
    'category_skill',
    'employment_type',
    'job_location',
    'vendor',
    'JobDescription',
    'source',
  ];
  page: number = 1;
  count: number = 0;
  tableSize: number = 1000;
  tableSizes: any = [3, 6, 9, 12];
  // paginator
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cdr = inject(PaginatorIntlService);
  payload: any;
  totalItems: number = 0;
  c_data: any[] = [];
  showReport = false;

  ngOnInit() {
    this.getAll();
  }

  getAll(currentPageIndex = 1) {
    this.payload = {
      "pageNumber": currentPageIndex,
      "pageSize": this.pageSize,
      "sortField": "skillset",
      "sortOrder": "asc",
      "endDate": this.data.endDate,
      "categorys": this.data.categorys,
      "startDate": this.data.startDate,
      "flag": "popup",
      "keyword": this.data.category_skill,
    }
    this.repServ.getOpenReqsReport(this.payload).subscribe((res: any) => {
      this.showReport = true;
      this.c_data = res.data.content;
      this.dataSource.data = res.data.content;
      this.dataSource.data = res.data.content;
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
        this.totalItems = res.data.totalElements;
    })
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  handlePageEvent(event: PageEvent) {
    this.payload.pageNumber = event.pageIndex + 1; 
    this.payload.pageSize = event.pageSize;
    this.currentPageIndex = event.pageIndex;
    // this.repServ.getOpenReqsReport(this.payload).subscribe((res: any) => {
    //     this.dataSource.data = res.data.content;
    //     this.dataSource.data.map((x: any, i) => {
    //         x.serialNum = this.generateSerialNumber(i);
    //     });
    // });
    this.getAll(this.payload.pageNumber)
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSort(event: any) {

  }

  headings: any[] = [];
  excelData: any[] = [];
  excelImport() {
    this.headings = [[
      'Posted On',
      'Job Title',
      'Category Skill',
      'Employment Type',
      'Job Location',
      'Vendor',
      'Job Description',
      'Source',
    ]];

    this.excelData = this.c_data.map(c => [
      c.posted_on,
      c.job_title,
      c.category_skill,
      c.employment_type,
      c.job_location,
      c.vendor,
      'View',
      c.source,
    ]);
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, this.headings);
    utils.sheet_add_json(ws, this.excelData, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'data');
    writeFile(wb, 'Open-Requirements-List-Report@' + this.payload.startDate + ' TO ' + this.payload.endDate + '.xlsx');

  }

}
