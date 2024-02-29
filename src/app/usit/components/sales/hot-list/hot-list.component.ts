import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { utils, writeFile } from 'xlsx';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-hot-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './hot-list.component.html',
  styleUrls: ['./hot-list.component.scss']
})
export class HotListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Name',
    'Technology',
    'Visa',
    'Experience',
    'Rate',
    'Priority',
    'CurrentLocation',
    'Relocation',
    'Phone',
    'Email',
  ];
  // pagination code
  length = 50;
  pageIndex = 0;
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [50, 75, 100];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  protected privilegeServ = inject(PrivilegesService);
  private router = inject(Router);
  private consultantServ = inject(ConsultantService);
  showReport: boolean = false;
  totalItems: number = 0;
  pageEvent!: PageEvent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    const shoWresult = this.privilegeServ.hasPrivilege('US_M1EXCELIMP')
    if (shoWresult) {
      this.showReport = true;
    } else {
      this.showReport = false;
    }
    this.getAllData();
  }

  getAllData() {
    this.consultantServ.getSalesAllHotList().subscribe(
      (response: any) => {
        this.dataSource.data = response.data;
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = i + 1;
        });
        this.totalItems = response.data.totalElements;
      }
    )
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onFilter(event: any){
    this.dataSource.filter = event.target.value;
  }

  onSort(event: any) {

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

  handleExport() {
    const currentDate = new Date();
    const chicagoDate = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(currentDate);

    const headings = [[
      'Name',
      'Technology',
      'Visa',
      'Exp',
      'Rate',
      'Priority',
      'Location',
      'Relocation',
      'Phone',
      'Email',
    ]];
    const excelData = this.dataSource.data.map(c => [
      c.consultantname,
      c.technologyarea,
      c.visa_status,
      c.experience,
      c.hourlyrate,
      c.priority,
      c.currentlocation,
      c.relocation,
      c.contactnumber,
      c.consultantemail
    ]);

    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, excelData, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'data');
    writeFile(wb, 'HotList@' + chicagoDate + '.xlsx');
  }
}
