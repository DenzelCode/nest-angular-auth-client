import { NgModule } from '@angular/core';
import { RecoverService } from './service/recover.service';
import { RecoverComponent } from './pages/recover/recover.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [RecoverComponent, ChangePasswordComponent],
  providers: [RecoverService],
  imports: [SharedModule],
  exports: [RecoverComponent, ChangePasswordComponent],
})
export class RecoverModule {}
