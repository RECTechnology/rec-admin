import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { environment } from 'src/environments/environment';
import { MySentry } from 'src/shared/sentry';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let cleanError: any = error;
                    const errStr = error.error || error;

                    if (typeof errStr === 'string') {
                        try {
                            cleanError = JSON.parse(errStr);
                        } catch (error) {
                            cleanError = errStr;
                        }
                    } else if (typeof errStr === 'object') {
                        cleanError = errStr;
                    }

                    if (environment.sentry.active) {
                        MySentry.createException(
                            cleanError.name || cleanError.status_text, cleanError.message, { params: request.body });
                    }

                    return throwError(cleanError);
                }),
            );
    }
}
