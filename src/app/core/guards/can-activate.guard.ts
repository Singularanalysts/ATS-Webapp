import { Injectable,inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {
  private permServ = inject(PermissionsService);
  private router = inject(Router);
  private isLoggedIn = false;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return this.permServ.isLoggedIn().pipe(
    //   map(isLoggedIn => isLoggedIn || this.router.createUrlTree(['']))
    // );

    return this.permServ.isUserSignedin();

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
