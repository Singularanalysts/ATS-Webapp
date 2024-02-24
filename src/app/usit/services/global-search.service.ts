import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {

  constructor(private apiServ: ApiService) { }


  getJobpostionAndCompany(jobPosition: String, company: String, location:String, pageNo: number, pagesize:number){
    return this.apiServ.get(`openreqs/dice/getby/${jobPosition}/${company}/${location}/${pageNo}/${pagesize}`);
  }
}
