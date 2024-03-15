import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { OpenreqService } from '../../services/openreq.service';
import { MatSort } from '@angular/material/sort';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-rssfed',
  standalone: true,
  imports: [CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule],
  templateUrl: './rssfed.component.html',
  styleUrls: ['./rssfed.component.scss']
})
export class RssfedComponentimplements implements OnInit {
  dataSource = new MatTableDataSource<any>([]);

  dataTableColumns: string[] = [
    'SerialNum',
    'pubdate',
    'company',
    'feedTitle',
    'city',
    'jobtype',
    'payrate',
    'empemail',
    'empfirstname',
  ];
   // paginator
  length = 50;
  pageIndex = 0;
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [50, 75, 100];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  totalItems: number = 0;
  field = 'empty';
  private router = inject(Router);
  private service = inject(OpenreqService);
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  private snackBarServ = inject(SnackBarService);
  ngOnInit(): void {
    this.getAllData();
  }
  readRSS(){
    this.service.readrss().subscribe(
      (response: any) => {
        if (response.status == 'success') {
          this.dataToBeSentToSnackBar.panelClass = [
            'custom-snack-success',
          ];
          this.dataToBeSentToSnackBar.message =
            'RSS read successfully';
            this.getAllData();
        } else {
          this.dataToBeSentToSnackBar.panelClass = [
            'custom-snack-failure',
          ];
          this.dataToBeSentToSnackBar.message = response.message;
        }
        this.snackBarServ.openSnackBarFromComponent(
          this.dataToBeSentToSnackBar
        );
      })
  }
  getAllData(pagIdx = 1) {
    this.service.rssfeedData().subscribe(
      (response: any) => {
        this.dataSource.data = response.data;
        this.totalItems = response.data.totalElements;
        //console.log(this.totalItems);
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = i + 1;
        });
      }
    )
  }

  onFilter(event: any){
    this.dataSource.filter = event.target.value;
  }

  onSort(event: any) {

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAllData(event.pageIndex + 1)
    }
    return;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }
}
