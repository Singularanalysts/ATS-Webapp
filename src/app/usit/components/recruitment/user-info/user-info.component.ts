import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeManagementService } from 'src/app/usit/services/employee-management.service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { DashboardService } from 'src/app/usit/services/dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTooltipModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatStepperModule],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {

  flag!: any;
  entity: any = [];
  datarr: any[] = [];
  id!: any;
  hasAcces: any;
  @ViewChild('stepper') private myStepper!: MatStepper;
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['RoleName', 'Actions'];
  private empServ = inject(EmployeeManagementService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private dashboardServ = inject(DashboardService);
  // constructor(private _service:UsermanagementService,private activatedRoute:ActivatedRoute,private router: Router, private service: DashboardService) { }

  ngOnInit(): void {
  setTimeout(() => {


      this.myStepper.next();
  }, 100);
    this.hasAcces = localStorage.getItem('role');
     this.id = this.activatedRoute.snapshot.params['id'];
    //const id = this.router.getCurrentNavigation()?.extras.state!['id'];

    this.flag = this.activatedRoute.snapshot.params['flg'];
    // alert(this.flag+" = "+this.id)
    this.empServ.getEmployeeInfoById(this.id).subscribe((response: any) => {
      this.entity = response.data;
      this.dataSource.data = response.data;
      // alert(JSON.stringify(this.entity))

    });

    this.dashboardServ.getUserTrack(this.id).subscribe((response: any) => {
      this.datarr = response.data;
    });
  }

  backtolist() {
    if (this.flag == 'sales-consultant')
      this.router.navigate(['sales-consultants/sales']);
    else if (this.flag == 'presales-consultant')
      this.router.navigate(['pre-sales/presales']);
    else if (this.flag == 'vendor')
      this.router.navigate(['list-vendor']);
    else if (this.flag == 'recruiter')
      this.router.navigate(['list-recruiter']);
    else if (this.flag == 'Recruiting-consultant')
      this.router.navigate(['recruiting-consultants/recruiting']);
    else if (this.flag == 'sales-submission')
      this.router.navigate(['sales-submission/sales']);
    else if (this.flag == 'sales-interview')
      this.router.navigate(['sales-interview/sales']);
    else if (this.flag == 'info')
      this.router.navigate(['list-employees']);
    else if (this.flag == 'Recruiting-submission')
      this.router.navigate(['recruiting-submission/recruiting']);
    else if (this.flag == 'Recruiting-interview')
      this.router.navigate(['recruiting-interview/recruiting']);
    else this.router.navigate(['dashboard']);
  }
}
