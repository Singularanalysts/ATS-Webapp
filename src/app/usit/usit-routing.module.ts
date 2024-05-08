import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RolesListComponent } from './components/role-list/roles-list.component';
import { VendorListComponent } from './components/vendor-management/vendor-list/vendor-list.component';
import { RecruiterListComponent } from './components/vendor-management/recruiter-list/recruiter-list.component';
import { ConsultantListComponent } from './components/sales/consultant-list/consultant-list.component';
import { SubmissionListComponent } from './components/sales/submission-list/submission-list.component';
import { InterviewListComponent } from './components/sales/interview-list/interview-list.component';
import { VisaListComponent } from './components/masters/visa-list/visa-list.component';
import { QualificationListComponent } from './components/masters/qualification-list/qualification-list.component';
import { CompaniesListComponent } from './components/masters/companies-list/companies-list.component';
import { TechnologyTagListComponent } from './components/technology-tag-list/technology-tag-list.component';
import { RequirementListComponent } from './components/recruitment/requirement-list/requirement-list.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { AttemptQuizComponent } from './components/quiz/attempt-quiz/attempt-quiz.component';
import { QuizListComponent } from './components/quiz/quiz-list/quiz-list.component';
import { PrivilegeListComponent } from './components/privilege-list/privilege-list.component';
import { QuizResultComponent } from './components/quiz/quiz-result/quiz-result.component';
import { ClosureListComponent } from './components/sales/closure-list/closure-list.component';
import { PurchaseOrderListComponent } from './components/accounts&billing/purchase-order-list/purchase-order-list.component';
import { UserInfoComponent } from './components/recruitment/user-info/user-info.component';
import { H1bImmigrationComponent } from './components/Immigration/h1b-immigration/h1b-immigration.component';
import { FutureOptCptComponent } from './components/Immigration/future-opt-cpt/future-opt-cpt.component';
import { HotListComponent } from './components/sales/hot-list/hot-list.component';
import { CanActivateGuard } from '../core/guards/can-activate.guard';
import { H1transferComponent } from './components/sales/h1transfer/h1transfer.component';
import { OpenreqsComponent } from './components/openreqs/openreqs.component';
import { RssfedComponentimplements } from './components/rssfed/rssfed.component';
import { EmployeeReportsComponent } from './components/reports/employee-reports/employee-reports.component';
import { SourcingReportsComponent } from './components/reports/sourcing-reports/sourcing-reports.component';
import { LinkedprofilesComponent } from './components/linkedprofiles/linkedprofiles.component';
import { ConsultantInfoComponent } from './components/sales/consultant-list/consultant-info/consultant-info.component';
import { EmailextractionComponent } from './components/emailextraction/emailextraction.component';
import { TechSupportListComponent } from './components/tech-support-list/tech-support-list.component';
import { GlobalSearchComponent } from './components/global-search/global-search.component';
import { OpenRequirementsReportsComponent } from './components/reports/open-requirements-reports/open-requirements-reports.component';
import { MassMailingListComponent } from './components/vendor-management/mass-mailing-list/mass-mailing-list.component';
import { EmailExtractionComponent } from './components/email-extraction/email-extraction.component';
import { InvoiceListComponent } from './components/accounts&billing/invoice-list/invoice-list.component';
import { ReceiptListComponent } from './components/accounts&billing/receipt-list/receipt-list.component';
import { HotListProvidersListComponent } from './components/hot-list-providers-list/hot-list-providers-list.component';
import { BlacklistedCompaniesListComponent } from './components/vendor-management/blacklisted-companies-list/blacklisted-companies-list.component';
import { CurrentPrimaryVendorListComponent } from './components/vendor-management/current-primary-vendor-list/current-primary-vendor-list.component';
import { FuturePrimaryVendorListComponent } from './components/vendor-management/future-primary-vendor-list/future-primary-vendor-list.component';
// import { ActiveComponent } from './components/people/active/active.component';
import { ProfileComponent } from './components/profile/profile.component';
// import { EVerifyComponent } from './components/Immigration/e-verify/e-verify.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'privileges/:id',
    component: PrivilegeListComponent,
  },
  {
    path: 'quiz-list',
    component: QuizListComponent,
  },
  {
    path: 'save-quiz',
    component: QuizComponent,
  },
  {
    path: 'attempt-quiz',
    component: AttemptQuizComponent,
  },
  {
    path: 'quiz-result',
    component: QuizResultComponent,
  },
  { path: 'employees', component: EmployeeListComponent },
  {
    path: 'user-info/:flg/:id',
    component: UserInfoComponent,
  },
  { path: 'vendors', component: VendorListComponent },
  { path: 'roles', component: RolesListComponent },
  { path: 'recruiters', component: RecruiterListComponent },
  {
    path: 'sales-submission',
    component: SubmissionListComponent,
    data: { isSaleSub: true },
  },
  {
    path: 'rec-submission',
    component: SubmissionListComponent,
    data: { isRecSub: true },
  },
  {
    path: 'dom-submission',
    component: SubmissionListComponent,
    data: { isDomSub: true },
  },
  {
    path: 'sales-interview',
    component: InterviewListComponent,
    data: { isSalesInt: true },
  },
  {
    path: 'rec-interview',
    component: InterviewListComponent,
    data: { isRecInt: true },
  },
  {
    path: 'dom-interview',
    component: InterviewListComponent,
    data: { isDomInt: true },
  },

  { path: 'visa', component: VisaListComponent },
  { path: 'qualification', component: QualificationListComponent },
  { path: 'companies', component: CompaniesListComponent },
  { path: 'technology-tag', component: TechnologyTagListComponent },
  {
    path: 'rec-requirements',
    component: RequirementListComponent,
    data: { isRecRequirement: true },
  },
  {
    path: 'dom-requirements',
    component: RequirementListComponent,
    data: { isDomRequirement: true },
  },
  {
    path: 'sales-consultants',
    component: ConsultantListComponent,
    data: { isSalesConsultant: true },
  },
  {
    path: 'rec-consultants',
    component: ConsultantListComponent,
    data: { isRecConsultant: true },
  },
  {
    path: 'pre-sales',
    component: ConsultantListComponent,
    data: { isPreConsultant: true },
  },
  {
    path: 'dom-consultants',
    component: ConsultantListComponent,
    data: { isDomConsultant: true },
  },
  {
    path: 'sales-submissions',
    component: SubmissionListComponent,
    data: { isSalesSubmission: true },
  },
  {
    path: 'rec-submissions',
    component: SubmissionListComponent,
    data: { isRecSubmission: true },
  },
  {
    path: 'dom-submissions',
    component: SubmissionListComponent,
    data: { isDomSubmission: true },
  },
  {
    path: 'sales-interviews',
    component: InterviewListComponent,
    data: { isSalesInterview: true },
  },
  {
    path: 'rec-interviews',
    component: InterviewListComponent,
    data: { isRecInterview: true },
  },
  {
    path: 'dom-interviews',
    component: InterviewListComponent,
    data: { isDomInterview: true },
  },
  {
    path: 'sales-closures',
    component: ClosureListComponent,
    canActivate:[CanActivateGuard],
    data: { isSalesClosure: true },
  },
  {
    path: 'rec-closures',
    component: ClosureListComponent,
    canActivate:[CanActivateGuard],
    data: { isRecClosure: true },
  },
  {
    path: 'dom-closures',
    component: ClosureListComponent,
    canActivate:[CanActivateGuard],
    data: { isDomClosure: true },
  },
  {
    path: 'purchase-orders',
    component: PurchaseOrderListComponent,
  },
  {
    path: 'h1b-immigartion', component: H1bImmigrationComponent,
  },
  {
    path: 'future-opt-cpt', component: FutureOptCptComponent,
  },
  {
    path: 'hot-list', component: HotListComponent,
  }
  ,
  {
    path: 'h1transfer', component: H1transferComponent,
  }
  ,
  {
    path: 'portalreqs', component: OpenreqsComponent,
  },
  {
    path: 'rssfeed', component: RssfedComponentimplements,
  },
  {
    path: 'linkedinprofiles', component: LinkedprofilesComponent,
  }
  ,
  { 
    path: 'employee-report', component: EmployeeReportsComponent
  },
  { 
    path: 'sourcing-report', component: SourcingReportsComponent 
  },
  { 
    path: 'open-reqs-report', component: OpenRequirementsReportsComponent
  },
  { path: 'consultant-info/:flg/:subFlag/:id', component: ConsultantInfoComponent },

  { 
    path: 'list-email', component: EmailextractionComponent 
  },

  { 
    path: 'list-techsupport', component: TechSupportListComponent 
  },
  { 
    path: 'search', component: GlobalSearchComponent 
  },
  { 
    path: 'mass-mailing-list', component: MassMailingListComponent 
  },

  { 
    path: 'email-extraction-list', component: EmailExtractionComponent 
  },
  
  {
    path: 'invoices', component: InvoiceListComponent,
  },
  {
    path: 'receipts', component: ReceiptListComponent,
  },
  
  {
    path: 'hot-list-providers', component: HotListProvidersListComponent,
  },
  {
    path: 'blacklisted-companies', component: BlacklistedCompaniesListComponent,
  },
  {
    path: 'current-primary-vendor', component: CurrentPrimaryVendorListComponent,
  },
  {
    path: 'future-primary-vendor', component: FuturePrimaryVendorListComponent,
  },
  // {
  //   path: 'active', component: ActiveComponent,
  // },
  {
    path: 'profile', component: ProfileComponent,
  },
  // {
  //   path: 'e-verify', component: EVerifyComponent,
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsitRoutingModule {}
