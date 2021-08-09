import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface Task {
  _id: string;
  title: string;
  description: string;
}

const { api } = environment;

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private httpClient: HttpClient) {}

  getAll() {
    return this.httpClient.get<Task[]>(`${api}/task`);
  }

  create(task: Task) {
    return this.httpClient.post<Task>(`${api}/task`, task);
  }

  update(id: string, task: Task) {
    return this.httpClient.put<Task>(`${api}/task/${id}`, task);
  }

  delete(task: Task) {
    return this.httpClient.delete<Task>(`${api}/task/${task._id}`);
  }
}
