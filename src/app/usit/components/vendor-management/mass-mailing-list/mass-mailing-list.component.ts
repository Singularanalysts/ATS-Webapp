import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AddMassMailingListComponent } from './add-mass-mailing-list/add-mass-mailing-list.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-mass-mailing-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './mass-mailing-list.component.html',
  styleUrls: ['./mass-mailing-list.component.scss']
})
export class MassMailingListComponent {

  private router = inject(Router);
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Technology',
    'Company',
    'MMFor',
    'MMType',
    'MMName',
    'Status',
    'Action',
  ];
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum !: any;
  totalItems: any;
  ser: number = 1;
  userid!: any;
  field = "empty";
  currentPageIndex = 0;
  pageEvent!: PageEvent;
  pageSize = 50;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageSizeOptions = [5, 10, 25];
  private dialogServ = inject(DialogService);


  addMassMailingList() {
    const actionData = {
      title: 'Add Mass Mailing List',
      massMailingData: null,
      actionName: 'add-mass-mailing-list',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-mass-mailing-list';
    dialogConfig.data = actionData;


    const dialogRef = this.dialogServ.openDialogWithComponent(AddMassMailingListComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
        //  this.getAll(this.currentPageIndex + 1);
      }
    })
  }

  applyFilter(event: any) {

  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      // this.getAll(event.pageIndex + 1)
    }
    return;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

}
