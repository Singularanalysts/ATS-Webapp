import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { debounceTime } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { utils, writeFile } from 'xlsx';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InfoSearchComponent } from './info-search/info-search.component';
import { GlobalSearchService } from '../../services/global-search.service';
import { OpenReqsAnalysisComponent } from '../dashboard/open-reqs-analysis/open-reqs-analysis.component';
import { DialogService } from 'src/app/services/dialog.service';
import { DashboardService } from '../../services/dashboard.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    InfoSearchComponent,
    MaterialModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSlideToggleModule,
    MatPaginatorModule,
  
  ],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class GlobalSearchComponent {
  
  isDialogOpen = false;
  inputValue = '';
  title = 'SearchUI';
  companyName: string = '';
  selected: boolean = false;
  location: string = '';
  jobposition: string = '';
  filteredVendorList: any[] = [];
  suggestionList: string[] = []; // Array to hold filtered suggestions for companies
  locationCompanies: any[] = []; // Array to hold location-specific companies
  locationSuggestions: any[] = []; // Update the type to any, assuming it contains objects with location and jobposition
  locationlist: boolean = false;
  jobPositionSuggestions: any[] = []; // Array to hold filtered suggestions for job positions
  selectpostioncompany: boolean = false;
  vendorPostioncompany: any[] = [];
  tableactive: boolean = false;
  searchControl: FormControl = new FormControl();
  // Add a property to track the visibility of suggestion lists
  showJobPositionSuggestions: boolean = false;
  showLocationSuggestions: boolean = false;
  currentInputField: string = '';
  showInputFormatWarning: boolean = false;
  pageNo: number = 1;
  pagesize!: number;
  currentPage: any;
  totalRecords: any;
  //lavanya
  totalItems=500;
  pageSize = 50; // items per page
  currentPageIndex = 0;
  //pageSizeOptions = [5, 10, 25, 50];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  page: number = 1;
  
 // totalPages=50;
  
  //
  
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  highlightSpaces(value: string) {
    this.inputValue = value;
  }
  ngOnInit() {

    this.getReqVendorCount();
    this.getReqCatergoryCount();

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.search();
    });
  }

  constructor(
    private globalSearchService: GlobalSearchService,
    public dialog: MatDialog
  ) {}

  filteredarray: any[] = [];
  search(): void {
    // this.showJobPositionSuggestions = this.jobposition.trim() !== '';
    this.showLocationSuggestions = this.location.trim() !== '';

    // this.showJobPositionSuggestions = this.jobposition.trim() !== '';
    this.showLocationSuggestions = this.location.trim() !== '';

    // const trimmedCompany = this.companyName.trim();
    // const trimmedJobPosition = this.jobposition.trim();
    const trimmedLocation = this.location.trim();

    // Call the service method to fetch vendor suggestions by location
    if (trimmedLocation !== '') {
      this.globalSearchService
        .getJobpostionAndCompany('empty', 'empty', this.location, 1, 50)
        .subscribe(
          (resp: any) => {
            this.locationSuggestions = resp.data.content;
          //  console.log('location suggestion' + this.locationSuggestions);

            // Remove duplicates from the locationSuggestions array
            const uniqueLocations = Array.from(
              new Set(this.locationSuggestions.map((item) => item.job_location))
            );
            this.locationSuggestions = uniqueLocations.map((location) => ({
              job_location: location,
            }));
          },
          (error: any) => {
            console.error('Error fetching location suggestions:', error);
            this.locationSuggestions = [];
          }
        );
    }
  }
  onPageChange(event: any) {
    this.currentPage = event.currentPage;
    this.globalSearchService.getJobpostionAndCompany(
      this.jobPositionAndCompany,
      this.jobPositionAndCompany,
      this.location,
      this.currentPage,
      this.pagesize
    );
  }
  
  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      
    }
    return;
  }
  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * this.pageSize + index + 1;
    return serialNumber;
  }
  

  closeSuggestions(): void {
    this.showJobPositionSuggestions = false;
    this.showLocationSuggestions = false;
  }
  jobPositionAndCompany: string = '';
  jobpositioncross: any[] = [];
  searchBotton() {
    if (
      this.jobPositionAndCompany !== '' &&
      !this.jobPositionAndCompany.includes(' And ')
    ) {
      if (this.location == '') {
        this.globalSearchService
          .getJobpostionAndCompany(
            this.jobPositionAndCompany,
            'empty',
            'empty',
            1,
            50
          )
          .subscribe(
            (resp: any) => {
              this.filteredVendorList = resp.data.content;
              if (this.filteredVendorList.length == 0) {
                if (this.location == '') {
                  this.globalSearchService
                    .getJobpostionAndCompany(
                      'empty',
                      this.jobPositionAndCompany,
                      'empty',
                      1,
                      50
                    )
                    .subscribe(
                      (resp: any) => {
                        this.filteredVendorList = resp.data.content;
                      //  console.log('companies', this.filteredVendorList);
                        this.suggestionList = Array.from(
                          new Set(
                            this.filteredVendorList.map((item) => item.company)
                          )
                        );
                      },
                      (error: any) => {
                        console.error('Error fetching vendors:', error);
                        this.filteredVendorList = []; // Reset the filtered list in case of an error
                      }
                    );
                }
              }
              this.jobpositioncross = resp.data.content;
             // console.log('getJobpostionAndCompany', this.filteredVendorList);
              this.suggestionList = Array.from(
                new Set(this.filteredVendorList.map((item) => item.company))
              );
             // console.log('filtered data');
            },
            (error: any) => {
              console.error('Error fetching vendors:', error);
              this.filteredVendorList = []; // Reset the filtered list in case of an error
            }
          );
      }
      if (this.location !== '') {
        this.globalSearchService
          .getJobpostionAndCompany(
            this.jobPositionAndCompany,
            'empty',
            this.location,
            1,
            50
          )
          .subscribe(
            (resp: any) => {
              this.filteredVendorList = resp.data.content;
              if (this.filteredVendorList.length == 0) {
                if (this.location !== '') {
                  this.globalSearchService
                    .getJobpostionAndCompany(
                      'empty',
                      this.jobPositionAndCompany,
                      this.location,
                      1,
                      50
                    )
                    .subscribe(
                      (resp: any) => {
                        this.filteredVendorList = resp.data.content;
                       // console.log('location ' + this.filteredVendorList);
                      },
                      (error: any) => {
                        console.error(
                          'Error fetching location suggestions:',
                          error
                        );
                        this.filteredVendorList = [];
                      }
                    );
                }
              }
             // console.log('location ' + this.filteredVendorList);
            },
            (error: any) => {
              console.error('Error fetching location suggestions:', error);
              this.filteredVendorList = [];
            }
          );
      }
    }

    if (this.validateInputFormat()) {
      const [jobPosition, company] = this.jobPositionAndCompany.split(' And ');

      // Check if both job position and company are provided
      if (
        jobPosition.trim() !== '' &&
        company.trim() !== '' &&
        this.location == ''
      ) {
        // Call the API for both job position and company
        this.globalSearchService
          .getJobpostionAndCompany(jobPosition, company, 'empty', 1, 50)
          .subscribe(
            (resp: any) => {
              this.filteredVendorList = resp.data.content;
             // console.log('getJobpostionAndCompany', this.filteredVendorList);
              this.suggestionList = Array.from(
                new Set(this.filteredVendorList.map((item) => item.company))
              );
              //console.log('filtered new data', this.filteredVendorList);
            },
            (error: any) => {
              console.error('Error fetching vendors:', error);
              this.filteredVendorList = []; // Reset the filtered list in case of an error
            }
          );
      }

      // Check if both job position and company are provided
      else if (
        jobPosition.trim() !== '' &&
        company.trim() !== '' &&
        this.location !== ''
      ) {
        // Call the API for both job position and company
        this.globalSearchService
          .getJobpostionAndCompany(jobPosition, company, this.location, 1, 50)
          .subscribe(
            (resp: any) => {
              this.filteredVendorList = resp.data.content;
             // console.log('getJobpostionAndCompany', this.filteredVendorList);
              this.suggestionList = Array.from(
                new Set(this.filteredVendorList.map((item) => item.company))
              );
              //console.log('filtered data 3 data');
            },
            (error: any) => {
              console.error('Error fetching vendors:', error);
              this.filteredVendorList = []; // Reset the filtered list in case of an error
            }
          );
      } else if (
        jobPosition.trim() !== '' &&
        company.trim() === '' &&
        this.location !== ''
      ) {
        this.globalSearchService
          .getJobpostionAndCompany(jobPosition, 'empty', this.location, 1, 50)
          .subscribe(
            (resp: any) => {
              this.filteredVendorList = resp.data.content;
              // console.log(
              //   'filtered company not there',
              //   this.filteredVendorList
              // );
            },
            (error: any) => {
              console.error('Error fetching vendors:', error);
              this.filteredVendorList = []; // Reset the filtered list in case of an error
            }
          );
      } else if (
        jobPosition.trim() === '' &&
        company.trim() !== '' &&
        this.location !== ''
      ) {
        this.globalSearchService
          .getJobpostionAndCompany('empty', company, this.location, 1, 50)
          .subscribe(
            (resp: any) => {
              this.filteredVendorList = resp.data.content;
             // console.log('getJobpostionAndCompany', this.filteredVendorList);
              this.suggestionList = Array.from(
                new Set(this.filteredVendorList.map((item) => item.company))
              );
             // console.log('filtered data');
            },
            (error: any) => {
              console.error('Error fetching vendors:', error);
              this.filteredVendorList = []; // Reset the filtered list in case of an error
            }
          );
      }
    } else {
      this.showInputFormatWarning = true;
    }
    if (this.jobPositionAndCompany == '' && this.location !== '') {
      this.globalSearchService
        .getJobpostionAndCompany('empty', 'empty', this.location, 1, 50)
        .subscribe(
          (resp: any) => {
            this.filteredVendorList = resp.data.content;
           // console.log('location ' + this.filteredVendorList);
          },
          (error: any) => {
           // console.error('Error fetching location suggestions:', error);
            this.filteredVendorList = [];
          }
        );
    }
    this.closeSuggestions(); // Close suggestions after search button click
    this.tableactive = true; // Set the tableactive flag to true, indicating that the table should be active
  }

  newinfo() {
    const dialogRef = this.dialog.open(InfoSearchComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log('The dialog was closed');
    });
  }

  openEmail(email: string): void {
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink;
  }
  validateInputFormat(): boolean {
    const regex = /^(.*And\s.*)$/i; // Regular expression for the specified format
    return regex.test(this.jobPositionAndCompany);
  }

  navigateToJobSource(jobSourceUrl: string) {
    // Use Angular router to navigate to the job source URL
    window.open(jobSourceUrl, '_blank'); // Opens the URL in a new tab/window
    // Alternatively, you can use router.navigate(['/externalRedirect', { externalUrl: jobSourceUrl }], { skipLocationChange: true });
  }

  reset(){
    this.tableactive = false;
  }
  excelName!: string;

  headings!: string[][];
  excelData: any;
  consultant: any[] = [];
  popUpImport() {
    this.headings = [['Company', 'Job_title', 'Location']];
    this.excelData = this.filteredVendorList.map((c: any) => [
      c.vendor,
      c.job_title,
      c.job_location,
      c.contactnumber,
      c.visa_status,
    ]);

    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, this.headings);
    utils.sheet_add_json(ws, this.excelData, {
      origin: 'A2',
      skipHeader: true,
    });
    utils.book_append_sheet(wb, ws, 'data');
    this.excelName = 'Report @' + 'Search Results' + '.xlsx';
    writeFile(wb, this.excelName);
  }

  dataSource = new MatTableDataSource([]);
  dataSourceTech = new MatTableDataSource([]);
  dataSourceVendor = new MatTableDataSource([]);

  dataTableColumnsTechAnalysis: string[] = [
    'SNo',
    'Date',
    'Category',
    'VendorCount',
  ];
  dataTableColumnsVendorAnalysis: string[] = [
    'SNo',
    'Date',
    'Vendor',
    'CategoryCount',
  ];
  private dialogServ = inject(DialogService);
  vendorCategoryPopup(vendorOrCategory: any, date: any, type: any) {
    const actionData = {
      title: vendorOrCategory,
      vendorOrCategory: vendorOrCategory,
      date: date,
      type: type,
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'vendor-category-count',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '90dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'vendor-category-count';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      OpenReqsAnalysisComponent,
      dialogConfig
    );
  }

  onVendorFilter(event: any){
    this.dataSourceVendor.filter = event.target.value;
  }

  onCategoryFilter(event: any){
    this.dataSourceTech.filter = event.target.value;
  }
  private dashboardServ = inject(DashboardService);
  search1 = 'empty'
  getReqVendorCount() {
    this.dashboardServ.getReqCounts(this.search1, 'count', 'vendor', 'empty').subscribe(
      (response: any) => {
        this.dataSourceTech.data = response.data;
        this.dataSourceTech.data.map((x: any, i) => {
          x.serialNum = i + 1;
        });
      }
    )
  }
  
  getReqCatergoryCount() {
    this.dashboardServ.getReqCounts(this.search1, 'count', 'category', 'empty').subscribe(
      (response: any) => {
        this.dataSourceVendor.data = response.data;
        this.dataSourceVendor.data.map((x: any, i) => {
          x.serialNum = i + 1;
        });
      }
    )
  }
 
}
