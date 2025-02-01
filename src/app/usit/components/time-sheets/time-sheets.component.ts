import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, Sort } from '@angular/material/sort';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from 'src/app/services/dialog.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddTimeSheetComponent } from './add-time-sheet/add-time-sheet.component';
import { TimeSheetService } from '../../services/time-sheet.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { TimesheetAttachmentsComponent } from 'src/app/dialogs/timesheet-attachments/timesheet-attachments.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-time-sheets',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './time-sheets.component.html',
  styleUrls: ['./time-sheets.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }]
})
export class TimeSheetsComponent {
  // flag: any;
  consultant: any;
  entity: any;
  // pagination code
  page: number = 1;
  pageSize = 50;
  totalItems: any;
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  showFirstLastButtons = true;
  itemsPerPage = 50;
  AssignedPageNum !: any;
  ser: number = 1;
  userid!: any;
  field = "empty";
  pageEvent!: PageEvent;
  showPageSizeOptions = true;







  dataSource = new MatTableDataSource<any>([]);
  protected privilegeServ = inject(PrivilegesService);
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private dialog = inject(MatDialog);
  displayedColumns: string[] = [
    'SerialNum',
    'company',
    'start_date',
    'end_date',
    'time_sheet_type',
    'number_of_hours',
    'attachments',
    'actions'
  ];

  constructor(private timeTagServ: TimeSheetService) { }
  ngOnInit() {
    // this.getAllTimeSheets();
    this.getAll();
  }
  ngAfterViewInit() {
    // Any actions that need to be taken after the view is fully initialized can be placed here.
    // This should handle any updates that might need to occur.
  }
  addTimeSheet() {
    const actionData = {
      title: 'Add Timesheet',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'add-timesheet'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "add-timesheet";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddTimeSheetComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.allowAction) {
        this.getAll();

      }
    })
  }

  navigateToDashboard() {
    console.log('Navigating to Dashboard...');
  }

  getAll(pagIdx = 1) {
    const pagObj = {
      pageNumber: pagIdx,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field,
    };

    this.timeTagServ.getTimeSheetListwithPaginationSortAndFilter(pagObj)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        // if (response.data && response.data.content) {
        //   this.entity = response.data.content;
        //   this.dataSource.data = response.data.content.map((item: any, index: number) => ({
        //     ...item,
        //     serialNum: this.generateSerialNumber(index),
        //   }));
        //   this.totalItems = response.data.totalElements;
        // }
        this.entity = response.data.content;
        this.dataSource.data = response.data.content;
        this.totalItems = response.data.totalElements;
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      });
  }

  sortField = 'time_sheet_type';
  sortOrder = 'desc';

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  applyFilter(event: any) {
    const keyword = event.target.value;
    if (keyword != '') {
      const pagObj = {
        pageNumber: 1,
        pageSize: this.itemsPerPage,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        keyword: keyword,
      }

      return this.timeTagServ.getTimeSheetListwithPaginationSortAndFilter(pagObj).subscribe(
        ((response: any) => {
          this.entity = response.data.content;
          this.dataSource.data = response.data.content;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
          this.totalItems = response.data.totalElements;
        })
      );
    }
    return this.getAll(this.currentPageIndex + 1)
  }

  private destroyed$ = new Subject<void>();
  deleteTimeSheet(timesheetId: number) {
    const dataToBeSentToDialog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete this timesheet?',
      confirmText: 'Yes',
      cancelText: 'No',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "delete-timesheet";
    dialogConfig.data = dataToBeSentToDialog;

    const dialogRef = this.dialogServ.openDialogWithComponent(ConfirmComponent, dialogConfig);

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

          this.timeTagServ.deleteTimeSheet(timesheetId).subscribe({
            next: (resp: any) => {
              if (resp.status === 'success') {
                dataToBeSentToSnackBar.message = 'Time Sheet Deleted Successfully';
                this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
                // Refresh the time sheet list after deletion
                this.getAll();
              } else {
                dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                dataToBeSentToSnackBar.message = resp.message || 'Failed to delete the time sheet';
                this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
              }
            },
            error: (err: any) => {
              console.error('Time Sheet delete error:', err);
              dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
              dataToBeSentToSnackBar.message = 'An error occurred while deleting the time sheet';
              this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
            },
          });
        }
      },
      error: (err: any) => {
        console.error('Dialog closed with error:', err);
      },
    });
  }

  openAttachmentsDialog(timesheet_id: number): void {
    // Fetch attachments using the timesheet_id
    this.timeTagServ.getAttachment(timesheet_id).subscribe({
      next: (res: any) => {
        // Ensure res.data contains the attachments
        const attachments = res.data;

        // Configure the dialog with the fetched data
        const dialogConfig = {
          width: '600px',
          data: { attachments } // Pass the fetched attachments to the dialog
        };

        // Open the dialog with the attachments data
        this.dialog.open(TimesheetAttachmentsComponent, dialogConfig);
      },
      error: (err: any) => {
        console.error('Error fetching attachments:', err);
      }
    });
  }
  onSort(event: Sort) {
    if (event.active == 'SerialNum')
      this.sortField = 'time_sheet_type'
    else
      this.sortField = event.active;

    this.sortOrder = event.direction;

    if (event.direction != '') {
      this.getAll();
    }
  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAll(event.pageIndex + 1)
    }
    return;
  }

  updateTimeSheet(id: number) {
    this.timeTagServ.getById(id).subscribe({
      next: (response: any) => {
        const actionData = {
          title: 'Update Time Sheet',
          buttonCancelText: 'Cancel',
          buttonSubmitText: 'Update',
          actionName: 'update-timesheet',
          timesheetData: response, // Ensure this includes the id
        };
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "550px";
        dialogConfig.height = "auto";
        dialogConfig.disableClose = false;
        dialogConfig.panelClass = "update-timesheet";
        dialogConfig.data = actionData;

        const dialogRef = this.dialogServ.openDialogWithComponent(AddTimeSheetComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(() => {

          this.getAll(); // Refresh the timesheet list

        });
      },
      error: (err) => {
        console.error('Error fetching timesheet data for update:', err);
      },
    });
  }


}
