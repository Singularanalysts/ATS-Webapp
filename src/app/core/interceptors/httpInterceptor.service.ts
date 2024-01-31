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
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private authService: PermissionsService,
    private loaderServ: LoaderService,
    private router : Router
  ) //private ngxService: NgxUiLoaderService
  {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderServ.showLoader()
    if (this.authService.getToken() && this.authService.isUserSignedin()  ) {
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
          // this.ngxService.stop();
          // const errorMessage = this.handleServerSideError(error);
          this.handleServerSideError(error);
          console.log("error-message", error)
          return throwError(() => error );
        })
     );
    }
    return next.handle(req);
  }

  handleServerSideError(error: HttpErrorResponse) {

   /* if (error instanceof TimeoutError) {
      // return alertify.error("TimeoutError");//  this.openDialog('error', `Няма връзка до сървъра.`);
    }

    if (
      error instanceof HttpErrorResponse &&
      error.error &&
      error.error.message
    ) {
      // return alertify.error(error.error.message);//this.openDialog('error', error.error.message);
    }

    if (error instanceof Error) {
      switch (error.message) {
        default:
        //  return alertify.error("An unknown error occurred");//this.openDialog('error', `An unknown error occurred`);
      }
    }
    // Generic HTTP errors
    switch (error.status) {
      case 400:
        switch (error.error) {
          case 'invalid_username_or_password':
            this.authService.signout();
          // return alertify.error("Invalid Credentials");//this.openDialog('error', 'Невалидно потребителско име или парола');
          default:
          //return alertify.error("Bad request");//this.openDialog('error', 'Bad request');
        }

      case 401:
        this.authService.signout();
      //return alertify.error("Authentication Error");///this.openDialog('error', 'Ще трябва да се логнете отново');

      case 403:
        this.authService.signout();
      // return alertify.error("You don't have the required permissions");///this.openDialog('error', `You don't have the required permissions`);

      case 404:
      // return alertify.error("Resource not found");//this.openDialog('error', 'Resource not found');

      case 422:
       // return alertify.error('Invalid data provided'); //this.openDialog('error', 'Invalid data provided');

      case 500:
      case 501:
      case 502:
      case 503:
      //return alertify.error("An internal server error occurred");//this.openDialog('error', 'An internal server error occurred');

      case -1:
      //return alertify.error("You appear to be offline. Please check your internet connection and try again.");//this.openDialog('error', 'You appear to be offline. Please check your internet connection and try again.' );

      case 0:
      //return alertify.error("CORS issue?");// this.openDialog('error', `CORS issue?`);

      default:
      //return alertify.error("An unknown error occurred");//this.openDialog('error', `An unknown error occurred`);
    }
    */
    switch (error.status) {
      case 400: {
        return `${HttpErrors[400]}: put your message here`;
      }
      case 401: {
        return `${HttpErrors[401]}: put your message here`;
      }
      case 403: {
        return `${HttpErrors[403]}: put your message here`;
      }
      case 404: {
        return `${HttpErrors[404]}: put your message here`;
      }
      case 500: {
        return `${HttpErrors[500]}: put your message here`;
      }
      case 503: {
        this.clearLocalStorageItemsOnLogOut();
        // navigate to login
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
