import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { AppleLoginProvider } from './provider/apple-login.provider';
import { MaterialModule } from '../../shared/material/material.module';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

const apps = environment.apps;

@NgModule({
  declarations: [RegisterPageComponent, LoginPageComponent],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(apps.google),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(apps.facebook),
          },
          {
            id: AppleLoginProvider.PROVIDER_ID,
            provider: new AppleLoginProvider(apps.apple),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  imports: [CommonModule, SocialLoginModule, SharedModule],
  exports: [SocialLoginModule, RegisterPageComponent, LoginPageComponent],
})
export class AuthModule {}
