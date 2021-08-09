import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { AuthGuard } from './auth/guard/auth.guard';
import { TasksDashboardComponent } from './tasks/pages/tasks-dashboard/tasks-dashboard.component';
import { SettingsComponent } from './user/pages/settings/settings.component';
import { RecoverComponent } from './recover/pages/recover/recover.component';
import { ChangePasswordComponent } from './recover/pages/change-password/change-password.component';
import { RoomsComponent } from './room/pages/rooms/rooms.component';

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
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'rooms',
    component: RoomsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'room/:id',
    component: RoomsComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/' },
];
