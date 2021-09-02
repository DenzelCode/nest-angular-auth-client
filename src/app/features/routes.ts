import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { MainComponent } from './main/main.component';
import { RegisterPageComponent } from './auth/pages/register-page/register-page.component';
import { AuthGuard } from './auth/guard/auth.guard';
import { SettingsPageComponent } from './user/pages/settings-page/settings-page.component';
import { RecoverChangePasswordPageComponent } from './user/pages/recover-change-password-page/recover-change-password-page.component';
import { RoomsPageComponent } from './room/pages/rooms-page/rooms-page.component';
import { RoomPageComponent } from './room/pages/room-page/room-page.component';
import { RecoverPageComponent } from './user/pages/recover-page/recover-page.component';
import { DirectMessagePageComponent } from './messages/pages/direct-message-page/direct-message-page.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [AuthGuard],
    data: {
      requireAuth: false,
    },
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [AuthGuard],
    data: {
      requireAuth: false,
    },
  },
  {
    path: 'recover',
    pathMatch: 'full',
    component: RecoverPageComponent,
    canActivate: [AuthGuard],
    data: {
      requireAuth: false,
    },
  },
  {
    path: 'recover/:code',
    pathMatch: 'full',
    component: RecoverChangePasswordPageComponent,
    canActivate: [AuthGuard],
    data: {
      requireAuth: false,
    },
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'rooms',
    component: RoomsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'room/:id',
    component: RoomPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'direct-message/:username',
    component: DirectMessagePageComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/' },
];
