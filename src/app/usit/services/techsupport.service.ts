import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { Techsupport } from '../models/TechSupport';

@Injectable({
  providedIn: 'root'
})
export class TechsupportService {

  private apiServ = inject(ApiService);
  registerTechSupport(tech: Techsupport) {
    return this.apiServ.post("auth/techsupp/save", tech);
  }

  updateTechSupport(tech: Techsupport) {
    return this.apiServ.post("auth/techsupp/update", tech);
  }

  //used for get one resource
  getTechsupportById(id: number) {
    return this.apiServ.get("consultant/technology/getskillsbyid/" + id);
  }

  getTechsupportId(id: number) {
    return this.apiServ.get("auth/techsupp/edit/" + id);
  }

  getTechSupportList() {
    return this.apiServ.get("auth/techsupp/all");
  }
  //used for delete the resource
  deleteTechsupport(id: number) {
    return this.apiServ.delete("auth/techsupp/delete/" + id);
  }
  changeTechSupportStatus(vendor: Techsupport) {
    return this.apiServ.patch("auth/techsupp/status", vendor);
  }
  public gettechnicalskills() {
    return this.apiServ.get("auth/technology/technologies");
  }
  public getSkilldata(id: number) {
    return this.apiServ.get("technology/getskillsbyid/" + id);
  }

  addORUpdateH1bImmigrant(
    entity: any,
    action: "edit-tech-support" | "add-tech-support"
  ) {
    return action === "edit-tech-support"
      ? this.updateTechSupport(entity)
      : this.registerTechSupport(entity);
  }
}
