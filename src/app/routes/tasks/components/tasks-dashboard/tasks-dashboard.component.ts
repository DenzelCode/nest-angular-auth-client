import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Task, TaskService } from '../../service/task.service';
import { ConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import * as lodash from 'lodash';

enum Mode {
  Update,
  Create,
}

@Component({
  templateUrl: './tasks-dashboard.component.html',
  styleUrls: ['./tasks-dashboard.component.scss'],
})
export class TasksDashboardComponent implements OnInit {
  createForm = this.formBuilder.group({
    title: '',
    description: '',
  });

  tasks: Task[];

  updateTask: Task = null;

  Mode = Mode;

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    const subscriber = this.taskService.getAll().subscribe(
      (tasks) => (this.tasks = tasks),
      () => subscriber.unsubscribe()
    );
  }

  create() {
    const inputTask = this.createForm.value;

    if (!this.updateTask) {
      const subscriber = this.taskService.create(inputTask).subscribe(
        (task) => this.tasks.push(task),
        () => subscriber.unsubscribe()
      );

      this.createForm.patchValue({
        title: '',
        description: '',
      });
    } else {
      const subscriber = this.taskService
        .update(this.updateTask._id, inputTask)
        .subscribe(
          (task) => {
            const nativeTask = this.tasks.find((t) => t._id === task._id);

            if (!nativeTask) {
              return;
            }

            Object.assign(nativeTask, inputTask);

            this.backToCreate();
          },
          () => subscriber.unsubscribe()
        );
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
    const subscriber = this.taskService.delete(task).subscribe(
      (task) => lodash.remove(this.tasks, (t) => t._id === task._id),
      () => subscriber.unsubscribe()
    );
  }
}
