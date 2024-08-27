import { inject, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  
  private apiServ = inject(ApiService);
  private pid!: string | number ;

  constructor() { }

  saveProject(entity: any) {
    return this.apiServ.post("task/project/save", entity);
  }

  updateProject(entity: any) {
    return this.apiServ.put("task/project/update", entity);
  }

  getAllProjectsWithPaginationAndSorting(entity: any) {
    return this.apiServ.post("task/project/findAllProjects", entity);
  }

  getProjectById(id: any) {
    return this.apiServ.get(`task/project/getbyProjectId/${id}`);
  }

  addORUpdateProject(entity: any, action: 'edit-project' | 'add-project'){
    return action === 'edit-project' ? this.updateProject(entity): this.saveProject(entity);
  }

  deleteProject(id: any) {
    return this.apiServ.delete(`task/project/delete/${id}`);
  }

  setPid(pid: string | number): void {
    this.pid = pid;
  }

  getPid(): string | number {
    return this.pid;
  }
}
