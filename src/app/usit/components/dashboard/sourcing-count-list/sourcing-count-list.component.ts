import { Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DashboardService } from 'src/app/usit/services/dashboard.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sourcing-count-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './sourcing-count-list.component.html',
  styleUrls: ['./sourcing-count-list.component.scss']
})
export class SourcingCountListComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<SourcingCountListComponent>
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
    'Date',
    'Id',
    'Name',
    'Email',
    'ContactNumber',
    'Visa',
    'CurrentLocation',
    'Company',
    'Position',
    'Experience',
    'Relocation',
    'Rate',
    'Priority',
    'Status',
  ];
  totalItems: any;
  private dashboardServ = inject(DashboardService);

  ngOnInit(): void {
    const userid = localStorage.getItem('userid');
    this.dashboardServ.getSourcingCountPopup(this.data.duration, this.data.flag).subscribe(
      ((response: any) => {
        this.dataSource.data = response.data;
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = i + 1;
        });
      }));
  }

  onCancel() {
    this.dialogRef.close();
  }



}
