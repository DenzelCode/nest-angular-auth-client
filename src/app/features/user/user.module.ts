import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './pages/settings/settings.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [SettingsComponent],
  imports: [CommonModule, SharedModule],
  exports: [SettingsComponent],
})
export class UserModule {}
