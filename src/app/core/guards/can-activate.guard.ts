import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {
  private permServ = inject(PermissionsService);
  private router = inject(Router);
  private isLoggedIn = false;
  dept !: any;
  role !: any;
  private snackBarServ = inject(SnackBarService);
  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return this.permServ.isLoggedIn().pipe(
    //   map(isLoggedIn => isLoggedIn || this.router.createUrlTree(['']))
    // );
    this.dept = localStorage.getItem('department');
    this.role = localStorage.getItem('role');
    if (this.dept == 'Accounts' || this.role == 'Super Administrator'){
      return true;
    }
    else{
      this.dataTobeSentToSnackBarService.message = "You are not Authorized to access this Path";
      this.dataTobeSentToSnackBarService.panelClass = [
        'custom-snack-failure',
      ];
      this.snackBarServ.openSnackBarFromComponent(
        this.dataTobeSentToSnackBarService
      );
      return false;
    }
     
    //this.permServ.isUserSignedin();

  }


  private isUserLoggedIn() {
    this.permServ.isLoggedIn().subscribe(
      (resp: boolean) => {
        this.isLoggedIn = resp;
      }
    );
    console.log('in- can activate guard,', this.isLoggedIn)
    return this.isLoggedIn;
  }
}
