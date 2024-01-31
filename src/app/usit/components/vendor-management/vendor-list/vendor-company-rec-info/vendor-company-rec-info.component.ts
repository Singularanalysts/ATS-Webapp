import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { QuizService } from 'src/app/usit/services/quiz.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecruiterService } from 'src/app/usit/services/recruiter.service';

@Component({
  selector: 'app-vendor-company-rec-info',
  standalone: true,
  imports: [MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatTooltipModule],
  templateUrl: './vendor-company-rec-info.component.html',
  styleUrls: ['./vendor-company-rec-info.component.scss']
})
export class VendorCompanyRecInfoComponent implements OnInit{
 // data source
 displayedColumns: string[] = ['RecruiterName', 'PhoneNumber', 'Email','Address', 'AddedOn',
  ];
 dataSource = new MatTableDataSource<any>([]);
  // paginator
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  totalItems = 0;
  pageEvent!: PageEvent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  // services
  private recServ = inject(RecruiterService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<VendorCompanyRecInfoComponent>);

  ngOnInit(): void {
    this.getCompanyInfo()
  }

  getCompanyInfo(){
    this.recServ.getEntitybyCompany(this.data.id).pipe(takeUntil(this.destroyed$))
    .subscribe({
      next: (resp: any)=>{
        if(resp.status === 'success'){
          if(resp.data){
            this.dataSource.data = resp.data;
          }
        }
    }})
  }

   /**
   * pagination control
   * @param event
   */
   handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      const currentPageIndex = event.pageIndex;
      this.currentPageIndex = currentPageIndex;
    }
    return;
  }


   /**
   * clean up subscriptions
   */
  ngOnDestroy(): void {
      this.destroyed$.next(undefined);
      this.destroyed$.complete();
  }
}
