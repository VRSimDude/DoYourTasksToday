import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatError } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-signup',
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
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  isRememberLogin = false;
  isLoading = false;
  private authStatusSub?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.getIsAuth()) {
      this.router.navigate(['/tasks']);
      return;
    }

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((success) => {
        this.isLoading = false;
        if (this.authService.getIsAuth()) {
          if (this.isRememberLogin) {
            localStorage.setItem('dytt_rememberLogin', 'true');
            localStorage.setItem('dytt_email', this.email);
            localStorage.setItem('dytt_password', this.password);
          }
          this.router.navigate(['/tasks']);
        }
      });

    const isRememberLogin = localStorage.getItem('dytt_rememberLogin');
    const email = localStorage.getItem('dytt_email');
    const password = localStorage.getItem('dytt_password');

    if (!isRememberLogin || !email || !password) {
      return;
    }

    this.isLoading = true;
    this.authService.login(email, password);
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub?.unsubscribe();
  }
}
