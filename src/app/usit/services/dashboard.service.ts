import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiServ = inject(ApiService);

  public vmstransactions(companyId: any) {
    return this.apiServ.get("dashboard/dailyvmsTrack/"+companyId);
  }

  public getUserTrack(id: number) {
    return this.apiServ.get("dashboard/getUserTrack/" + id);
  }

  public getsubmissionCount(flag: string, company: any) {
    return this.apiServ.get("dashboard/submissionscount/" + flag +"/"+company);
  }

  public getInterviewCount(flag: string, companyId: any) {
    return this.apiServ.get("dashboard/interviewscount/" + flag +"/" +companyId);
  }

  public getClosureCount(flag: string, companyId: any) {
    return this.apiServ.get("dashboard/closurecount/" + flag +"/"+companyId);
  }

  // public getDiceRequirements(role: any, empid:any) {
  //   const requestData = { empid: empid }; // Sending empid in POST request
  //   // return this.apiServ.get("dashboard/getTaggedcounts/empty/empty/0");
  //   // return this.apiServ.get("requirement/postedInLastDays");
  //   if (role === 'Team Leader Sales' || role == 'Sales Manager' || role == 'Super Administrator') {
  //     return this.apiServ.post("dashboard/getTaggedcounts/empty/empty/0", requestData);
  //   } else if (role === 'Recruiter' || role === 'Team Leader Recruiting' || role === 'Recruiting Manager') {
  //     return this.apiServ.get("requirement/postedInLastDays");
  //   }else if (role === 'Sales Executive') {
  //     return this.apiServ.get("consultant/assignedDashboardConsultantsDataById/" +empid);
  //   } 
  //   else {
  //     // Handle other roles or return a default value
  //     return this.apiServ.get("dashboard/getTaggedcounts/empty/empty/0"); // Default case
  //   }
  //  }
  public getDiceRequirements(payload: { role: any; userId: any; pageNumber: any; pageSize: any }, companyId: any) {
    if (payload.role === 'Team Leader Sales' || payload.role == 'Sales Manager' || payload.role == 'Super Administrator') {
      return this.apiServ.post(`dashboard/getTaggedcounts/${companyId}`, payload);
    } else if (payload.role === 'Recruiter' || payload.role === 'Team Leader Recruiting' || payload.role === 'Recruiting Manager') {
      return this.apiServ.get("requirement/postedInLastDays");
    } else if (payload.role === 'Sales Executive') {
      return this.apiServ.get("consultant/assignedDashboardConsultantsDataById/" + payload.userId);
    } else {
      return this.apiServ.get("dashboard/getTaggedcounts/empty/empty/0"); // Default case
    }
  }
  
   public getDiceRequirementslax(role: any, actData : any) {
    
    if (role === 'Team Leader Sales' || role == 'Sales Manager' || role === 'Sales Executive') {
      return this.apiServ.post("openreqs/dice/allEmpContractAllReqs",  actData);
    }
  return null
   }

//    public getDiceRequirementss() {
//  return this.apiServ.get("dashboard/getTaggedcounts");
//    }

    public getEmployeeName() {
     return this.apiServ.get("dashboard/getBanchSalesEmps");
    }

  public getSourcingLeads(data: any, comapnyId:any) {
    return this.apiServ.post(`dashboard/all/${comapnyId}` , data);
  }

  // for executive and lead
  public getClosureCountForExAndLead(flag: string, userid: number) {
    return this.apiServ.get("dashboard/closurecountboardreport/" + flag + "/" + userid);
  }

  public getsubmissionCountForExAndLead(flag: string, userid: number) {
    return this.apiServ.get("dashboard/submissionsdashboardreport/" + flag + "/" + userid);
  }

  public getInterviewCountForExAndLead(flag: string, userid: number) {
    return this.apiServ.get("dashboard/interviewscountboardreport/" + flag + "/" + userid);
  }

  // for count pop ups
  public getClosureCountPopup(flag: string, duration: string,companyId:any) {
    return this.apiServ.get("dashboard/dashboardclosurespopUp/" + flag + "/" + duration + "/" + companyId);
  }

  public getsubmissionCountPopup(flag: string, duration: string,companyId: any) {
    return this.apiServ.get("dashboard/dashboardsubpopups/" + flag + "/" + duration+"/" + companyId);
  }



  public getInterviewCountPopup(flag: string, duration: string,companyId:any) {
    return this.apiServ.get("dashboard/dashboardinterviewpopUp/" + flag + "/" + duration+"/" + companyId);
  }

  public getsubmissionCountPopupemp(flag: string, duration: string, userid:any) {
    return this.apiServ.get("dashboard/subpopups/" + flag + "/" + duration+"/"+userid);
  }

  public getInterviewCountPopupEmp(flag: string, duration: string, userid:any) {
    return this.apiServ.get("dashboard/interviewpopUp/" + flag + "/" + duration+"/"+userid);
  }

  public getClosureCountPopupEmp(flag: string, duration: string, userid:any) {
    return this.apiServ.get("dashboard/dashboardclosurespopUp/" + flag + "/" + duration+"/"+userid);
  }

  public getsourcingCount(flag: string, companyId: any) {
    return this.apiServ.get("dashboard/sourcingCount/" + flag+"/"+companyId);
  }

  public getSourcingCountPopup(flag: string, duration: string,companyId:any) {
    return this.apiServ.get("dashboard/sourcingCountPopup/" + flag + "/" + duration+"/"+companyId);
  }

  public getReqCounts(search: string,flag: string, type: string, date: any) {
    return this.apiServ.get("dashboard/reqCounts/" + search + "/" +flag + "/" + type + "/" + date);
  }
  
  // getFilteredEmployee(startDate:any ,endDate:any ,id:any){
  //   return this.apiServ.get("dashboard/getTaggedcounts/"+startDate+"/"+endDate+"/"+id)
  // }
  getFilteredEmployee(payload: { fromDate: any; toDate: any; userId: any ;pageNumber: number; pageSize: number },companyid:any) {
    return this.apiServ.post(`dashboard/getTaggedcounts/${companyid}`, payload);
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
