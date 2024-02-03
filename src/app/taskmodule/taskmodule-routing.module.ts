import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { TaskListComponent } from './task-list/task-list.component';

const route: Routes = [
  { path: "list-task", component: TaskListComponent },
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }