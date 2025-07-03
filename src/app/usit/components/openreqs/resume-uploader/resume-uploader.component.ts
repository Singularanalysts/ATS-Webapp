import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from 'src/app/services/dialog.service';
import { ResumeDescriptionComponent } from '../resume-description/resume-description.component';
import { ResumeApplicationComponent } from '../resume-application/resume-application.component';
import { HttpParams } from '@angular/common/http';
import { ResumeVendorComponent } from '../resume-vendor/resume-vendor.component';


@Component({
  selector: 'app-resume-uploader',
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
  templateUrl: './resume-uploader.component.html',
  styleUrls: ['./resume-uploader.component.scss']
})
export class ResumeUploaderComponent {
    private service = inject(OpenreqService);
    dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'posted_on',
    'job_title',
    'category_skill',
    'employment_type',
    'job_location',
    'vendor',
    'JobDescription',
    'Comments',
    // 'Matching',
    'source',
  ];
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  selectedFile: File | null = null;
  percentage: number | null = null; // Store percentage value
  private dialogServ = inject(DialogService);
  private dialog = inject(MatDialog);
  currentPageIndex = 0;
  pageEvent!: PageEvent;
  pageSize = 10;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageSizeOptions = [50, 75, 100];
  totalElements: any;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  clearFile() {
  console.log('clearrrrrr');
  
  this.selectedFile = null;
  this.percentage = null;
  this.fileInput.nativeElement.value = ''; // Reset file input element

  // Reset table data
  this.allData = [];
  this.dataSource.data = [];  // Clear mat-table data
  this.totalElements = 0;
  this.currentPageIndex = 0;
}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  allData: any[] = []; // Store all records
  isSubmitted = false; // Track form submission

  submitForm() {
      this.isSubmitted = true; // Mark form as submitted

    if (!this.selectedFile || this.percentage === null) {
      return;
    }
  
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('resume', this.selectedFile);
    const userId = String(localStorage.getItem('userid'));
  
    const params = new HttpParams().set('percentage', this.percentage.toString()).set('userId',userId);
  
    this.service.resumeupload(formData, params).subscribe(
      (response: any) => {
        console.log('API Response:', response);
  
        if (response && response.data) {
          // Store all records
          this.allData = response.data.map((item: any, index: number) => ({
            serialNum: index + 1,
            id: item.id,
            postedon: item.postedon,
            job_title: item.job_title,
            category_skill: item.category_skill,
            employment_type: item.employment_type,
            job_location: item.job_location,
            vendor: item.vendor,
            source: item.source,
            job_source:item.job_source
          }));
  
          this.totalElements = this.allData.length; // Total records
          this.currentPageIndex = 0; // Reset to first page
          this.updatePageData(); // Show first 10 records
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
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
        ResumeVendorComponent,
        dialogConfig
      );
    }
  
  empTag(id: number) {
    this.service.openReqsEmpTagging(id, this.userid).subscribe(
      (response: any) => {

      })
  }  
  updatePageData() {
    const startIndex = this.currentPageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
  
    this.dataSource.data = this.allData.slice(startIndex, endIndex);
  }
  userid!: any;

  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
  }
  
  handlePageEvent(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  
    this.updatePageData(); // Update displayed data
  }
  
  
  isValidDate(dateString: any): boolean {
    if (!dateString) {
      return false;
    }
    const date = new Date(dateString);
    return !isNaN(date.getTime());
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
      ResumeDescriptionComponent,
      dialogConfig
    );
  }
 jobComments(job: any) {
    const data =this.dialog.open(ResumeApplicationComponent, {
      width: '60vw',
      data: {
        title: job.job_title,
        jobData: job
      },
    });

    data.afterClosed().subscribe(() => {
      if(data.componentInstance.submitted){
        //  this.getAllreqsData();
      }
    })
  }
}
