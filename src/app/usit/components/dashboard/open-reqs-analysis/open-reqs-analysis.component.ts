import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DashboardService } from 'src/app/usit/services/dashboard.service';

@Component({
  selector: 'app-open-reqs-analysis',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './open-reqs-analysis.component.html',
  styleUrls: ['./open-reqs-analysis.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class OpenReqsAnalysisComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<OpenReqsAnalysisComponent>
  ) { }
  dataSource = new MatTableDataSource<any>([]);
  length = 50;
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [50, 75, 100];
  hidePageSize = true;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum!: any;
  field = 'empty';
  companyType: string = '';
  dataTableColumns: string[] = [
    'SerialNum',
    'posted_on',
    'job_title',
    'category_skill',
    'employment_type',
    'job_location',
    'vendor',
  ];
  totalItems: any;
  private dashboardServ = inject(DashboardService);
  department: any;

  ngOnInit(): void {
    this.department = localStorage.getItem('department');
    
    if (this.department.trim().toLowerCase() !== 'consultant') {
      this.dataTableColumns.push('source');
    } 

    const userid = localStorage.getItem('userid');
    this.getReqVendorPopup();

  }

  getReqVendorPopup() {
    this.dashboardServ.getReqCounts(this.data.vendorOrCategory, 'popup', this.data.type, this.data.date).subscribe(
      (response: any) => {
        this.dataSource.data = response.data;
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = i + 1;
        });
      }
    )
  }

  onSort(event: any) {

  }

  handlePageEvent(event: any) {

  }

  onCancel() {
    this.dialogRef.close();
  }

}
