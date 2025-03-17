import { Component, inject } from '@angular/core';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {

  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatDialogConfig } from '@angular/material/dialog';

import { AddExecutiveRatingComponent } from '../add-executive-rating/add-executive-rating.component';
import { DialogService } from 'src/app/services/dialog.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
@Component({
  selector: 'app-executive-ratings',
   standalone: true,
    imports: [
      MatTableModule,
      CommonModule,
      MatIconModule,
      MatIconModule,
      MatButtonModule,
      MatCardModule,
      MatInputModule,
      MatFormFieldModule,
      MatSortModule,
      MatPaginatorModule,
      MatTooltipModule
    ],
    
  templateUrl: './executive-ratings.component.html',
  styleUrls: ['./executive-ratings.component.scss']
})
export class ExecutiveRatingsComponent {
 private router = inject(Router);
 
 pageSize = 50;
showPageSizeOptions = true;
showFirstLastButtons = true;
pageSizeOptions = [5, 10, 25, 50]; // Ensure it matches API-supported page sizes
currentPageIndex = 0;
itemsPerPage = 50; // Ensure this matches the default pageSize
totalItems = 0; // Start with 0 and update dynamically

  sortField = 'Rating';  
  sortOrder = 'ASC';  
  field = "empty";  
  
  pageEvent!: PageEvent;

  flag!: string;
  private dialogServ = inject(DialogService);

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }
  addRating() {
    const actionData = {
      title: 'Add  Rating',
      interviewData: null,
      actionName: 'add-executiverating',
      flag: this.flag,
    };
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-interview';
    dialogConfig.data = actionData;
  
    const dialogRef = this.dialogServ.openDialogWithComponent(AddExecutiveRatingComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {  
        this.getRatedData();  
      }
    });
  }
 
  onSort(event: Sort) {
  this.sortField = event.active;
  this.sortOrder = event.direction === 'asc' ? 'ASC' : 'DESC'; 

  console.log('Sorting triggered:', { field: this.sortField, order: this.sortOrder });

  this.getRatedData(); 
}

    protected privilegeServ = inject(PrivilegesService);

    
    private snackBarServ = inject(SnackBarService);
  
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Rating',
    'Feedback',
    'RatedTo',
    'RatedBy',
    
'Action'
  ];
  ngOnInit() {
    this.getRatedData();
    // alert(JSON.stringify(this.privilegeServ.hasPrivilege("ADD_RATINGS")))
  }
    private destroyed$ = new Subject<void>();
  

 
    applyFilter(event: any) {
      const filterValue = event.target.value.trim(); // Remove leading/trailing spaces
      this.field = filterValue; // Update keyword field
    
      // Call API with the updated keyword for searching
      this.getRatedData(1); // Reset to page 1 for new search
    }
    
    getRatedData(currentPageIndex = 1) {
      const userId = localStorage.getItem('userid');
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }
    
      const pagObj = {
        pageNumber: currentPageIndex,
        pageSize: this.itemsPerPage,
        sortField: this.sortField || 'serialNum',
        sortOrder: this.sortOrder || 'ASC',
        keyword: this.field || '', // If empty, fetch all data
      };
    
      this.privilegeServ.getRateddata(pagObj)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((response: any) => {
          if (response && response.data) {
            // Update table data
            this.dataSource.data = response.data.content.map((item: any, index: number) => ({
              id: item.id,
              serialNum: (currentPageIndex - 1) * this.itemsPerPage + index + 1, // Adjust numbering
              rating: item.rating,
              remarks: item.feedBack,
              rated_to: item.ratedTo,
              rated_by: item.ratedBy,
            }));
    
            // Update total items count for pagination
            this.totalItems = response.data.totalElements || 0;
          } else {
            this.dataSource.data = []; // Clear table if no results found
            this.totalItems = 0; // Reset pagination
          }
        });
    }
    
    
    
    deleteRating(id: any) {
      const dataToBeSentToDialog: Partial<IConfirmDialogData> = {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this rating?',
        confirmText: 'Yes',
        cancelText: 'No',
        actionData: id,
      };
    
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = 'fit-content';
      dialogConfig.height = 'auto';
      dialogConfig.disableClose = false;
      dialogConfig.panelClass = 'delete-rating';
      dialogConfig.data = dataToBeSentToDialog;
    
      const dialogRef = this.dialogServ.openDialogWithComponent(ConfirmComponent, dialogConfig);
    
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
    
            this.privilegeServ.deleteRating(id)
              .pipe(takeUntil(this.destroyed$))
              .subscribe({
                next: (response: any) => {
                  if (response.status === 'Success') {
                    this.getRatedData();
                    dataToBeSentToSnackBar.message = 'Rating deleted successfully';
                  } else {
                    dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                    dataToBeSentToSnackBar.message = 'Failed to delete rating';
                  }
                  this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
                },
                error: (err: any) => {
                  dataToBeSentToSnackBar.message = err.message;
                  dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                  this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
                }
              });
          }
        },
      });
    }
    
    editRating(rating: any) {
      const actionData = {
        title: 'Edit Rating',
        interviewData: { id: rating }, 
        actionName: 'edit-executiverating',
        flag: this.flag,
      };
    console.log(actionData,'actionidd');
    
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '65vw';
      dialogConfig.disableClose = false;
      dialogConfig.panelClass = 'add-interview';
      dialogConfig.data = actionData;
    
      const dialogRef = this.dialogServ.openDialogWithComponent(AddExecutiveRatingComponent, dialogConfig);
    
      dialogRef.afterClosed().subscribe(result => {
        if (result?.success) {
          this.getRatedData(); 
        }
      });
    }
    
    
 
  handlePageEvent(event: PageEvent) {
    if (event) {
      this.currentPageIndex = event.pageIndex;
      this.itemsPerPage = event.pageSize; // Update page size dynamically
      this.getRatedData(this.currentPageIndex + 1); // Call API with updated page index
    }
  }
  

}
