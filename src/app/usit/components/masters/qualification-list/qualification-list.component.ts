import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { DialogService } from 'src/app/services/dialog.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { Qualification } from 'src/app/usit/models/qualification';
import { QualificationService } from 'src/app/usit/services/qualification.service';
import { AddQualificationComponent } from './add-qualification/add-qualification.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-qualification-list',
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
    MatTooltipModule
  ],
  templateUrl: './qualification-list.component.html',
  styleUrls: ['./qualification-list.component.scss']
})
export class QualificationListComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSource = new MatTableDataSource<Qualification>([]);
  displayedColumns: string[] = ['SerialNum', 'Name', 'Action'];
  private qualificationServ = inject(QualificationService);
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);
  @ViewChild(MatSort) sort!: MatSort;
  qualificationList: Qualification[]= [];
  // paginator
  length = 50;
  pageIndex = 0;
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [50, 75, 100];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  totalItems: number = 0;
  page: number = 1;
  itemsPerPage = 50;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  ngOnInit(): void {
    this.getAllQualifications();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllQualifications() {
    return this.qualificationServ.getAllQualifications().pipe(takeUntil(this.destroyed$)).subscribe(
      {
        next:(response: any) => {
          this.qualificationList = response.data;
          this.dataSource.data = response.data;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = i + 1;
          });
        },
        error: (err)=> console.log(err)
      }
    );
  }

  addQualification() {
    const actionData = {
      title: 'Add Qualification',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'add-qualification'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "add-qualification";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddQualificationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.allowAction){
        this.getAllQualifications();
      }
    })
  }

  editQualification(qualification: any) {
    const actionData = {
      title: 'Update Qualification',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'update-qualification',
      qualificationData: qualification
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "update-qualification";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddQualificationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.allowAction){
        this.getAllQualifications();
      }

    })
  }

  deleteQualification(qualification: any) {
    const dataToBeSentToDailog : Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: qualification,
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "update-qualification";
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(ConfirmComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: () =>{
        if (dialogRef.componentInstance.allowAction) {
          const dataToBeSentToSnackBar: ISnackBarData = {
            message: '',
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-success'],
          };
          this.qualificationServ.deleteQualification(qualification.id).pipe(takeUntil(this.destroyed$)).subscribe
            ({
              next: (resp: any) => {
                if (resp.status == 'success') {
                  dataToBeSentToSnackBar.message =
                    'Qualification Deleted successfully';
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                  // call get api after deleting a qualification
                  this.getAllQualifications();
                } else {
                  dataToBeSentToSnackBar.message = resp.message;
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                }

              }, error: (err) => console.log(`Qualification delete error: ${err}`)
            });
        }
      }
    })
  }

  onFilter(event: any) {
    this.dataSource.filter = event.target.value;
  }

  onSort(event: any) {
    const sortDirection = event.direction;
    const sortColumn = event.active;

    if (sortDirection !== null && sortDirection !== undefined) {
      this.dataSource.data = this.sortData(this.dataSource.data, sortColumn, sortDirection);
    } else {
      this.dataSource.data = [...this.qualificationList];
    }
  }

  private sortData(data: Qualification[], sortColumn: string, sortDirection: string): Qualification[] {
    return data.sort((a, b) => {
      switch (sortColumn) {
        case 'Name':
          const valueA = (a.name as string) || '';
          const valueB = (b.name as string) || '';
          if (sortDirection === 'asc') {
            return valueA.localeCompare(valueB);
          } else if (sortDirection === 'desc') {
            return valueB.localeCompare(valueA);
          } else {
            return valueA.localeCompare(valueB);
          }

        default:
          return 0;
      }
    });
  }

  getRowClass(row: any): string {
    const rowIndex = this.dataSource.filteredData.indexOf(row);
    return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  /**
   * clean up
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
