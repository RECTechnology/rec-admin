import { ErrorHandler, Injectable } from '@angular/core';
import * as Sentry from '@sentry/browser';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
    public handleError(error) {
        console.log('handle error', error);
        const eventId = Sentry.captureException(error.originalError || error);
        Sentry.showReportDialog({ eventId });
    }
}
