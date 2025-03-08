import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { OpenreqService } from '../../services/openreq.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmailBodyComponent } from './email-body/email-body.component';
import { DialogService } from 'src/app/services/dialog.service';
import { AddEmailExtractionComponent } from './add-email-extraction/add-email-extraction.component';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { Subject, takeUntil } from 'rxjs';
import { MatSortModule, Sort } from '@angular/material/sort';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatMenuModule } from '@angular/material/menu';
import { EmailsDeleteConfirmComponent } from 'src/app/dialogs/emails-delete-confirm/emails-delete-confirm.component';
import { UnBlockingEmailsComponent } from 'src/app/dialogs/un-blocking-emails/un-blocking-emails.component';

@Component({
  selector: 'app-email-extraction',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatMenuModule
  ],

  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
  templateUrl: './email-extraction.component.html',
  styleUrls: ['./email-extraction.component.scss']
})
export class EmailExtractionComponent implements OnInit {

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
  //  'stared',
    'select',
    'SerialNum',
    'To',
    'From',
    'CC',
    'Subject',
    'ReceivedDate',
    'Body',
    // 'Action'
  ];
  private destroyed$ = new Subject<void>();
  private service = inject(OpenreqService);
  // paginator
  pageIndex = 0;
  pageSize = 50; // items per page
  currentPageIndex = 0;
  pageSizeOptions = [50, 75, 100];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  itemsPerPage = 50;
  totalItems: number = 0;
  field = 'empty';
  payload: any;
  private router = inject(Router);
  userid!: any;
  showBlockMails=true;

  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  private snackBarServ = inject(SnackBarService);

  entity: any;
  private dialogServ = inject(DialogService);
  private dialog = inject(MatDialog);
  protected privilegeServ = inject(PrivilegesService);
  selection = new SelectionModel<any>(true, []);
  showDeleteButton = false;
  showBlockButton = false;
  role!: string | null;
  blockedEmails: any; // Initialize as an empty array
  blockedEmailss: any=[];

  ngOnInit(): void {
    this.userid = localStorage.getItem('userid');
    this.role = localStorage.getItem('role');
    this.getAll();
  }

  refresh() {
    this.getAll();
  }

  getAll(pagIdx = 1) {
    const pagObj = {
      pageNumber: pagIdx,
      pageSize: this.itemsPerPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      keyword: this.field,
    }
    this.service.emailEXtractionByPaginationSortandFilter(pagObj)
      .pipe(takeUntil(this.destroyed$)).subscribe(
        (response: any) => {
          this.entity = response.data.content;
          this.dataSource.data = response.data.content;
          this.totalItems = response.data.totalElements;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
            x = this.processEmailsForKeys(x, ['tomails', 'sender', 'ccmails']);
            return x;
          });
        }
      )
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isIndeterminate() {
    return this.selection.hasValue() && !this.isAllSelected();
  }

  selectAll(event: MatCheckboxChange): void {
    if (event.checked) {
      this.dataSource.data.forEach(row => this.selection.select(row));
    } else {
      this.selection.clear();
    }
    this.updateDeleteButtonVisibility();
  }


  toggleSelection(element: any) {
    this.selection.toggle(element);
    this.updateDeleteButtonVisibility();
  }

  updateDeleteButtonVisibility(): void {
    this.showDeleteButton = this.selection.selected.length > 0;
    this.showBlockButton = this.selection.selected.length === 1;
  }

  applyFilter(event: any) {
    const keyword = event.target.value;
    this.field = keyword;
    if (keyword != '') {
      const pagObj = {
        pageNumber: 1,
        pageSize: this.itemsPerPage,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        keyword: this.field,
      }
      return this.service.emailEXtractionByPaginationSortandFilter(pagObj).subscribe(
        ((response: any) => {
          this.entity = response.data.content;
          this.dataSource.data = response.data.content;
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
            x = this.processEmailsForKeys(x, ['tomails', 'sender', 'ccmails']);
            return x;
          });
          this.totalItems = response.data.totalElements;
        })
      );
    }
    if (keyword == '') {


    }
    return this.getAll(this.currentPageIndex + 1)
  }
  navigateBack() {
    this.router.navigate(['/usit/email-configuration']);
  }
  processEmailsForKeys(obj: any, keys: string[]) {
    keys.forEach(key => {
      if (obj[key]) {
        const emailArray = obj[key].split(',').map((email: any) => email.trim());
        const filteredEmails = emailArray.filter((email: any, index: any) => email !== '' || index !== emailArray.length - 1);

        obj[`${key}_displayedEmail`] = filteredEmails[0] || '';
        obj[`${key}_remainingEmails`] = filteredEmails.slice(1);
        obj[`${key}_remainingEmailsCount`] = filteredEmails.length > 1 ? filteredEmails.length - 1 : 0;
        obj[`${key}_showRemainingEmails`] = false;
      }
    });
    return obj;
  }


  toggleEmailList(element: any, key: string) {
    element[`${key}_showRemainingEmails`] = !element[`${key}_showRemainingEmails`];
  }


  sortField = 'ReceivedDate';
  sortOrder = 'desc';
  onSort(event: Sort) {
    if (event.active == 'SerialNum')
      this.sortField = 'updateddate'
    else
      this.sortField = event.active;
    this.sortOrder = event.direction;

    if (event.direction != '') {
      this.getAll();
    }
  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  handlePageEvent(event: PageEvent) {
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAll(event.pageIndex + 1);
    }
    return;
  }

  addEmail() {
    const actionData = {
      title: 'Extract Email',
      emailData: null,
      actionName: 'add-email',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-email';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddEmailExtractionComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.submitted) {
        this.getAll(this.currentPageIndex + 1);
      }
    })
  }

  goToReqInfo(element: any) {
    const actionData = {
      title: "Mail Body",
      data: element
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '62dvw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'req-info';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(EmailBodyComponent, dialogConfig);
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  delete(element: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: element,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = 'fit-content';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'delete-email';
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      EmailsDeleteConfirmComponent,
      dialogConfig
    );

    // call delete api after  clicked 'Yes' on dialog click
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

          this.service
            .deleteSender(element.id)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
              next: (response: any) => {
                if (response.status == 'success') {
                  this.getAll(this.currentPageIndex + 1);
                  dataToBeSentToSnackBar.message =
                    'Email Deleted successfully';
                } else {
                  dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                  dataToBeSentToSnackBar.message = response.message;
                }
                this.snackBarServ.openSnackBarFromComponent(
                  dataToBeSentToSnackBar
                );
              },
              error: (err: { message: string; }) => {
                dataToBeSentToSnackBar.message = err.message;
                dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                this.snackBarServ.openSnackBarFromComponent(
                  dataToBeSentToSnackBar
                );
              },
            });
        }
      },
    });
  }

  extractEmails() {
    const extractEmail = {
      userid: this.userid
    }
    return this.service.extractEmails(extractEmail).subscribe({
      next: (response: any) => {
        if (response.status === 'Success') {
          this.getAll();
          this.dataToBeSentToSnackBar.message = response.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
        } else if (response.status === 'Configure') {
          this.dataToBeSentToSnackBar.message = response.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
        } else if (response.status === 'failed') {
          this.dataToBeSentToSnackBar.message = 'Oops! It seems there are no new emails at the moment';
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
        } else if (response.status === 'Invalid-credentials') {
          this.dataToBeSentToSnackBar.message = response.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
        } else if (response.status === 'Invalid-Domain') {
          this.dataToBeSentToSnackBar.message = response.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
        } else {
          this.dataToBeSentToSnackBar.message = response.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataToBeSentToSnackBar
          );
        }
      },
      error: (err: any) => {
        this.dataToBeSentToSnackBar.message = err.message;
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(
          this.dataToBeSentToSnackBar
        );
      },
    });
  }
  blockEmail(): void{
    if (this.selection.selected.length === 1) {

      const dataToBeSentToDialog: Partial<IConfirmDialogData> = {
        title: 'Confirmation',
        message: 'Are you sure you want to block the selected email?',
        confirmText: 'Yes',
        cancelText: 'No',
      };

      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "400px";
      dialogConfig.height = "auto";
      dialogConfig.disableClose = false;
      dialogConfig.panelClass = "delete-confirmation";
      dialogConfig.data = dataToBeSentToDialog;
    
      const dialogRef = this.dialogServ.openDialogWithComponent(EmailsDeleteConfirmComponent, dialogConfig);

      const selectedEmail = this.selection.selected[0];  // Get the selected email
      this.payload = {
        userid : this.userid ,
        email: this.removeQuotes(selectedEmail.sender)
      };

      dialogRef.afterClosed().subscribe({
        next: () => {
          if (dialogRef.componentInstance.allowAction) {
            
            this.service.blockVendorMail(this.payload).subscribe({
              next: (response: any) => {
            if (response.status === 'Success') {
            this.selection.clear();
           this.showDeleteButton=false;
           this.showBlockButton=false;
            this.getAll();
            this.dataToBeSentToSnackBar.message = "Mail Blocked Successfully";
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
            this.snackBarServ.openSnackBarFromComponent(
              this.dataToBeSentToSnackBar
            );
          }
         else if (response.status === 'Saving failed') {
            this.selection.clear();
           this.showDeleteButton=false;
           this.showBlockButton=false;
            this.getAll();
            this.dataToBeSentToSnackBar.message = "Already This mail got blocked";
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(
              this.dataToBeSentToSnackBar
            );
          }
              },
              error: (error: any) => {
                this.dataToBeSentToSnackBar.message = error.message || 'Failed to block email';
                this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
              }
            });
          }
        },
        error: (err: any) => {
          console.error('Dialog closed with error:', err);
        }
      });

      //  this.service.blockVendorMail(this.payload).subscribe({
      //   next: (response: any) => {
      //     if (response.status === 'Success') {
      //       this.selection.clear();
      //      this.showDeleteButton=false;
      //      this.showBlockButton=false;
      //       this.getAll();
      //       this.dataToBeSentToSnackBar.message = "Mail Blocked Successfully";
      //       this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
      //       this.snackBarServ.openSnackBarFromComponent(
      //         this.dataToBeSentToSnackBar
      //       );
      //     } else if (response.status === 'Failed') {
      //       this.dataToBeSentToSnackBar.message = response.message;
      //       this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
      //       this.snackBarServ.openSnackBarFromComponent(
      //         this.dataToBeSentToSnackBar
      //       );
      //     } else {
      //       this.dataToBeSentToSnackBar.message = response.message;
      //       this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
      //       this.snackBarServ.openSnackBarFromComponent(
      //         this.dataToBeSentToSnackBar
      //       );
      //     }
      //   },
      //   error: (err: any) => {
      //     this.dataToBeSentToSnackBar.message = err.message;
      //     this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
      //     this.snackBarServ.openSnackBarFromComponent(
      //       this.dataToBeSentToSnackBar
      //     );
      //   },
      // });
    } else {
      // If no email or multiple emails are selected, you can show a message or do nothing
      alert('Please select exactly one email to block.');
    }
  }

  removeQuotes(str: string): string {
    if (str.startsWith('"') && str.endsWith('"')) {
      return str.slice(1, -1);
    }
    return str;
  }

  // bulkDelete(): void {
  //   const selectedEmails = this.selection.selected;
  //   const idsToDelete = selectedEmails.map(email => email.id);
  //   const delObj = {
  //     ids: idsToDelete
  //   }

  //   if (idsToDelete.length) {
  //     this.service.deleteEmails(delObj)
  //       .subscribe({
  //         next: (response: any) => {
  //           this.dataToBeSentToSnackBar.message = response.message;
  //           this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
  //           this.snackBarServ.openSnackBarFromComponent(
  //             this.dataToBeSentToSnackBar
  //           );
  //           this.getAll();
  //           this.selection.clear();
  //           this.updateDeleteButtonVisibility();
  //         },
  //         error: (error: any) => {
  //           this.dataToBeSentToSnackBar.message = error.message;
  //           this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
  //           this.snackBarServ.openSnackBarFromComponent(
  //             this.dataToBeSentToSnackBar
  //           );
  //         }
  //       });
  //   }
  // }
  bulkDelete(): void {
    const selectedEmails = this.selection.selected;
    const idsToDelete = selectedEmails.map(email => email.id);
  
    if (!idsToDelete.length) {
      return; // Exit if no items are selected
    }
  
    const dataToBeSentToDialog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete the selected emails?',
      confirmText: 'Yes',
      cancelText: 'No',
    };
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "delete-confirmation";
    dialogConfig.data = dataToBeSentToDialog;
  
    const dialogRef = this.dialogServ.openDialogWithComponent(EmailsDeleteConfirmComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe({
      next: () => {
        if (dialogRef.componentInstance.allowAction) {
          const delObj = { ids: idsToDelete };
          
          this.service.deleteEmails(delObj).subscribe({
            next: (response: any) => {
              this.dataToBeSentToSnackBar.message = response.message || 'Emails deleted successfully';
              this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
              this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
              
              this.getAll();
              this.selection.clear();
              this.updateDeleteButtonVisibility();
            },
            error: (error: any) => {
              this.dataToBeSentToSnackBar.message = error.message || 'Failed to delete emails';
              this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
              this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
            }
          });
        }
      },
      error: (err: any) => {
        console.error('Dialog closed with error:', err);
      }
    });
  }
  
  unblockEmail() {
    this.service.blockedEmailsList(this.userid).subscribe({
      next: (response: any) => {
  
        // Store the response data properly
        this.blockedEmails = response.data;
        const attachments = response.data;
        // Format & Alert the response in a readable way
  
        // alert(`Blocked Emails:\n${formattedResponse}`);

        // Configure the dialog with the fetched data
        const dialogConfig = {
          width: '600px',
          data: { attachments } // Pass the fetched attachments to the dialog
        };

        // Open the dialog with the attachments data
        this.dialog.open(UnBlockingEmailsComponent, dialogConfig);

      },
      error: (error: any) => {
      
      }
    });
  }

  unblockEmails(id:any) {

  const dataToBeSentToDialog: Partial<IConfirmDialogData> = {
    title: 'Confirmation',
    message: 'Are you sure you want to Un-block the selected email?',
    confirmText: 'Yes',
    cancelText: 'No',
  };

  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = "400px";
  dialogConfig.height = "auto";
  dialogConfig.disableClose = false;
  dialogConfig.panelClass = "delete-confirmation";
  dialogConfig.data = dataToBeSentToDialog;

  const dialogRef = this.dialogServ.openDialogWithComponent(EmailsDeleteConfirmComponent, dialogConfig);

  dialogRef.afterClosed().subscribe({
    next: () => {
      if (dialogRef.componentInstance.allowAction) {
        
        this.service.unblockingEmailWithId(id).subscribe({
          next: (response: any) => {
        if (response.status === 'Success') {
        this.selection.clear();
       this.showDeleteButton=false;
       this.showBlockButton=false;
        this.getAll();
        this.dataToBeSentToSnackBar.message = "Mail Un-Blocked Successfully";
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
        this.snackBarServ.openSnackBarFromComponent(
          this.dataToBeSentToSnackBar
        );
      }
          },
          error: (error: any) => {
            this.dataToBeSentToSnackBar.message = error.message || 'Failed to block email';
            this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
          }
        });
      }
    },
    error: (err: any) => {
      console.error('Dialog closed with error:', err);
    }
  });
  
  }
  

}