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
import { MatSort } from '@angular/material/sort';
import { PrivilegesService } from 'src/app/services/privileges.service';
@Component({
  selector: 'app-h1transfer',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './h1transfer.component.html',
  styleUrls: ['./h1transfer.component.scss']
})
export class H1transferComponent implements OnInit{
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
  totalItems = 0;
  pageSize = 50;
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = true;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  field = 'empty';
  showReport: boolean = false;
  private router = inject(Router);
  private consultantServ = inject(ConsultantService);
  protected privilegeServ = inject(PrivilegesService);
  ngOnInit(): void {
    const shoWresult = this.privilegeServ.hasPrivilege('US_M1EXCELIMP')
    this.getAllData();
    if (shoWresult) {
      this.showReport = true;
    } else {
      this.showReport = false;
    }
  }

  getAllData(pagIdx = 1) {
    this.consultantServ.getH1TransferList(pagIdx, this.pageSize, this.field).subscribe(
      (response: any) => {
        this.dataSource.data = response.data.content;
        this.totalItems = response.data.totalElements;
        // for serial-num {}
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

  applyFilter(event : any) {
    const keyword = event.target.value;
    if (keyword != '') {
      return this.consultantServ.getH1TransferList(1, this.pageSize, keyword).subscribe(
        ((response: any) => {
          this.dataSource.data  = response.data.content;
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
    return  this.getAllData(this.currentPageIndex + 1);
  }

  onSort(event: any) {

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
