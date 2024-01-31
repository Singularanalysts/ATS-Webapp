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
import { Company } from 'src/app/usit/models/company';
import { CompanyService } from 'src/app/usit/services/company.service';
import { AddCompanyComponent } from './add-company/add-company.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-companies-list',
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
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss']
})
export class CompaniesListComponent implements OnInit, AfterViewInit, OnDestroy {

  private companyServ = inject(CompanyService);
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private router = inject(Router);
  protected privilegeServ = inject(PrivilegesService);

  dataSource = new MatTableDataSource<Company>([]);
  displayedColumns: string[] = ['SerialNum', 'Company', 'Actions'];
  @ViewChild(MatSort) sort!: MatSort;
  companyList: Company[]= [];
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
    this.getAllCompanies()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllCompanies() {
    return this.companyServ.getAllCompanies().pipe(takeUntil(this.destroyed$)).subscribe(
      {
        next:(response: any) => {
          this.companyList = response.data;
          this.dataSource.data = response.data;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = i + 1;
          });
        },
        error: (err)=> console.log(err)
      }
    );
  }

  addCompany() {
    const actionData = {
      title: 'Add Company',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'add-company'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "add-company";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddCompanyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.allowAction){
        this.getAllCompanies();
      }
    })
  }

  editCompany(company: any) {
    const actionData = {
      title: 'Update Company',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'update-company',
      companyData: company
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "update-company";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddCompanyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.allowAction){
        this.getAllCompanies();
      }
    })

  }

  deleteCompany(company: any) {
    const dataToBeSentToDailog : Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: company,
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "delete-company";
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
          this.companyServ.deleteCompany(company.companyid).pipe(takeUntil(this.destroyed$)).subscribe
            ({
              next: (resp: any) => {
                if (resp.status == 'success') {
                  dataToBeSentToSnackBar.message =
                    'Company Deleted successfully';
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                  // call get api after deleting a role
                  this.getAllCompanies();
                } else {
                  dataToBeSentToSnackBar.message = resp.message;
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                }

              }, error: (err: any) => console.log(`Company delete error: ${err}`)
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
      this.dataSource.data = [...this.companyList];
    }
  }

  private sortData(data: Company[], sortColumn: string, sortDirection: string): Company[] {
    return data.sort((a, b) => {
      switch (sortColumn) {
        case 'Company':
          const valueA = (a.companyname as string) || '';
          const valueB = (b.companyname as string) || '';
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
