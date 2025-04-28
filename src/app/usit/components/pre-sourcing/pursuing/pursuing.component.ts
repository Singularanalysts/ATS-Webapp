import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginatorIntl, PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { DialogService } from 'src/app/services/dialog.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { Consultantinfo } from 'src/app/usit/models/consultantinfo';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { IV_AVAILABILITY, PRIORITY, STATUS, RADIO_OPTIONS } from '../../profile/edit-profile/edit-profile.component';
import { ReportVo } from '../../sales/consultant-list/consultant-list.component';
import { ConsultantTrackComponent } from '../../sales/consultant-list/consultant-track/consultant-track.component';
import { AddSourcingConsultantComponent } from '../sourcing/add-sourcing-consultant/add-sourcing-consultant.component';

@Component({
  selector: 'app-pursuing',
  standalone: true,
  imports: [
    MatSelectModule,
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
    ReactiveFormsModule,
  ],
  templateUrl: './pursuing.component.html',
  styleUrls: ['./pursuing.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class PursuingComponent
  implements OnInit, OnDestroy {
  role!: any;
  consultant: Consultantinfo[] = [];
  consultant2 = new Consultantinfo();
  message: any;
  showAlert = false;
  submitted = false;
  flag = 'pursuing';
  searchstring!: any;
  ttitle!: string;
  ttitle1!: string;
  tclass!: string;
  dept!: any;
  subFlag = 'pursuing';
  consultant_track: any[] = [];
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  field = 'empty';
  // pagination code
  dataTableColumns: string[] = [
    'SerialNum',
    'Date',
    // 'Id',
    'Name',
    'Email',
    'ContactNumber',
    'Visa',
    'CurrentLocation',
    'Company',
    'Position',
    'Experience',
    'Relocation',
    'Rate',
    // 'Priority',
    'Status',
    'Action',
    'AddedBy'
  ];
  dataSource = new MatTableDataSource<any>([]);
  // paginator
  totalItems = 0;
  pageSize = 50;
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = true;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private consultantServ = inject(ConsultantService);
  private router = inject(Router);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  priority: [string, string] = ['', ''];
  h1bForm: any = FormGroup;
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
  filteredConsultants: any;
  myForm: any;
  filterValues: any;
  filterRequest: any;
  size: any;

  constructor(private formBuilder: FormBuilder) {
    this.experienceForm = this.formBuilder.group({
      experience: ['']
    });
  }
  
  selectOptionObj = {
    interviewAvailability: IV_AVAILABILITY,
    priority: PRIORITY,
    statusType: STATUS,
    radioOptions: RADIO_OPTIONS,
  };

  userid: any;
  page: number = 1;
  move2sales = false;
  
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.userid = localStorage.getItem('userid');
    this.dept = localStorage.getItem('department');
    this.getvisa();
    this.getAllData();
  }
  filterData(request: any) {
    this.consultantServ.getFilteredConsults(request, 1, this.pageSize)
      .subscribe({
        next: (response: any) => {

          this.dataSource.data = response.data.content;
          // Reassign serial numbers after filtering
          this.dataSource.data.map((item: any, index: number) => {
            item.serialNum = index + 1;
            return item;
          });
        },
        error: (error: any) => {
          // Handle errors here
          console.error('An error occurred:', error);
        }
      });
  }

  getvisa() {
    this.consultantServ.getvisa().subscribe((response: any) => {
      this.visadata = response.data;
    });
  }

  /**
   * pageIndex : default value is 1 , will get updated whenever the page number changes
   * @returns number of records based on pagenumber
   */
  getAllData(pagIdx = 1) {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    const pagObj = {
      pageNumber: pagIdx,
      pageSize: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field,
      role: this.role,
      userId: this.userid,
      preSource: 1,
      flag: this.flag
    }

    return this.consultantServ
      .getAllConsultantData(
        pagObj
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.consultant = response.data.content;
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
    const keyword = event.target.value;
    this.field = keyword;
    if (keyword != '') {
      const pagObj = {
        pageNumber: 1,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        keyword: this.field,
        role: this.role,
        userId: this.userid,
        preSource: 1,
        flag: this.flag
      }
      return this.consultantServ.getAllConsultantData(pagObj).subscribe(
          ((response: any) => {
            this.consultant = response.data.content;
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
    return this.getAllData(this.currentPageIndex + 1);
  }

  /**
   * Sort
   * @param event
   */
  sortField = 'updateddate';
  sortOrder = 'desc';
  onSort(event: Sort) {
    if (event.active == 'SerialNum')
      this.sortField = 'updateddate'
    else
      this.sortField = event.active;
      this.sortOrder = event.direction;
    if (event.direction != '') {
      this.getAllData();
    }
  }

  navTo(to: string, id: any) {
    this.router.navigate([
      `usit/user/${to.toLocaleLowerCase()}-consultant/${id}`,
    ]);
  }

  /**
   *
   * @param element
   * @param type
   */
  goToConsultantInfo(element: any, flag: string) {
    this.router.navigate(['usit/consultant-info', flag, 'consultant', element.consultantid])
  }

  consultant_data: any[] = [];
  getDrilldownRport(id: any, status: any) {
    const drilldownReportObj: ReportVo = {
      id: id,
      startDate: '2020-06-01',
      endDate: '2030-06-01',
      groupby: 'consultant',
      status: status,
    };

    return this.consultantServ
      .consultant_DrillDown_report(drilldownReportObj,localStorage.getItem('companyid'))
      .subscribe((response: any) => {
        this.consultant_data = response.data;
      });
  }

  /**
   *
   * @param consultant
   */
  moveConsultant(consultant: Consultantinfo, cond: string) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to Move Profiles to ' + cond + ' ?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: consultant,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = 'fit-content';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );
    // call moveConsultant api after  clicked 'Yes' on dialog click

    dialogRef.afterClosed().subscribe({
      next: () => {
        if (dialogRef.componentInstance.allowAction) {
          this.consultantServ
            .moveConsultant(
              consultant.consultantid,
              cond,
              this.userid
            )
            .subscribe((resp: any) => {
              if (resp.status == 'success') {
                this.dataToBeSentToSnackBar.panelClass = [
                  'custom-snack-success',
                ];
                this.dataToBeSentToSnackBar.message = resp.message == 'Onboarding' ? 'Consultant moved to OnBoarding successfully' : 'Consultant moved to Sourcing successfully';

              } else {
                this.dataToBeSentToSnackBar.panelClass = [
                  'custom-snack-failure',
                ];
                this.dataToBeSentToSnackBar.message = resp.message;
              }
              this.snackBarServ.openSnackBarFromComponent(
                this.dataToBeSentToSnackBar
              );
              this.getAllData(this.currentPageIndex + 1);
            });
        }
      },
    });

  }

  /**
   * Add
   * Send this.flag value - to distinguish sales , recruiting, presales
   */
  addConsultant() {
    const actionData = {
      title: 'Add Consultant',
      consultantData: null,
      flag: this.flag,
      actionName: 'add-consultant',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-consultant';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddSourcingConsultantComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAllData(this.currentPageIndex + 1);
      }
    });
  }

  /**
   * Edit / Update
   */
  editConsultant(consultant: any) {
    const actionData = {
      title: 'Update Consultant',
      consultantData: consultant,
      actionName: 'edit-consultant',
      flag: this.flag,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'edit-consultant';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddSourcingConsultantComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAllData(this.currentPageIndex + 1);
      }
    });
  }

  /**
   * Delete
   */
  deleteConsultant(consultant: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: consultant,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = 'fit-content';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'delete-consultant';
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );

    // call delete api after  clicked 'Yes' on dialog click
    dialogRef.afterClosed().subscribe({
      next: () => {
        if (dialogRef.componentInstance.allowAction) {
          const dataToBeSentToSnackBar: ISnackBarData = {
            message: '',
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-success'],
          };

          this.consultantServ
            .deleteEntity(consultant.consultantid)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
              next: (response: any) => {
                if (response.status == 'success') {
                  this.getAllData(this.currentPageIndex + 1);
                  dataToBeSentToSnackBar.message =
                    'Consultant Deleted successfully';
                } else {
                  dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                  dataToBeSentToSnackBar.message = response.message;
                }
                this.snackBarServ.openSnackBarFromComponent(
                  dataToBeSentToSnackBar
                );
              },
              error: (err) => {
                dataToBeSentToSnackBar.message = err.message;
                dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                this.snackBarServ.openSnackBarFromComponent(
                  dataToBeSentToSnackBar
                );
              },
            });
        }
      },
    });
  }

  onStatusUpdate(consultant: any) {
    const dataToBeSentToDailog = {
      title: 'Status Update',
      updateText:
        consultant.status !== 'Active' ? 'activating' : 'in-activating',
      type: 'Consultant',
      buttonText: 'Update',
      actionData: consultant,
      actionName: 'update-consultant-status',
    };
    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog, {
      delete: false,
      edit: false,
      add: false,
      updateSatus: true,
    });
    const dialogRef = this.dialogServ.openDialogWithComponent(
      StatusComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe({
      next: () => {
        if (dialogRef.componentInstance.submitted) {
          consultant.remarks = dialogRef.componentInstance.remarks;
        }
      },
    });
  }

  private getDialogConfigData(
    dataToBeSentToDailog: Partial<IConfirmDialogData>,
    action: {
      delete: boolean;
      edit: boolean;
      add: boolean;
      updateSatus?: boolean;
    }
  ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width =
      action.edit || action.add
        ? '65vw'
        : action.delete
          ? 'fit-content'
          : '400px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = dataToBeSentToDailog.actionName;
    dialogConfig.data = dataToBeSentToDailog;
    return dialogConfig;
  }

  goToConsultantTrackDetails(vms: any) {
    const actionData = {
      title: 'Consultant Track',
      consultantData: vms,
      actionName: 'track-consultant',
      flag: this.flag,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '55vw';
    dialogConfig.data = actionData;
    this.dialogServ.openDialogWithComponent(
      ConsultantTrackComponent,
      dialogConfig
    );
  }

  /**
   * handle page event - pagination
   * @param vendor
   */
  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAllData(event.pageIndex + 1);
    }
    return;
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * this.pageSize + index + 1;
    return serialNumber;
  }

  /**
   * clean up
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  goToUserInfo(id: number) {
    this.router.navigate(['usit/user-info', this.subFlag, id])
  }

}
