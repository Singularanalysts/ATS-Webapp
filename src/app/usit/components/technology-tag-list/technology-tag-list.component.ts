import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { DialogService } from 'src/app/services/dialog.service';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
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
export class TechnologyTagListComponent implements OnInit {
  protected privilegeServ = inject(PrivilegesService);
  private dialogServ = inject(DialogService);
  private techTagServ = inject(TechnologyTagService);
  private snackBarServ = inject(SnackBarService);
  dataSource = new MatTableDataSource<any>([]);

  dataTableColumns: string[] = ['SerialNum', 'Technology', 'Skills', 'Actions'];
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum !: any;
  totalItems: any;
  field = "empty";
  currentPageIndex = 0;
  pageEvent!: PageEvent;
  pageSize = 50;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageSizeOptions = [50, 75, 100];

  private router = inject(Router);
  userid!: any;
  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.getAllData();
  }

  getAllData(pagIdx = 1) {
    this.techTagServ.getAllTechnologiesByPagination(pagIdx, this.itemsPerPage, this.field,
      this.sortField,
      this.sortOrder).subscribe(
      (response: any) => {
        this.dataSource.data = response.data.content;
        this.totalItems = response.data.totalElements;
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      }
    )
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  applyFilter(event: any) {
    const keyword = event.target.value;
    if (keyword != '') {
      return  this.techTagServ.getAllTechnologiesByPagination(1, this.itemsPerPage, keyword,
        this.sortField,
        this.sortOrder).subscribe(
      // return this.service.getopenReqWithPagination(1, this.itemsPerPage, keyword).subscribe(
        ((response: any) => {
          this.dataSource.data  = response.data.content;
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

  sortField = 'technologyarea';
  sortOrder = 'asc';
  onSort(event: Sort) {
    //console.log(event);
    if (event.active == 'SerialNum')
      this.sortField = 'technologyarea'
    else
      this.sortField = event.active;
    
      this.sortOrder = event.direction;
    
    if (event.direction != ''){
    this.getAllData();
    }
  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAllData(event.pageIndex + 1)
    }
    return;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
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
      if (dialogRef.componentInstance.allowAction) {
        this.getAllData();
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
      if (dialogRef.componentInstance.allowAction) {
        this.getAllData();
      }
    })
  }

  deleteTechnology(technology: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
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
                  this.getAllData();
                }
                else if (resp.status == 'associated') {
                  dataToBeSentToSnackBar.message = resp.message;
                  this.snackBarServ.openSnackBarFromComponent(
                    dataToBeSentToSnackBar
                  );
                  // call get api after deleting a technology
                  this.getAllData();
                }
                else {
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
}
