import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultantService {

  constructor(private http: ApiService, private ht: HttpClient) { }

  public duplicatecheck(phonenumber: string) {
    return this.http.get("consultant/duplicatecheck/" + phonenumber);  
  }

  public duplicatecheckEmail(email: string) {
    return this.http.get("consultant/duplicateMail/" + email);
  }

  public duplicatecheckedit(phonenumber: number, id: number) {
    return this.http.get("consultant/duplicatecheck/" + phonenumber + "/" + id);
  }
  public duplicatecheckEmailEdit(email: string, id: number) {
    return this.http.get("consultant/duplicateMailEdit/" + email + "/" + id);
  }

  //register consultant
  public registerconsultant(entity: any) {
    return this.http.post("consultant/saveconsultant", entity);
  }

  public getSkilldata(id: number) {
    return this.http.get("consultant/technology/getskillsbyid/" + id);
  }

  public getCompanies() {
    return this.http.get("consultant/company/allcompanies");
  }
  getConsultantList() {
    return this.http.get("consultant/all");
  }

  //used for get consultant entity
  getConsultantById(id: number) {
    return this.http.get("consultant/getbyid/" + id);
  }

  consultantInfoByconId(id: number) {
    return this.http.get("consultant/consultantInfoByconId/" + id);
  }

  getConsultantList2(flg: string, access: string, userid: number) {
    return this.http.get("consultant/all/" + flg + "/" + access + "/" + userid);
  }

  getAllConsultantData(data: any) {
    return this.http.post("consultant/all", data);
  }

  getAllSourcingConsultantData(data: any) {
    return this.http.post("consultant/getAllSourcingCounsultants", data);
  }

  getAllH1TransferConsultantData(page: any, size: any, field: any) {
    return this.http.get("consultant/all/" + page + "/" + size + "/" + field);
  }

  //used for delete the consultant
  deleteEntity(id: number) {
    return this.http.delete("consultant/delete/" + id);
  }

  changeCOnsultantStatus(id: number, status: string, remarks: string) {
    return this.http.get("consultant/status?id=" + id + "&status=" + status + "&remarks=" + remarks);
  }

  //used for delete the consultant
  moveToSales(id: number, flg: string, userid: number) {
    return this.http.get("consultant/movedtosales/" + id + "/" + flg +  "/" + userid);
  }

  moveConsultant(id: number, flg: string, userid: number) {
    return this.http.get("consultant/moveConsultant/" + id + "/" + flg +  "/" + userid);
  }

  //used for delete the consultant
  consultantTracker(id: number) {
    return this.http.get("consultant/consultantTrack/" + id);
  }

  removingfile(id: number, flg: string) {
    return this.http.get("consultant/removefile/" + id + "/" + flg);
  }

  removingfiles(id: number) {
    return this.http.get("consultant/removefiles/" + id);
  }

  // supporting drop down apis
  public getrequirements() {
    return this.http.get("requirement/getrequirements");
  }
  public getvisa() {
    return this.http.get("consultant/visa/visas");
  }
  public gettech() {
    return this.http.get("consultant/technology/tech");
  }

  public gettechDropDown(techid: any) {
    return this.http.get("consultant/technology/"+techid);
  }

  getQualification() {
    return this.http.get("consultant/qualification/all");
  }

  // for report
  //register consultant
  public consultant_report(entity: any) {
    return this.http.post("report/creport", entity);
  }

  public sourcingreport(entity: any) {
    return this.http.post("report/sourcingreport", entity);
  }

  //register consultant
  public consultant_DrillDown_report(vo: any) {
    if (vo.status == 'submission') {
      return this.http.post("report/popupSub", vo);
    }
    else if (vo.status == 'interview') {
      return this.http.post("report/popupInt", vo);
    }
    else if (vo.status == 'consultant') {
      return this.http.post("report/recruiterleads", vo);
    }
    else {
      return this.http.post("report/popup", vo);
    }
  }

  //register consultant
  public sourcing_DrillDown_report(vo: any) {
    return this.http.post("report/sourceleads", vo);
  }

  uploadexcels(file: any) {
    return this.http.post("consultant/upload", file);
  }

  // mass mailing service call
  public masmailingRecruiterEmails(flg: any) {
    return this.http.get("recruiter/massmailEmails/" + flg);
  }

  getSalesHotList(page: any, size: any, field: any) {
    return this.http.get("consultant/hotlist/" + page + "/" + size + "/" + field);
  }

  getSalesAllHotListWithUserid(id: any) {
    return this.http.get("consultant/getAssginConsultantList/"+id);
  }

  getOptCptList(page: any, size: any, field: any, sortField: any, sortOrder: any) {
    return this.http.get(`consultant/all/${page}/${size}/${field}/p5/${sortField}/${sortOrder}`);
  }

  getH1TransferList(page: any, size: any, field: any, sortField: any, sortOrder: any) {
    return this.http.get(`consultant/all/${page}/${size}/${field}/p3/${sortField}/${sortOrder}`);
  }
  
  getFilteredConsultants(request:any) {
    return this.http.post("consultant/consultantFilter",request);
  }

  //both
  getFilteredConsults(pageno: any, pagesize: any, request:any) {
    return this.http.post(`consultant/allConsultantFilter/${pageno}/${pagesize}`,request);
  }

  public getregtech() {
    return this.http.get("consultant/technology");
  }

  public getregskills(techid: any) {
    return this.http.get(`auth/technology/getskillsbyid/${techid}`);
  }

  public getProfile(userid: any) {
    return this.http.get(`consultant/getByAddedby/${userid}`);
  }

  getEmployee(userid: any) {
    return this.http.get(`consultant/salesExecutivesList/${userid}`);
  }

  getDomEmployee() {
    return this.http.get("consultant/domExecutivesList");
  }

  getRecruiters() {
    return this.http.get("requirement/recruiterlist");
  }

  getAssignedRecruiter(id: number) {
    return this.http.get("consultant/getSalesExecutiveById/" + id);
  }    
  
  public getTLdropdown(id: number) {
    return this.http.get("consultant/technology/getskillsbyid/" + id);
  }

}