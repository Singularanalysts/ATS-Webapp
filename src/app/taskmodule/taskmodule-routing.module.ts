import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { TaskListComponent } from './task-list/task-list.component';
import { TaskReportComponent } from './task-report/task-report.component';

const route: Routes = [
  { path: "list-task", component: TaskListComponent },
  { path: "task-report", component: TaskReportComponent },
  {
    path: "projects",
    loadComponent: () => import('./project-list/project-list.component').then(m => m.ProjectListComponent)
  },
  {
    path: "projects/:projectId/tasks",
    loadComponent: () => import('./task-list/task-list.component').then(m => m.TaskListComponent)
  },
  {
    path: "projects/:projectId/tasks/:ticketId/subtasks",
    loadComponent: () => import('./sub-task-list/sub-task-list.component').then(m => m.SubTaskListComponent)
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }