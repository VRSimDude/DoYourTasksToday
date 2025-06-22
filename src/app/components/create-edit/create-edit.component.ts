import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-create-edit',
  imports: [
    FormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatError,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-edit.component.html',
  styleUrl: './create-edit.component.css',
})
export class CreateEditComponent implements OnInit, OnDestroy {
  isCreateMode = true;
  isLoading = true;
  title = '';
  description = '';
  priority = 'medium';
  dueDate = '';
  private editTask?: Task;
  private taskStatusSub?: Subscription;
  private taskDataSub?: Subscription;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.taskStatusSub = this.taskService
      .getTaskStatusListener()
      .subscribe((success) => {
        if (success) {
          this.router.navigate(['tasks']);
        }
      });
    this.taskDataSub = this.taskService
      .getTaskDataListener()
      .subscribe((taskData) => {
        this.isLoading = false;
        this.editTask = taskData;
        if (this.editTask) {
          this.title = this.editTask.title;
          this.description = this.editTask.description;
          this.priority = this.editTask.priority;
          this.dueDate = this.editTask.dueDate;
        }
      });
    if (this.router.url !== '/create') {
      this.isCreateMode = false;
      this.taskService.getTask(this.activatedRoute.snapshot.params['id']);
    } else {
      this.isLoading = false;
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.isCreateMode) {
      this.taskService.addTask({
        userId: '',
        _id: '',
        title: this.title,
        description: this.description,
        priority: this.priority,
        dueDate: this.dueDate,
        status: '',
        order: 0,
      });
    } else {
      if (this.editTask) {
        this.taskService.updateTask({
          userId: this.editTask.userId,
          _id: this.editTask._id,
          title: this.title,
          description: this.description,
          priority: this.priority,
          dueDate: this.dueDate,
          status: this.editTask.status,
          order: this.editTask.order,
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['tasks']);
  }

  ngOnDestroy() {
    this.taskStatusSub?.unsubscribe();
    this.taskDataSub?.unsubscribe();
  }
}
