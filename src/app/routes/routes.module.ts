import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { TasksModule } from './tasks/tasks.module';
import { RecoverComponent } from './recover/recover.component';

@NgModule({
  declarations: [MainComponent, LoginComponent, RegisterComponent, RecoverComponent],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TasksModule,
  ],
  exports: [RouterModule],
})
export class RoutesModule {}
