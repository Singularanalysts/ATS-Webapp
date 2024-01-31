import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, retry } from 'rxjs/operators';
import { HandledError } from 'src/app/services/error-wrappers/handled-error';
import { UnHandledError } from 'src/app/services/error-wrappers/unhandled-error';
import { Observable, TimeoutError, of } from 'rxjs';
import { HttpErrors } from '../models/http-errors';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // private readonly apiUrl = 'http://69.216.19.140:8080/usit/';
  //  readonly apiUrl = 'http://localhost:1122/';
 readonly apiUrl = 'http://23.81.209.229:1122/';
  constructor(private http: HttpClient) {}
 
  get(url: string) {
    return this.http.get(this.apiUrl + url).pipe(
      map((x) => x),

      catchError(x=> of({message: this.handleHttpError(x)}))
    );
  }

  post(url: string, data: any) {
    return this.http.post(this.apiUrl + url, data).pipe(
      map((x) => x),

      catchError(x=> of({message: this.handleHttpError(x)}))
    );
  }
  put(url: string, data: any) {
    return this.http.put(this.apiUrl + url, data).pipe(
      map((x) => x),
      retry(1),
      catchError(x=> of({message: this.handleHttpError(x)}))
    );
  }

  patch(url: string, data: any) {
    return this.http.patch(this.apiUrl + url, data).pipe(
      map((x) => x),
      retry(1),
      catchError(x=> of({message: this.handleHttpError(x)}))
    );
  }

  delete(url: string, data?: any) {
    return this.http.delete(this.apiUrl + url).pipe(
      map((x) => x),
      catchError(x=> of({message: this.handleHttpError(x)}))
    );
  }

  private responseHandler(x: any) {
    if (x.hasOwnProperty('didError') && !x['didError']) {
      return x['model'];
    } else {
      this.errorHandler(x);
    }
  }

  private errorHandler(x: any) {
    if (x.hasOwnProperty('message') && !x['errorMessage']) {
      throw new HandledError(x['errorMessage']);
    } else {
      throw new UnHandledError('unhandled error');
    }
  }

  getJson(path: string): Observable<any> {
    return this.http.get(path);
  }

  // uploadFile(url : string, formData : any){
  //   return this.http.post(this.apiUrl + url, formData, {observe: "response"}).pipe(
  //     map((x) => x),

  //     catchError(x=> of({message: this.handleHttpError(x)}))
  //   );
  // }
  
  // get data from ready-made api endpoints
  getFakeAPI(url: string): Observable<unknown> {
    return this.http.get(url);
  }
  // handle errors
  handleHttpError(error: HttpErrorResponse) {
    if (error instanceof TimeoutError) {
      return  'TimeoutError';
    }
    switch (error.status) {
      case 400: {
        if (error.error === 'invalid_username_or_password') {
          return `${HttpErrors[400]}: Invalid Credentials`;
        }
        return `${HttpErrors[400]}: Please re-check the api endpoint`;
      }
      case 401: {
        return `Authentication Error`;
      }
      case 403: {
        return `You don't have the required permissions`;
      }
      case 404: {
        return `Resource not found`;
      }
      case 422: {
        return ` Invalid data provided`
      }
      case 500:
      case 501:
      case 502:
      case 503: {
        return `An internal server error occurred`;
      }
      case -1: {
        return `You appear to be offline. Please check your internet connection and try again`
      }
      case 0: {
        return `CORS Error, Check the endpoints and domain`;
      }
      default: {
        return `An unknown error occurred`;
      }
    }
  }
}
