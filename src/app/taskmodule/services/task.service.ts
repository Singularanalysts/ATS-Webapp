import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiServ = inject(ApiService);
  constructor() { }

  getAllTasksOfProject(entity: any) {
    return this.apiServ.post("task/findByProjectId", entity);
  }
  
  getUsersByDepartment(department: string) {
    return this.apiServ.get(`task/getUsers/${department}`);
  }

  createTask(entity: any) {
    return this.apiServ.post("task/createTask", entity);
  }

  getTaskById(taskid: number | string) {
    return this.apiServ.get("task/getbyTaskId/" + taskid);
  }

  public Taskupdate(entity: any) {
    return this.apiServ.post("task/update", entity);
  }

  trackByUser(id: number) {
    return this.apiServ.get("task/trackByUser/" + id);
  }

  getTaskByTicketId(ticketid: string) {
    return this.apiServ.get("task/getByTicketId/" + ticketid);
  }

  public popup(taskid: any) {
    return this.apiServ.get("task/taskAssinInfo/" + taskid);
  }

  task_report(value: any) {
    return this.apiServ.post("task/getTaskReports", value);
  }

  deleteTask(id: any) {
    return this.apiServ.delete(`task/delete/${id}`);
  }

  updateTaskStatus(taskid: any, status: any) {
    return this.apiServ.get(`task/update/${taskid}/${status}`);
  }

  addORUpdateTask(entity: any, action: 'edit-task' | 'add-task'){
    return action === 'edit-task' ? this.Taskupdate(entity): this.createTask(entity);
  }
}
