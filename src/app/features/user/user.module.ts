import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { SharedModule } from '../../shared/shared.module';
import { RecoverPageComponent } from './pages/recover-page/recover-page.component';
import { RecoverChangePasswordPageComponent } from './pages/recover-change-password-page/recover-change-password-page.component';

@NgModule({
  declarations: [
    SettingsPageComponent,
    RecoverPageComponent,
    RecoverChangePasswordPageComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    SettingsPageComponent,
    RecoverPageComponent,
    RecoverChangePasswordPageComponent,
  ],
})
export class UserModule {}
