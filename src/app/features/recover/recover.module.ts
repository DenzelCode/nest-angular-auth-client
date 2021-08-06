import { NgModule } from '@angular/core';
import { RecoverService } from './service/recover.service';
import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecoverComponent } from './pages/recover/recover.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

@NgModule({
  declarations: [RecoverComponent, ChangePasswordComponent],
  providers: [RecoverService],
  imports: [
    HttpClientModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [RecoverComponent, ChangePasswordComponent],
})
export class RecoverModule {}
