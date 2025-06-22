import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatError, MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatError,
    MatDividerModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  isRememberLogin = false;
  newPassword = '';
  isSaveDataMonthly = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (localStorage.getItem('dytt_rememberLogin')) {
      this.isRememberLogin = true;
    }
  }

  onChangePassword() {
    if (this.newPassword.length < 8 || this.newPassword.length > 128) {
      return;
    }
    this.authService.changePassword(this.newPassword);
  }

  onForgetLogin() {
    localStorage.removeItem('dytt_rememberLogin');
    localStorage.removeItem('dytt_email');
    localStorage.removeItem('dytt_password');
    this.isRememberLogin = false;
  }

  onDeleteData() {
    this.authService.delete();
  }
}
