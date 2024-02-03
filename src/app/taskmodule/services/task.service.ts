import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiServ = inject(ApiService);
  constructor() { }

  getAllTasks() {
    return this.apiServ.get("task/getAllTasks");
  }

  createTask(entity: any) {
    return this.apiServ.post("task/createTask", entity);
  }

  getEmployee() {
    return this.apiServ.get("auth/users/recruiterlist2");
  }

  public updateTask(entity: any) {
    return this.apiServ.post("task/updateTask", entity);
  }
 

  trackByUser(id: number) {
    return this.apiServ.get("task/trackByUser/" + id);
  }

}
