import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class OpenreqService {

  constructor(private http: ApiService) { }

  public openReqsEmpTagging(reqid: number, empid: number) {
    return this.http.get("openreqs/dice/empTagging/" + reqid + "/" + empid);
  }

  public getopenReqWithPagination(pageNo: any, pageSize: any, field: any) {
    return this.http.get("openreqs/dice/allreqs/" + pageNo + "/" + pageSize + "/" + field);
  }

  public linkedinProfiles() {
    return this.http.get("openreqs/linked/all");
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

}
