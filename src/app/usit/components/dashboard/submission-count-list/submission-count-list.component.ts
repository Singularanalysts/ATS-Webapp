import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { DashboardService } from 'src/app/usit/services/dashboard.service';

@Component({
  selector: 'app-submission-count-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './submission-count-list.component.html',
  styleUrls: ['./submission-count-list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class SubmissionCountListComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<SubmissionCountListComponent>
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

  private dashboardServ = inject(DashboardService);
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum!: any;
  field = 'empty';
  companyType: string = '';
  dataTableColumns: string[] = [
    'SerialNum',
    'Dos',
    'Id',
    'Consultant',
    'Requirement',
    'ImplementationPartner',
    'EndClient',
    'Vendor',
    'SubRate',
    'ProjectLocation',
    'SubmittedBy',
    'SubStatus',
  ];
  totalItems: any;
  ngOnInit(): void {
    const userid = localStorage.getItem('userid');
    if (this.data.condition == 'admin') {
      this.dashboardServ.getsubmissionCountPopup(this.data.flag, this.data.duration).subscribe(
        ((response: any) => {
          // console.log(response.data)
          this.dataSource.data = response.data;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = i + 1;
          });
        }));
    }
    else {
      this.dashboardServ.getsubmissionCountPopupemp(this.data.flag, this.data.userduration, userid).subscribe(
        ((response: any) => {
          // console.log(response.data)
          this.dataSource.data = response.data;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = i + 1;
          });
        }));
    }
  }

  /*
  subPop(flag: string) {
    // this.submissionFlag
    this.dashboardServ.getsubmissionCountPopup(flag, this.submissionFlag).subscribe(
      ((response: any) => {
        console.log(response.data)
      }));
  }
  */

  onSort(event: any) {

  }

  handlePageEvent(event: any) {

  }


  onCancel() {
    this.dialogRef.close();
  }

}
