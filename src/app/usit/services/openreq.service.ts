import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class OpenreqService {

  constructor(private http: ApiService) { }

  readmail(entity: any) {
     return this.http.post("mail/extractEmail", entity);
  }

  fetch( page: any, size: any,searchQuery:string) {
    return this.http.get("mail/read/"+page + "/" + size+"/"+searchQuery);
  }

  public openReqsEmpTagging(reqid: number, empid: number) {
    return this.http.get("openreqs/dice/empTagging/" + reqid + "/" + empid);
  }

  public getopenReqWithPaginationAndSource(pageNo: any, pageSize: any, field: any, source: any, country: string) {
    return this.http.get("openreqs/dice/allreqs/" + pageNo + "/" + pageSize + "/" + field + "/" + source + "/" + country);
  }

  public linkedinProfiles() {
    return this.http.get("openreqs/linked/all");
  }

  linkedInPagination(data: any) {
    return this.http.post("openreqs/linked/LinkedInPofiles", data);
  }

  public readrss() {
    return this.http.get("openreqs/rssfeed/read");
  }

  public sendRssLink(rssLink: any) {
    return this.http.post("openreqs/rssfeed/save", rssLink);
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

  deleteSender(id: number) {
    return this.http.delete("mail/delete/" + id);
  }

  getOpenReqsById(id:number) {
    return this.http.get("openreqs/dice/getByReqId/"+id);
  }
  getreportemail(id:any){
    return this.http.get("mail/getEmailExtractionReport/"+id)
  }

  getOpenFulltimeReqsById(id:number) {
    return this.http.get("openreqs/dice/getByFulltimeReqId/"+id);
  }

  emailEXtractionByPaginationSortandFilter(data: any) {
    return this.http.post("mail/read", data);
  }

  blockVendorMail(data: any) {
    return this.http.post("mail/saveBlockedDomains", data);
  }

  getConsultantOpenReqsByPaginationSortandFilter(data: any) {
    return this.http.post("openreqs/dice/allEmpContractReqs", data);
  }

  getConsultantOpenReqsFulltimeByPaginationSortandFilter(data: any) {
    return this.http.post("openreqs/dice/allEmpFulltimeReqs", data);
  }

  // applyJob(data: any) {
  //   return this.http.post("openreqs/apply/applyJob", data);
  // }

  applyJob(data: any) {
    return this.http.post("openreqs/apply/applyContractJob", data);
  }

  applyJobs(data: any) {
    return this.http.post("openreqs/apply/applyFulltimeJob", data);
  }

  appliedJobs(data: any) {
    return this.http.post("openreqs/apply/appliedJobListEmp", data);
  }

  showAppliedJobToEmployer(data: any) {
    return this.http.post("openreqs/apply/appliedJobListTeamleads", data);
  }

  getCpvFpvOpenRequirements(data: any) {
    return this.http.post("openreqs/dice/getCpvFpvReq", data);
  }

  getCfoAndVp(data: any) {
    return this.http.post("openreqs/linked/LinkedInPofilesRequest", data);
  }

  // extractEmails(data: any) {
  //   return this.http.post("mail/extractEmail", data);
  // }

  extractEmails(data: any) {
    return this.http.post("mail/fetch", data);
  }
  // callTheStatus(email : string){
  //   return this.http.get("mail/status"+`/${email}`)
  // }
  stopTheExtraction(id : any){
    return this.http.get("mail/stop"+`/${id}`);
  }
  showBody(id : string){
    // return this.http.get("mail/body"+`/${id}`);
    return this.http.get(`mail/body/${id}`);
  }
  saveConfiguredEmail(data: any) {
    return this.http.post("mail/emailcredentials/save", data);
  }

  updateConfiguredEmail(data: any) {
    return this.http.put("mail/emailcredentials/update", data);
  }

  getConfiguredEmailById(id: string) {
    return this.http.get(`mail/emailcredentials/getEmailCredentialsByUserId/${id}`);
  }

  validateOldPassword(data: any) {
    return this.http.post(`mail/emailcredentials/oldPasswordValidation`, data);
  }

  requestOtp(data: any) {
    return this.http.post(`mail/emailcredentials/forgotPassword`, data);
  }

  validateOtp(id: any, otp: any) {
    return this.http.get(`mail/emailcredentials/validate/${id}/${otp}`);
  }

  deleteEmails(data: any) {
    return this.http.post(`mail/deleteMailByIds`, data);
  }

  addORUpdateEmailConfiguration(entity: any, action: 'edit-email-configuration' | 'add-email-configuration'){
    return action === 'edit-email-configuration' ? this.updateConfiguredEmail(entity): this.saveConfiguredEmail(entity);
  }

  getEmailById(id: any) {
    return this.http.get(`mail/emailcredentials/getByRecordId/${id}`);
  }

  duplicatecheckEmail(data: any) {
    return this.http.put(`mail/emailcredentials/credentialUpdate`, data);
  }

  getHotlist() {
    return this.http.get(`consultant/analyz/hotListDropdown`);
  }

  matchResume(consultantId: number, jobDescription: string) {
    return this.http.get(`consultant/analyz/matchResume/${consultantId}/${jobDescription}`);
  }

  addComment(data: any) {
    return this.http.post(`openreqs/dice/comment`, data);
  }

  jobComments(reqId: number) {
    return this.http.get(`openreqs/dice/getComment/${reqId}`);
  }

  blockedEmailsList(id:number) {
    return this.http.get("mail/getBlockedDomains/"+id);
  }

  unblockingEmailWithId(id:any) {
    return this.http.post("mail/unblockEmails",id);
  }

  blockedEmailsLists() {
    return this.http.get("auth/users/getAllActiveUsersEmails");
  }
assignedrequirements(payload:any){
  return this.http.post("requirement/getAssignedRequirementUsers",payload);

}
Requirementsreport(payload:any){
  return this.http.post("requirement/getAssignedRequirementsPopup",payload);

}
private apiUrl = 'openreqs/resume/getReq'; // API endpoint

resumeupload(formData: FormData, params: HttpParams): Observable<any> {
  return this.http.post(this.apiUrl, formData, { params }); // Include params in options
}


}
