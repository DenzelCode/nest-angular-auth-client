import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './pages/settings/settings.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingsComponent],
  imports: [CommonModule, AngularMaterialModule, ReactiveFormsModule],
  exports: [SettingsComponent],
})
export class UserModule {}
