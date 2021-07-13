import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { TasksModule } from './tasks/tasks.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SettingsComponent } from './settings/settings.component';
import { RecoverModule } from './recover/recover.module';

@NgModule({
  declarations: [
    MainComponent,
    LoginComponent,
    RegisterComponent,
    ChangePasswordComponent,
    SettingsComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TasksModule,
  ],
  exports: [RouterModule],
})
export class RoutesModule {}
