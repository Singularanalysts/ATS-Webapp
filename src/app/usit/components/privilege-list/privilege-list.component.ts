import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { ManagePrivilegeComponent } from './manage-privilege/manage-privilege.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-privilege-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './privilege-list.component.html',
  styleUrls: ['./privilege-list.component.scss'],
})
export class PrivilegeListComponent implements OnInit, OnDestroy {
  // variables
  keysObj = Object;
  id!: number;
  RoleName!: string;
  entity = new Privilege();
  role: any[] = [];
  type: string[] = [];
  name!: string;
  vendor: any[] = [];
  recruiter: any[] = [];
  tech_support: any[] = [];
  consultant: any[] = [];
  visa: any[] = [];
  configuration: any[] = [];
  taskmanagement: any[] = [];
  //taskmanagement
  qualification: any[] = [];
  kpt: any[] = [];
  requirement: any[] = [];
  technology_tags: any[] = [];
  immigration: any[] = [];
  users: any[] = [];
  submission: any[] = [];
  interview: any[] = [];
  privilegResp: any[] = [];
  company: any[] = [];
   // snackbar
   dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
 // services
 private snackBarServ = inject(SnackBarService);
  private activatedRoute = inject(ActivatedRoute);
  private privilegServ = inject(PrivilegesService);
  private router = inject(Router);
  private dialogServ = inject(DialogService);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.entity.roleId = +this.id;
    this.getAll();
  }

  /**
   * fetch privileges
   */
  getAll() {
    this.privilegServ
      .getAllPrivileges()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        this.vendor = response.data.vendor;
        // console.log(JSON.stringify(this.vendor))
        this.recruiter = response.data.recruiter;
        this.tech_support = response.data.tech_support;
        this.consultant = response.data.consultant;
        this.visa = response.data.visa;
        this.configuration = response.data.configuration;
        this.qualification = response.data.qualification;
        //taskmanagement
        this.requirement =  response.data.requirement;
        this.kpt =  response.data.kpt;
        this.role =  response.data.role;
        this.company =  response.data.company;
       // console.log(this.company)
        this.taskmanagement = response.data.taskmanagement;
        this.technology_tags = response.data.technology_tag;
        this.immigration = response.data.immigration;
        this.users = response.data.user;
        this.submission = response.data.submission;
        //console.log(this.submission)
        this.interview = response.data.interview;
        this.selecedPrivileges();
        this.mapResponseData();
      });
  }

  private mapResponseData() {
    this.privilegResp.push(
      {
        title: 'User',
        privileges: this.users,
        isSelected: this.users
          ? this.users.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Role',
        privileges: this.role,
        isSelected: this.role
          ? this.role.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Vendor',
        privileges: this.vendor,
        isSelected: this.vendor
          ? this.vendor.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Recruiter',
        privileges: this.recruiter,
        isSelected: this.recruiter
          ? this.recruiter.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Technology Tags',
        privileges: this.technology_tags,
        isSelected: this.technology_tags
          ? this.technology_tags.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Tech & Support',
        privileges: this.tech_support,
        isSelected: this.tech_support
          ? this.tech_support.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Immigration',
        privileges: this.immigration,
        isSelected: this.immigration
          ? this.immigration.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Company',
        privileges: this.company,
        isSelected: this.company
          ? this.company.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Consultant',
        privileges: this.consultant,
        isSelected: this.consultant
          ? this.consultant.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Submission',
        privileges: this.submission,
        isSelected: this.submission
          ? this.submission.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Interview',
        privileges: this.interview,
        isSelected: this.interview
          ? this.interview.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Visa',
        privileges: this.visa,
        isSelected: this.visa
          ? this.visa.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Qualificaton',
        privileges: this.qualification,
        isSelected: this.qualification
          ? this.qualification.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Requirement',
        privileges: this.requirement,
        isSelected: this.requirement
          ? this.requirement.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'KPT',
        privileges: this.kpt,
        isSelected: this.kpt
          ? this.kpt.every((priv: any) => priv.selected === true)
          : false,
      },
      //requirement
      {
        title: 'Task Management',
        privileges: this.taskmanagement,
        isSelected: this.taskmanagement
          ? this.taskmanagement.every((priv: any) => priv.selected === true)
          : false,
      }

      //taskmanagement
    );
  }

  /**
   * fetch privileges by id
   */
  selecedPrivileges() {
    this.privilegServ
      .getPrivilegesById(+this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        if (this.recruiter != null) {
          this.recruiter.forEach((ele) => {
            response.data.recruiter.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }
        if (this.users != null) {
          this.users.forEach((userele) => {
            response.data.user.forEach((userresp: any) => {
              if (userele.id === userresp.id) {
                this.entity.privilegeIds.push(userresp.id);
                userele.selected = true;
              }
            });
          });
        }

        if (this.role != null) {
          this.role.forEach((role) => {
            response.data.role.forEach((userresp: any) => {
              if (role.id === userresp.id) {
                this.entity.privilegeIds.push(userresp.id);
                role.selected = true;
              }
            });
          });
        }

        if (this.vendor != null) {
          this.vendor.forEach((ele) => {
            response.data.vendor.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }

        if (this.technology_tags != null) {
          this.technology_tags.forEach((ele) => {
            response.data.technology_tag.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }

        if (this.tech_support != null) {
          this.tech_support.forEach((ele) => {
            response.data.tech_support.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }
        if (this.immigration != null) {
          this.immigration.forEach((ele) => {
            response.data.immigration.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }

        if (this.consultant != null) {
          this.consultant.forEach((ele) => {
            response.data.consultant.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }

        if (this.interview != null) {
          this.interview.forEach((ele) => {
            response.data.interview.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }

        if (this.visa != null) {
          this.visa.forEach((ele) => {
            response.data.visa.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }

        if (this.submission != null) {
          this.submission.forEach((ele) => {
            response.data.submission.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }

      
//requirement
        if (this.qualification != null) {
          this.qualification.forEach((ele) => {
            response.data.qualification.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }
        if (this.taskmanagement != null) {
          this.taskmanagement.forEach((ele) => {
            response.data.taskmanagement.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }
        //taskmanagement
       
        if (this.interview != null) {
          this.interview.forEach((ele) => {
            response.data.interview.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }
        if (this.visa != null) {
          this.visa.forEach((ele) => {
            response.data.visa.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }
        if (this.requirement != null) {
          this.requirement.forEach((ele) => {
            response.data.requirement.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }

        if (this.kpt != null) {
          this.kpt.forEach((ele) => {
            response.data.kpt.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }
        //requirement
        if (this.qualification != null) {
          this.qualification.forEach((ele) => {
            response.data.qualification.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }

        if (this.company != null) {
          this.company.forEach((ele) => {
            response.data.company.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
              }
            });
          });
        }
      });
  }

  /**
   * To provide / revoke all the accesses
   * @param card
   * @param event
   */
  selectAllAccess(card: any, event: MatCheckboxChange) {
    card.privileges?.forEach((ele: any) => {
      if (event.checked) {
        ele.selected = true;
        this.entity.privilegeIds.push(ele.id);
        card.isSelected = true;
      } else {
        ele.selected = false;
        card.isSelected = false;
        this.entity.privilegeIds.forEach((id, index) => {
          if (ele.id === id) {
            this.entity.privilegeIds?.splice(index, 1);
          }
        });
      }
      this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)]
    });
  }

  /**
   * manage side nav-item's visibility
   */
  private getSideNavData() {
    // this.apiServ.getJson('assets/side-navbar-items.json').subscribe({
    //   next: (data: any[]) => {
    //     this.menuList = data;
    //     let indexOfSideNavItem: number = 0;
    //     if(!this.permissionServ.hasPrivilege('LIST_EMPLOYEE')){
    //       indexOfSideNavItem = data.indexOf((item:any) => item.text === "Employees")
    //     }
    //     else if(!this.permissionServ.hasPrivilege('LIST_ROLES')){
    //       indexOfSideNavItem = data.indexOf((item:any) => item.text.includes("Roles"));
    //     }

    //     if(indexOfSideNavItem >=0){
    //        this.menuList.splice(indexOfSideNavItem, 1)
    //     }
    //   },
    // });
  }

  /**
   * form privilge ids based on selected type
   * @param data
   * @param event
   */
  commonFunction(data: any, event: any) {
    data.forEach((ele: any) => {
      if (event.target.checked) {
        this.entity.privilegeIds.push(ele.id);
        data.isSelected = true;
      } else {
        data.isSelected = false;
        this.entity.privilegeIds.forEach((id, index) => {
          if (data.id === id) {
            this.entity.privilegeIds.splice(index, 1);
          }
        });
      }
    });
  }

  /**
   * checkbox event
   * @param event
   */
  selectInidividualAccess(
    event: MatCheckboxChange,
    privileges: any,
    privId: number,
    cardId: number
  ) {
    if (event.checked) {
      privileges[privId].selected = event.checked;
      this.entity.privilegeIds.push(privileges[privId].id);
      this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)]
    } else {
      this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)]
      privileges[privId].selected = event.checked;
      const uncheckedPrivId = privileges[privId].id;
      const uncheckedPrivIdIndex = this.entity.privilegeIds.indexOf(uncheckedPrivId)
      if (uncheckedPrivIdIndex >= 0) {
        this.entity.privilegeIds.splice(uncheckedPrivIdIndex, 1);
      }
    }
    this.privilegResp[cardId].isSelected = privileges.every(
      (priv: any) => priv.selected === true
    );
  }

  /**
   * Add privilege
   */

   // add
   addPrivilege(){
    const actionData = {
      title: 'Add Privilege',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionName: 'add-privilege'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "480px";
    dialogConfig.height = "300px";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "add-privilege";
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(ManagePrivilegeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(resp =>{
      if(dialogRef.componentInstance.submitted){
        this.getAll()
      }
    })
  }

  /**
   * save
   */
  savePrivileges() {
    console.log("Save Privileges Object", this.entity)
    this.privilegServ.addPrevilegeToRole(this.entity).pipe(takeUntil(this.destroyed$)).subscribe(
      (result) => {
        this.dataToBeSentToSnackBar.message =  'Previleges added successfully!';
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        this.router.navigate(['/usit/roles']);

      }, (error: any) => {
        if (error.status == 401) {
        this.dataToBeSentToSnackBar.message =  'Previleges addition is failed!';
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
        else {
          this.dataToBeSentToSnackBar.message =  'Previleges addition is failed!';
          this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
        }
      });
  }

  onCancel() {
    this.router.navigate(['/usit/roles']);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(undefined);
    this.destroyed$.complete();
  }
}

export class Privilege {
  roleId!: number;
  privilegeIds: any[] = [];
}
