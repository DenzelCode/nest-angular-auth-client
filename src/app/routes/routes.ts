import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from '../auth/guard/auth.guard';
import { TasksDashboardComponent } from './tasks/components/tasks-dashboard/tasks-dashboard.component';
import { RecoverComponent } from './recover/recover.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: {
      requireAuth: false,
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
    data: {
      requireAuth: false,
    },
  },
  {
    path: 'recover',
    pathMatch: 'full',
    component: RecoverComponent,
    canActivate: [AuthGuard],
    data: {
      requireAuth: false,
    },
  },
  {
    path: 'recover/:code',
    pathMatch: 'full',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
    data: {
      requireAuth: false,
    },
  },
  {
    path: 'tasks',
    component: TasksDashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/' },
];
