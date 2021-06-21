import { NgModule } from '@angular/core';
import { CommonModule as CommonMainModule } from '@angular/common';
import { RecoverService } from './service/recover.service';
import { UserService } from './service/user.service';

@NgModule({
  declarations: [],
  providers: [RecoverService, UserService],
  imports: [CommonMainModule],
  exports: [CommonMainModule],
})
export class CommonModule {}
