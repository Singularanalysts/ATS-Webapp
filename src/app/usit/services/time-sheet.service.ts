import { inject, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService {

  private apiServ = inject(ApiService);

  constructor() { }

  addTimeSheet(entity: any) {
    return this.apiServ.post("billpay/timesheets/saveTimeSheet", entity);
  }
  getTimeSheetListwithPaginationSortAndFilter(pagObj: any) {
    return this.apiServ.post("billpay/timesheets/getAllTimesheets", pagObj);
  }
  getById(id: number) {
    return this.apiServ.get("billpay/timesheets/getByTimesheetId" + `/${id}`);
  }
  deleteTimeSheet(id: number) {
    return this.apiServ.delete("billpay/timesheets/delete" + `/${id}`);
  }
  getAllTimeSheetLists() {
    return this.apiServ.get("billpay/all");
  }
  getVendor(conRegistrationId: any) {
    return this.apiServ.get("billpay/timesheets/getvendor" + `/${conRegistrationId}`);
  }
  updateTimeSheet(entity: any) {
    return this.apiServ.put("billpay/timesheets/updateTimeSheet", entity);
  }
  //attachment section
  addAttachments(formData: FormData, id: any) {
    return this.apiServ.post("billpay/attachments/upload" + `/${id}`, formData);
  }
  getAttachment(id: number) {
    return this.apiServ.get("billpay/attachments/getTimesheetId" + `/${id}`);
  }
  downloadAttachment(id: number) {
    return this.apiServ.get("billpay/attachments/download" + `/${id}`);
  }
  deleteAttachment(id: number){
    return this.apiServ.delete("billpay/attachments/deleted" + `/${id}`);
  }

}
