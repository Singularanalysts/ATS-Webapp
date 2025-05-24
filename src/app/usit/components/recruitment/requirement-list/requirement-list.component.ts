import { CommonModule } from '@angular/common';
import {
  Component, OnDestroy, OnInit,
  ViewChild,
  inject
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
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { DialogService } from 'src/app/services/dialog.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { Consultantinfo } from 'src/app/usit/models/consultantinfo';
import { RequirementService } from 'src/app/usit/services/requirement.service';
import { AddRequirementComponent } from './add-requirement/add-requirement.component';
import { RequirementInfoComponent } from './requirement-info/requirement-info.component';
import { RequirementSubmissionCountComponent } from './requirement-submission-count/requirement-submission-count.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-requirement-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class RequirementListComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'RequirementNumber',
    'Date',
    'JobTitle',
    'Location',
    'IPVendor',
    'EmployementType',
    'AssignedTo',
    'AddedBy',
    'Submitted',
    'Status',
    'Action',
  ];
  // paginator
  totalItems = 0;
  pageSize = 50;
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = true;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  hasAcces!: any;
  requirement: Consultantinfo[] = [];
  requirement2 = new Consultantinfo();
  message: any;
  showAlert = false;
  submitted = false;
  flag = "";
  searchstring!: any;
  ttitle!: string;
  ttitle1!: string;
  tclass!: string;
  dept!: any;
  requirement_track: any[] = [];
  field = 'empty';
  userid: any;
  page: number = 1;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private requirementServ = inject(RequirementService);
  private activatedRoute =  inject(ActivatedRoute);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);
  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.userid = localStorage.getItem('userid');
    this.dept = localStorage.getItem('department');
    this.getFlag();
    this.getAllData();
  }
  getFlag() {
    const routeData = this.activatedRoute.snapshot.data;
    if (routeData['isRecRequirement']) {
      this.flag = "Recruiting";
    } else {
      this.flag = "Domrecruiting";
    }
  
    console.log(this.flag, 'flagggggg');
  
    // Dynamically set columns based on flag
    this.setTableColumns();
  }
  
  setTableColumns() {
    this.dataTableColumns = [
      'SerialNum',
      'RequirementNumber',
      'Date',
      'JobTitle',
      'Location',
      'IPVendor',
      'EmployementType',
      'AddedBy',
      'Submitted',
      'Status',
      'Action',
    ];
  
    if (this.flag === "Recruiting") {
      this.dataTableColumns.splice(7, 0, 'AssignedTo'); // Add "AssignedTo" at the correct index
    }
  
    console.log(this.dataTableColumns, 'Updated Columns');
  }
  

  getAllData(currentPageIndex = 1) {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    const pagObj = {
      flg: this.flag,
      pageNumber: currentPageIndex,
      pageSize: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field,
      cid:localStorage.getItem('companyid')
    }

    return this.requirementServ
      .getAllRequirementData(pagObj)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.requirement = response.data.content;
          this.dataSource.data = response.data.content;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
          this.totalItems = response.data.totalElements;
        },
        error: (err: any) => {
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          dataToBeSentToSnackBar.message = err.message;
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  applyFilter(event: any) {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    const keyword = event.target.value;
    if (keyword != '') {
      const pagObj = {
        flg: this.flag,
        pageNumber: 1,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        keyword: keyword,
        cid:localStorage.getItem('companyid')
      }
      return this.requirementServ
      .getAllRequirementData(pagObj)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.requirement = response.data.content;
          this.dataSource.data = response.data.content;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
          this.totalItems = response.data.totalElements;
        },
        error: (err: any) => {
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          dataToBeSentToSnackBar.message = err.message;
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
    }
    return this.getAllData(this.currentPageIndex + 1);
  }

  addRequirement() {
    const actionData = {
      title: 'Add Requirement',
      requirementData: null,
      flag: this.flag,
      actionName: 'add-requirement',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-requirement';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(AddRequirementComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
        this.getAllData(this.currentPageIndex + 1);
      }
    })
  }

  editRequirement(requirement: any){
    const actionData = {
      title: 'Update Requirement',
      requirementData: requirement,
      flag: this.flag,
      actionName: 'edit-requirement',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.panelClass = 'edit-requirement';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddRequirementComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
        this.getAllData(this.currentPageIndex + 1);
      }
    })
  }

  deleteRequirement(requirement: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: requirement,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = 'fit-content';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'delete-requirement';
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );
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

          this.requirementServ.deleteEntity(requirement.requirementid).pipe(takeUntil(this.destroyed$))
          .subscribe({next:(response: any) => {
            if (response.status == 'success') {
              this.getAllData(this.currentPageIndex + 1);
              dataToBeSentToSnackBar.message = 'Requirement Deleted successfully';
            } else {
              dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
              dataToBeSentToSnackBar.message = 'Record Deletion failed';
            }
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          }, error: err => {
            dataToBeSentToSnackBar.message = err.message;
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          }});
        }
      },
    });
  }

  sortField = 'postedon';
  sortOrder = 'desc';
  onSort(event: Sort) {
    if (event.active == 'SerialNum')
      this.sortField = 'postedon'
    else
      this.sortField = event.active;
    
      this.sortOrder = event.direction;
    
    if (event.direction != ''){
    this.getAllData();
    }
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * this.pageSize + index + 1;
    return serialNumber;
  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAllData(event.pageIndex + 1);
    }
    return;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  goToReqInfo(element: any){
    const actionData = {
      title: `${element.reqnumber}`,
      id: element.requirementid,
      actionName: 'req-info',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'req-info';
    dialogConfig.data = actionData;

   this.dialogServ.openDialogWithComponent(
      RequirementInfoComponent,
      dialogConfig
    );
  }

  submissionCount(data: any) {
    const actionData = {
      subCountData: data,
      actionName: 'req-submission-count',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'req-submission-count';
    dialogConfig.data = actionData;

   this.dialogServ.openDialogWithComponent(
      RequirementSubmissionCountComponent,
      dialogConfig
    );
  }

  showLateIcon(element: any): boolean {
    if (element?.submission_count !== 0) {
      return false;
    }
    const postedDate = new Date(element?.postedon);
    const today = new Date();
    const diffInDays = Math.floor((today.getTime() - postedDate.getTime()) / (1000 * 3600 * 24));
    return diffInDays <= 60;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  Assignedrequirements(){
    this.router.navigate(['/usit/assigned-requirements']);
    

  }
}
