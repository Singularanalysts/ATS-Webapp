import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TechnologyTagService {

  private apiServ = inject(ApiService);

  constructor() { }

  //register technology
  addTechnology(entity: any) {
    return this.apiServ.post("auth/technology/save", entity);
  }

  //update technology
  updateTechnology(entity: any) {
    return this.apiServ.put("auth/technology/technologies", entity);
  }

  // get all technologies
  getAllTechnologies() {
    return this.apiServ.get("auth/technology/all");
  }

  getAllTechnologiesByPagination(access: string, userid: number, page: any, size: any, field: any) {
    return this.apiServ.get("auth/technology/all/" + access + "/" + userid + "/" + page + "/" + size + "/" + field);
  }

  // delete technology
  deleteTechnology(id: number) {
    return this.apiServ.delete("auth/technology/delete/" + id);
  }

  addOrUpdateTechnology(entity: any, action: string) {
    return action === "update-technology" ? this.updateTechnology(entity) : this.addTechnology(entity);
  }
}
