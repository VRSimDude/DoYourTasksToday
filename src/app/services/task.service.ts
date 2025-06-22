import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Task } from '../models/task.model';

const BACKEND_URL =
  (environment.production ? environment.apiUrl : environment.dev_apiUrl) +
  '/task/';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [];
  private taskStatusListener = new Subject<boolean>();
  private taskDataListener = new Subject<Task>();
  private tasksDataListener = new Subject<Task[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getTaskStatusListener() {
    return this.taskStatusListener.asObservable();
  }

  getTaskDataListener() {
    return this.taskDataListener.asObservable();
  }

  getTasksDataListener() {
    return this.tasksDataListener.asObservable();
  }

  getTask(id: string) {
    this.http.get<{ message: string; task: Task }>(BACKEND_URL + id).subscribe({
      next: (taskData) => {
        this.taskDataListener.next(taskData.task);
      },
    });
  }

  getTasks() {
    this.http
      .get<{ message: string; tasks: Task[] }>(BACKEND_URL)
      .subscribe((taskData) => {
        this.tasks = taskData.tasks;
        this.tasksDataListener.next([...this.tasks]);
      });
  }

  addTask(task: Task) {
    this.http.post(BACKEND_URL + 'create', task).subscribe({
      next: () => {
        this.taskStatusListener.next(true);
      },
      error: () => {
        this.taskStatusListener.next(false);
      },
    });
  }

  updateTask(updatedTask: Task) {
    this.http.put(BACKEND_URL + 'update', updatedTask).subscribe({
      next: () => {
        this.taskStatusListener.next(true);
      },
      error: () => {
        this.taskStatusListener.next(false);
      },
    });
  }

  moveTask(updatedTask: Task) {
    this.http.put(BACKEND_URL + 'move', updatedTask).subscribe({
      error: () => {
        this.router.navigate(['/tasks']);
      },
    });
  }

  deleteTask(id: string) {
    this.http.delete(BACKEND_URL + 'delete/' + id).subscribe({
      next: () => {
        this.getTasks();
      },
    });
  }
}
