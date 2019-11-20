import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AlertsService } from './alerts/alerts.service';
import { UserService } from './user.service';
import { MySentry } from 'src/shared/sentry';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';

export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        public translate: TranslateService,
        public alerts: AlertsService,
        public us: UserService,
    ) { }

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

                    console.log(cleanError);

                    if (environment.sentry.active) {
                        MySentry.createException(
                            cleanError.name || cleanError.status_text, cleanError.message, { params: request.body });
                    }

                    return throwError(cleanError);
                }),
            );
    }
}
