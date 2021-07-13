import { NgModule } from '@angular/core';
import { RecoverService } from './service/recover.service';
import { RecoverComponent } from './components/recover/recover.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RecoverComponent],
  providers: [RecoverService],
  imports: [
    HttpClientModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [RecoverComponent],
})
export class RecoverModule {}
