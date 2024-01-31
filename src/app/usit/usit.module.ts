import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsitRoutingModule } from './usit-routing.module';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { AddEmployeeComponent } from './components/employee-list/add-employee/add-employee.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesListComponent } from './components/role-list/roles-list.component';
import { AddRoleComponent } from './components/role-list/add-role/add-role.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    UsitRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsitModule { }
