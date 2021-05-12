import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Task, TaskService } from '../../service/task.service';
import { ConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import * as lodash from 'lodash';
import { take } from 'rxjs/operators';

@Component({
  templateUrl: './tasks-dashboard.component.html',
  styleUrls: ['./tasks-dashboard.component.scss'],
  providers: [TaskService],
})
export class TasksDashboardComponent implements OnInit {
  createForm = this.formBuilder.group({
    title: '',
    description: '',
  });

  tasks: Task[];

  updateTask: Task;

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.taskService
      .getAll()
      .pipe(take(1))
      .subscribe((tasks) => (this.tasks = tasks));
  }

  create() {
    const inputTask = this.createForm.value;

    if (!this.updateTask) {
      this.taskService
        .create(inputTask)
        .pipe(take(1))
        .subscribe((task) => this.tasks.push(task));

      this.createForm.patchValue({
        title: '',
        description: '',
      });
    } else {
      this.taskService
        .update(this.updateTask._id, inputTask)
        .pipe(take(1))
        .subscribe((task) => {
          const nativeTask = this.tasks.find((t) => t._id === task._id);

          if (!nativeTask) {
            return;
          }

          Object.assign(nativeTask, inputTask);

          this.backToCreate();
        });
    }
  }

  updateMode(task: Task) {
    this.updateTask = task;

    this.createForm.patchValue({
      title: this.updateTask.title,
      description: this.updateTask.description,
    });
  }

  backToCreate() {
    this.updateTask = null;

    this.createForm.patchValue({
      title: '',
      description: '',
    });
  }

  confirmDelete(task: Task) {
    const dialog = this.dialog.open(ConfirmDialogComponent);

    dialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.delete(task);
      }
    });
  }

  delete(task: Task) {
    this.taskService
      .delete(task)
      .pipe(take(1))
      .subscribe((task) =>
        lodash.remove(this.tasks, (t) => t._id === task._id)
      );
  }
}
