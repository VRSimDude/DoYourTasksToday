import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { PopupComponent } from '../components/popup/popup.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialogService: MatDialog) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occured!';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialogService.open(PopupComponent, {
          data: { title: 'An Error Occured', message: errorMessage },
        });
        return throwError(() => {
          error;
        });
      })
    );
  }
}
