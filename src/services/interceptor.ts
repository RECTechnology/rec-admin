import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AlertsService } from './alerts/alerts.service';
import * as Sentry from '@sentry/browser';
import { UserService } from './user.service';

export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        public translate: TranslateService,
        public alerts: AlertsService,
        public us: UserService,
    ) { }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let cleanError: any = error;
                    const errStr = error.error || error;

                    if (error.status === 500 && !environment.error_500_details) {
                        this.alerts.showSnackbar('ERROR_500', 'ok');
                        return throwError({
                            message: 'ERROR_500',
                            status: 500,
                        });
                    }

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
                        Sentry.captureException(error.error || error);
                    }

                    return throwError(cleanError);
                }),
            );
    }
}
