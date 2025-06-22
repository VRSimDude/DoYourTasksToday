import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardActions } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks-view',
  imports: [
    RouterModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule,
    MatCardActions,
    DatePipe,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit, OnDestroy {
  isLoading = true;
  backlogTasks: Task[] = [];
  todoTasks: Task[] = [];
  progressTasks: Task[] = [];
  doneTasks: Task[] = [];
  sortBy = '';
  sortAscending = true;
  private taskDataSub?: Subscription;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskDataSub = this.taskService
      .getTasksDataListener()
      .subscribe((tasks) => {
        this.isLoading = false;
        this.sortTasks(tasks);
        this.backlogTasks = [];
        this.todoTasks = [];
        this.progressTasks = [];
        this.doneTasks = [];
        tasks.forEach((task) => {
          switch (task.status) {
            case 'backlog':
              this.backlogTasks.push(task);
              break;
            case 'todo':
              this.todoTasks.push(task);
              break;
            case 'progress':
              this.progressTasks.push(task);
              break;
            case 'done':
              this.doneTasks.push(task);
              break;
            default:
              break;
          }
        });
      });

    this.taskService.getTasks();
  }

  onSortAllTasks() {
    this.sortTasks(this.backlogTasks);
    this.sortTasks(this.todoTasks);
    this.sortTasks(this.progressTasks);
  }

  onSwitchTaskToBacklog(task: Task) {
    task.status = 'backlog';
    task.order = 0;

    if (this.backlogTasks.length && this.backlogTasks[0].order == 0) {
      this.backlogTasks.forEach((backlogTask) => {
        backlogTask.order += 1;
      });
    }

    this.todoTasks.find((todoTask) => {
      if (todoTask._id === task._id) {
        this.todoTasks = this.todoTasks.filter((e) => e._id !== todoTask._id);
      }
    });

    this.progressTasks.find((progressTask) => {
      if (progressTask._id === task._id) {
        this.progressTasks = this.progressTasks.filter(
          (e) => e._id !== progressTask._id
        );
      }
    });

    this.backlogTasks.push(task);
    this.sortTasks(this.backlogTasks);

    this.taskService.moveTask(task);
  }

  onSwitchTaskToTodo(task: Task) {
    task.status = 'todo';
    task.order = 0;

    if (this.todoTasks.length && this.todoTasks[0].order == 0) {
      this.todoTasks.forEach((todoTask) => {
        todoTask.order += 1;
      });
    }

    this.backlogTasks.find((backlogTask) => {
      if (backlogTask._id === task._id) {
        this.backlogTasks = this.backlogTasks.filter(
          (e) => e._id !== backlogTask._id
        );
      }
    });

    this.progressTasks.find((progressTask) => {
      if (progressTask._id === task._id) {
        this.progressTasks = this.progressTasks.filter(
          (e) => e._id !== progressTask._id
        );
      }
    });

    this.todoTasks.push(task);
    this.sortTasks(this.todoTasks);

    this.taskService.moveTask(task);
  }

  onSwitchTaskToProgress(task: Task) {
    task.status = 'progress';
    task.order = 0;

    if (this.progressTasks.length && this.progressTasks[0].order == 0) {
      this.progressTasks.forEach((progressTask) => {
        progressTask.order += 1;
      });
    }

    this.backlogTasks.find((backlogTask) => {
      if (backlogTask._id === task._id) {
        this.backlogTasks = this.backlogTasks.filter(
          (e) => e._id !== backlogTask._id
        );
      }
    });

    this.todoTasks.find((todoTask) => {
      if (todoTask._id === task._id) {
        this.todoTasks = this.todoTasks.filter((e) => e._id !== todoTask._id);
      }
    });

    this.progressTasks.push(task);
    this.sortTasks(this.progressTasks);

    this.taskService.moveTask(task);
  }

  onCompleteTask(task: Task) {
    task.status = 'done';
    task.order = 0;

    this.doneTasks.forEach((doneTask) => {
      doneTask.order += 1;
    });

    this.backlogTasks.find((backlogTask) => {
      if (backlogTask._id === task._id) {
        this.backlogTasks = this.backlogTasks.filter(
          (e) => e._id !== backlogTask._id
        );
      }
    });

    this.todoTasks.find((todoTask) => {
      if (todoTask._id === task._id) {
        this.todoTasks = this.todoTasks.filter((e) => e._id !== todoTask._id);
      }
    });

    this.progressTasks.find((progressTask) => {
      if (progressTask._id === task._id) {
        this.progressTasks = this.progressTasks.filter(
          (e) => e._id !== progressTask._id
        );
      }
    });

    this.doneTasks.push(task);
    this.sortTasks(this.doneTasks);

    this.taskService.moveTask(task);
  }

  onMoveTaskUp(task: Task) {
    const oldTaskOrder = task.order;

    switch (task.status) {
      case 'backlog': {
        for (let index = 0; index < this.backlogTasks.length; index++) {
          if (this.backlogTasks[index]._id === task._id) {
            if (index) {
              task.order = this.backlogTasks[index - 1].order;
              this.backlogTasks[index - 1].order = oldTaskOrder;
              this.sortTasks(this.backlogTasks);
              this.taskService.moveTask(task);
            }
            break;
          }
        }
        break;
      }
      case 'todo': {
        for (let index = 0; index < this.todoTasks.length; index++) {
          if (this.todoTasks[index]._id === task._id) {
            if (index) {
              task.order = this.todoTasks[index - 1].order;
              this.todoTasks[index - 1].order = oldTaskOrder;
              this.sortTasks(this.todoTasks);
              this.taskService.moveTask(task);
            }
            break;
          }
        }
        break;
      }
      case 'progress': {
        for (let index = 0; index < this.progressTasks.length; index++) {
          if (this.progressTasks[index]._id === task._id) {
            if (index) {
              task.order = this.progressTasks[index - 1].order;
              this.progressTasks[index - 1].order = oldTaskOrder;
              this.sortTasks(this.progressTasks);
              this.taskService.moveTask(task);
            }
            break;
          }
        }
        break;
      }
      default:
        break;
    }

    this.taskService.moveTask(task);
  }

  onMoveTaskDown(task: Task) {
    const oldTaskOrder = task.order;

    switch (task.status) {
      case 'backlog': {
        for (let index = 0; index < this.backlogTasks.length; index++) {
          if (this.backlogTasks[index]._id === task._id) {
            if (index < this.backlogTasks.length - 1) {
              task.order = this.backlogTasks[index + 1].order;
              this.backlogTasks[index + 1].order = oldTaskOrder;
              this.sortTasks(this.backlogTasks);
              this.taskService.moveTask(task);
            }
            break;
          }
        }
        break;
      }
      case 'todo': {
        for (let index = 0; index < this.todoTasks.length; index++) {
          if (this.todoTasks[index]._id === task._id) {
            if (index < this.todoTasks.length - 1) {
              task.order = this.todoTasks[index + 1].order;
              this.todoTasks[index + 1].order = oldTaskOrder;
              this.sortTasks(this.todoTasks);
              this.taskService.moveTask(task);
            }
            break;
          }
        }
        break;
      }
      case 'progress': {
        for (let index = 0; index < this.progressTasks.length; index++) {
          if (this.progressTasks[index]._id === task._id) {
            if (index < this.progressTasks.length - 1) {
              task.order = this.progressTasks[index + 1].order;
              this.progressTasks[index + 1].order = oldTaskOrder;
              this.sortTasks(this.progressTasks);
              this.taskService.moveTask(task);
            }
            break;
          }
        }
        break;
      }
      default:
        break;
    }

    this.taskService.moveTask(task);
  }

  onDeleteTask(id: string) {
    this.taskService.deleteTask(id);
  }

  ngOnDestroy() {
    this.taskDataSub?.unsubscribe();
  }

  private sortTasks(tasks: Task[]) {
    switch (this.sortBy) {
      case '': {
        if (this.sortAscending) {
          tasks = tasks.sort((a, b) =>
            Number(a.order) < Number(b.order) ? -1 : 1
          );
        } else {
          tasks.sort((a, b) => (Number(a.order) > Number(b.order) ? -1 : 1));
        }
        break;
      }
      case 'date': {
        if (this.sortAscending) {
          tasks.sort((a, b) => {
            if (a.dueDate && b.dueDate) {
              return a.dueDate < b.dueDate ? -1 : 1;
            } else if (a.dueDate && !b.dueDate) {
              return -1;
            } else if (!a.dueDate && b.dueDate) {
              return 1;
            } else {
              return -1;
            }
          });
        } else {
          tasks.sort((a, b) => (a.dueDate > b.dueDate ? -1 : 1));
        }
        break;
      }
      case 'priority': {
        if (this.sortAscending) {
          tasks.sort((a, b) => this.comparePriority(a.priority, b.priority));
        } else {
          tasks.sort(
            (a, b) => -1 * this.comparePriority(a.priority, b.priority)
          );
        }
        break;
      }
      default:
        break;
    }
  }

  private comparePriority(a: string, b: string) {
    if (a === 'urgent') {
      return -1;
    } else if (a === 'high') {
      if (b === 'urgent') {
        return 1;
      } else {
        return -1;
      }
    } else if (a === 'medium') {
      if (b === 'urgent' || b === 'high') {
        return 1;
      } else {
        return -1;
      }
    } else {
      if (b === 'urgent' || b === 'high' || b === 'medium') {
        return 1;
      } else {
        return -1;
      }
    }
  }
}
