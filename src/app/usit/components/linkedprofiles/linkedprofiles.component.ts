import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialogConfig } from '@angular/material/dialog';

import { OpenreqService } from '../../services/openreq.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LinkedInProfilesComponent } from '../dashboard/linked-in-profiles/linked-in-profiles.component';

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
  // Table & paginator
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'candidate_name',
    'address',
    'category',
    'experience_summary',
    'job_title'
  ];

  // Dialog service
  private dialogServ = inject(DialogService);

  // Pagination
  length = 50;
  pageIndex = 0;
  pageSize = 50;
  currentPageIndex = 0;
  pageSizeOptions = [50, 75, 100];
  showFirstLastButtons = true;
  pageEvent!: PageEvent;

  // API & filtering
  itemsPerPage = 50;
  totalItems = 0;
  field = 'empty'; // search keyword
  status = 'all'; // tab status (all/usa/uae)
  tabs = ['USA']; // example tabs
  pageIndices: { [key: string]: number } = { all: 0, usa: 0, uae: 0 };
  sortField = 'updateddate';
  sortOrder: 'asc' | 'desc' = 'desc';
  private router = inject(Router);
  private service = inject(OpenreqService);
  private snackBarServ = inject(SnackBarService);
  userid!: any;

  // SnackBar default data
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };

  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.getAllData(); // initial load
  }

  // Generate serial number for each row
  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    return (pagIdx - 1) * this.pageSize + index + 1;
  }

  // API call for fetching data with pagination, sort & search
  getAllData(pagIdx = 1, status: string = this.status) {
    const pagObj = {
      pageNumber: pagIdx,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field === '' ? 'empty' : this.field, // send 'empty' if no search
      country: status
    };

    this.service.linkedInPagination(pagObj).subscribe((response: any) => {
      this.dataSource.data = response.data.content;
      this.totalItems = response.data.totalElements;
      this.dataSource.data.forEach((x: any, i) => x.serialNum = this.generateSerialNumber(i));
    });
  }

  // Open add LinkedIn Profile dialog
  addLinkedInProfile() {
    const actionData = {
      title: 'LinkedIn Profiles',
      interviewData: null,
      actionName: 'add-executiverating',
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-interview';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(LinkedInProfilesComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.getAllData(this.currentPageIndex + 1);
      }
    });
  }

  // Search/filter
  applyFilter(event: any) {
    const keyword = event.target.value;
    this.field = keyword || 'empty';
    this.currentPageIndex = 0; // reset to first page
    this.getAllData(1, this.status);
  }

  // Sorting
  onSort(event: Sort) {
    if (!event.direction) return; // ignore empty
    this.sortField = event.active === 'SerialNum' ? 'updateddate' : event.active;
    this.sortOrder = event.direction as 'asc' | 'desc';
    this.getAllData(this.currentPageIndex + 1, this.status);
  }

  // Pagination
  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPageIndex = event.pageIndex;
    this.getAllData(event.pageIndex + 1, this.status);
  }

  // Lock profile
  lockProfile(id: number) {
    this.service.lockProfiles(id, this.userid).subscribe((response: any) => {
      if (response.status === 'success') {
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
        this.dataToBeSentToSnackBar.message = 'Profile locked successfully';
      } else {
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.dataToBeSentToSnackBar.message = response.message;
      }
      this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      this.getAllData(this.currentPageIndex + 1, this.status);
    });
  }

  // Tab change
  onTabChanged(event: MatTabChangeEvent) {
    this.status = event.tab.textLabel.toLowerCase();
    this.currentPageIndex = this.pageIndices[this.status] || 0;
    this.getAllData(this.currentPageIndex + 1, this.status);
  }
}
