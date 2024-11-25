import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
import { Subject, takeUntil } from 'rxjs';
import { Consultantinfo } from 'src/app/usit/models/consultantinfo';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AddconsultantComponent, IV_AVAILABILITY, PRIORITY, RADIO_OPTIONS, STATUS } from './add-consultant/add-consultant.component';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { ConsultantTrackComponent } from './consultant-track/consultant-track.component';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-consultant-list',
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
  templateUrl: './consultant-list.component.html',
  styleUrls: ['./consultant-list.component.scss'],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class ConsultantListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  role!: any;
  consultant: Consultantinfo[] = [];
  consultant2 = new Consultantinfo();
  message: any;
  showAlert = false;
  submitted = false;
  flag = '';
  searchstring!: any;
  ttitle!: string;
  ttitle1!: string;
  tclass!: string;
  dept!: any;
  subFlag!: any;
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
    'Priority',
    'Status',
    'Action',
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
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
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
  size: any;
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

  userid: any;
  page: number = 1;
  move2sales = false;
  ngOnInit(): void {
    const mvt = this.privilegeServ.hasPrivilege('MOVETOSALES_PRESALES');
    if (mvt) {
      this.move2sales = true;
    }
    this.role = localStorage.getItem('role');
    this.userid = localStorage.getItem('userid');
    this.dept = localStorage.getItem('department');
    this.getFlag();
    // alert(this.flag)
    
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
  filterData(request: any) {
    this.consultantServ.getFilteredConsults(request,1,this.pageSize )
      .subscribe(
        (response: any) => {
          
          this.dataSource.data = response.data.content;
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
   
  }
  //lavanya
  getvisa() {
    this.consultantServ.getvisa().subscribe((response: any) => {
      this.visadata = response.data;
    });
  }
  //
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
    //this.paginator.firstPage()
  }
  /**
   * get flag details
   */
  getFlag() {
    const routeData = this.activatedRoute.snapshot.data;
    if (routeData['isSalesConsultant']) {
      // sales consultant
      this.flag = 'sales';
      this.ttitle = 'back to pre sales';
      this.ttitle1 = 'move to sales';
      this.tclass = 'arrow_left_alt';
      this.subFlag = 'sales-consultant';
    } else if (routeData['isRecConsultant']) {
      // recruiting consutlant
      this.flag = 'Recruiting';
      this.ttitle = 'move to sales';
      //this.ttitle1 = "back to pre sales";
      this.tclass = "arrow_right_alt";
      this.subFlag = 'rec-consultant';
    } else if (routeData['isPreConsultant']) {
      // presales
      this.flag = 'presales';
      this.ttitle = 'move to sales';
      this.ttitle1 = 'back to pre sales';
      this.tclass = 'arrow_right_alt';
      this.subFlag = 'presales-consultant';
    } else {
      this.flag = 'DomRecruiting';
      this.subFlag = 'domrec-consultant';
    }

    if (
      this.flag.toLocaleLowerCase() === 'presales' ||
      this.flag.toLocaleLowerCase() === 'recruiting'
      ||
      this.flag.toLocaleLowerCase() === 'domrecruiting'
    ) {
      this.dataTableColumns.splice(15, 0, 'AddedBy');
    }
    if (
      this.flag.toLocaleLowerCase() === 'recruiting' ||
      this.flag.toLocaleLowerCase() === 'domrecruiting'
    ) {
      const priorityIndex = this.dataTableColumns.indexOf('Priority');
      if (priorityIndex !== -1) {
        this.dataTableColumns.splice(priorityIndex, 1);
      }
    }
  }

  /**
   * pageIndex : default value is 1 , will get updated whenever the page number changes
   * @returns number of records based on pagenumber
   */
  getAllData(pageIndex = 1) {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };

    const pagObj = {
      pageNumber: pageIndex,
      pageSize: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field,
      flag: this.flag,
      role: this.role,
      userId: this.userid,
      preSource: 0,
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
          //  this.length = response.data.totalElements;
        },
        error: (err: any) => {
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          dataToBeSentToSnackBar.message = err.message;
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  /**
   * get data by pagination
   */

  /**
   * on filter
   * @param event
   */
  onFilter(event: any) {
    // this.dataSource.filter = event.target.value;
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
        flag: this.flag,
        role: this.role,
        userId: this.userid,
        preSource: 0,
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
  /**
   * on track
   */
  goToConsultantDrillDownReport(
    element: any,
    type: 'interview' | 'submission'
  ) {
    // open popup
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
      .consultant_DrillDown_report(drilldownReportObj)
      .subscribe((response: any) => {
        this.consultant_data = response.data;
      });
  }

  /**
   *
   * @param consultant
   */
  moveProfileToSales(consultant: Consultantinfo, cond: string) {
    //alertify.confirm("Move Profile", "Are you sure you want to move Profile to Sales ? ", () => {
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
    // call moveToSales api after  clicked 'Yes' on dialog click

    dialogRef.afterClosed().subscribe({
      next: () => {
        if (dialogRef.componentInstance.allowAction) {
          this.consultantServ
            .moveToSales(
              consultant.consultantid,
              this.flag,
              this.userid
            )
            .subscribe((resp: any) => {
              if (resp.status == 'success') {
                this.dataToBeSentToSnackBar.panelClass = [
                  'custom-snack-success',
                ];
                this.dataToBeSentToSnackBar.message = resp.message == 'presales' ? 'Profile moved to Pre-Sales successfully' : 'Profile moved to Sales successfully';

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
    // dialogConfig.height = "100vh";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-consultant';
    dialogConfig.data = actionData;

    //this.dialogServ.openDialogWithComponent(AddconsultantComponent, dialogConfig);

    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddconsultantComponent,
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
    // dialogConfig.height = "100vh";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'edit-consultant';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      AddconsultantComponent,
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
  // status update
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
      next: (resp) => {
        if (dialogRef.componentInstance.submitted) {
          consultant.remarks = dialogRef.componentInstance.remarks;
          // this.callChangeEmpStatusAPI(emp);
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
   * @param endor
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
  //lavanya
  request = new FilterRequest();
  onExperienceChange(event: any): void {
    const visa = this.myForm.get('visa').value;
    const priority = this.myForm.get('priority').value;
    const experience = this.myForm.get('experience').value;
    this.request.visaStatus = visa;
    this.request.priority = priority;
    this.request.experience = experience;

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





export interface ReportVo {
  startDate: any;
  endDate: any;
  groupby: string;
  status: string;
  id: number;
}
