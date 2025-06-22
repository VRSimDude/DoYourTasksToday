import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from '../models/auth-data.model';
import { environment } from '../../environments/environment';

const BACKEND_URL =
  (environment.production ? environment.apiUrl : environment.dev_apiUrl) +
  '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string = '';
  private tokenTimer?: any;
  private isAuthenticated = false;
  private userId?: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post(BACKEND_URL + 'signup', authData)
      .subscribe({
        next: () => {
          this.authStatusListener.next(true);
        },
        error: () => {
          this.authStatusListener.next(false);
        },
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + 'login',
        authData
      )
      .subscribe({
        next: (response) => {
          if (response.token) {
            this.token = response.token;
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            this.saveAuthData(
              this.token,
              new Date(new Date().getTime() + expiresInDuration * 1000),
              this.userId
            );
          }
        },
        error: () => {
          this.authStatusListener.next(false);
          this.router.navigate(['/']);
        },
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    if (authInformation.expirationDate <= now) {
      return;
    }
    this.token = authInformation.token;
    this.setAuthTimer(
      (authInformation.expirationDate.getTime() - now.getTime()) / 1000
    );
    this.isAuthenticated = true;
    this.userId = authInformation.userId;
    this.authStatusListener.next(true);
  }

  changePassword(newPW: string) {
    this.http
      .put(BACKEND_URL + 'changePassword', { newPassword: newPW })
      .subscribe({
        next: () => {
          this.authStatusListener.next(true);
          this.logout();
          this.router.navigate(['/']);
        },
        error: () => {
          this.authStatusListener.next(false);
        },
      });
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = undefined;
    localStorage.removeItem('dytt_rememberLogin');
    localStorage.removeItem('dytt_email');
    localStorage.removeItem('dytt_password');
    this.router.navigate(['/']);
  }

  delete() {
    this.http.delete(BACKEND_URL + 'delete').subscribe(() => {
      this.logout();
      this.router.navigate(['/']);
    });
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('dytt_token', token);
    localStorage.setItem('dytt_expiration', expirationDate.toISOString());
    localStorage.setItem('dytt_userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('dytt_token');
    localStorage.removeItem('dytt_expiration');
    localStorage.removeItem('dytt_userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('dytt_token');
    const expirationDate = localStorage.getItem('dytt_expiration');
    const userId = localStorage.getItem('dytt_userId');
    if (!token || !expirationDate || !userId) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
