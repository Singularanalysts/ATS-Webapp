import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarV2Component } from './components/sidebar-v2/sidebar-v2.component';
import { CanLoadGuard } from './core/guards/can-load.guard';
import { PasswordChangeComponent } from './components/password-change/password-change.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

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
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'password',
    component: PasswordChangeComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },

  // 
  {
    path: 'usit',
    loadChildren: () => import('./usit/usit.module').then(m => m.UsitModule),
    canLoad: [CanLoadGuard] // add canactivate to check sign in
  },
  {
    path: 'task',
    loadChildren: () => import('./taskmodule/task.module').then(n => n.TaskModule)
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
