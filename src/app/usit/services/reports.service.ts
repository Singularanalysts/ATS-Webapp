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
    return this.apiServ.post("reports/creport", value);
  }

  sources_report(value: any) {
    return this.apiServ.post("reports/sourcingreport", value)
  }

  public sourcing_DrillDown_report(vo: any) {
    return this.apiServ.post("reports/sourceleads", vo);

  }
  
  public consultant_DrillDown_report(vo: any) {
    if (!vo || typeof vo.status === 'undefined') {
      // Handle the case where 'vo' or 'vo.status' is undefined
      console.error('Invalid request data:', vo);
      return throwError('Invalid request data');
    }

    if (vo.status == 'submission') {
      return this.apiServ.post("reports/popupSub", vo);
    } else if (vo.status == 'interview') {
      return this.apiServ.post("reports/popupInt", vo);
    } else if (vo.status == 'consultant') {
      return this.apiServ.post("reports/recruiterleads", vo);
    } else {
      return this.apiServ.post("reports/popup", vo);
    }
  }


}
