import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AddconsultantComponent } from '../../sales/consultant-list/add-consultant/add-consultant.component';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
@Component({
  selector: 'app-future-opt-cpt',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './future-opt-cpt.component.html',
  styleUrls: ['./future-opt-cpt.component.scss']
})
export class FutureOptCptComponent implements OnInit {

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Email',
    'Number',
    'Technology',
    'University',
    'BeneficiaryFirstName',
    'BeneficiaryMiddleName',
    'BeneficiaryLastName',
    'CurrentLocation',
    'Gender',
    'Action',
  ];
  @ViewChild(MatSort) sort!: MatSort;
  private consultantServ = inject(ConsultantService);
  private dialogServ = inject(DialogService);
  private router = inject(Router);
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum !: any;
  totalItems: any;
  field = "empty";
  currentPageIndex = 0;
  pageEvent!: PageEvent;
  pageSize = 50;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageSizeOptions = [50, 75, 100];
  flag = 'sales';

  ngOnInit(): void {
    this.getAll()
  }

  getAll(pagIdx = 1) {
    this.consultantServ.getOptCptList(pagIdx, this.itemsPerPage, this.field).subscribe(
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

  editOptCpt(OptCpt: any) {
    const actionData = {
      title: 'Update consultant',
      consultantData: OptCpt,
      actionName: 'edit-consultant',
      flag: this.flag,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.panelClass = 'edit-consultant';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddconsultantComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll(this.currentPageIndex + 1);
      }
    })
  }

  applyFilter(event: any) {
    this.dataSource.filter = event.target.value;
  }
  //lavanya
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
        case 'SerialNum':
          // Assuming 'serialNum' is the property representing the serial number
          const serialNumA = parseInt(a.serialNum) || 0;
          const serialNumB = parseInt(b.serialNum) || 0;
          return (isAsc ? 1 : -1) * (serialNumA - serialNumB);
        case 'Email':
          return (
            (isAsc ? 1 : -1) *
            (a.consultantemail || '').localeCompare(b.consultantemail || '')
          );
        case 'Number':
            const NumberA = this.extractNumericValue(a.contactnumber);
            const NumberB = this.extractNumericValue(b.contactnumber);
            return (isAsc ? 1 : -1) * (NumberA - NumberB);
        case 'Technology':
          return (
            (isAsc ? 1 : -1) * (a.technologyarea || '').localeCompare(b.technologyarea || '')
          );

        case 'University':
          return (
            (isAsc ? 1 : -1) *
            (a.university || '').localeCompare(b.university || '')
          );
        case 'BeneficiaryFirstName':
          return (
            (isAsc ? 1 : -1) *
            (a.h1validto || '').localeCompare(b.h1validto || '')
          );
        case 'BeneficiaryMiddleName':
          return (
            (isAsc ? 1 : -1) * (a.everifydate || '').localeCompare(b.everifydate || '')
          );
        case 'BeneficiaryLastName':
          return (
            (isAsc ? 1 : -1) * (a.lasti9date || '').localeCompare(b.lasti9date || '')
          );
        case 'CurrentLocation':
          return (
            (isAsc ? 1 : -1) * (a.currentlocation || '').localeCompare(b.currentlocation || '')
          );
        case 'Gender':
          return (
            (isAsc ? 1 : -1) * (a.gender || '').localeCompare(b.gender || '')
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
  //

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAll(event.pageIndex + 1)
    }
    return;
  }
  //lavanya
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

  }
  //
}
