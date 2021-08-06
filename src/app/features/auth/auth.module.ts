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
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

const apps = environment.apps;

@NgModule({
  declarations: [RegisterComponent, LoginComponent],
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
  imports: [
    CommonModule,
    SocialLoginModule,
    AngularMaterialModule,
    ReactiveFormsModule,
  ],
  exports: [SocialLoginModule, RegisterComponent, LoginComponent],
})
export class AuthModule {}
