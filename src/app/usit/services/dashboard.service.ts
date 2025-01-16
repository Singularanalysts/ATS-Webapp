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

  public getUserTrack(id: number) {
    return this.apiServ.get("dashboard/getUserTrack/" + id);
  }

  public getsubmissionCount(flag: string) {
    return this.apiServ.get("dashboard/submissionscount/" + flag);
  }

  public getInterviewCount(flag: string) {
    return this.apiServ.get("dashboard/interviewscount/" + flag);
  }

  public getClosureCount(flag: string) {
    return this.apiServ.get("dashboard/closurecount/" + flag);
  }

  public getDiceRequirements(role: string) {
    // return this.apiServ.get("dashboard/getTaggedcounts/empty/empty/0");
    // return this.apiServ.get("requirement/postedInLastDays");
    if (role === 'Team Leader Sales' || role == 'Sales Manager' || role == 'Super Administrator') {
      return this.apiServ.get("dashboard/getTaggedcounts/empty/empty/0");
    } else if (role === 'Recruiter' || role === 'Team Leader Recruiting' || role === 'Recruiting Manager') {
      return this.apiServ.get("requirement/postedInLastDays");
    } else {
      // Handle other roles or return a default value
      return this.apiServ.get("dashboard/getTaggedcounts/empty/empty/0"); // Default case
    }
   }

   public getDiceRequirementss() {
 return this.apiServ.get("dashboard/getTaggedcounts/empty/empty/0");
   }

    public getEmployeeName() {
     return this.apiServ.get("dashboard/getBanchSalesEmps");
    }

  public getSourcingLeads(id: any) {
    return this.apiServ.get("dashboard/all/" + id);
  }

  // for executive and lead
  public getClosureCountForExAndLead(flag: string, userid: number) {
    return this.apiServ.get("dashboard/closurecount/" + flag + "/" + userid);
  }

  public getsubmissionCountForExAndLead(flag: string, userid: number) {
    return this.apiServ.get("dashboard/submissionscount/" + flag + "/" + userid);
  }

  public getInterviewCountForExAndLead(flag: string, userid: number) {
    return this.apiServ.get("dashboard/interviewscount/" + flag + "/" + userid);
  }

  // for count pop ups
  public getClosureCountPopup(flag: string, duration: string) {
    return this.apiServ.get("dashboard/closurespopUp/" + flag + "/" + duration);
  }

  public getsubmissionCountPopup(flag: string, duration: string) {
    return this.apiServ.get("dashboard/subpopups/" + flag + "/" + duration);
  }



  public getInterviewCountPopup(flag: string, duration: string) {
    return this.apiServ.get("dashboard/interviewpopUp/" + flag + "/" + duration);
  }

  public getsubmissionCountPopupemp(flag: string, duration: string, userid:any) {
    return this.apiServ.get("dashboard/subpopups/" + flag + "/" + duration+"/"+userid);
  }

  public getInterviewCountPopupEmp(flag: string, duration: string, userid:any) {
    return this.apiServ.get("dashboard/interviewpopUp/" + flag + "/" + duration+"/"+userid);
  }

  public getClosureCountPopupEmp(flag: string, duration: string, userid:any) {
    return this.apiServ.get("dashboard/closurespopUp/" + flag + "/" + duration+"/"+userid);
  }

  public getsourcingCount(flag: string) {
    return this.apiServ.get("dashboard/sourcingCount/" + flag);
  }

  public getSourcingCountPopup(flag: string, duration: string) {
    return this.apiServ.get("dashboard/sourcingCountPopup/" + flag + "/" + duration);
  }

  public getReqCounts(search: string,flag: string, type: string, date: any) {
    return this.apiServ.get("dashboard/reqCounts/" + search + "/" +flag + "/" + type + "/" + date);
  }
  
  getFilteredEmployee(startDate:any ,endDate:any ,id:any){
    return this.apiServ.get("dashboard/getTaggedcounts/"+startDate+"/"+endDate+"/"+id)
  }

  getVendorAndCategoryAnalysisCountByDate(date: any, type: any) {
    return this.apiServ.get("dashboard/reqCountsWithDate/" + date + "/" + type);
  }

  getEmployeeDashboardCount(data: any) {
    return this.apiServ.post("dashboard/employeeDashboardCounts", data);
  }
  
  getEmployeeDashboardApPopup(data: any) {
    return this.apiServ.post("dashboard/empAppliedJobPopUp", data);
  }

  getEmployeeDashboardSubmissionPopup(data: any) {
    return this.apiServ.post("dashboard/empSubPopups", data);
  }

  getEmployeeDashboardInterviewPopup(data: any) {
    return this.apiServ.post("dashboard/empInterviewPopUp", data);
  }

  getEmployeeDashboardRecentActivity(empid: any) {
    return this.apiServ.get(`dashboard/getEmpRecentActivity/${empid}`);
  }
}
