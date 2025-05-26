import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/usit/services/reports.service';
import { utils, writeFile } from 'xlsx';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { Observable, Subject, catchError, map, startWith, throwError } from 'rxjs';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { DialogService } from 'src/app/services/dialog.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Recruiter } from 'src/app/usit/models/recruiter';
import { VendorService } from 'src/app/usit/services/vendor.service';
import { OpenRequirementPopupListComponent } from './open-requirement-popup-list/open-requirement-popup-list.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-open-requirements-reports',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSortModule,
    MatCheckboxModule,
     MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatIconModule
  ],
  providers: [DatePipe, { provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
  templateUrl: './open-requirements-reports.component.html',
  styleUrls: ['./open-requirements-reports.component.scss'],
})
export class OpenRequirementsReportsComponent {
  sourcingreport!: FormGroup

  submitted = false;
  showReport = false;
  c_data: any[] = [];
  Activecnt = 0;
  groupby!: any;
  stdate !: any;
  eddate !: any;
  hiddenflg = "main";
  router: any;
  constructor(private formBuilder: FormBuilder,
    private service: ReportsService, private datePipe: DatePipe, private dialog: MatDialog) { }
  get f() { return this.sourcingreport.controls; }
  department!: any;
  options: Observable<string[]> | undefined;
  allOptions: string[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 1000;
  tableSizes: any = [3, 6, 9, 12];
  dataTableColumns: string[] = [
    'SerialNum',
    'skillset',
    'vendorcount'
  ];
  dataSource = new MatTableDataSource<any>([]);
  // paginator
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cdr = inject(PaginatorIntlService);
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private vendorServ = inject(VendorService);
  // private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);

  hasAcces!: any;
  loginId!: any;
  // department!: any;
  assignToPage: any;
  datarr: any[] = [];
  recrData: Recruiter[] = [];
  entity: any[] = [];
  totalItems: number = 0;
 
  itemsPerPage = 50;
  field = 'empty';
  isRejected: boolean = false;
  private destroyed$ = new Subject<void>();
  payload: any;


 
  ngOnInit() {
    this.department = localStorage.getItem('department');
    this.service.getCategories().subscribe((res: any) => {
      this.allOptions = res.data;
    })

    this.sourcingreport = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      groupby: ['', Validators.required],
    });

  }

selectAllValue = 'ALL_OPTIONS';

  isAllSelected(): boolean {
    const selected = this.sourcingreport.get('groupby')?.value || [];
    return selected.length === this.allOptions.length;
  }

  toggleAllSelection() {
    const control = this.sourcingreport.get('groupby');
    if (this.isAllSelected()) {
      control?.setValue([]);
    } else {
      control?.setValue([...this.allOptions]);
    }
  }

  onSelectionChange(event: any) {
    const selected = this.sourcingreport.get('groupby')?.value || [];
    if (selected.includes(this.selectAllValue)) {
      const filtered = selected.filter((val: string) => val !== this.selectAllValue);
      this.sourcingreport.get('groupby')?.setValue(filtered);
    }
  }



  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  onSubmit() {
    this.submitted = true;
    if (this.sourcingreport.invalid) {
      this.showReport = false;
      return;
    } else {
      this.showReport = true;
    }
    const joiningDateFormControl = this.sourcingreport.get('startDate');
    const relievingDateFormControl = this.sourcingreport.get('endDate');
      const formattedJoiningDate = this.datePipe.transform(joiningDateFormControl!.value, 'yyyy-MM-dd');
      const formattedRelievingDate = this.datePipe.transform(relievingDateFormControl?.value, 'yyyy-MM-dd');
      joiningDateFormControl!.setValue(formattedJoiningDate);
      relievingDateFormControl?.setValue(formattedRelievingDate);
  
    const category = this.sourcingreport.get('groupby')!.value


     this.payload = {
      "pageNumber": this.page,
      "pageSize": this.pageSize,
      "sortField": "skillset",
      "sortOrder": "asc",
      "endDate": formattedRelievingDate,
      "categorys": category,
      "startDate": formattedJoiningDate,
      "flag": "count",
      "keyword": "empty",
    }
    this.service.getOpenReqsReport(this.payload).subscribe((res: any) => {
        this.c_data = res.data.content;
        this.dataSource.data = res.data.content;
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
        this.totalItems = res.data.totalElements;
      });
  }

  applyFilter(event: any) {
    const keyword = event.target.value;
    this.field = keyword;
    // if (keyword != '') {
    //   return this.vendorServ
    //     .getAllHotListProvidersByPagination(
    //       1,
    //       this.pageSize,
    //       keyword,
    //       this.sortField,
    //       this.sortOrder
    //     )
    //     .subscribe((response: any) => {
    //       this.datarr = response.data.content;
    //       this.dataSource.data = response.data.content;
    //       // for serial-num {}
    //       this.dataSource.data.map((x: any, i) => {
    //         x.serialNum = this.generateSerialNumber(i);
    //       });
    //       this.totalItems = response.data.totalElements;
    //     });
    // }
    // if (keyword == '') {
    //   this.field = 'empty';
    // }
    return 0;
  }

  /**
   * Sort
   * @param event
   */
  sortField = 'skillset';
  sortOrder = 'asc';
  onSort(event: Sort) {
    if (event.active == 'SerialNum')
      this.sortField = 'skillset'
    else
      this.sortField = event.active;
    
      this.sortOrder = event.direction;
    
    if (event.direction != ''){
    ///this.sortOrder = event.direction;
    // this.getAllData();
    }
  }

  // handlePageEvent(event: PageEvent) {
  //   if (event) {
  //     this.pageEvent = event;
  //     const currentPageIndex = event.pageIndex;
  //     this.currentPageIndex = currentPageIndex;
      
  //   }
  //   return;
  // }

  pageChanged(event: PageEvent) {
    // Update payload with new pagination parameters
    this.payload.pageNumber = event.pageIndex + 1; // Page index starts from 0
    this.payload.pageSize = event.pageSize;

    // Make API call with updated payload
    this.service.getOpenReqsReport(this.payload).subscribe((res: any) => {
        // Process the data received from the API
        this.c_data = res.data.content;
        this.dataSource.data = res.data.content;
        this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
        });
    });
  }

  vendorCategoryPopup(data: any) {
    const actionData = {
      ...this.payload,
      ...data,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '90dvw';
    dialogConfig.height = '90vh';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'vendor-category-count';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      OpenRequirementPopupListComponent,
      dialogConfig
    );
  }


  reset() {
    this.sourcingreport.reset();
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  headings: any[] = [];
  excelData: any[] = [];
  excelImport() {
    this.headings = [[
      'Skill Set',
      'Vendor Count'
    ]];

    this.excelData = this.c_data.map(c => [
      c.category_skill,
      c.vendorcount,
    ]);
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, this.headings);
    utils.sheet_add_json(ws, this.excelData, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'data');
    writeFile(wb, 'Open-Requirements-Report@' + this.payload.startDate + ' TO ' + this.payload.endDate + '.xlsx');

  }

}

