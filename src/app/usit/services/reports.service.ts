import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { throwError } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiServ = inject(ApiService);

  consultant_report(value: any, compnayId: any) {
    return this.apiServ.post(`report/creport/${compnayId}`, value);
  }

  sources_report(value: any, companyId: any) {
    return this.apiServ.post(`report/sourcingreport/${companyId}`, value)
  }

  public sourcing_DrillDown_report(vo: any, companyId: any) {
    return this.apiServ.post(`report/sourceleads/${companyId}`, vo);
  }

  public consultant_DrillDown_report(vo: any, companyId: any) {
    if (!vo || typeof vo.status === 'undefined') {
      // Handle the case where 'vo' or 'vo.status' is undefined
      console.error('Invalid request data:', vo);
      return throwError('Invalid request data');
    }

    if (vo.status == 'submission') {
      return this.apiServ.post(`report/popupSub/${companyId}`, vo);
    } else if (vo.status == 'interview') {
      return this.apiServ.post(`report/popupInt/${companyId}`, vo);
    } else if (vo.status == 'consultant') {
      return this.apiServ.post(`report/recruiterleads/${companyId}`, vo);
    } else {
      return this.apiServ.post(`report/popup/${companyId}`, vo);
    }
  }

  public getCategories() {
    return this.apiServ.get("report/getCategorys");
  }

  public getOpenReqsReport(entity: any) {
    return this.apiServ.post("report/getReqReport", entity);
  }

  public getBanterReport(entity: any, companyId: any) {
    return this.apiServ.post(`report/callRecords/banterReport/${companyId}`, entity);
  }

  public getCommentReport(entity: any, companyId: any) {
    return this.apiServ.post(`report/CommentsReport/${companyId}`, entity);
  }

  public getEmployeeByDeparment(department: string, companyId: any) {
    return this.apiServ.get(`auth/users/user/${department}/${companyId}`)
  }

  public getEmployeeReport(entity: any) {
    return this.apiServ.post("report/individualEmployeeReport", entity);
  }

  public employeeSubmissionPopup(data: any) {
    return this.apiServ.post("report/employeeSubPopup", data);
  }

  public employeeInterviewPopup(data: any) {
    return this.apiServ.post("report/employeeIntervStatusPopups", data);
  }

  public candidateReport(data: any, companyId: any) {
    return this.apiServ.post(`report/allEmployeesReport/${companyId}`, data);
  }

  public candidateSubmissionPopup(data: any, companyId: any) {
    return this.apiServ.post(`report/employeeSubmissionPopup/${companyId}`, data);
  }

  public candidateInterviewPopup(data: any, companyId:any) {
    return this.apiServ.post(`report/employeeInterviewStatPopups/${companyId}`, data);
  }

  public candidateAppliedJobsPopup(data: any, companyId: any) {
    return this.apiServ.post(`report/employeeJobApplyCount/${companyId}`, data);
  }

  public requirementPopup(data: any) {
    return this.apiServ.post("report/reqPopups", data);
  }
}
