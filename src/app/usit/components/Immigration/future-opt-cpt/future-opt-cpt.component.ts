import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { AddconsultantComponent } from '../../sales/consultant-list/add-consultant/add-consultant.component';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';
import { MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-future-opt-cpt',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule
  ],
  templateUrl: './future-opt-cpt.component.html',
  styleUrls: ['./future-opt-cpt.component.scss']
})
export class FutureOptCptComponent implements OnInit{

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Email',
    'Number',
    'Technology',
    'University',
    'BeneficiaryFirstName',
    'BeneficiaryMiddleName',
    'BeneficiaryLastName',
    'CurrentLocation',
    'Gender',
    'Action',
  ];

  private consultantServ = inject(ConsultantService);
  private dialogServ = inject(DialogService);
  private router = inject(Router);
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
  flag = 'sales';

  ngOnInit(): void {
    this.getAll()
  }

  getAll(pagIdx=1) {
    this.consultantServ.getOptCptList(pagIdx, this.itemsPerPage, this.field).subscribe(
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

  editOptCpt(OptCpt: any) {
    const actionData = {
      title: 'Update consultant',
      consultantData: OptCpt,
      actionName: 'edit-consultant',
      flag: this.flag,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.panelClass = 'edit-consultant';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddconsultantComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
         this.getAll(this.currentPageIndex + 1);
      }
    })
  }

  applyFilter(event : any) {
    this.dataSource.filter = event.target.value;
  }

  onSort(event: any) {

  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }
}
