import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './pages/settings/settings.component';
import { SharedModule } from '../../shared/shared.module';
import { RecoverComponent } from './pages/recover/recover.component';
import { ChangePasswordComponent } from './pages/recover-change-password/recover-change-password.component';

@NgModule({
  declarations: [SettingsComponent, RecoverComponent, ChangePasswordComponent],
  imports: [CommonModule, SharedModule],
  exports: [SettingsComponent, RecoverComponent, ChangePasswordComponent],
})
export class UserModule {}
