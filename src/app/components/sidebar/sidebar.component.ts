
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import {    Component, OnInit, inject } from '@angular/core'
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { UserManagementService } from 'src/app/services/user-management.service';
import { EmployeeManagementService } from 'src/app/usit/services/employee-management.service';
import { WebsocketService } from 'src/app/usit/services/websocket.service';

const keyFrames = [
  style({ transform: 'rotate(0deg)', offset: '0'}),
  style({ transform: 'rotate(1turn)', offset: '1'})
];
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger("rotate", [

      transition("* => close", [
        animate('1500ms', keyframes(keyFrames))
      ])
    ]),
  ]
})
export class SidebarComponent implements OnInit {
  protected privilegeServ = inject(PrivilegesService);

  private empManagementServ = inject(EmployeeManagementService);
  private snackBarServ = inject(SnackBarService);
  protected permissionServ = inject(PermissionsService);
  protected userManagementServ = inject(UserManagementService);
  private router = inject(Router);
  // loader
  loaderServ = inject(LoaderService);
  isLoading$ = this.loaderServ.isLoading$;
  color: ThemePalette = 'primary';
  progressBarMode: ProgressBarMode = 'indeterminate';
  progressSpinnerMode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  role!: string | null;
  private websocketService = inject(WebsocketService);
  messageSubscription: any;
  unseenNotificationCount: number | undefined;
  notificationArr: any[] = [];
  department: string | null | undefined;
  submissions: any[] = [];
  pendingSubmissionsCount: number = 0;
  isManager: boolean = false;
  managingCompanyOpt: string | null = null;
isManagingToDispaly: boolean = false;

  getsubmissions() {
    this.permissionServ.getsubmission(localStorage.getItem('companyid')).subscribe((res: any) => {
      this.submissions = res.data || [];
  
      // Filter count for new submissions not approved or rejected
      this.pendingSubmissionsCount = this.submissions.filter(
        (submission: any) => submission.status !== 'Approved' && submission.status !== 'Rejected'
      ).length;
    });
  }
  
// In your component.ts
approve(submissionId: number) {
  this.permissionServ.updatesubmission(submissionId, 'Approved').subscribe((res) => {
    console.log('Approved successfully', res);
    this.getsubmissions(); // Refresh data after update
  });
}

reject(submissionId: number) {
  this.permissionServ.updatesubmission(submissionId, 'Rejected').subscribe((res) => {
    console.log('Rejected successfully', res);
    this.getsubmissions(); // Refresh data after update
  });
}

  globalRefresh(): void {
    window.location.reload();
  }

ngOnInit(): void {
  this.managingCompanyOpt = localStorage.getItem('companyid');

  this.isManagingToDispaly = this.managingCompanyOpt === 'tJiels9DKKE4HXvMZSuI7A==';

  console.log('isManagingToDispaly:', this.isManagingToDispaly);

    this.getsubmissions()
    this.role  = localStorage.getItem('role');
    this.department  = localStorage.getItem('department');
    this.websocketService.connect();
    this.userManagementServ.getNotifications().subscribe({
      next: (res: any) => {
        this.unseenNotificationCount = res.data.unSeenCount;
        this.notificationArr = res.data.notifications;
      }
    });
    this.messageSubscription = this.websocketService.getMessages().subscribe(
      {
        next: (message: string) => {
          this.userManagementServ.getNotifications().subscribe({
            next: (res: any) => {
              this.unseenNotificationCount = res.data.unSeenCount;
              this.notificationArr = res.data.notifications;
            }
          });
        },
        error: (error: any) => {
          console.error('Error receiving WebSocket message:', error);
        }
      }
    );

  }

  handleNotificationClick(notification: any) {
    this.router.navigateByUrl('/usit/vendors');
    if(notification.seen !== true) {
      this.userManagementServ.seeNotification(notification.nt_id, notification.seen).subscribe({
        next: (res: any) => {
  
        },
        error: (err: any) => {
  
        }
      });
    }
  }

  onSignOut(){
  const dataToBeSentToSnackBar: ISnackBarData = {
    message: 'You have signed out!',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-signout']
  };


  this.permissionServ.logOut()
    .subscribe({
      next: () =>{
        this.websocketService.disconnect();
        this.clearLocalStorageItemsOnLogOut();
        // navigate to login
        this.router.navigate(['/']);
      },
      error: err =>{
        // show error
      }
    });


  }

  clearLocalStorageItemsOnLogOut() {
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userid');
    localStorage.removeItem('roleno');
    localStorage.removeItem('department');
    localStorage.removeItem('designation');
    localStorage.removeItem('rnum');
    localStorage.removeItem('vnum');
    localStorage.removeItem('privileges');
    localStorage.removeItem('companyid');
    //alertify.warning("Token expired please login");
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: 'You have signed out!',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-signout']
    };
    this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
  }
  approveSubmission() {
    // You can replace this with real logic
    console.log('Submission approved');
    this.snackBarServ.openSnackBarFromComponent({
      message: 'Submission Approved',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success']
    });
  }
  
  rejectSubmission() {
    // Replace this with actual rejection logic
    console.log('Submission rejected');
    this.snackBarServ.openSnackBarFromComponent({
      message: 'Submission Rejected',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-error']
    });
  }
  
}
