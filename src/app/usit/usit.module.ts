import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsitRoutingModule } from './usit-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultantFulltimeOpenreqsComponent } from './components/consultant-components/consultant-openreqs/consultant-fulltime-openreqs/consultant-fulltime-openreqs.component';
import { AddFulltimeResumeComponent } from './components/consultant-components/consultant-openreqs/add-fulltime-resume/add-fulltime-resume.component';
import { ResumeDescriptionComponent } from './components/openreqs/resume-description/resume-description.component';
import { ResumeVendorComponent } from './components/openreqs/resume-vendor/resume-vendor.component';
import { AddResumeVendorComponent } from './components/openreqs/add-resume-vendor/add-resume-vendor.component';
import { AddResumeRecruiterComponent } from './components/openreqs/add-resume-recruiter/add-resume-recruiter.component';

@NgModule({
  declarations: [













    ResumeDescriptionComponent,
  ],
  imports: [
    CommonModule,
    UsitRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,

  ]
})
export class UsitModule { }
