import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {
  private apiServ = inject(ApiService);
  private http = inject(HttpClient);

  constructor() { }

  uploadFile(formData:any, id: number) {
    return this.http.post(this.apiServ.apiUrl + `auth/users/uploadMultiple/${id}`, formData, {observe: "response"});
  }

  ConUploadFile(formData:any, id: number) {
    return this.http.post(this.apiServ.apiUrl + `consultant/uploadMultiple/${id}`, formData, {observe: "response"});
  }

  h1bUploadFile(formData:any, id: number) {
    return this.http.post(this.apiServ.apiUrl + `img/H1BApplicants/h1docs/${id}`, formData, {observe: "response"});
  }

  removefile(id: number, flg: string) {
    return this.apiServ.get(`auth/users/removefile/${id}/${flg}`);
  }

  conremovefile(id: number, flg: string) {
    return this.apiServ.get(`consultant/removefile/${id}/${flg}`);
  }

  h1bRemoveFile(id: number, flg: string) {
    return this.apiServ.get(`img/H1BApplicants/removefile/${id}/${flg}`);
  }

  removefiles(id: number) {
    return this.apiServ.get(`auth/users/removefiles/${id}`);
  }

  conremovefiles(id: number) {
    return this.apiServ.get(`consultant/removefiles/${id}`);
  }

  downloadresume(id: number, flg: string): Observable<Blob> {
    return this.http.get(`${this.apiServ.apiUrl}auth/users/download/${id}/${flg}`, {
      responseType: 'blob',
    });
  }

  downloadconresume(id: number, flg: string): Observable<Blob> {
    return this.http.get(`${this.apiServ.apiUrl}consultant/download/${id}/${flg}`, {
      responseType: 'blob',
    });
  }

  downloadH1bFile(id: number, flg: string): Observable<Blob> {
    return this.http.get(`${this.apiServ.apiUrl}img/H1BApplicants/download/${id}/${flg}`, {
      responseType: 'blob',
    });
  }

  downloadfile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiServ.apiUrl}auth/users/downloadfiles/${id}`, {
      responseType: 'blob',
    });
  }
  downloadConsultantfile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiServ.apiUrl}consultant/downloadfiles/${id}`, {
      responseType: 'blob',
    });
  }
}
