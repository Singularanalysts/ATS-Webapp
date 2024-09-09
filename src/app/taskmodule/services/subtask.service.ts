import { inject, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SubtaskService {
  private apiServ = inject(ApiService);
  constructor() { }

  getsubTaskByTicketId(ticketid: string) {
    return this.apiServ.get("task/subTask/getBySubTaskTicketId/" + ticketid);
  }

  createSubTask(entity: any) {
    return this.apiServ.post("task/subTask/saveSubTask", entity);
  }

  getAllTasks() {
    return this.apiServ.get("task/subTask/getAllTasks");
  }


  getsubTaskById(subtaskid: number | string) {
    return this.apiServ.get("task/subTask/getBySubTaskId/" + subtaskid);
  }

  getTaskByTicketId(ticketid: string) {
    return this.apiServ.get("task/subTask/getByTicketId/" + ticketid);
  }

  public subTaskUpdate(entity: any) {
    return this.apiServ.put("task/subTask/update", entity);
  }
  
  public popup(taskid: any) {
    return this.apiServ.get("task/subTask/taskAssinInfo/" + taskid);
  }

  task_report(value: any) {
    return this.apiServ.post("task/subTask/getTaskReports", value);
  }

  deleteSubTask(id: any) {
    return this.apiServ.delete(`task/subTask/deleteSubTask/${id}`);
  }

  getUsersByDepartment(department: string) {
    return this.apiServ.get(`task/getUsers/${department}`);
  }

  updateSubTaskStatus(subtaskid: any, status: any, userid: any) {
    return this.apiServ.get(`task/subTask/updateSubTaskStatus/${subtaskid}/${status}/${userid}`);
  }

  addComments(data: any) {
    return this.apiServ.post(`task/updateTask`, data);
  }

  subtaskComments(subtaskid: any) {
    return this.apiServ.get(`task/subTask/trackBySubTask/${subtaskid}`);
  }

  addORUpdateSubTask(entity: any, action: 'edit-sub-task' | 'add-sub-task'){
    return action === 'edit-sub-task' ? this.subTaskUpdate(entity): this.createSubTask(entity);
  }
}
