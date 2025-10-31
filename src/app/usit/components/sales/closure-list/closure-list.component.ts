import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { InterviewService } from 'src/app/usit/services/interview.service';

@Component({
  selector: 'app-closure-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './closure-list.component.html',
  styleUrls: ['./closure-list.component.scss'],
})
export class ClosureListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Company',
    'ConsultantName',
    'ConsultantEmail',
    'Contact',
    'Visa',
    'VisaValidity',
    'Client',
    'ImplPartner',
    'Vendor',
    'Recruiter',
    'RateType',
    'Rate',
    'Employee',
    'RateFromVendor',
    'RateToConsultant',
    'BillingCycle',
    'PaymentCycle',
    'ProjectStartDate',
    'ProjectEndDate',
    'VendorArContact',
  ];

  flag!: string;
  entity: any[] = [];
  totalItems: number = 0;
  closureCount: number = 0;
  currentPageIndex = 0;

  // Pagination setup
  length = 50;
  pageIndex = 0;
  pageSize = 50;
  pageSizeOptions = [50, 75, 100];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;

  // ViewChild references
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Injected services
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private interviewServ = inject(InterviewService);
  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.getFlag();
    this.getAll();
  }

  ngAfterViewInit(): void {
    // ensure paginator and sort are assigned after view init
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    //  setup sorting accessor once initially
    this.setSortingAccessor();
  }

  //  added helper to set sorting rules in one place
  private setSortingAccessor(): void {
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'SerialNum': return item.serialNum;
        case 'Company': return item.companyname?.toLowerCase() || '';
        case 'ConsultantName': return item.consultantname?.toLowerCase() || '';
        case 'ConsultantEmail': return item.consultantemail?.toLowerCase() || '';
        case 'Contact': return item.contactnumber || '';
        case 'Visa': return item.visa_status?.toLowerCase() || '';
        case 'VisaValidity': return item.visavalidity || '';
        case 'Client': return item.endclient?.toLowerCase() || '';
        case 'ImplPartner': return item.implpartner?.toLowerCase() || '';
        case 'Vendor': return item.vendor?.toLowerCase() || '';
        case 'Recruiter': return item.recruiter?.toLowerCase() || '';
        case 'RateType': return item.ratetype?.toLowerCase() || '';
        case 'Rate': return +this.NumericValue(item.submissionrate);
        case 'Employee': return item.pseudoname?.toLowerCase() || '';
        case 'RateFromVendor': return +this.NumericValue(item.billratevendor);
        case 'RateToConsultant': return +this.NumericValue(item.payrateconsultant);
        case 'BillingCycle': return item.billingcycle?.toLowerCase() || '';
        case 'PaymentCycle': return item.paymentcycle?.toLowerCase() || '';
        case 'ProjectStartDate': return new Date(item.projectstartdate).getTime() || 0;
        case 'ProjectEndDate': return new Date(item.projectendtdate).getTime() || 0;
        case 'VendorArContact': return item.vendorarphonenumber || '';
        default: return '';
      }
    };
  }

  getFlag(): void {
    const routeData = this.activatedRoute.snapshot.data;
    if (routeData['isSalesClosure']) {
      this.flag = 'Sales';
    } else if (routeData['isRecClosure']) {
      this.flag = 'Recruiting';
    } else {
      this.flag = 'Domrecruiting';
    }
  }

  getAll(): void {
    this.interviewServ
      .getOnboardedDetails(this.flag, localStorage.getItem('companyid'))
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        this.entity = response.data || [];
        this.entity.forEach((x: any, i: number) => {
          x.serialNum = this.generateSerialNumber(i);
        });

        //  recreate datasource with new data
        this.dataSource = new MatTableDataSource(this.entity);

        //  reattach sorting rules every time data source is recreated
        this.setSortingAccessor();

        //  rebind paginator and sort after small delay
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.closureCount = this.entity.length;
        this.totalItems = this.entity.length;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    return (pagIdx - 1) * this.pageSize + index + 1;
  }

  navigateToDashboard(): void {
    this.router.navigateByUrl('/usit/dashboard');
  }

  handlePageEvent(e: PageEvent): void {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.currentPageIndex = e.pageIndex;
  }

  NumericValue(value: string): string {
    if (!value) return '';
    return value.replace(/[^0-9.]/g, '');
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
