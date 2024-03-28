import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class OpenreqService {

  constructor(private http: ApiService, private http2: HttpClient) { }

  // readonly apiUrl = 'http://69.216.19.140:1122/';
  //API_BASE_URL = "http://69.216.19.140:8080/extract/"
  readmail(entity: any) {
    //return this.http.post(this.API_BASE_URL + "mail/extractEmail", entity);
     return this.http.post("mail/extractEmail", entity);
  }

  fetch( page: any, size: any,searchQuery:string) {
    return this.http.get("mail/read/"+page + "/" + size+"/"+searchQuery);
  }

  public openReqsEmpTagging(reqid: number, empid: number) {
    return this.http.get("openreqs/dice/empTagging/" + reqid + "/" + empid);
  }

  public getopenReqWithPaginationAndSource(pageNo: any, pageSize: any, field: any, source: any) {
    return this.http.get("openreqs/dice/allreqs/" + pageNo + "/" + pageSize + "/" + field + "/" + source);
  }

  public linkedinProfiles() {
    return this.http.get("openreqs/linked/all");
  }

  public linkedInPagination(pageNo: any, pageSize: any, field: any) {
    return this.http.get("openreqs/linked/LinkedInPofiles/" + pageNo + "/" + pageSize + "/" + field );
  }

  public readrss() {
    return this.http.get("openreqs/rssfeed/read");
  }

  public rssfeedData() {
    return this.http.get("openreqs/rssfeed/getalldata");
  }

  lockProfiles(id:number, userid:number) {
    return this.http.get("openreqs/linked/lock/"+id+"/"+userid);
  }
  public updateSourcingLead(entity:any) {
    return this.http.post("openreqs/linked/update",entity);
  }

  getLeadById(id:number) {
    return this.http.get("openreqs/linked/getById/"+id);
  }
}
