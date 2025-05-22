import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { JobApplicationCommentsComponent } from 'src/app/usit/components/openreqs/job-application-comments/job-application-comments.component';
import { DialogService } from 'src/app/services/dialog.service';
import { RecruInfoComponent } from 'src/app/usit/components/openreqs/recru-info/recru-info.component';
import { JobDescriptionComponent } from 'src/app/usit/components/openreqs/job-description/job-description.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-alert-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
  ],
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.scss']
})
export class AlertPopupComponent {
  // disableClose = true;
  // remainingTime = 30;
  // intervalId: any;

  // constructor(
  //   public dialogRef: MatDialogRef<AlertPopupComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: string
  // ) {}

  // ngOnInit(): void {
  //   this.intervalId = setInterval(() => {
  //     this.remainingTime--;
  //     if (this.remainingTime <= 0) {
  //       this.disableClose = false;
  //       clearInterval(this.intervalId);

  //     }
  //   }, 1000);
  // }

  // ngOnDestroy(): void {
  //   if (this.intervalId) {
  //     clearInterval(this.intervalId);
  //   }
  // }

  // onClose(): void {
  //   this.dialogRef.close();
  //   // alert("closed");
  // }
  userid!: any;
  status = 'all';
  tabs = ['USA'];
  currentOptions: { value: string, label: string }[] = [];
  private dialog = inject(MatDialog);
  private dialogServ = inject(DialogService);
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
      { value: 'All Local Jobs', label: 'All Local Jobs' }
    ]
  };
  currentPageIndex = 0;
  disableClose = true;
  remainingTime = 30;
  pageIndices: { [key: string]: number } = { all: 0, usa: 0, uae: 0 };
  intervalId: any;
  field = "empty";
  source = 'all';
  totalItems: any;
  dataSource = new MatTableDataSource<any>();
  private service = inject(OpenreqService);
  itemsPerPage = 50;

  dataTableColumns: string[] = [
    'SerialNum',
    'posted_on',
    'job_title',
    'employment_type',
    'job_location',
    'vendor',
    'JobDescription',
    'Comments',
    'source',
    'ResumeUpload',
    'Percentage'
  ];

  constructor(
    public dialogRef: MatDialogRef<AlertPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.disableClose = false;
        clearInterval(this.intervalId);
      }
    }, 1000);

    // Assuming data is an array of portal req records
    if (Array.isArray(this.data)) {
      this.dataSource.data = this.data;
    }
    this.getAllData();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  // isValidDate(dateString: string): boolean {
  //   return !isNaN(Date.parse(dateString));
  // }

  // triggerFileUpload(input: HTMLInputElement) {
  //   input.click();
  // }

  // onFileSelectedata(event: any, element: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     console.log('Uploading', file.name, 'for', element);
  //   }
  // }

  // jobComments(element: any) {
  //   console.log('Comments for:', element);
  // }
  empTag(id: number) {
    this.service.openReqsEmpTagging(id, this.userid).subscribe(
      (response: any) => {

      })
  }
  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  getAllData(pagIdx = 1, status: string = 'all') {
    this.service.getNewRequirementsAlertData().subscribe(
      (response: any) => {
        this.dataSource.data = response.data;
        this.totalItems = response.data.totalElements;
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      }
    )
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
  onTabChanged(event: MatTabChangeEvent) {
    this.status = event.tab.textLabel.toLowerCase();
    const selectedTab = this.tabs[event.index] as 'All' | 'USA' | 'UAE';
    this.currentOptions = this.tabOptions[selectedTab];
    this.currentPageIndex = this.pageIndices[this.status];
    this.getAllData(this.currentPageIndex + 1, this.status);
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

  isValidDate(dateString: any): boolean {
    if (!dateString) {
      return false;
    }
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
  onFileSelectedata(event: any, element: any): void {
    const file = event.target.files[0];
    const userId = String(localStorage.getItem('userid'));
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('requirementId', element.id); // now correct ID
    formData.append('userId', userId);

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
  jobComments(job: any) {
    const data = this.dialog.open(JobApplicationCommentsComponent, {
      width: '60vw',
      data: {
        title: job.job_title,
        jobData: job
      },
    });
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

  triggerFileUpload(fileInput: HTMLInputElement): void {
    fileInput.click(); // now specific to the clicked row
  }
}
