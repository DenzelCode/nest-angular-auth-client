import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { TasksModule } from './tasks/tasks.module';
import { RecoverComponent } from './recover/recover.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    MainComponent,
    LoginComponent,
    RegisterComponent,
    RecoverComponent,
    ChangePasswordComponent,
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
