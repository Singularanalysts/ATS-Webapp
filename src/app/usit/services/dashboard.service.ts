import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiServ = inject(ApiService);

  public vmstransactions() {
    return this.apiServ.get("dashboard/dailyvmsTrack");
  }

  public getUserTrack(id:number) {
    return this.apiServ.get("dashboard/getUserTrack/"+id);
  }

  public getsubmissionCount(flag:string) {
    return this.apiServ.get("dashboard/submissionscount/"+flag);
  }

  public getInterviewCount(flag:string) {
    return this.apiServ.get("dashboard/interviewscount/"+flag);
  }

  public getClosureCount(flag:string) {
    return this.apiServ.get("dashboard/closurecount/"+flag);
  }

  public getDiceRequirements() {
    return this.apiServ.get("dashboard/reqempTags");
  }

  public getSourcingLeads(id: any) {
    return this.apiServ.get("dashboard/all/"+ id);
  }

  // for executive and lead
  public getClosureCountForExAndLead(flag:string,userid:number) {
    return this.apiServ.get("dashboard/closurecount/"+flag+"/"+userid);
  }

  public getsubmissionCountForExAndLead(flag:string,userid:number) {
    return this.apiServ.get("dashboard/submissionscount/"+flag+"/"+userid);
  }

  public getInterviewCountForExAndLead(flag:string,userid:number) {
    return this.apiServ.get("dashboard/interviewscount/"+flag+"/"+userid);
  }

}
