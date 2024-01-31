import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateChildGuard implements CanActivate, CanActivateChild {
  private permServ = inject(PermissionsService);
  private router = inject(Router);
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.permServ.isUserSignedin();
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.permServ.isAdmin('Admin').pipe(
      map(isAdmin => isAdmin)

    );



  }

}
