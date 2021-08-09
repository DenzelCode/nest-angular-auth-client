import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksDashboardComponent } from './pages/tasks-dashboard/tasks-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { TaskService } from './service/task.service';

@NgModule({
  declarations: [TasksDashboardComponent],
  providers: [
    TaskService,
  ],
  imports: [
    CommonModule,
    CoreModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  exports: [TasksDashboardComponent],
})
export class TasksModule {}
