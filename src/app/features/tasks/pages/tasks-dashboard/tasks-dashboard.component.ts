import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Task, TaskService } from '../../service/task.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import * as lodash from 'lodash';
import { take, tap } from 'rxjs/operators';
import { upsertItem } from '../../../../shared/utils/upsert-item';

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

  updateTask: Task;

  loading = true;

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const process = () => (this.loading = false);

    this.taskService
      .getAll()
      .pipe(take(1), tap(process, process))
      .subscribe(tasks => {
        this.tasks = tasks;
      });
  }

  submit() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const inputTask = this.createForm.value;

    let request = this.taskService.create(inputTask);

    if (this.updateTask) {
      request = this.taskService.update(this.updateTask._id, inputTask);
    }

    const process = () => (this.loading = false);

    request.pipe(take(1), tap(process, process)).subscribe(task => {
      upsertItem(this.tasks, t => t._id === task._id, inputTask);

      this.backToCreate();

      this.createForm.patchValue({
        title: '',
        description: '',
      });
    });
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
  }

  confirmDelete(task: Task) {
    const dialog = this.dialog.open<ConfirmDialogData>(ConfirmDialogComponent);

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe(confirm => {
        if (confirm) {
          this.delete(task);
        }
      });
  }

  delete(task: Task) {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const process = () => (this.loading = false);

    this.taskService
      .delete(task)
      .pipe(take(1), tap(process, process))
      .subscribe(response =>
        lodash.remove(this.tasks, t => t._id === response._id),
      );
  }
}
