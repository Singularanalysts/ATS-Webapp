import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { OpenreqService } from '../../services/openreq.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { RecruInfoComponent } from './recru-info/recru-info.component';
import { DialogService } from 'src/app/services/dialog.service';
import { JobDescriptionComponent } from './job-description/job-description.component';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatchProfileJobDescriptionComponent } from './match-profile-job-description/match-profile-job-description.component';
import { JobApplicationCommentsComponent } from './job-application-comments/job-application-comments.component';

@Component({
  selector: 'app-openreqs',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatTabsModule,
    MatInputModule,
    FormsModule,
    MatAutocompleteModule
  ],
  templateUrl: './openreqs.component.html',
  styleUrls: ['./openreqs.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }]
})
export class OpenreqsComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'posted_on',
    'job_title',
    // 'category_skill',
    'employment_type',
    'job_location',
    'vendor',
    'JobDescription',
    'Comments',
    // 'Matching',
    'source',
    'ResumeUpload',
    'Percentage'
  ];
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
  isCompanyExist: any;
  source = 'all';
  // tabs = ['All', 'USA', 'UAE'];
  tabs = ['USA'];
  status = 'all';
  pageIndices: { [key: string]: number } = { all: 0, usa: 0, uae: 0 };

  private service = inject(OpenreqService);
  userid!: any;
  vendordialog: any;
  private dialog = inject(MatDialog);
  
  private dialogServ = inject(DialogService);
  currentOptions: { value: string, label: string }[] = [];
  tabOptions = {
    'All': [
      { value: 'all', label: 'All' },
      { value: 'dice', label: 'Dice' },
      { value: 'glassdoor', label: 'Glassdoor' },
      { value: 'indeed', label: 'Indeed' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'recruit.net', label: 'Recruit' },
      { value: 'techfetch', label: 'Tech Fetch' },
      { value: 'jobsora', label: 'Jobsora' },
      { value: 'jobdiva', label: 'Jobdiva' },
      { value: 'Simplyhired', label: 'Simply Hired' },
      { value: 'Post Job Free', label: 'Post Job Free' },
      { value: 'Joblift', label: 'Joblift' }
    ],
    'USA': [
      { value: 'all', label: 'All' },
      { value: 'dice', label: 'Dice' },
      { value: 'glassdoor', label: 'Glassdoor' },
      { value: 'indeed', label: 'Indeed' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'recruit.net', label: 'Recruit' },
      { value: 'techfetch', label: 'Tech Fetch' },
      { value: 'jobdiva', label: 'Jobdiva' },
      { value: 'Simplyhired', label: 'Simply Hired' },
      { value: 'Post Job Free', label: 'Post Job Free' },
      { value: 'Joblift', label: 'Joblift' }
    ],
    'UAE': [
      { value: 'all', label: 'All' },
      { value: 'glassdoor', label: 'Glassdoor' },
      { value: 'indeed', label: 'Indeed' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'jobsora', label: 'Jobsora' },
      { value:'All Local Jobs', label: 'All Local Jobs' }
    ]
  };
  consultantData: any[] = [];
  searchText: string = '';
  selectedElement: any;

  constructor() {
    this.currentOptions = this.tabOptions['All'];
  }

  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.getAllreqsData();
  }

  empTag(id: number) {
    this.service.openReqsEmpTagging(id, this.userid).subscribe(
      (response: any) => {

      })
  }

  onSelectionChange(event: MatSelectChange) {
    this.source = event.value;
    this.getAllreqsData()
  }
  
  openVendorPopup(vendor: string): void {
    this.vendordialog.open({
      data: { vendor: vendor }
    });
  }

  goToReqInfo(element: any) {
    const actionData = {
      title: `${element.vendor}`,
      id: element.vendor,
      isExist: element.isexist,
      actionName: 'req-info',
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'req-info';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      RecruInfoComponent,
      dialogConfig
    );
  }

  getAllreqsData() {
    if (this.source && this.source !== 'empty') {
      this.getAllData(1);
    } else {
      this.getAllData(1);
    }
  }

  getAllData(pagIdx = 1, status: string = 'all') {
    this.service.getopenReqWithPaginationAndSource(pagIdx, this.itemsPerPage, this.field, this.source, this.status).subscribe(
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

  applyFilter(event: any) {
    const keyword = event.target.value;
    this.field = keyword;
    if (keyword != '') {
      return this.service.getopenReqWithPaginationAndSource(1, this.itemsPerPage, keyword, this.source,  this.status).subscribe(
        ((response: any) => {
          this.dataSource.data = response.data.content;
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
    return this.getAllData(this.currentPageIndex + 1, this.status);
  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAllData(event.pageIndex + 1, this.status)
    }
    return;
  }

  getRowStyles(row: any): any {
    const companyStatus = row.isexist;
    let backgroundColor = '';

    switch (companyStatus) {
      case '1':
        backgroundColor = 'rgba(185	,245	,210)';
        break;
      default:
        backgroundColor = '';
        break;
    }

    return { 'background-color': backgroundColor };
  }

  goToJobDescription(element: any) {
    const actionData = {
      title: `${element.job_title}`,
      id: element.id,
      actionName: 'job-description',
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'job-description';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      JobDescriptionComponent,
      dialogConfig
    );
  }

  matching(job: any) {
    this.dialog.open(MatchProfileJobDescriptionComponent, {
      width: '60vw',
      data: {
        title: job.job_title,
        jobData: job
      },
    });
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.status = event.tab.textLabel.toLowerCase();
    const selectedTab = this.tabs[event.index] as 'All' | 'USA' | 'UAE';
    this.currentOptions = this.tabOptions[selectedTab];
    this.currentPageIndex = this.pageIndices[this.status];
    this.getAllData(this.currentPageIndex + 1, this.status);
  }

  isValidDate(dateString: any): boolean {
    if (!dateString) {
      return false;
    }
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  jobComments(job: any) {
    const data =this.dialog.open(JobApplicationCommentsComponent, {
      width: '60vw',
      data: {
        title: job.job_title,
        jobData: job
      },
    });

    data.afterClosed().subscribe(() => {
      if(data.componentInstance.submitted){
         this.getAllreqsData();
      }
    })
  }
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  selectedFile: File | null = null;
  percentage: number | null = null; // Store percentage value

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  clearFile() {
    console.log('clearrrrrr')
    this.selectedFile = null;
    this.percentage = null; // Reset percentage
    this.fileInput.nativeElement.value = ''; // Reset file input
  }
  
  @ViewChild('fileInputdata') fileInputdata!: ElementRef;

//   triggerFileUpload(element: any): void {
//   // Store the selected element (requirement)
//   this.selectedElement = element;
//   this.fileInputdata.nativeElement.click(); // trigger hidden input
// }

// onFileSelectedata(event: any, element: any): void {
//   const file = event.target.files[0];
//   if (!file) return;

//   const formData = new FormData();
//   formData.append('resume', file); // field name 'resume' should match backend
//   formData.append('requirementId', element.id); // assuming 'id' is requirement ID

//   this.service.ResumeUpload(formData).subscribe({
//     next: (res: any) => {
//       // Assuming response contains 'percentage'
//       element.percentage = res?.data || '100';
//     },
//     error: (err) => {
//       console.error('Upload failed', err);
//     }
//   });

//   // Reset file input
//   event.target.value = null;
// }

  

triggerFileUpload(fileInput: HTMLInputElement): void {
  fileInput.click(); // now specific to the clicked row
}

onFileSelectedata(event: any, element: any): void {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('resume', file);
  formData.append('requirementId', element.id); // now correct ID

  this.service.ResumeUpload(formData).subscribe({
    next: (res: any) => {
      element.percentage = res?.data || '100';
    },
    error: (err) => {
      console.error('Upload failed', err);
    }
  });

  event.target.value = null;
}

}