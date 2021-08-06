import { NgModule } from '@angular/core';
import { RecoverService } from './service/recover.service';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecoverComponent } from './pages/recover/recover.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

@NgModule({
  declarations: [RecoverComponent, ChangePasswordComponent],
  providers: [RecoverService],
  imports: [
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [RecoverComponent, ChangePasswordComponent],
})
export class RecoverModule {}
