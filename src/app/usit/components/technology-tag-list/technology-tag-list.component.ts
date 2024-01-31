import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { DialogService } from 'src/app/services/dialog.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { Technology } from '../../models/technology';
import { TechnologyTagService } from '../../services/technology-tag.service';
import { AddTechnologyTagComponent } from './add-technology-tag/add-technology-tag.component';
import { PrivilegesService } from 'src/app/services/privileges.service';

@Component({
  selector: 'app-technology-tag-list',
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
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
  templateUrl: './technology-tag-list.component.html',
  styleUrls: ['./technology-tag-list.component.scss']
})
export class TechnologyTagListComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['SerialNum','Technology', 'Skills', 'Actions'];
  dataSource = new MatTableDataSource<any>([]);
  technologyTagList: Technology[] = [];
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  protected privilegeServ = inject(PrivilegesService);
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  totalItems: number = 0;
  field = 'empty';
  datarr: any[] = [];
  hasAcces!: any;
  loginId!: any;
  department!: any;

  // to clear subscriptions
  private destroyed$ = new Subject<void>();

  private techTagServ = inject(TechnologyTagService);
  private snackBarServ = inject(SnackBarService);
  private dialogServ = inject(DialogService);
  private router = inject(Router);

  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.loginId = localStorage.getItem('userid');
    this.department = localStorage.getItem('department');

    this.getAllTechnologies()
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  getAllTechnologies() {
    return this.techTagServ.getAllTechnologies().pipe(takeUntil(this.destroyed$)).subscribe(
      {
        next: (response: any) => {
          this.technologyTagList = response.data;
          this.dataSource.data = response.data;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = i + 1;
          });
          this.totalItems = response.data.totalElements;
        },
        error: (err: any) => console.log(err)
      }
    );
  }



  addTechnology() {
    const actionData = {
      title: 'Add Technology',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'add-technology'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "add-technology";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddTechnologyTagComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.allowAction){
        this.getAllTechnologies();
      }
    })

  }

  editTechnology(technology: any) {
    const actionData = {
      title: 'Update Technology',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'update-technology',
      technologyData: technology
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "update-technology";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddTechnologyTagComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.allowAction){
        this.getAllTechnologies();
      }
    })
  }

  deleteTechnology(technology: any) {
    const dataToBeSentToDailog : Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: technology,
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "delete-technology";
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
          this.techTagServ.deleteTechnology(technology.id).subscribe
            ({
              next: (resp: any) => {
                if (resp.status == 'success') {
                  dataToBeSentToSnackBar.message =
                    'Technology Deleted successfully';
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                  // call get api after deleting a technology
                  this.getAllTechnologies();
                } else {
                  dataToBeSentToSnackBar.message = resp.message;
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                }

              }, error: (err: any) => console.log(`Technology delete error: ${err}`)
            });
        }
      }
    })
  }

  // search
  onFilter(event: any){
    this.dataSource.filter = event.target.value;
  }

  onSort(event: any) {

  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  getRowClass(row: any): string {
    const rowIndex = this.dataSource.filteredData.indexOf(row);
    return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

}
