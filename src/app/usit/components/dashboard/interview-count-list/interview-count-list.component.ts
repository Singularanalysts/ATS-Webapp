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
  selector: 'app-interview-count-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './interview-count-list.component.html',
  styleUrls: ['./interview-count-list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class InterviewCountListComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<InterviewCountListComponent>
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
    'InterviewId',
    'ConsultantName',
    'DateAndToI',
    'Round',
    'Mode',
    'Client',
    'ImplementationPartner',

    'Vendor',
    'DateOfSubmission',
    'EmployeerName',
    'InterviewStatus',
  ];
  totalItems: any;
  private dashboardServ = inject(DashboardService);
  ngOnInit(): void {
    const userid = localStorage.getItem('userid');
    if (this.data.condition == 'admin') {
    this.dashboardServ.getInterviewCountPopup(this.data.flag, this.data.duration,localStorage.getItem('companyid')).subscribe(
      ((response: any) => {
        this.dataSource.data = response.data;
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = i + 1;
        });
      }));
    }
    else{
      this.dashboardServ.getInterviewCountPopupEmp(this.data.flag, this.data.duration,userid).subscribe(
        ((response: any) => {
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
