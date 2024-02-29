import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, retry } from 'rxjs/operators';
//import { NgxUiLoaderService } from "ngx-ui-loader";
//import * as alertify from 'alertifyjs';
import { TimeoutError } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions.service';
import { HttpErrors } from '../models/http-errors';
import { LoaderService } from 'src/app/services/loader.service';
import { Router } from '@angular/router';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private authService: PermissionsService,
    private loaderServ: LoaderService,
    private router: Router,
    private snackBarServ: SnackBarService
  ) //private ngxService: NgxUiLoaderService
  { }

  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    this.loaderServ.showLoader()
  
    if (this.authService.getToken() && this.authService.isUserSignedin()) {
      const request = req.clone({
        headers: new HttpHeaders({
          //   'content-type': 'application/json; charset=utf-8',
          Authorization: this.authService.getToken(),
        }),
      });
      return next.handle(request).pipe(
        retry(1),
        finalize(() => {
          this.loaderServ.hideLoader();
        }),
        catchError((error: HttpErrorResponse) => {
          this.handleServerSideError(error);
         // console.log("error-message", error)
          return throwError(() => error);
        })
      );
    }
    else if ((this.router.url === '/' || this.router.url === '/logout')) {
      //  this.router.navigate(['/']);
    }
    else {
      // alert(this.router.url)
      // alertify.error("Token Expired");
      this.router.navigate(['/']);
    }
    return next.handle(req);
  }

  handleServerSideError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400: {
        return `${HttpErrors[400]}: put your message here`;
      }
      case 401: {
        this.clearLocalStorageItemsOnLogOut();
        this.dataTobeSentToSnackBarService.message = "Token Expired Please Login"
        this.dataTobeSentToSnackBarService.panelClass = [
          'custom-snack-failure',
        ];
        this.snackBarServ.openSnackBarFromComponent(
          this.dataTobeSentToSnackBarService
        );
        return `${HttpErrors[401]}: put your message here`;
      }
      case 403: {
        return `${HttpErrors[403]}: In Active User`;
      }
      case 404: {
        return `${HttpErrors[404]}: put your message here`;
      }
      case 500: {
        return `${HttpErrors[500]}: put your message here`;
      }
      case 503: {
        //this.clearLocalStorageItemsOnLogOut();
        // navigate to login
        this.dataTobeSentToSnackBarService.message = "Service Not Available"
        this.dataTobeSentToSnackBarService.panelClass = [
          'custom-snack-failure',
        ];
        this.snackBarServ.openSnackBarFromComponent(
          this.dataTobeSentToSnackBarService
        );
        return `${HttpErrors[500]}: Service Not Available`;
      }
      default: {
        return `Please Try Again Later`;
      }
    }
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
    this.router.navigate(['/']);
    //alertify.warning("Token expired please login");
  }
}
