import { NgModule } from '@angular/core';
import { CommonModule as CommonMainModule } from '@angular/common';
import { UserService } from './service/user.service';

@NgModule({
  declarations: [],
  providers: [UserService],
  imports: [CommonMainModule],
  exports: [CommonMainModule],
})
export class CommonModule {}
