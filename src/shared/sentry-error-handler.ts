import { ErrorHandler, Injectable } from '@angular/core';
import * as Sentry from '@sentry/browser';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
    public handleError(error) {
        console.error(error);
        Sentry.captureException(error.originalError || error);
    }
}
