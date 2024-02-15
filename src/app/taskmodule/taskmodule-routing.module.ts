import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { TaskListComponent } from './task-list/task-list.component';
import { TaskReportComponent } from './task-report/task-report.component';

const route: Routes = [
  { path: "list-task", component: TaskListComponent },
  { path: "task-report", component: TaskReportComponent },
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }