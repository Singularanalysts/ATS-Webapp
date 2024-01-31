import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { QuizService } from 'src/app/usit/services/quiz.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-quiz-result',
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
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class QuizResultComponent implements OnInit, OnDestroy {
  // data source
  displayedColumns: string[] = ['Id', 'Department', 'Category','NumOfQuestions', 'AttemptedQuestions',
  //'AttemptedDate',
  'Score', 'UserName'];
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
   private quizServ = inject(QuizService);
  ngOnInit(): void {
    this.getQuizResult()
  }

  getQuizResult(){
    this.quizServ.getQuizResults().pipe(takeUntil(this.destroyed$))
    .subscribe({
      next: (resp: any)=>{
        if(resp.status === 'success'){
          if(resp.data){
            this.dataSource.data = resp.data;
          }
        }
    }})
  //   this.dataSource.data = [{
  //     "fullname": "Super Admin",
  //     "department": "Administration",
  //     "category": "L1",
  //     "numofquetion": 5,
  //     "numofquetionatmpt": 5,
  //     "score": 3,
  //     "date": "2023-12-19 00:58"
  // }]
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

   // search
   onFilter(event: any){
    this.dataSource.filter = event.target.value;
  }

  onSort(event: any) {
    //this.dataSource.filter = event.target.value;
  }

   /**
   * clean up subscriptions
   */
  ngOnDestroy(): void {
      this.destroyed$.next(undefined);
      this.destroyed$.complete();
  }
}
