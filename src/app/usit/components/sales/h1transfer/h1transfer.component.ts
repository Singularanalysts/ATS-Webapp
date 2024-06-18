import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { utils, writeFile } from 'xlsx';
import { MatSort, Sort } from '@angular/material/sort';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { MatSortModule } from '@angular/material/sort';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
@Component({
  selector: 'app-h1transfer',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,MatSortModule
  ],
  templateUrl: './h1transfer.component.html',
  styleUrls: ['./h1transfer.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
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
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  onSort1(event: Sort) {
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
        case 'SerialNum':
          // Assuming 'serialNum' is the property representing the serial number
          const serialNumA = parseInt(a.serialNum) || 0;
          const serialNumB = parseInt(b.serialNum) || 0;
          return (isAsc ? 1 : -1) * (serialNumA - serialNumB);
        case 'Name':
          return (
            (isAsc ? 1 : -1) *
            (a.consultantname || '').localeCompare(b.consultantname || '')
          );
          
        case 'Technology':
          return (
            (isAsc ? 1 : -1) * (a.technologyarea || '').localeCompare(b.technologyarea || '')
          );
        case 'Visa':
          return (
            (isAsc ? 1 : -1) *
            (a.visa_status || '').localeCompare(b.visa_status || '')
          );
          
          case 'Experience':
            // Assuming 'experience' is the property representing the experience
            const experienceA = parseInt(a.experience) || 0;
            const experienceB = parseInt(b.experience) || 0;
            return (isAsc ? 1 : -1) * (experienceA - experienceB);
          
            case 'Rate':
              // Assuming 'experience' is the property representing the experience
              const hourlyrateA = parseInt(a.hourlyrate) || 0;
              const hourlyrateB = parseInt(b.hourlyrate) || 0;
              return (isAsc ? 1 : -1) * (hourlyrateA - hourlyrateB);
            
              case 'Priority':
                const priorityA = parseInt(a.priority.slice(1)); 
                const priorityB = parseInt(b.priority.slice(1)); 
                return (isAsc ? 1 : -1) * (priorityA - priorityB); 
          case 'CurrentLocation':
          return (
            (isAsc ? 1 : -1) * (a.currentlocation || '').localeCompare(b.currentlocation || '')
          );
          case 'Relocation':
          return (
            (isAsc ? 1 : -1) * (a.relocation || '').localeCompare(b.relocation || '')
          );
          case 'Phone':
            const PhoneA = this.extractNumericValue(a.contactnumber);
            const PhoneB = this.extractNumericValue(b.contactnumber);
            return (isAsc ? 1 : -1) * (PhoneA - PhoneB);
          case 'Email':
          return (
            (isAsc ? 1 : -1) * (a.consultantemail || '').localeCompare(b.consultantemail || '')
          );
        default:
          return 0;
      }
    });
  }
  extractNumericValue(phoneNumber: string): number {
    // Remove non-numeric characters and parse as integer
    return parseInt(phoneNumber.replace(/\D/g, ''));
  }

  getAllData(pagIdx = 1) {
    this.consultantServ.getH1TransferList(pagIdx, this.pageSize, this.field, this.sortField, this.sortOrder).subscribe(
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
      return this.consultantServ.getH1TransferList(1, this.pageSize, keyword, this.sortField, this.sortOrder).subscribe(
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

  

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAllData(event.pageIndex + 1)
    }
    return;
  }

  sortField = 'updateddate';
  sortOrder = 'desc';
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
