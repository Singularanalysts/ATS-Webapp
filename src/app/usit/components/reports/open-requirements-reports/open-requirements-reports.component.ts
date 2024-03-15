import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/usit/services/reports.service';
import { utils, writeFile } from 'xlsx';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-open-requirements-reports',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  templateUrl: './open-requirements-reports.component.html',
  styleUrls: ['./open-requirements-reports.component.scss']
})
export class OpenRequirementsReportsComponent {
  sourcingreport!: FormGroup

  submitted = false;
  showReport = false;
  c_data: any[] = [];
  Activecnt = 0;
  groupby!: any;
  stdate !: any;
  eddate !: any;
  hiddenflg = "main";
  router: any;
  constructor(private formBuilder: FormBuilder,
    private service: ReportsService, private datePipe: DatePipe, private dialog: MatDialog) { }
  get f() { return this.sourcingreport.controls; }
  department!: any;
  ngOnInit() {
    this.department = localStorage.getItem('department');
    this.sourcingreport = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      groupby: ['employee'],
    });
  }

  hideflg = true;
  grpby = '';
  flag2 = false;
  initiated = 0;
  completed = 0;
  verified = 0;
  rejected = 0;
  sales = 0;
  vo = new ReportVo();

  onSubmit() {
    this.submitted = true;

    // Check if the form is invalid
    if (this.sourcingreport.invalid) {
      this.showReport = false;
      return;
    } else {
      this.showReport = true;
    }

    // Extract the start and end dates from the form controls
    const joiningDateFormControl = this.sourcingreport.get('startDate');
    const relievingDateFormControl = this.sourcingreport.get('endDate');

    // Format the dates using Angular's DatePipe
    if (joiningDateFormControl?.value) {
      const formattedJoiningDate = this.datePipe.transform(joiningDateFormControl.value, 'yyyy-MM-dd');
      const formattedRelievingDate = this.datePipe.transform(relievingDateFormControl?.value, 'yyyy-MM-dd');

      // Update the form controls with the formatted dates
      joiningDateFormControl.setValue(formattedJoiningDate);
      relievingDateFormControl?.setValue(formattedRelievingDate);
    }

    // Assign the formatted dates to the properties in your component
    this.vo.startDate = joiningDateFormControl?.value;
    this.vo.endDate = relievingDateFormControl?.value;

    this.stdate = this.vo.startDate;
    this.eddate = this.vo.endDate;

    // Make an API call using the service to fetch data
    this.service.sources_report(this.sourcingreport.value)
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred during the API call:', error);
          // Handle the error appropriately (e.g., show an error message)
          return throwError('An error occurred. Please try again.');
        })
      )
      .subscribe((data: any) => {
        // Process the data received from the API
        this.c_data = data.data;

        // Perform calculations based on the data
        if (this.c_data && this.c_data.length > 0) {
          this.initiated = this.c_data.reduce((a, b) => a + (b.initiated || 0), 0);
          this.completed = this.c_data.reduce((a, b) => a + (b.completed || 0), 0);
          this.verified = this.c_data.reduce((a, b) => a + (b.verified || 0), 0);
          this.rejected = this.c_data.reduce((a, b) => a + (b.rejected || 0), 0);
          this.sales = this.c_data.reduce((a, b) => a + (b.sales || 0), 0);
        }
      });
  }


  reset() {
    this.sourcingreport.reset();
  }
  submenuflg = "";
  exname = '';
  //consult_data:any = [];
  consultant: any[] = [];
  executive!: string;
  
  // pagination code main table 
  page: number = 1;
  count: number = 0;
  tableSize: number = 50;
  tableSizes: any = [3, 6, 9, 12];
  onTableDataChange(event: any) {
    this.page = event;
  }
  generateSerialNumber(index: number): string {
    const serialNumber = (this.page - 1) * this.tableSize + index + 1;
    return serialNumber.toString();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}

export class ReportVo {
  startDate: any;
  endDate: any;
  groupby: any;
  status: any;
  id: any;
  flg: any;
}
