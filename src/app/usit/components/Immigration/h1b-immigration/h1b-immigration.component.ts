import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog.service';
import { AddH1bImmigrantComponent } from './add-h1b-immigrant/add-h1b-immigrant.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { H1bImmigrantService } from 'src/app/usit/services/h1b-immigrant.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
@Component({
  selector: 'app-h1b-immigration',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule, MatSortModule
  ],
  templateUrl: './h1b-immigration.component.html',
  styleUrls: ['./h1b-immigration.component.scss']
})
export class H1bImmigrationComponent implements OnInit {

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Name',
    'Company',
    'ValidFrom',
    'ValidTill',
    'E-Verify',
    'LastI9',
    'Action',
  ];
  // paginator
  length = 50;
  pageSize = 50;
  pageIndex = 0;
  pageSizeOptions = [50, 75, 100];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum !: any;
  totalItems: any;
  field = "empty";
  currentPageIndex = 0;

  private router = inject(Router);
  private dialogServ = inject(DialogService);
  private h1bServ = inject(H1bImmigrantService);
  submitted = false;

  ngOnInit(): void {
    this.getAll();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAll() {
    return this.h1bServ.getAll().subscribe(
      ((response: any) => {
        this.dataSource.data = response.data;
        this.totalItems = response.data.totalElements;
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      })
    );
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  addH1b() {
    const actionData = {
      title: 'Add H1B',
      interviewData: null,
      actionName: 'add-h1b',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-h1b';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddH1bImmigrantComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll();
      }
    })
  }

  editH1b(h1b: any) {
    const actionData = {
      title: 'Update H1B',
      h1bData: h1b,
      actionName: 'edit-h1b',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.panelClass = 'edit-h1b';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddH1bImmigrantComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll();
      }
    })
  }

  onFilter(event: any) {
    this.dataSource.filter = event.target.value;
  }

  applyFilter(event: any) {

  }



  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }
  onSort(event: Sort) {
    const sortDirection = event.direction;
    const activeSortHeader = event.active;

    if (sortDirection === '') {
      this.dataSource.data = this.dataSource.data;
      this.dataSource.sort = this.sort;
      return;
    }
   const isAsc = sortDirection === 'asc';
    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      switch (activeSortHeader) {
        case 'Name':
          return (
            (isAsc ? 1 : -1) *
            (a.employeename || '').localeCompare(b.employeename || '')
          );
        case 'Company':
          return (
            (isAsc ? 1 : -1) *
            (a.companyname || '').localeCompare(b.companyname || '')
          );
        case 'ValidFrom':
          const h1validfromA = new Date(a.h1validfrom);
          const h1validfromeB = new Date(b.h1validfrom);
          return isAsc ? h1validfromA.getTime() - h1validfromeB.getTime() : h1validfromeB.getTime() - h1validfromA.getTime();
        case 'ValidTill':
          const h1validtoA = new Date(a.h1validto);
          const h1validtoB = new Date(b.h1validto)
          return isAsc ? h1validtoA.getTime() - h1validtoB.getTime() : h1validtoB.getTime() - h1validtoA.getTime();
        case 'E-Verify':
          const everifydateA = new Date(a.everifydate);
          const everifydateB = new Date(b.everifydate)
          return isAsc ? everifydateA.getTime() - everifydateB.getTime() : everifydateB.getTime() - everifydateA.getTime();
        case 'LastI9':
          const lasti9dateA = new Date(a.lasti9date);
          const lasti9dateB = new Date(b.lasti9date)
          return isAsc ? lasti9dateA.getTime() - lasti9dateB.getTime() : lasti9dateB.getTime() - lasti9dateA.getTime();
          case 'SerialNum':
            // Assuming 'serialNum' is the property representing the serial number
            const serialNumA = parseInt(a.serialNum) || 0;
            const serialNumB = parseInt(b.serialNum) || 0;
            return (isAsc ? 1 : -1) * (serialNumA - serialNumB);
        default:
          return 0;
      }
    });
  }

}
