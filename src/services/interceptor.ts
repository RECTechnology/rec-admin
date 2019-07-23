import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MySnackBarSevice } from 'src/bases/snackbar-base';

export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        public translate: TranslateService,
        public snackbar: MySnackBarSevice
    ) { }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.log('Interceptor', error);
                    let cleanError: any = error;
                    const errStr = error.error || error;

                    if (error.status === 500) {
                        this.snackbar.open('ERROR_500', 'ok');
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
                    }
                    return throwError(cleanError);
                }),
            );
    }
}