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
import { MatSort, Sort } from '@angular/material/sort';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { AddconsultantComponent, IV_AVAILABILITY, PRIORITY, RADIO_OPTIONS, STATUS } from '../consultant-list/add-consultant/add-consultant.component';
import { FormBuilder } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
//import { AddVisaComponent } from '../../masters/visa-list/add-visa/add-visa.component';


@Component({
  selector: 'app-hot-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule, 
    ReactiveFormsModule,MatSortModule
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

  //lavanya
  priority: [string, string] = ['', ''];
  h1bForm: any = FormGroup;
  ///private h1bServ = inject(H1bImmigrantService);
  private api = inject(ApiService);
  visadata: any = [];
  experiences: string[] = [];
  experienceForm: FormGroup | undefined;
  PRIORITY = [
    { code: 'P1', desc: 'P1 - Our h1 w2 consultant not on the job' },
    { code: 'P2', desc: 'P2 - our h1 consultant whose project is ending in 4 weeks' },
    { code: 'P3', desc: 'P3 - new visa transfer consultant looking for a job' },
    { code: 'P4', desc: 'P4 - our h1 consultant on a project looking for a high rate' },
    { code: 'P5', desc: 'P5 - OPT /CPT visa looking for a job' },
    { code: 'P6', desc: 'P6 - independent visa holder looking for a job' },
    { code: 'P7', desc: 'P7 - independent visa holder project is ending in 4 weeks' },
    { code: 'P8', desc: 'P8 - independent visa holder project looking for a high rate' },
    { code: 'P9', desc: 'P9 - 3rd party consultant' },
    { code: 'P10', desc: 'P10' },
  ]
  http: any;
  filteredConsultants: any;
  myForm: any;
  filterValues: any;
  filterRequest: any;
  constructor(private formBuilder: FormBuilder) {
    this.experienceForm = this.formBuilder.group({
      experience: ['']
    });

  }
  generateExperienceRanges() {
    for (let i = 0; i <= 30; i += 5) {
      const range = `${i}-${i + 5}`;
      this.experiences.push(range);
    }
  }
  selectOptionObj = {
    interviewAvailability: IV_AVAILABILITY,
    priority: PRIORITY,
    statusType: STATUS,
    radioOptions: RADIO_OPTIONS,

  };

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
    const shoWresult = this.privilegeServ.hasPrivilege('EXCEL_EXPORT')
    if (shoWresult) {
      this.showReport = true;
    } else {
      this.showReport = false;
    }
    this.getAllData();

     //lavanya
     this.getvisa();
     this.generateExperienceRanges();
     this.myForm = this.formBuilder.group({
       visa: [null], // Set default value if needed
       priority: [null], // Set default value if needed
       experience: [null] // Set default value if needed
     });
    
  }

 

  filterData(request:any) {
    // if (this.filterRequest()) {
      // If any filter field is provided, filter the data
      this.consultantServ.getFilteredConsultants(request)
        .subscribe(
          (response: any) => {
            // Assign the response to the dataSource for displaying filtered data

            this.dataSource.data = response.data;
            // Reassign serial numbers after filtering
            this.dataSource.data.map((item: any, index: number) => {
              item.serialNum = index + 1;
              return item;
            });
          },
          (error: any) => {
            // Handle errors here
            console.error('An error occurred:', error);
          }
        );
    // } else {
    //   // If all filter fields are empty, fetch all data
    //   this.getAllData();
    // }
  }

  getAllData() {
    const userid=localStorage.getItem('userid');
    this.consultantServ.getSalesAllHotListWithUserid(userid).subscribe(
      (response: any) => {
        this.dataSource.data = response.data;
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = i + 1;
        });
        this.totalItems = response.data.totalElements;
      }
    )
  }

   //lavanya
   getvisa() {
    this.consultantServ.getvisa().subscribe((response: any) => {
      this.visadata = response.data;
    });
  }
  //

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onFilter(event: any){
    this.dataSource.filter = event.target.value;
  }

  onSort(event: Sort) {
    const sortDirection = event.direction;
    const activeSortHeader = event.active;

    if (sortDirection === '') {
      this.dataSource.data = this.dataSource.data;
      this.dataSource.sort = this.sort;
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
              (isAsc ? 1 : -1) *
              (a.technologyarea || '').localeCompare(b.technologyarea || '')
            );
        
          case 'Visa':
          return (
            (isAsc ? 1 : -1) * (a.visa_status || '').localeCompare(b.visa_status || '')
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
            (isAsc ? 1 : -1) *
            (a.currentlocation || '').localeCompare(b.currentlocation || '')
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
  //lavanya
  request=new FilterRequest();
  onExperienceChange(event: any): void {
    const visa = this.myForm.get('visa').value;
  const priority = this.myForm.get('priority').value;
  const experience = this.myForm.get('experience').value;
    this.request.visaStatus=visa;
    this.request.priority=priority;
    this.request.experience=experience;
    
    this.filterData(this.request);
  }
  refreshForm(): void {
    this.myForm.reset(); // Reset all form controls
    // Call getAllData() to fetch all data again
    this.getAllData();
  }
  NumericValue(value: string): string {
    if (!value) return ''; // Return empty string if value is falsy
    // Use regular expression to replace non-numeric characters with an empty string
    return value.replace(/[^0-9]/g, '');
  }
  


  
}

export class FilterRequest {
  visaStatus: any;
  priority: any;
  experience: any;
  
}


