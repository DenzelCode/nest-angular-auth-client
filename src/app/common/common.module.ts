import { NgModule } from '@angular/core';
import { CommonModule as CommonMainModule } from '@angular/common';
import { RecoverService } from './service/recover.service';

@NgModule({
  declarations: [],
  providers: [RecoverService],
  imports: [CommonMainModule],
  exports: [CommonMainModule],
})
export class CommonModule {}
