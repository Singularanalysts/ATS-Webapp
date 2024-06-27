import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { OpenreqService } from '../../services/openreq.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { MatTabsModule } from '@angular/material/tabs';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-linkedprofiles',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSortModule
  ],
  templateUrl: './linkedprofiles.component.html',
  styleUrls: ['./linkedprofiles.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }]
})
export class LinkedprofilesComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'candidate_name',
    'address',
    'category',
    'experience_summary',
    'job_title'
  ];
  // paginator
  length = 50;
  pageIndex = 0;
  pageSize = 50;
  currentPageIndex = 0;
  pageSizeOptions = [50, 75, 100];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  totalItems: number = 0;
  field = 'empty';
  private router = inject(Router);
  private service = inject(OpenreqService);
  private snackBarServ = inject(SnackBarService);
  userid!: any;
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  sortField = 'updateddate';
  sortOrder = 'desc';

  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.getAllData();
  }

  empTag(id: number) {
    this.service.openReqsEmpTagging(id, this.userid).subscribe(
      (response: any) => {

      })
  }

  getAllData(pagIdx = 1) {
    const pagObj = {
      pageNumber: pagIdx,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field,
    }
    this.service.linkedInPagination(pagObj).subscribe(
      (response: any) => {
        this.dataSource.data = response.data.content;
        this.totalItems = response.data.totalElements;
        // for serial-num {
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      }
    )
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  onFilter(event: any) {
    this.dataSource.filter = event.target.value;
  }

  onSort(event: Sort) {
    if (event.active == 'SerialNum')
      this.sortField = 'updateddate'
    else
      this.sortField = event.active;
      this.sortOrder = event.direction;
    
    if (event.direction != ''){
    this.getAllData();
    }
  }

  applyFilter(event: any) {
    const keyword = event.target.value;
    const pagObj = {
      pageNumber: 1,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: keyword,
    }
    if (keyword != '') {
      return this.service.linkedInPagination(pagObj).subscribe(
        ((response: any) => {
          this.dataSource.data = response.data.content;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
          this.totalItems = response.data.totalElements;

        })
      );
    }
    if (keyword == '') {
      this.field = 'empty';
    }
    return this.getAllData(this.currentPageIndex + 1);
  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAllData(event.pageIndex + 1)
    }
    return;
  }

  lockProfile(id: number) {
    this.service.lockProfiles(id, this.userid).subscribe(
      (response: any) => {

        if (response.status == 'success') {
          this.dataToBeSentToSnackBar.panelClass = [
            'custom-snack-success',
          ];
          this.dataToBeSentToSnackBar.message =
            'Profile locked successfully';
        } else {
          this.dataToBeSentToSnackBar.panelClass = [
            'custom-snack-failure',
          ];
          this.dataToBeSentToSnackBar.message = response.message;
        }
        this.snackBarServ.openSnackBarFromComponent(
          this.dataToBeSentToSnackBar
        );
        this.getAllData();
      }
    )
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }
}

