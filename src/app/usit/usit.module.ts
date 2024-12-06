import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsitRoutingModule } from './usit-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultantFulltimeOpenreqsComponent } from './components/consultant-components/consultant-openreqs/consultant-fulltime-openreqs/consultant-fulltime-openreqs.component';
import { AddFulltimeResumeComponent } from './components/consultant-components/consultant-openreqs/add-fulltime-resume/add-fulltime-resume.component';

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
