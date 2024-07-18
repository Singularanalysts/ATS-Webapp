import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { throwError } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiServ = inject(ApiService);

  consultant_report(value: any) {
    return this.apiServ.post("report/creport", value);
  }

  sources_report(value: any) {
    return this.apiServ.post("report/sourcingreport", value)
  }

  public sourcing_DrillDown_report(vo: any) {
    return this.apiServ.post("report/sourceleads", vo);
  }

  public consultant_DrillDown_report(vo: any) {
    if (!vo || typeof vo.status === 'undefined') {
      // Handle the case where 'vo' or 'vo.status' is undefined
      console.error('Invalid request data:', vo);
      return throwError('Invalid request data');
    }

    if (vo.status == 'submission') {
      return this.apiServ.post("report/popupSub", vo);
    } else if (vo.status == 'interview') {
      return this.apiServ.post("report/popupInt", vo);
    } else if (vo.status == 'consultant') {
      return this.apiServ.post("report/recruiterleads", vo);
    } else {
      return this.apiServ.post("report/popup", vo);
    }
  }

  public getCategories() {
    return this.apiServ.get("report/getCategorys");
  }

  public getOpenReqsReport(entity: any) {
    return this.apiServ.post("report/getReqReport", entity);
  }

  public getBanterReport(entity: any) {
    return this.apiServ.post("report/callRecords/banterReport", entity);
  }

  public getEmployeeByDeparment(department: string) {
    return this.apiServ.get(`auth/users/user/${department}`)
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

  public candidateReport(data: any) {
    return this.apiServ.post("report/allemployeesreport", data);
  }

  public candidateSubmissionPopup(data: any) {
    return this.apiServ.post("report/employeeSubmissionPopup", data);
  }

  public candidateInterviewPopup(data: any) {
    return this.apiServ.post("report/employeeInterviewStatPopups", data);
  }

  public candidateAppliedJobsPopup(data: any) {
    return this.apiServ.post("report/employeeJobApplyCount", data);
  }
}
