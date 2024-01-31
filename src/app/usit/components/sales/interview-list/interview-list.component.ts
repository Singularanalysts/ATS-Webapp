import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { Recruiter } from 'src/app/usit/models/recruiter';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { Subject, takeUntil } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewService } from 'src/app/usit/services/interview.service';
import { AddInterviewComponent } from './add-interview/add-interview.component';
import { PrivilegesService } from 'src/app/services/privileges.service';

@Component({
  selector: 'app-interview-list',
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
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.scss']
})
export class InterviewListComponent implements OnInit, OnDestroy{

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'InterviewId',
    'ConsultantName',
    'DateAndToI',
    'Round',
    'Mode',
    'Vendor',
    'ImplementationPartner',
    'Client',
    'DateOfSubmission',
    'EmployeerName',
    'InterviewStatus',
    'Action',
  ];
  hasAcces!: any;
  // intentity = new SalesInterview();
  entity: any[] = [];
  submitted = false;
  // registerForm: any = FormGroup;
  showAlert = false;
  flag!: string;
  searchstring!: any;
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum !: any;
  totalItems: any;
  ser: number = 1;
  userid!: any;
  field = "empty";
  currentPageIndex = 0;
  pageEvent!: PageEvent;
  pageSize = 50;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageSizeOptions = [5, 10, 25];
  // services
  private activatedRoute = inject(ActivatedRoute);
  private interviewServ = inject(InterviewService);
  private dialogServ = inject(DialogService);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);
  private snackBarServ = inject(SnackBarService);
   // to clear subscriptions
   private destroyed$ = new Subject<void>();
  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.userid = localStorage.getItem('userid');
    this.getFlag();
    this.getAll();
  }

  getFlag(){
    const routeData = this.activatedRoute.snapshot.data;
    if (routeData['isSalesInterview']) {
      this.flag = "Sales";

    } else if (routeData['isRecInterview']) { // recruiting consutlant
      this.flag = "Recruiting";
    }
    else {
      this.flag = "Domrecruiting";
    }

  }


  getAll(pagIdx=1 ) {
    this.userid = localStorage.getItem('userid');
    this.interviewServ.getPaginationlist(this.flag, this.hasAcces, this.userid, pagIdx, this.itemsPerPage, this.field)
    .pipe(takeUntil(this.destroyed$)).subscribe(
      (response: any) => {
        this.entity = response.data.content;
        this.dataSource.data = response.data.content;
        this.totalItems = response.data.totalElements;
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      }
    )
  }

  addInterview() {
    const actionData = {
      title: 'Add Interview',
      interviewData: null,
      actionName: 'add-interview',
      flag: this.flag,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-interview';
    dialogConfig.data = actionData;


    const dialogRef = this.dialogServ.openDialogWithComponent(AddInterviewComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
         this.getAll(this.currentPageIndex + 1);
      }
    })
  }

  editInterview(interview: any) {
    const actionData = {
      title: 'Update Interview',
      interviewData: interview,
      actionName: 'edit-interview',
      flag: this.flag,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.panelClass = 'edit-interview';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddInterviewComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
         this.getAll(this.currentPageIndex + 1);
      }
    })
  }

  deleteInterview(interview: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: interview,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = 'fit-content';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'delete-interview';
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );

    // call delete api after  clicked 'Yes' on dialog click

    dialogRef.afterClosed().subscribe({
      next: (resp) => {
        if (dialogRef.componentInstance.allowAction) {
          const dataToBeSentToSnackBar: ISnackBarData = {
            message: '',
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-success'],
          };

          this.interviewServ.deleteEntity(interview.intrid).pipe(takeUntil(this.destroyed$))
          .subscribe({next:(response: any) => {
            if (response.status == 'Success') {
              this.getAll();
              dataToBeSentToSnackBar.message = 'Interview Deleted successfully';
            } else {
              dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
              dataToBeSentToSnackBar.message = 'Record Deletion failed';
            }
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          }, error: (err: any) => {
            dataToBeSentToSnackBar.message = err.message;
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          }});
        }
      },
    });
  }

  onFilter(event: any) {

  }
  applyFilter(event: any) {
    const keyword = event.target.value;
    if (keyword != '') {
      return this.interviewServ.getPaginationlist(this.flag, this.hasAcces, this.userid, 1, this.itemsPerPage, keyword).subscribe(
        ((response: any) => {
          this.entity = response.data.content;
          this.dataSource.data  = response.data.content;
           // for serial-num {}
           this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
          this.totalItems = response.data.totalElements;

        })
      );
    }
    return  this.getAll(this.currentPageIndex + 1)
  }

  onSort(event: any) {

  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  getRowStyles(row: any): any {
    const intStatus = row.interview_status;
    let backgroundColor = '';
    let color = '';

    switch (intStatus) {
      case 'OnBoarded':
        backgroundColor = 'rgba(40, 160, 76, 0.945)';
        color = 'white';
        break;
      case 'Selected':
        backgroundColor = 'rgba(243, 208, 9, 0.945)';
        color = '';
        break;
      case 'Hold':
        backgroundColor = 'rgba(243, 208, 9, 0.945)';
        color = '';
        break;
      case 'Rejected':
        backgroundColor = '';
        color = 'rgba(177, 19, 19, 0.945)';
        break;
      default:
        backgroundColor = '';
        color = '';
        break;
    }

    return { 'background-color': backgroundColor, 'color': color };
  }

  handlePageEvent(event: PageEvent) {
     if (event) {
       this.pageEvent = event;
       this.currentPageIndex = event.pageIndex;
       this.getAll(event.pageIndex + 1)
     }
     return;
   }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  ngOnDestroy(): void {
    this.destroyed$.next(undefined);
    this.destroyed$.complete()
  }

  goToUserInfo(id: number){
    this.router.navigate(['usit/user-info',id])
  }
}
