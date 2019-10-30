import * as Sentry from '@sentry/browser';

// tslint:disable-next-line: no-namespace
export namespace MySentry {
    export function setup(env) {
        if (env.sentry && env.sentry.active) {
            console.log('sentry init');
            Sentry.init({ dsn: env.sentry.dsn });
            Sentry.configureScope((scope) => {
                scope.setTag('type', 'normal');
            });
        }
    }

    export function addTag(key, val) {
        Sentry.configureScope((scope) => {
            scope.setTag(key, val);
        });
    }

    export function setUser(user) {
        Sentry.configureScope((scope) => {
            scope.setUser({ id: user.id, email: user.email, username: user.username });
        });
    }

    export function createException(name, message, opts: any = {}) {
        const error = new Error(message);
        error.name = name || 'UnkownError';

        if (opts.tags) {
            for (const tag of opts.tags) {
                MySentry.addTag(tag.key, tag.value);
            }
        }

        Sentry.captureException(error);
    }

    export const sentry = Sentry;
}
