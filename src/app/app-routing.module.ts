import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CanLoadGuard } from './core/guards/can-load.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RegisterConsultantComponent } from './components/register-consultant/register-consultant.component';
import { OtpVerificationComponent } from './components/otp-verification/otp-verification.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'otp-verify',
    component: OtpVerificationComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: 'consultant-register',
    component: RegisterConsultantComponent
  },
  {
    path: 'usit',
    loadChildren: () => import('./usit/usit.module').then(m => m.UsitModule),
    canLoad: [CanLoadGuard]
  },
  {
    path: 'task-management',
    loadChildren: () => import('./taskmodule/task.module').then(n => n.TaskModule),
    canLoad: [CanLoadGuard]
  },
  {
    path: 'docsync',
    loadChildren: () => import('./docsync/docsync.module').then(n => n.DocsyncModule),
    canLoad: [CanLoadGuard]
  },
  {
    path: 'billpay',
    loadChildren: () => import('./billpay/billpay.module').then(n => n.BillpayModule),
    canLoad: [CanLoadGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
