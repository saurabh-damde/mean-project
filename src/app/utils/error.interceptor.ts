import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { ErrorComponent } from '../components/error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, nxt: HttpHandler) {
    return nxt.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        let message: string = 'An Unknown Error Occurred!';
        if (err.error.message) {
          message = err.error.message;
        }
        this.dialog.open(ErrorComponent, { data: { message } });
        return throwError(() => new Error(err.error));
      })
    );
  }
}
