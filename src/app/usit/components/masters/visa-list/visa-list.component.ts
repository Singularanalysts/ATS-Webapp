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
import { Visa } from 'src/app/usit/models/visa';
import { VisaService } from 'src/app/usit/services/visa.service';
import { AddVisaComponent } from './add-visa/add-visa.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-visa-list',
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
  templateUrl: './visa-list.component.html',
  styleUrls: ['./visa-list.component.scss']
})
export class VisaListComponent implements OnInit, AfterViewInit, OnDestroy{
  // services
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private visaServ = inject(VisaService);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);

  displayedColumns: string[] = ['SerialNum', 'VisaStatus', 'Actions'];
  dataSource = new MatTableDataSource<Visa>([]);
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

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  visaList: Visa[]= [];
// to clear subscriptions
private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.getAllVisa()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllVisa() {
    return this.visaServ.getAllVisas().pipe(takeUntil(this.destroyed$)).subscribe(
      {
        next:(response: any) => {
          this.visaList = response.data;
          this.dataSource.data = response.data;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = i + 1;
          });
        },
        error: (err)=> console.log(err)
      }
    );
  }

  addVisa() {
    const actionData = {
      title: 'Add Visa',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'add-visa'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "add-visa";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddVisaComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.allowAction){
        this.getAllVisa();
      }
    })
  }

  editVisa(visa: any) {
    const actionData = {
      title: 'Update Visa',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'update-visa',
      visaData: visa
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "update-visa";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddVisaComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.allowAction){
        this.getAllVisa();
      }
    })
  }

  deleteVisa(visa: any) {
    const dataToBeSentToDailog : Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: visa,
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "delete-visa";
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
          this.visaServ.deleteVisa(visa.vid).pipe(takeUntil(this.destroyed$)).subscribe
            ({
              next: (resp: any) => {
                if (resp.status == 'success') {
                  dataToBeSentToSnackBar.message =
                    'Visa Deleted successfully';
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                  // call get api after deleting a role
                  this.getAllVisa();
                } else {
                  dataToBeSentToSnackBar.message = resp.message;
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                }

              }, error: (err) => console.log(`Visa delete error: ${err}`)
            });
        }
      }
    })
  }

  // search
  onFilter(event: any){
    this.dataSource.filter = event.target.value;
  }

  // sort
  onSort(event: any) {
    const sortDirection = event.direction;
    const sortColumn = event.active;

    if (sortDirection !== null && sortDirection !== undefined) {
      this.dataSource.data = this.sortData(this.dataSource.data, sortColumn, sortDirection);
    } else {
      this.dataSource.data = [...this.visaList];
    }
  }

  private sortData(data: Visa[], sortColumn: string, sortDirection: string): Visa[] {
    return data.sort((a, b) => {
      switch (sortColumn) {
        case 'VisaStatus':
          const valueA = (a.visastatus as string) || '';
          const valueB = (b.visastatus as string) || '';
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
